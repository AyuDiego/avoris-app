import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should render the footer with the correct class', () => {
    const footerElement = fixture.debugElement.query(By.css('footer.c-footer'));
    expect(footerElement).toBeTruthy();
  });

  it('should display the logo', () => {
    const logoElement = fixture.debugElement.query(By.css('.c-footer__logo'));
    expect(logoElement).toBeTruthy();
     
    expect(logoElement.nativeElement.src).toContain('assets/images/logoMV.svg');
    expect(logoElement.nativeElement.alt).toBe('Waveless Logo');
  });

  it('should have a brand link that points to homepage', () => {
    const brandLink = fixture.debugElement.query(By.css('.c-footer__brand'));
    expect(brandLink).toBeTruthy();
    expect(brandLink.attributes['href']).toBe('/');
    expect(brandLink.attributes['aria-label']).toBe('Homepage');
  });

  it('should display copyright information', () => {
    const copyrightElement = fixture.debugElement.query(By.css('.c-footer__copyright'));
    expect(copyrightElement).toBeTruthy();
    expect(copyrightElement.nativeElement.textContent).toContain('2024 Waveless');
    expect(copyrightElement.nativeElement.textContent).toContain('Todos los derechos reservados');
  });

  it('should have a proper footer structure with main and bottom sections', () => {
    const mainSection = fixture.debugElement.query(By.css('.c-footer__main'));
    const bottomBar = fixture.debugElement.query(By.css('.c-footer__bottom-bar'));
    
    expect(mainSection).toBeTruthy();
    expect(bottomBar).toBeTruthy();
  });
});