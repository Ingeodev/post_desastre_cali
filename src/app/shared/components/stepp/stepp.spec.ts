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

function getWrapper(fixture: ComponentFixture<HostComponent>): HTMLElement {
  return fixture.nativeElement.querySelector('[data-stepp-content]') as HTMLElement;
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

  it('should not render the content while inactive', () => {
    expect(getWrapper(fixture)).toBeNull();
  });

  it('should render the content and show it when active', () => {
    expect(fixture.nativeElement.querySelector('[data-content]')).toBeNull();

    host.stepp.setActive(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-content]')).not.toBeNull();
    expect(getWrapper(fixture)).not.toBeNull();
  });
});