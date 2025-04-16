import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceBreakdownModalComponent } from './price-breakdown-modal.component';

describe('PriceBreakdownModalComponent', () => {
  let component: PriceBreakdownModalComponent;
  let fixture: ComponentFixture<PriceBreakdownModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceBreakdownModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceBreakdownModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
