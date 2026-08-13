import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

import { ReportDetail } from './report-detail';
import { ProfileStore } from '../../stores/profile.store';

describe('ReportDetail', () => {
  let component: ReportDetail;
  let fixture: ComponentFixture<ReportDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetail],
      providers: [
        provideRouter([]),
        {
          provide: ProfileStore,
          useValue: {
            profile: signal(null),
            isLoading: signal(false),
            error: signal(null),
            status: signal('idle'),
            load: (): Promise<void> => Promise.resolve(),
            reset: (): void => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});