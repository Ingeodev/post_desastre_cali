import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { Topbar } from "../../components/topbar/topbar";
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-default-layout',
  imports: [Topbar, Footer, ToastModule],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.css',
})
export class DefaultLayout {}
