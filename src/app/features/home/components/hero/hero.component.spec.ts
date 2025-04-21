import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeroComponent } from './hero.component';
import { HERO_SLIDES } from 'src/app/mock-data/hero-slides.mock';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withFetch())],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentSlideIndex()).toBe(0);
    expect(component.slides()).toEqual(HERO_SLIDES);
  });

  it('should display content from the current slide', () => {
    const currentSlide = HERO_SLIDES[0];

    const title = fixture.debugElement.query(By.css('.o-hero-slider__title'));
    const subtitle = fixture.debugElement.query(
      By.css('.o-hero-slider__subtitle')
    );
    const button = fixture.debugElement.query(By.css('.o-hero-slider__button'));
    const background = fixture.debugElement.query(
      By.css('.o-hero-slider__background')
    );

    expect(title.nativeElement.textContent.trim()).toBe(currentSlide.title);
    expect(subtitle.nativeElement.textContent.trim()).toBe(
      currentSlide.subtitle
    );
    expect(button.componentInstance.label()).toBe(currentSlide.buttonText);
    expect(background.styles['background-image']).toContain(currentSlide.image);
  });

  it('should go to the previous slide when onPrev is called', () => {
    expect(component.currentSlideIndex()).toBe(0);

    component.onPrev();
    expect(component.currentSlideIndex()).toBe(HERO_SLIDES.length - 1);

    component.onPrev();
    expect(component.currentSlideIndex()).toBe(HERO_SLIDES.length - 2);
  });

  it('should go to the next slide when onNext is called', () => {
    expect(component.currentSlideIndex()).toBe(0);

    component.onNext();
    expect(component.currentSlideIndex()).toBe(1);

    while (component.currentSlideIndex() < HERO_SLIDES.length - 1) {
      component.onNext();
    }

    component.onNext();
    expect(component.currentSlideIndex()).toBe(0);
  });

  it('should update slide when indicator is clicked', () => {
    const targetIndex = 2;
    component.onIndicatorClick(targetIndex);

    fixture.detectChanges();

    expect(component.currentSlideIndex()).toBe(targetIndex);

    const currentSlide = HERO_SLIDES[targetIndex];
    const title = fixture.debugElement.query(By.css('.o-hero-slider__title'));
    expect(title.nativeElement.textContent.trim()).toBe(currentSlide.title);
  });

  it('should have the correct number of slider indicators', () => {
    const sliderIndicator = fixture.debugElement.query(
      By.css('app-slider-indicator')
    );
    expect(sliderIndicator).toBeTruthy();

    expect(sliderIndicator.componentInstance.currentIndex()).toBe(0);
    expect(sliderIndicator.componentInstance.totalSlides()).toBe(
      HERO_SLIDES.length
    );
  });

  it('should handle prev/next button clicks', () => {
    spyOn(component, 'onPrev');
    spyOn(component, 'onNext');

    const prevButton = fixture.debugElement.query(
      By.css('.o-hero-slider__nav-button--prev')
    );
    const nextButton = fixture.debugElement.query(
      By.css('.o-hero-slider__nav-button--next')
    );

    prevButton.componentInstance.previousClicked.emit();
    expect(component.onPrev).toHaveBeenCalled();

    nextButton.componentInstance.nextClicked.emit();
    expect(component.onNext).toHaveBeenCalled();
  });

  it('should respond to indicator clicks', () => {
    spyOn(component, 'onIndicatorClick');

    const sliderIndicator = fixture.debugElement.query(
      By.css('app-slider-indicator')
    );

    const clickIndex = 2;
    sliderIndicator.componentInstance.indicatorClicked.emit(clickIndex);

    expect(component.onIndicatorClick).toHaveBeenCalledWith(clickIndex);
  });
});
