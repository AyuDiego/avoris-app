import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderIndicatorComponent } from './slider-indicator.component';

describe('SliderIndicatorComponent', () => {
  let component: SliderIndicatorComponent;
  let fixture: ComponentFixture<SliderIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderIndicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SliderIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
