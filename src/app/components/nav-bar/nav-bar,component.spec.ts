import { TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { CommonModule } from '@angular/common';

describe('NavBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NavBarComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(NavBarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have isMenuOpen initial value false', () => {
    const fixture = TestBed.createComponent(NavBarComponent);
    const component = fixture.componentInstance;
    expect(component.isMenuOpen()).toBeFalse();
  });

  it('toggleMenu should toggle isMenuOpen from false to true and back', () => {
    const fixture = TestBed.createComponent(NavBarComponent);
    const component = fixture.componentInstance;

    expect(component.isMenuOpen()).toBeFalse();

    component.toggleMenu();
    expect(component.isMenuOpen()).toBeTrue();

    component.toggleMenu();
    expect(component.isMenuOpen()).toBeFalse();
  });

  it('routes should be an array of objects with title and path and must not contain wildcard path', () => {
    const fixture = TestBed.createComponent(NavBarComponent);
    const component = fixture.componentInstance;

    expect(Array.isArray(component.routes)).toBeTrue();
    expect(component.routes.length).toBeGreaterThanOrEqual(0);

    component.routes.forEach((r) => {
      expect(typeof r.title).toBe('string');
      expect(typeof r.path).toBe('string');
    });

    const hasWildcard = component.routes.some((r) => r.path === '**');
    expect(hasWildcard).toBeFalse();
  });
});
