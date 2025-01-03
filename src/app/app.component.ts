import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'improve';

  constructor() {}

  logout() {
    localStorage.clear();
    this.reloadPage();
  }

  reloadPage() {
    window.location.reload();
  }
}
