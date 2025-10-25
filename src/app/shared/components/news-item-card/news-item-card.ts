import { Component, input } from '@angular/core';
import { NewsItemMain } from '../../../interfaces/news.interfaces';
import { MatCardModule } from '@angular/material/card';
import { NoImagePipe } from '../../pipes/no-image-pipe';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-news-item-card',
  imports: [
    MatCardModule,
    NoImagePipe,
    DatePipe,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './news-item-card.html',
  styleUrl: './news-item-card.scss',
})
export class NewsItemCard {
  readonly newsItem = input.required<NewsItemMain>();

  goTo(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
