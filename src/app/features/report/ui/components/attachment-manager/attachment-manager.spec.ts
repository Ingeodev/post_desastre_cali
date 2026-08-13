import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AttachmentManager } from './attachment-manager';
import { NewReportStore } from '../../stores/new-report.store';
import { SaveReport } from '../../../domain/use-cases/save-report';
import { GlobalStore } from '../../../../../shared/stores/global.store';

describe('AttachmentManager', () => {
  let component: AttachmentManager;
  let fixture: ComponentFixture<AttachmentManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentManager],
      providers: [
        NewReportStore,
        { provide: SaveReport, useValue: { execute: vi.fn() } },
        { provide: GlobalStore, useValue: { setRegistering: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
