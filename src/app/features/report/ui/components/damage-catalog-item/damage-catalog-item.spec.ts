import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageCatalogItemComponent } from './damage-catalog-item';

describe('DamageCatalogItemComponent', () => {
  let component: DamageCatalogItemComponent;
  let fixture: ComponentFixture<DamageCatalogItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageCatalogItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DamageCatalogItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
