import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetailComponentComponent } from './form-detail-component.component';

describe('FormDetailComponentComponent', () => {
  let component: FormDetailComponentComponent;
  let fixture: ComponentFixture<FormDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDetailComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
