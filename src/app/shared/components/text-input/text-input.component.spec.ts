import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';
import { TextInputComponent, TextInputType } from './text-input.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconRegistryService } from '../../../core/icon-registry.service';
import { of } from 'rxjs';

const mockSvgContent = '<svg><path d="M10 10"></path></svg>';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;
  let iconRegistryServiceSpy: jasmine.SpyObj<IconRegistryService>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('IconRegistryService', ['loadIcon']);

    await TestBed.configureTestingModule({
      imports: [TextInputComponent],
      providers: [
        provideHttpClient(withFetch()),
        { provide: IconRegistryService, useValue: spy },
      ],
    }).compileComponents();

    iconRegistryServiceSpy = TestBed.inject(
      IconRegistryService
    ) as jasmine.SpyObj<IconRegistryService>;
    sanitizer = TestBed.inject(DomSanitizer);

    const safeHtml = sanitizer.bypassSecurityTrustHtml(mockSvgContent);
    iconRegistryServiceSpy.loadIcon.and.returnValue(of(safeHtml));

    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.type()).toBe('filter-input-text');
    expect(component.leftIcon()).toBe('');
    expect(component.iconStyle()).toBe('fill:none;');
    expect(component.label()).toBe('Entrada');
    expect(component.placeholder()).toBe('Escribe aquí...');
    expect(component.value()).toBe('');
    expect(component.size()).toBe('sm');
    expect(component.disabled()).toBeFalse();
    expect(component.navTabClass()).toBe('custom-nav-tab-color');
    expect(component.title()).toBe('');
    expect(component.chevronDown()).toBeFalse();
    expect(component.rightIcon()).toBe('chevron-down');
    expect(component.rightIconStyle()).toBe('');
    expect(component.inputValue()).toBe('');
  });

  it('should render nav-tab-main type correctly', () => {
    fixture.componentRef.setInput('type', 'nav-tab-main' as TextInputType);
    fixture.componentRef.setInput('leftIcon', 'mountains');
    fixture.componentRef.setInput('title', 'Aventura');
    fixture.detectChanges();

    const navBar = fixture.debugElement.query(By.css('.c-text-input-nav-bar'));
    expect(navBar).toBeTruthy();

    const title = fixture.debugElement.query(
      By.css('.c-text-input-nav-bar__title')
    );
    expect(title.nativeElement.textContent).toBe('Aventura');

    const icon = fixture.debugElement.query(By.directive(IconComponent));
    expect(icon).toBeTruthy();
    expect(icon.componentInstance.name()).toBe('mountains');

    const button = fixture.debugElement.query(
      By.css('.c-text-input-nav-bar__chevron')
    );
    expect(button).toBeTruthy();
  });

  it('should render icon-input type correctly', () => {
    fixture.componentRef.setInput('type', 'icon-input' as TextInputType);
    fixture.componentRef.setInput('leftIcon', 'tag');
    fixture.componentRef.setInput('placeholder', 'Mínimo');
    fixture.detectChanges();

    const iconInput = fixture.debugElement.query(
      By.css('.c-text-input-icon-input')
    );
    expect(iconInput).toBeTruthy();

    const input = fixture.debugElement.query(
      By.css('.c-text-input-icon-input__field')
    );
    expect(input).toBeTruthy();
    expect(input.nativeElement.placeholder).toBe('Mínimo');

    const icon = fixture.debugElement.query(By.directive(IconComponent));
    expect(icon).toBeTruthy();
    expect(icon.componentInstance.name()).toBe('tag');
  });

  it('should render default filter-input-text type correctly', () => {
    fixture.componentRef.setInput('leftIcon', 'search');
    fixture.componentRef.setInput('label', 'Buscar');
    fixture.detectChanges();

    const filterInput = fixture.debugElement.query(
      By.css('.c-text-input-filter')
    );
    expect(filterInput).toBeTruthy();

    const label = fixture.debugElement.query(
      By.css('.c-text-input-filter__label')
    );
    expect(label.nativeElement.textContent).toBe('Buscar');

    const icon = fixture.debugElement.query(By.directive(IconComponent));
    expect(icon).toBeTruthy();
    expect(icon.componentInstance.name()).toBe('search');
  });

  it('should emit chevronClicked when chevron button is clicked', () => {
    fixture.componentRef.setInput('type', 'nav-tab-main' as TextInputType);
    fixture.detectChanges();

    spyOn(component.chevronClicked, 'emit');

    const button = fixture.debugElement.query(
      By.css('.c-text-input-nav-bar__chevron')
    );
    button.triggerEventHandler('click', null);

    expect(component.chevronClicked.emit).toHaveBeenCalled();
  });

  it('should emit inputValueChange when input value changes', () => {
    fixture.componentRef.setInput('type', 'icon-input' as TextInputType);
    fixture.detectChanges();

    spyOn(component.inputValueChange, 'emit');

    const input = fixture.debugElement.query(
      By.css('.c-text-input-icon-input__field')
    );
    const event = new Event('input');

    Object.defineProperty(event, 'target', { value: { value: 'test input' } });

    input.triggerEventHandler('input', event);

    expect(component.inputValueChange.emit).toHaveBeenCalledWith('test input');
  });

  it('should apply disabled attribute when disabled is true', () => {
    fixture.componentRef.setInput('type', 'icon-input' as TextInputType);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.debugElement.query(
      By.css('.c-text-input-icon-input__field')
    ).nativeElement;
    expect(input.disabled).toBeTrue();
  });

  it('should update value when inputValue changes', () => {
    fixture.componentRef.setInput('type', 'icon-input' as TextInputType);
    fixture.componentRef.setInput('inputValue', 'initial value');
    fixture.detectChanges();

    const input = fixture.debugElement.query(
      By.css('.c-text-input-icon-input__field')
    ).nativeElement;
    expect(input.value).toBe('initial value');

    fixture.componentRef.setInput('inputValue', 'changed value');
    fixture.detectChanges();

    expect(input.value).toBe('changed value');
  });

  it('should apply is-open class when chevronDown is true', () => {
    fixture.componentRef.setInput('type', 'nav-tab-main' as TextInputType);
    fixture.componentRef.setInput('chevronDown', true);
    fixture.detectChanges();

    const navBar = fixture.debugElement.query(By.css('.c-text-input-nav-bar'));
    expect(navBar.classes['is-open']).toBeTrue();

    const chevronIcon = fixture.debugElement.query(
      By.css('.c-text-input-nav-bar__chevron-icon')
    );
    expect(chevronIcon.classes['is-rotated']).toBeTrue();
  });

  it('should set aria-expanded attribute correctly for chevron button', () => {
    fixture.componentRef.setInput('type', 'nav-tab-main' as TextInputType);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('.c-text-input-nav-bar__chevron')
    ).nativeElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fixture.componentRef.setInput('chevronDown', true);
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });
});
