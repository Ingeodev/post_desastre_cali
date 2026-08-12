import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLayer } from './report-layer';

describe('ReportLayer', () => {
  let component: ReportLayer;
  let fixture: ComponentFixture<ReportLayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportLayer],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportLayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
