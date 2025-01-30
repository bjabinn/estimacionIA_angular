import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEstimacionComponent } from './view-estimacion.component';

describe('ViewEstimacionComponent', () => {
  let component: ViewEstimacionComponent;
  let fixture: ComponentFixture<ViewEstimacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEstimacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEstimacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
