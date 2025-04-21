import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconComponent } from './icon.component';
import { IconRegistryService } from '../../../core/icon-registry.service';
import { of, throwError } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockSvgContent = '<svg><path d="M10 10"></path></svg>';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;
  let iconRegistryService: IconRegistryService;
  let sanitizer: DomSanitizer;
  let loadIconSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent, HttpClientTestingModule],
      providers: [IconRegistryService],
    }).compileComponents();

    iconRegistryService = TestBed.inject(IconRegistryService);
    sanitizer = TestBed.inject(DomSanitizer);
    const safeHtml = sanitizer.bypassSecurityTrustHtml(mockSvgContent);
    loadIconSpy = spyOn(iconRegistryService, 'loadIcon').and.returnValue(
      of(safeHtml)
    );
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'test-icon');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and display the icon', () => {
    expect(loadIconSpy).toHaveBeenCalledWith('test-icon');
    const iconElement = fixture.debugElement.query(By.css('.icon-wrapper'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.nativeElement.innerHTML).toBeTruthy();
    expect(component.svgContent()).not.toBeNull();
  });

  it('should handle error when loading icon fails', () => {
    spyOn(console, 'error');
    loadIconSpy.and.returnValue(throwError(() => new Error('Icon not found')));
    fixture.componentRef.setInput('name', 'error-icon');
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalled();
    expect(component.svgContent()).toBeNull();
  });

  it('should not load icon when name is empty', () => {
    loadIconSpy.calls.reset();
    fixture.componentRef.setInput('name', '');
    fixture.detectChanges();
    expect(loadIconSpy).not.toHaveBeenCalled();
    expect(component.svgContent()).toBeNull();
  });
});
