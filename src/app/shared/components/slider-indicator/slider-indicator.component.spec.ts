import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SliderIndicatorComponent } from './slider-indicator.component';

describe('SliderIndicatorComponent', () => {
  let component: SliderIndicatorComponent;
  let fixture: ComponentFixture<SliderIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderIndicatorComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('currentIndex', 0);
    fixture.componentRef.setInput('totalSlides', 3);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of dot indicators based on totalSlides', () => {
    const dots = fixture.debugElement.queryAll(
      By.css('.c-slider-indicator__dot')
    );
    expect(dots.length).toBe(3);

    fixture.componentRef.setInput('totalSlides', 5);
    fixture.detectChanges();

    const updatedDots = fixture.debugElement.queryAll(
      By.css('.c-slider-indicator__dot')
    );
    expect(updatedDots.length).toBe(5);
  });

  it('should mark the correct dot as active based on currentIndex', () => {
    const dots = fixture.debugElement.queryAll(
      By.css('.c-slider-indicator__dot')
    );

    expect(
      dots[0].nativeElement.classList.contains(
        'c-slider-indicator__dot--active'
      )
    ).toBeTrue();
    expect(
      dots[1].nativeElement.classList.contains(
        'c-slider-indicator__dot--active'
      )
    ).toBeFalse();
    expect(
      dots[2].nativeElement.classList.contains(
        'c-slider-indicator__dot--active'
      )
    ).toBeFalse();

    fixture.componentRef.setInput('currentIndex', 1);
    fixture.detectChanges();

    expect(
      dots[0].nativeElement.classList.contains(
        'c-slider-indicator__dot--active'
      )
    ).toBeFalse();
    expect(
      dots[1].nativeElement.classList.contains(
        'c-slider-indicator__dot--active'
      )
    ).toBeTrue();
    expect(
      dots[2].nativeElement.classList.contains(
        'c-slider-indicator__dot--active'
      )
    ).toBeFalse();
  });

  it('should emit indicatorClicked event with correct index when dot is clicked', () => {
    spyOn(component.indicatorClicked, 'emit');

    const dots = fixture.debugElement.queryAll(
      By.css('.c-slider-indicator__dot')
    );

    dots[1].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.indicatorClicked.emit).toHaveBeenCalledWith(1);

    dots[2].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.indicatorClicked.emit).toHaveBeenCalledWith(2);
  });

  it('should have accessible labels for screen readers on dots', () => {
    const dots = fixture.debugElement.queryAll(
      By.css('.c-slider-indicator__dot')
    );

    expect(dots[0].nativeElement.getAttribute('aria-label')).toBe(
      'Go to slide 1'
    );
    expect(dots[1].nativeElement.getAttribute('aria-label')).toBe(
      'Go to slide 2'
    );
    expect(dots[2].nativeElement.getAttribute('aria-label')).toBe(
      'Go to slide 3'
    );
  });

  it('should call onIndicatorClick method when dot is clicked', () => {
    spyOn(component, 'onIndicatorClick');

    const dots = fixture.debugElement.queryAll(
      By.css('.c-slider-indicator__dot')
    );

    dots[1].triggerEventHandler('click', null);

    expect(component.onIndicatorClick).toHaveBeenCalledWith(1);
  });

  it('should properly update dots when totalSlides changes', () => {
    let dots = fixture.debugElement.queryAll(
      By.css('.c-slider-indicator__dot')
    );
    expect(dots.length).toBe(3);

    fixture.componentRef.setInput('totalSlides', 2);
    fixture.detectChanges();

    dots = fixture.debugElement.queryAll(By.css('.c-slider-indicator__dot'));
    expect(dots.length).toBe(2);

    fixture.componentRef.setInput('totalSlides', 4);
    fixture.detectChanges();

    dots = fixture.debugElement.queryAll(By.css('.c-slider-indicator__dot'));
    expect(dots.length).toBe(4);
  });
});
