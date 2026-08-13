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
    component.item = {
      id: 1,
      code: 'GRIETA',
      label: 'Grieta',
      description: 'Descripción',
      reference_image_url: 'https://example.com/img.png',
      active: true,
    };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
