import { TestBed } from '@angular/core/testing';

import NewsItemManagementComponent from './news-item-management.component';

import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { NewsFacade } from '../../services/news-facade.service';
import { CommonModule } from '@angular/common';
import { ActionBtn } from '../../utils/consts';

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
      actions: [ActionBtn.edit, ActionBtn.delete, ActionBtn.find_in_page],
      deleteNewsItemInList: jasmine.createSpy('deleteNewsItemInList'),
      saveNewsItemInList: jasmine.createSpy('saveNewsItemInList'),
      updateNewsItemInList: jasmine.createSpy('updateNewsItemInList'),
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

  it('delete flow: when dialog confirms, should remove item and call facade.deleteNewsItemInList', () => {
    const fixture = TestBed.createComponent(NewsItemManagementComponent);
    const comp = fixture.componentInstance;

    (comp.dataSource as any).update(() => [
      { number: 1, title: 'one' },
      { number: 2, title: 'two' },
    ]);

    mockDialogRef.afterClosed.and.returnValue(of(true));

    const emitter = {
      action: ActionBtn.delete,
      row: () => ({ number: 2, title: 'two' }),
    } as any;
    comp.action(emitter);

    expect(mockFacade.deleteNewsItemInList).toHaveBeenCalledWith(
      jasmine.objectContaining({ number: 2, title: 'two' })
    );
  });

  it('addNew should add a new item when modal returns item with number === null', () => {
    const fixture = TestBed.createComponent(NewsItemManagementComponent);
    const comp = fixture.componentInstance;

    const initialList = [{ number: 1, title: 'existing', actions: [] }];
    (comp.dataSource as any).update(() => initialList);

    const modalResponse = { number: null, title: 'new item' };

    mockFacade.saveNewsItemInList.and.callFake((newItem: any) => {
      (comp.dataSource as any).update((list: any[]) => [...list, newItem]);
    });

    mockDialogRef.afterClosed.and.returnValue(of(modalResponse));
    mockDialog.open.and.returnValue(mockDialogRef);

    comp.addNew();
    const listAfter = (comp.dataSource as any)();
    expect(listAfter.length).toBe(2);
    expect(listAfter[1].title).toBe('new item');
    expect(mockFacade.saveNewsItemInList).toHaveBeenCalledWith(
      jasmine.objectContaining({ title: 'new item' })
    );
  });

  it('addNew should update existing item when modal returns item with existing number', () => {
    const fixture = TestBed.createComponent(NewsItemManagementComponent);
    const comp = fixture.componentInstance;

    const initialList = [
      { number: 1, title: 'one', actions: [] },
      { number: 2, title: 'two', actions: [] },
    ];

    (comp.dataSource as any).update(() => initialList);

    const modalResponse = { number: 2, title: 'updated' };

    mockFacade.updateNewsItemInList.and.callFake(
      (updatedItem: any, originalItem: any) => {
        (comp.dataSource as any).update((list: any[]) =>
          list.map((item: any) =>
            item.number === originalItem.number ? updatedItem : item
          )
        );
      }
    );

    mockDialogRef.afterClosed.and.returnValue(of(modalResponse));
    mockDialog.open.and.returnValue(mockDialogRef);

    comp.addNew();

    const listAfter = (comp.dataSource as any)();
    expect(listAfter.find((i: any) => i.number === 2).title).toBe('updated');
    expect(mockFacade.updateNewsItemInList).toHaveBeenCalledWith(
      jasmine.objectContaining({ number: 2, title: 'updated' }),
      jasmine.objectContaining({ number: 2, title: 'updated' })
    );
  });
});
