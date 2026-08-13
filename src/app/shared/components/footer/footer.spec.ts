import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { Footer } from './footer';
import { SettingsStore } from '../../../features/settings/ui/stores/settings.store';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let isConfigured: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    isConfigured = signal(false);

    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [
        provideRouter([]),
        { provide: SettingsStore, useValue: { isConfigured } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not block navigation when settings are configured', () => {
    isConfigured.set(true);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onNewReportClick(new Event('click'));
    fixture.detectChanges();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should send the user to settings when tapping the disabled new report tab', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const link = fixture.nativeElement.querySelector(
      'a[aria-label="Nuevo reporte"]',
    ) as HTMLAnchorElement;
    expect(link.getAttribute('aria-disabled')).toBe('true');

    link.dispatchEvent(new Event('click', { cancelable: true }));

    expect(navigateSpy).toHaveBeenCalledWith(['/settings']);
  });
});