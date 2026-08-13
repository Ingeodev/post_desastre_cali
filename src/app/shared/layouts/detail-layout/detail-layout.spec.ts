import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { DetailLayout } from './detail-layout';

describe('DetailLayout', () => {
  let component: DetailLayout;
  let fixture: ComponentFixture<DetailLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailLayout],
      providers: [provideRouter([]), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a back link and a router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerlink]')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});