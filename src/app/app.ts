import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefaultLayout } from "./shared/layouts/default-layout/default-layout";
import { SyncOverlay } from './shared/components/sync-overlay/sync-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DefaultLayout, SyncOverlay],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('post_desastre_cali');
}
