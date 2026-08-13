import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailPhotos } from './report-detail-photos';
import { ReportProfilePhoto } from '../../../domain/models/report-profile.model';

describe('ReportDetailPhotos', () => {
  let component: ReportDetailPhotos;
  let fixture: ComponentFixture<ReportDetailPhotos>;

  const photos: ReportProfilePhoto[] = [
    { id: '1', sequence: 0, takenAt: '2026-08-10T00:00:00Z', url: 'https://example.com/1.png' },
    { id: '2', sequence: 1, takenAt: '2026-08-10T00:00:00Z', url: 'https://example.com/2.png' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailPhotos],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDetailPhotos);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photos', photos);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one image per photo', () => {
    const images = fixture.nativeElement.querySelectorAll('img');
    expect(images.length).toBe(2);
  });

  it('should show the empty state without photos', async () => {
    fixture.componentRef.setInput('photos', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No se registraron fotos.');
  });
});