import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocationLayer } from './user-location-layer';

describe('UserLocationLayer', () => {
  let component: UserLocationLayer;
  let fixture: ComponentFixture<UserLocationLayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLocationLayer],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLocationLayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
