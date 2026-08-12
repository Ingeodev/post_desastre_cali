import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentManager } from './attachment-manager';
import { NewReportStore } from '../../stores/new-report.store';

describe('AttachmentManager', () => {
  let component: AttachmentManager;
  let fixture: ComponentFixture<AttachmentManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentManager],
      providers: [NewReportStore],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
