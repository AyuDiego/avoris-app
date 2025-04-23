import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfoTooltipComponent } from './info-tooltip.component';
import { IconComponent } from '../icon/icon.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; 
import { of } from 'rxjs';
import { IconRegistryService } from 'src/app/core/services/icon-registry.service';

const mockSvgContent = '<svg><path d="M10 10"></path></svg>';

describe('InfoTooltipComponent', () => {
  let component: InfoTooltipComponent;
  let fixture: ComponentFixture<InfoTooltipComponent>;
  let iconRegistryServiceSpy: jasmine.SpyObj<IconRegistryService>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('IconRegistryService', ['loadIcon']);

    await TestBed.configureTestingModule({
      imports: [InfoTooltipComponent],
      providers: [{ provide: IconRegistryService, useValue: spy }],
    }).compileComponents();

    iconRegistryServiceSpy = TestBed.inject(
      IconRegistryService
    ) as jasmine.SpyObj<IconRegistryService>;
    sanitizer = TestBed.inject(DomSanitizer);

    const safeHtml = sanitizer.bypassSecurityTrustHtml(mockSvgContent);
    iconRegistryServiceSpy.loadIcon.and.returnValue(of(safeHtml));

    fixture = TestBed.createComponent(InfoTooltipComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', 'Test tooltip content');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided content', () => {
    const tooltipText = fixture.debugElement.query(By.css('.tooltip__text'));
    expect(tooltipText).toBeTruthy();
    expect(tooltipText.nativeElement.textContent).toContain(
      'Test tooltip content'
    );
  });

  it('should use the default icon name when not specified', () => {
    const iconElement = fixture.debugElement.query(By.directive(IconComponent));
    expect(iconElement).toBeTruthy();
    expect(component.iconName()).toBe('info-tooltip');
    expect(iconRegistryServiceSpy.loadIcon).toHaveBeenCalledWith(
      'info-tooltip'
    );
  });

  it('should use custom icon name when provided', () => {
    iconRegistryServiceSpy.loadIcon.calls.reset();

    fixture.componentRef.setInput('iconName', 'custom-icon');
    fixture.detectChanges();

    expect(component.iconName()).toBe('custom-icon');
    expect(iconRegistryServiceSpy.loadIcon).toHaveBeenCalledWith('custom-icon');
  });

  it('should update content when input changes', () => {
    const newContent = 'Updated tooltip content';
    fixture.componentRef.setInput('content', newContent);
    fixture.detectChanges();
    const tooltipText = fixture.debugElement.query(By.css('.tooltip__text'));
    expect(tooltipText.nativeElement.textContent).toContain(newContent);
  });

  it('should have proper tooltip structure', () => {
    const tooltipElement = fixture.debugElement.query(By.css('.tooltip'));
    expect(tooltipElement).toBeTruthy();
    const triggerElement = fixture.debugElement.query(
      By.css('.tooltip__trigger')
    );
    expect(triggerElement).toBeTruthy();
    const contentElement = fixture.debugElement.query(
      By.css('.tooltip__content')
    );
    expect(contentElement).toBeTruthy();
    const arrowElement = fixture.debugElement.query(By.css('.tooltip__arrow'));
    expect(arrowElement).toBeTruthy();
  });
});
