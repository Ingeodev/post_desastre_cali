import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefaultLayout } from "./shared/layouts/default-layout/default-layout";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DefaultLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('post_desastre_cali');
}
