import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NavBarComponent } from './nav-bar.component';
import { TABS } from 'src/app/mock-data/tabs.mock';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { ButtonsComponent } from '../../shared/components/buttons/buttons.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarComponent],
      providers: [
        provideHttpClient(withFetch())
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the mobile menu closed by default', () => {
    expect(component.isMobileMenuOpen()).toBeFalse();
    const mobileMenu = fixture.debugElement.query(By.css('.c-navbar__mobile-menu'));
    expect(mobileMenu).toBeTruthy();
    expect(mobileMenu.classes['is-open']).toBeFalsy();
  });

  it('should toggle mobile menu when toggleMobileMenu is called', () => {
    expect(component.isMobileMenuOpen()).toBeFalse();
    component.toggleMobileMenu();
    fixture.detectChanges();
    expect(component.isMobileMenuOpen()).toBeTrue();
    const mobileMenu = fixture.debugElement.query(By.css('.c-navbar__mobile-menu'));
    expect(mobileMenu.classes['is-open']).toBeTrue();
    component.toggleMobileMenu();
    fixture.detectChanges();
    expect(component.isMobileMenuOpen()).toBeFalse();
    expect(mobileMenu.classes['is-open']).toBeFalsy();
  });

  it('should display logo with proper attributes', () => {
    const logo = fixture.debugElement.query(By.css('.c-navbar__logo'));
    expect(logo).toBeTruthy();
    expect(logo.nativeElement.src).toContain('assets/images/logoMV.svg');
    expect(logo.nativeElement.alt).toBe('Waveless Logo');
  });

  it('should have a brand link that points to homepage', () => {
    const brandLink = fixture.debugElement.query(By.css('.c-navbar__brand'));
    expect(brandLink).toBeTruthy();
    expect(brandLink.attributes['href']).toBe('/');
    expect(brandLink.attributes['aria-label']).toBe('Homepage');
  });

  it('should display tabs component with TABS data', () => {
    const tabsComponent = fixture.debugElement.query(By.directive(TabsComponent));
    expect(tabsComponent).toBeTruthy();
    expect(tabsComponent.componentInstance.tabs()).toEqual(TABS);
  });

  it('should have a reservation button', () => {
    const reserveButton = fixture.debugElement.query(By.directive(ButtonsComponent));
    expect(reserveButton).toBeTruthy();
    expect(reserveButton.componentInstance.label()).toBe('Reserva');
    expect(reserveButton.componentInstance.buttonStyle()).toBe('primary');
  });

  it('should have a mobile menu toggle button with correct attributes', () => {
    const toggleButton = fixture.debugElement.query(By.css('.c-navbar__toggler'));
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.attributes['aria-controls']).toBe('mobileMenu');
    expect(toggleButton.attributes['aria-expanded']).toBe('false');
    expect(toggleButton.attributes['aria-label']).toBe('Toggle navigation');
    toggleButton.triggerEventHandler('click', null);
    expect(component.isMobileMenuOpen()).toBeTrue();
    fixture.detectChanges();
    expect(toggleButton.attributes['aria-expanded']).toBe('true');
  });

  it('should update aria-expanded attribute when mobile menu state changes', () => {
    const toggleButton = fixture.debugElement.query(By.css('.c-navbar__toggler'));
    expect(toggleButton.attributes['aria-expanded']).toBe('false');
    component.toggleMobileMenu();
    fixture.detectChanges();
    expect(toggleButton.attributes['aria-expanded']).toBe('true');
  });

  it('should include an icon in the mobile menu toggle button', () => {
    const toggleButton = fixture.debugElement.query(By.css('.c-navbar__toggler'));
    const icon = toggleButton.query(By.directive(IconComponent));
    expect(icon).toBeTruthy();
    expect(icon.componentInstance.name()).toBe('burger-menu');
  });
});
