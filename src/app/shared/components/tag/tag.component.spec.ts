import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TagComponent, TagVariant } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.variant()).toBe('secondary');
    expect(component.label()).toBe('Tag');

    const tagElement = fixture.debugElement.query(By.css('.c-tag'));
    expect(tagElement).toBeTruthy();
    expect(tagElement.classes['c-tag--secondary']).toBeTrue();

    const labelElement = fixture.debugElement.query(By.css('.c-tag__label'));
    expect(labelElement.nativeElement.textContent).toBe('Tag');
  });

  it('should display the provided label text', () => {
    const testLabel = 'Custom Label';
    fixture.componentRef.setInput('label', testLabel);
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.c-tag__label'));
    expect(labelElement.nativeElement.textContent).toBe(testLabel);
  });

  it('should apply the correct class based on variant', () => {
    let tagElement = fixture.debugElement.query(By.css('.c-tag'));
    expect(tagElement.classes['c-tag--secondary']).toBeTrue();

    fixture.componentRef.setInput('variant', 'grey' as TagVariant);
    fixture.detectChanges();

    tagElement = fixture.debugElement.query(By.css('.c-tag'));

    tagElement = fixture.debugElement.query(By.css('.c-tag'));
    expect(tagElement.classes['c-tag--grey']).toBeTrue();
    expect(tagElement.classes['c-tag--secondary']).toBeFalsy();
  });

  it('should update rendered content when inputs change', () => {
    fixture.componentRef.setInput('variant', 'grey' as TagVariant);
    fixture.componentRef.setInput('label', 'New Label');
    fixture.detectChanges();

    const tagElement = fixture.debugElement.query(By.css('.c-tag'));
    expect(tagElement.classes['c-tag--grey']).toBeTrue();

    const labelElement = fixture.debugElement.query(By.css('.c-tag__label'));
    expect(labelElement.nativeElement.textContent).toBe('New Label');
  });

  it('should handle empty label', () => {
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.c-tag__label'));
    expect(labelElement.nativeElement.textContent).toBe('');
  });
});
