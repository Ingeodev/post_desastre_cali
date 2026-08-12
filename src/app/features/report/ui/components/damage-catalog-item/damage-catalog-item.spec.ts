import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageCatalogItem } from './damage-catalog-item';

describe('DamageCatalogItem', () => {
  let component: DamageCatalogItem;
  let fixture: ComponentFixture<DamageCatalogItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamageCatalogItem],
    }).compileComponents();

    fixture = TestBed.createComponent(DamageCatalogItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
