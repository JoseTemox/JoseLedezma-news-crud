import { TestBed } from '@angular/core/testing';

import NewsItemManagementComponent from './news-item-management.component';

import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { NewsFacade } from '../../services/news-facade.service';
import { CommonModule } from '@angular/common';

describe('NewsItemManagementComponent', () => {
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<any>;
  let mockFacade: any;
  let mockStorage: any;

  const createSignalLike = <T>(initial: T) => {
    let value = initial;
    const s: any = () => value;
    s.update = (fn: (v: T) => T) => {
      value = fn(value);
    };
    return s as (() => T) & { update(fn: (v: T) => void): void };
  };

  beforeEach(async () => {
    mockFacade = {
      allData: createSignalLike<any[]>([]),
      actions: ['edit', 'delete', 'find_in_page'],
      deleteItem: jasmine.createSpy('deleteItem'),
      saveFixedData: jasmine.createSpy('saveFixedData'),
      updateData: jasmine.createSpy('updateData'),
    };

    mockStorage = jasmine.createSpyObj('LocalStorageService', ['get', 'set']);

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', [
      'afterClosed',
      'close',
    ]);
    mockDialogRef.afterClosed.and.returnValue(of(undefined));

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue(mockDialogRef);

    await TestBed.configureTestingModule({
      imports: [CommonModule, NewsItemManagementComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: NewsFacade, useValue: mockFacade },
        { provide: LocalStorageService, useValue: mockStorage },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NewsItemManagementComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('action edit should call addNew with row data', () => {
    const fixture = TestBed.createComponent(NewsItemManagementComponent);
    const comp = fixture.componentInstance;

    spyOn(comp, 'addNew');

    const emitter = {
      action: 'edit',
      row: () => ({ number: 1, title: 'x' }),
    } as any;
    comp.action(emitter);

    expect(comp.addNew).toHaveBeenCalledWith(
      jasmine.objectContaining({ number: 1, title: 'x' })
    );
  });

  it('delete flow: when dialog confirms, should remove item and call facade.deleteItem', () => {
    const fixture = TestBed.createComponent(NewsItemManagementComponent);
    const comp = fixture.componentInstance;

    (comp.dataSource as any).update(() => [
      { number: 1, title: 'one' },
      { number: 2, title: 'two' },
    ]);

    mockDialogRef.afterClosed.and.returnValue(of(true));

    const emitter = { action: 'delete', row: () => ({ number: 2 }) } as any;
    comp.action(emitter);

    const current = (comp.dataSource as any)();
    expect(current.some((i: any) => i.number === 2)).toBeFalse();
    expect(mockFacade.deleteItem).toHaveBeenCalledWith(
      jasmine.objectContaining({ number: 2 })
    );
  });

  it('addNew should add a new item when modal returns item with number === null', () => {
    const fixture = TestBed.createComponent(NewsItemManagementComponent);
    const comp = fixture.componentInstance;

    (comp.dataSource as any).update(() => [
      { number: 1, title: 'existing', actions: [] },
    ]);

    const modalResponse = { number: null, title: 'new item' };
    mockDialogRef.afterClosed.and.returnValue(of(modalResponse));
    mockDialog.open.and.returnValue(mockDialogRef);

    comp.addNew();

    const listAfter = (comp.dataSource as any)();
    expect(listAfter.length).toBe(2);
    expect(listAfter[0].title).toBe('new item');
    expect(mockFacade.saveFixedData).toHaveBeenCalled();
  });

  it('addNew should update existing item when modal returns item with existing number', () => {
    const fixture = TestBed.createComponent(NewsItemManagementComponent);
    const comp = fixture.componentInstance;

    (comp.dataSource as any).update(() => [
      { number: 1, title: 'one', actions: [] },
      { number: 2, title: 'two', actions: [] },
    ]);

    const modalResponse = { number: 2, title: 'updated' };
    mockDialogRef.afterClosed.and.returnValue(of(modalResponse));
    mockDialog.open.and.returnValue(mockDialogRef);

    comp.addNew();

    const listAfter = (comp.dataSource as any)();
    expect(listAfter.find((i: any) => i.number === 2).title).toBe('updated');
    expect(mockFacade.updateData).toHaveBeenCalledWith(
      jasmine.objectContaining({ number: 2, title: 'updated' })
    );
  });
});
