import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stepp } from './stepp';

@Component({
  template: `
    <app-stepp [position]="3" [validate]="() => false">
      <p data-content>Contenido del paso</p>
    </app-stepp>
  `,
  imports: [Stepp],
})
class HostComponent {
  @ViewChild(Stepp)
  stepp!: Stepp;
}

describe('Stepp', () => {
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host.stepp).toBeTruthy();
  });

  it('should expose the received position', () => {
    expect(host.stepp.position()).toBe(3);
  });

  it('should expose the received validate', () => {
    const validator = host.stepp.validate();
    expect(typeof validator === 'function' ? validator() : validator).toBe(false);
  });

  it('should hide the content while inactive', () => {
    expect(fixture.nativeElement.querySelector('[data-content]')).toBeNull();
  });

  it('should show the content when active', () => {
    host.stepp.setActive(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-content]')).not.toBeNull();
  });
});