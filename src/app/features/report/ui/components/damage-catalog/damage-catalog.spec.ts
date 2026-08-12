import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagePatternCatalogComponent } from './damage-catalog';

describe('DamagePatternCatalogComponent', () => {
  let component: DamagePatternCatalogComponent;
  let fixture: ComponentFixture<DamagePatternCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamagePatternCatalogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DamagePatternCatalogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
