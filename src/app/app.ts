import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { Footer } from './components/footer/footer.component';
import { NewsFacade } from './services/news-facade.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, Footer, MatProgressSpinner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('crud');
  facadeNewsService = inject(NewsFacade);
}
