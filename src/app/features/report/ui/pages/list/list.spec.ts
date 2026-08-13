import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { List } from './list';
import { ReportStore } from '../../stores/report.store';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
      providers: [
        {
          provide: ReportStore,
          useValue: {
            summaries: signal([]),
            localSummaries: signal([]),
            remoteSummaries: signal([]),
            activeSource: signal('local' as const),
            localCount: signal(0),
            remoteCount: signal(0),
            isLoading: signal(false),
            loadSummaries: (): void => undefined,
            setSource: (): void => undefined,
            selectedReport: signal(null),
            selectReport: (): void => undefined,
            damageCategories: signal([]),
            constructionTypes: signal([]),
            dataSources: signal([]),
            currentSeismicEvent: signal(null),
            damageCatalog: signal([]),
            loadCatalogs: (): void => undefined,
            filter: signal({ query: '', order: 'asc' as const }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the report list', () => {
    expect(fixture.nativeElement.querySelector('app-report-list')).not.toBeNull();
  });
});
