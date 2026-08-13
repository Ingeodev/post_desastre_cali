import { Component, inject } from '@angular/core';
import { GlobalStore } from '../../stores/global.store';
import { matInfoOutline } from '@ng-icons/material-symbols/outline';
import { hugeCloudUpload } from '@ng-icons/huge-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-topbar',
  imports: [ NgIcon],
  providers :[provideIcons({ matInfoOutline, hugeCloudUpload})],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  readonly globalStore = inject(GlobalStore);
}
