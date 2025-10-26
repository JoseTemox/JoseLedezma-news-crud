import { Component, inject } from '@angular/core';
import { NewsFacade } from '../../services/news-facade.service';
import { MatCardModule } from '@angular/material/card';
import { NewsItemCard } from '../../shared/components/news-item-card/news-item-card';

@Component({
  selector: 'app-news',
  imports: [MatCardModule, NewsItemCard],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export default class NewsComponent {
  api = inject(NewsFacade);
  facadeNewsService = inject(NewsFacade);
  newsItemList = this.facadeNewsService.allData;
}
