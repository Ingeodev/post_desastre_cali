import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DamagePatterns } from '../../../../../core/supabase-models/supabase-type-aliases';

@Component({
  selector: 'app-damage-catalog-item',
  standalone: true,
  templateUrl: './damage-catalog-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DamageCatalogItemComponent {
  @Input({ required: true })
  item!: DamagePatterns;

  @Input()
  selected = false;

  @Output()
  selectedChange = new EventEmitter<DamagePatterns>();

  select(): void {
    this.selectedChange.emit(this.item);
  }

  showInfo(event: Event): void {
    event.stopPropagation();

    console.log('Damage pattern:', this.item);
  }
}