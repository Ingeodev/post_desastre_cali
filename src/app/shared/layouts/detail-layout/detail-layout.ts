import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detail-layout',
  imports: [RouterOutlet, RouterLink, ToastModule],
  templateUrl: './detail-layout.html',
  styleUrl: './detail-layout.css',
})
export class DetailLayout {}