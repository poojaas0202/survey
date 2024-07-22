import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyreportComponent } from './surveyreport.component';

describe('SurveyreportComponent', () => {
  let component: SurveyreportComponent;
  let fixture: ComponentFixture<SurveyreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyreportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
