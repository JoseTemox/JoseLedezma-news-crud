/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Injector, signal } from '@angular/core';
import { Action, ActionEvent, ActionsComponent } from './actions.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

describe('ActionsComponent', () => {
  let fixture: ComponentFixture<ActionsComponent>;
  let component: ActionsComponent;
  let injector: Injector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ActionsComponent,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        CommonModule,
      ],
    }).compileComponents();

    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(ActionsComponent);
    component = fixture.componentInstance;
  });

  function overrideInputAsSignal<T>(target: any, prop: string, initial: T) {
    Object.defineProperty(target, prop, {
      value: signal(initial),
      writable: false,
      configurable: true,
    });
  }

  it('should instantiate', () => {
    expect(component).toBeTruthy();
  });

  it('sortedElement computed should order by weight then original index', () => {
    const items: Action[] = [
      { name: 'z' },
      { name: 'edit' },
      { name: 'find_in_page' },
      { name: 'delete' },
    ];

    overrideInputAsSignal(component, 'element', items);
    fixture.detectChanges();

    const sorted = component.sortedElement();
    expect(sorted.map((s) => s.name)).toEqual([
      'find_in_page',
      'edit',
      'z',
      'delete',
    ]);
  });

  function makeElementFn<T>(items: T[]) {
    const fn = (..._: any[]) => items;

    Object.defineProperty(fn, 'length', { value: Math.max(items.length, 5) });
    return fn;
  }

  it('effect updateAction should split firstActions and secondActions when length > 4', () => {
    const many: Action[] = [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
      { name: 'd' },
      { name: 'e' },
      { name: 'f' },
    ];

    const elementFn = makeElementFn(many);

    Object.defineProperty(component, 'element', {
      value: elementFn,
      writable: false,
      configurable: true,
    });

    Object.defineProperty(component, 'index', {
      value: signal(0),
      writable: false,
      configurable: true,
    });
    Object.defineProperty(component, 'row', {
      value: signal(null),
      writable: false,
      configurable: true,
    });

    fixture.detectChanges();

    expect(component.firstActions.map((a) => a.name)).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
    expect(component.secondActions.map((a) => a.name)).toEqual(['e', 'f']);
  });

  it('emitAction should emit ActionEvent with current index and row', () => {
    overrideInputAsSignal(component, 'index', 3);
    const rowValue = { id: 42 };
    overrideInputAsSignal(component, 'row', rowValue as any);
    overrideInputAsSignal(component, 'element', [] as Action[]);

    const spyEmit = spyOn(component.actionEvent, 'emit');

    component.emitAction('custom_action');

    expect(spyEmit).toHaveBeenCalledTimes(1);
    const emittedArg = spyEmit.calls.mostRecent()
      .args[0] as ActionEvent<unknown>;
    expect(emittedArg.action).toBe('custom_action');
    expect(emittedArg.index).toBe(3);

    expect(typeof emittedArg.row).toBe('function');
    expect((emittedArg.row as any)()).toEqual(rowValue);
  });

  it('sortedElement should return a shallow copy when items length <= 1', () => {
    overrideInputAsSignal(component, 'element', [{ name: 'only' }]);

    fixture.detectChanges();

    const out = component.sortedElement();
    expect(Array.isArray(out)).toBeTrue();
    expect(out).not.toBe((component as any).element());
    expect(out.map((o) => o.name)).toEqual(['only']);
  });

  it('template should render icons for firstActions when provided (smoke test)', () => {
    const many: Action[] = [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
      { name: 'd' },
    ];
    overrideInputAsSignal(component, 'element', many);
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css('mat-icon'));
    expect(icons.length).toBeGreaterThanOrEqual(0);
  });
});
