import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DefaultLayout } from './default-layout';

describe('DefaultLayout', () => {
  let component: DefaultLayout;
  let fixture: ComponentFixture<DefaultLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
