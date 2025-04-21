import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TitleComponent } from './title.component';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.text()).toBe('Título');
    expect(component.customClass()).toBe('');

    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent).toBe('Título');
    expect(titleElement.nativeElement.className).toBe('c-title');
  });

  it('should display the provided text', () => {
    const testText = 'Custom Title';
    fixture.componentRef.setInput('text', testText);
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent).toBe(testText);
  });

  it('should apply custom class when provided', () => {
    const testClass = ' custom-class';
    fixture.componentRef.setInput('customClass', testClass);
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.className).toBe('c-title' + testClass);
  });

  it('should update rendered content when inputs change', () => {
    fixture.componentRef.setInput('text', 'New Title');
    fixture.componentRef.setInput('customClass', ' special');
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent).toBe('New Title');
    expect(titleElement.nativeElement.className).toBe('c-title special');
  });
});
