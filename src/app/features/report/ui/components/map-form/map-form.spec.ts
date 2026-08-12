import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapForm } from './map-form';

describe('MapForm', () => {
  let component: MapForm;
  let fixture: ComponentFixture<MapForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
