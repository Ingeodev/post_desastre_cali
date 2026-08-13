import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ReportListItem } from './report-list-item';
import { ReportSummary } from '../../../domain/models/report-summary.model';

describe('ReportListItem', () => {
  let component: ReportListItem;
  let fixture: ComponentFixture<ReportListItem>;

  const summary: ReportSummary = {
    id: 'abc',
    addressText: 'Calle 1',
    damageCategoryLabel: 'Daño alto',
    capturedAt: '2026-08-10T00:00:00Z',
    notes: 'Grietas en muros',
    firstPhotoUrl: 'https://example.com/photo.png',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportListItem],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportListItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('summary', summary);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the summary data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Calle 1');
    expect(compiled.textContent).toContain('Daño alto');
    expect(compiled.textContent).toContain('Grietas en muros');
    expect(compiled.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/photo.png',
    );
  });

  it('should navigate to the detail page on click', () => {
    const navigate = vi.spyOn(component['router'], 'navigate');

    (fixture.nativeElement.querySelector('p-button button') as HTMLButtonElement).click();

    expect(navigate).toHaveBeenCalledWith(['/reportes', 'abc']);
  });
});