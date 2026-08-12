import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageCatalog } from './damage-catalog';

describe('DamageCatalog', () => {
  let component: DamageCatalog;
  let fixture: ComponentFixture<DamageCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(DamageCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
