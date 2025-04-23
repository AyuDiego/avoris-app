import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsComponent } from './buttons.component';

describe('ButtonsComponent', () => {
  let component: ButtonsComponent;
  let fixture: ComponentFixture<ButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit previousClicked when onSliderClick is called with sliderDirection "prev"', () => {
    const emitSpy = spyOn(component.previousClicked, 'emit');
    fixture.componentRef.setInput('sliderDirection', 'prev');
    fixture.detectChanges();

    component.onSliderClick();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit nextClicked when onSliderClick is called with sliderDirection "next"', () => {
    const emitSpy = spyOn(component.nextClicked, 'emit');
    fixture.componentRef.setInput('sliderDirection', 'next');
    fixture.detectChanges();

    component.onSliderClick();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit any events when onSliderClick is called with invalid sliderDirection', () => {
    const prevEmitSpy = spyOn(component.previousClicked, 'emit');
    const nextEmitSpy = spyOn(component.nextClicked, 'emit');
    fixture.componentRef.setInput('sliderDirection', undefined);
    fixture.detectChanges();

    component.onSliderClick();

    expect(prevEmitSpy).not.toHaveBeenCalled();
    expect(nextEmitSpy).not.toHaveBeenCalled();
  });

  it('should emit toggle when onAccordionToggle is called', () => {
    const emitSpy = spyOn(component.toggle, 'emit');

    component.onAccordionToggle();

    expect(emitSpy).toHaveBeenCalled();
  });
});
