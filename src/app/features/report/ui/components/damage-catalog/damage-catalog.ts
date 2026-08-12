import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { DamageCatalogItemComponent } from '../damage-catalog-item/damage-catalog-item';
import { DamagePatterns } from '../../../../../core/supabase-models/supabase-type-aliases';

@Component({
  selector: 'app-damage-catalog',
  standalone: true,
  imports: [
    DamageCatalogItemComponent,
  ],
  templateUrl: './damage-catalog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DamagePatternCatalogComponent {
  @Input()
  items: DamagePatterns[] = [];

  @Output()
  selectedItemsChange = new EventEmitter<DamagePatterns[]>();

  private selectedIds = new Set<number>();

  get selectedItems(): DamagePatterns[] {
    return this.items.filter((item) =>
      this.selectedIds.has(item.id)
    );
  }

  isSelected(item: DamagePatterns): boolean {
    return this.selectedIds.has(item.id);
  }

  toggleSelection(item: DamagePatterns): void {
    if (this.selectedIds.has(item.id)) {
      this.selectedIds.delete(item.id);
    } else {
      this.selectedIds.add(item.id);
    }

    this.selectedItemsChange.emit(this.selectedItems);
  }
}