import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from '../../app.routes';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, MatGridListModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  isMenuOpen = signal(false);

  // isMenuOpen = false;

  toggleMenu(): void {
    // this.isMenuOpen = !this.isMenuOpen;
    this.isMenuOpen.update((open) => !open);
  }
  routes = routes
    .filter((item) => item.path !== '**')
    .map(({ title, path }) => ({
      title: title ?? '',
      path: path ?? '',
    }));
}
