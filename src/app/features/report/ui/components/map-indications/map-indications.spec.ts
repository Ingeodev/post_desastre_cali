import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapIndications } from './map-indications';

describe('MapIndications', () => {
  let component: MapIndications;
  let fixture: ComponentFixture<MapIndications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapIndications],
    }).compileComponents();

    fixture = TestBed.createComponent(MapIndications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
