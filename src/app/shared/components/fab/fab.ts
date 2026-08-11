import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Button } from 'primeng/button';

export type FabSize = 'small' | 'large';

export type FabSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'help'
  | 'contrast';

export type FabPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

const POSITION_STYLES: Record<FabPosition, Record<string, string>> = {
  'top-start': { top: '16px', left: '16px' },
  'top-center': { top: '16px', left: '50%', transform: 'translateX(-50%)' },
  'top-end': { top: '16px', right: '16px' },
  'bottom-start': { bottom: '16px', left: '16px' },
  'bottom-center': { bottom: '16px', left: '50%', transform: 'translateX(-50%)' },
  'bottom-end': { bottom: '16px', right: '16px' },
};

@Component({
  selector: 'app-fab',
  imports: [Button],
  templateUrl: './fab.html',
  styleUrl: './fab.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fab {
  readonly icon = input.required<string>();
  readonly size = input<FabSize>();
  readonly severity = input<FabSeverity>('primary');
  readonly position = input<FabPosition>('bottom-end');
  readonly ariaLabel = input<string>();

  readonly clicked = output<void>();

  readonly positionStyle = computed(() => ({
    position: 'absolute',
    zIndex: '1100',
    ...POSITION_STYLES[this.position()],
  }));
}
