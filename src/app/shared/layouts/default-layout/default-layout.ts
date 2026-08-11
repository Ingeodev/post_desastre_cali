import { Component } from '@angular/core';
import { Topbar } from "../../components/topbar/topbar";
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-default-layout',
  imports: [Topbar, Footer],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.css',
})
export class DefaultLayout {}
