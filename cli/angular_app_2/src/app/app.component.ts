import { Component } from '@angular/core';
import packageJson from '../../package.json';

@Component({
  selector: 'angular-element',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';
  appName = packageJson.name;
}
