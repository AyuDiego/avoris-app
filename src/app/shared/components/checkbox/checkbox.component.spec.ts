import { provideHttpClient, withFetch } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CheckboxComponent } from './checkbox.component';
import { InfoTooltipComponent } from '../info-tooltip/info-tooltip.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let inputElement: HTMLInputElement;
  let labelElement: HTMLLabelElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxComponent],
      providers: [
        provideHttpClient(withFetch()), 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(
      By.css('input[type="checkbox"]')
    ).nativeElement;
    labelElement = fixture.debugElement.query(By.css('label'))?.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.label()).toBe('');
    expect(component.tooltip()).toBe('');
    expect(component.checked()).toBeFalse();
    expect(inputElement.checked).toBeFalse();
  });

  it('should display the label when provided', () => {
    const testLabel = 'Test Label';
    fixture.componentRef.setInput('label', testLabel);
    fixture.detectChanges();
    labelElement = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(labelElement.textContent).toContain(testLabel);
  });

  it('should set the checked state via model', () => {
    component.checked.set(true);
    fixture.detectChanges();
    expect(inputElement.checked).toBeTrue();
  });

  it('should toggle the checked state when clicked', () => {
    expect(component.checked()).toBeFalse();

    component.toggleCheck();
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(inputElement.checked).toBeTrue();

    component.toggleCheck();
    fixture.detectChanges();

    expect(component.checked()).toBeFalse();
    expect(inputElement.checked).toBeFalse();
  });

  it('should update checked value when toggleCheck is called', () => {
    expect(component.checked()).toBeFalse();

    component.toggleCheck();
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(inputElement.checked).toBeTrue();
  });

  it('should display tooltip when provided', () => {
    const testTooltip = 'Test Tooltip';
    fixture.componentRef.setInput('tooltip', testTooltip);
    fixture.detectChanges();
    
    const tooltipElement = fixture.debugElement.query(By.directive(InfoTooltipComponent));
    expect(tooltipElement).toBeTruthy();
    expect(tooltipElement.componentInstance.content()).toBe(testTooltip);
  });

  it('should update hover state', () => {
    expect(component.hover()).toBeFalse();

    inputElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
  });
});
