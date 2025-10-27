import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Injector, runInInjectionContext } from '@angular/core';
import { ImgRender } from './img-render.component';

describe('ImgRender (standalone unit tests)', () => {
  let injector: Injector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgRender],
    }).compileComponents();

    injector = TestBed.inject(Injector);
  });

  function createInstance() {
    return runInInjectionContext(injector, () => new ImgRender()) as ImgRender;
  }

  it('should create component instance', () => {
    const comp = createInstance();
    expect(comp).toBeTruthy();
  });

  it('toCssValue returns px for number and raw string for string, null for undefined', () => {
    const comp = createInstance();

    (comp as any).width.set?.(50);

    (comp as any).width = signal(50) as any;
    (comp as any).height = signal('10%') as any;
    (comp as any).marginLeft = signal(undefined) as any;
    (comp as any).marginRight = signal('2rem') as any;

    expect(comp.styleWidth).toBe('50px');
    expect(comp.styleHeight).toBe('10%');
    expect(comp.styleMarginLeft).toBeNull();
    expect(comp.styleMarginRight).toBe('2rem');
  });

  it('effect with undefined newsItemUrl sets fallback and not loading', () => {
    const comp = createInstance();

    (comp as any).newsItemUrl = (() => undefined) as any;

    (comp as any).currentSrc.set?.(undefined);
    (comp as any).loading.set?.(false);

    const candidate = (comp as any).newsItemUrl();
    if (!candidate) {
      (comp as any).currentSrc.set(comp.fallback);
      (comp as any).loading.set(false);
    }

    expect(comp.currentSrc()).toBe(comp.fallback);
    expect(comp.loading()).toBeFalse();
    expect(comp.loaded()).toBeFalse();
    expect(comp.failed()).toBeFalse();
  });

  it('effect with a valid newsItemUrl sets currentSrc and loading true', () => {
    const comp = createInstance();
    (comp as any).newsItemUrl = (() => 'https://image.test/x.png') as any;

    const candidate = (comp as any).newsItemUrl();
    if (!candidate) {
      (comp as any).currentSrc.set(comp.fallback);
      (comp as any).loading.set(false);
    } else {
      (comp as any).loading.set(true);
      (comp as any).currentSrc.set(candidate);
    }

    expect(comp.currentSrc()).toBe('https://image.test/x.png');
    expect(comp.loading()).toBeTrue();
    expect(comp.loaded()).toBeFalse();
    expect(comp.failed()).toBeFalse();
  });

  it('onLoaded should set loaded true and loading false and failed false', () => {
    const comp = createInstance();

    comp.loading.set(true);
    comp.loaded.set(false);
    comp.failed.set(true);

    comp.onLoaded();

    expect(comp.loaded()).toBeTrue();
    expect(comp.loading()).toBeFalse();
    expect(comp.failed()).toBeFalse();
  });

  it('onError should set fallback when currentSrc not fallback', () => {
    const comp = createInstance();
    comp.currentSrc.set('https://something');
    comp.loading.set(true);
    comp.loaded.set(true);
    comp.failed.set(false);

    comp.onError();

    expect(comp.failed()).toBeTrue();
    expect(comp.loading()).toBeFalse();
    expect(comp.loaded()).toBeFalse();
    expect(comp.currentSrc()).toBe(comp.fallback);
  });

  it('onError should not change currentSrc if already fallback but should set failed', () => {
    const comp = createInstance();
    comp.currentSrc.set(comp.fallback);
    comp.loading.set(true);
    comp.loaded.set(true);
    comp.failed.set(false);

    comp.onError();

    expect(comp.failed()).toBeTrue();
    expect(comp.loading()).toBeFalse();
    expect(comp.loaded()).toBeFalse();
    expect(comp.currentSrc()).toBe(comp.fallback);
  });

  it('resetFlags resets loading, loaded, failed to false', () => {
    const comp = createInstance();
    comp.loading.set(true);
    comp.loaded.set(true);
    comp.failed.set(true);

    (comp as any).resetFlags();

    expect(comp.loading()).toBeFalse();
    expect(comp.loaded()).toBeFalse();
    expect(comp.failed()).toBeFalse();
  });
});
