import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastingResultComponent } from './forecasting-result.component';

describe('ForecastingResultComponent', () => {
  let component: ForecastingResultComponent;
  let fixture: ComponentFixture<ForecastingResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastingResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForecastingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
