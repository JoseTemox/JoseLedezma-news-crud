import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NewsItemCard } from './news-item-card';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

@Component({
  template: `<app-news-item-card
    [isDetailsMode]="details"
    [newsItem]="item"
  ></app-news-item-card>`,
  standalone: true,
  imports: [NewsItemCard],
})
class HostComponent {
  item: any = null;
  details = false;
}

describe('NewsItemCard', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let windowOpenSpy: jasmine.Spy;

  const sampleItem = {
    id: 1,
    mainTitle: 'Titulo prueba',
    url: 'https://example.com',
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    dialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;

    windowOpenSpy = spyOn(window, 'open').and.callFake(() => null as any);
  });

  afterEach(() => {
    windowOpenSpy.and.callThrough();
  });

  it('should create host and child component', () => {
    host.item = sampleItem;
    fixture.detectChanges();

    const childDebug = fixture.debugElement.query(By.directive(NewsItemCard));
    expect(childDebug).toBeTruthy();
  });

  it('goTo should open external url with correct features', () => {
    host.item = sampleItem;
    fixture.detectChanges();

    const childInstance = fixture.debugElement.query(By.directive(NewsItemCard))
      .componentInstance as NewsItemCard;
    childInstance.goTo('https://angular.io');

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://angular.io',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('goToDetails should open dialog with ModalCardDetailsComponent and pass newsItem as data', async () => {
    host.item = sampleItem;
    fixture.detectChanges();

    const childInstance = fixture.debugElement.query(By.directive(NewsItemCard))
      .componentInstance as NewsItemCard;

    await childInstance.goToDetails();

    expect(dialogSpy.open).toHaveBeenCalled();
    const callArgs = dialogSpy.open.calls.mostRecent().args;

    expect(callArgs.length).toBeGreaterThanOrEqual(2);
    const cfg = callArgs[1] as any;
    expect(cfg.data).toEqual(sampleItem);
  });

  it('generateGhibliIA should open dialog passing newsTitle in data', async () => {
    host.item = sampleItem;
    fixture.detectChanges();

    const childInstance = fixture.debugElement.query(By.directive(NewsItemCard))
      .componentInstance as NewsItemCard;

    await childInstance.generateGhibliIA();

    expect(dialogSpy.open).toHaveBeenCalled();
    const callArgs = dialogSpy.open.calls.mostRecent().args;
    const cfg = callArgs[1] as any;
    expect(cfg.data).toEqual({ newsTitle: sampleItem.mainTitle });
  });

  it('component input required should throw when newsItem not provided', () => {
    host.item = null;

    expect(() => fixture.detectChanges()).toThrow();
  });
});
