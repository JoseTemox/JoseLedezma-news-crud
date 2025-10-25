import { Component, inject, signal } from '@angular/core';
import { NewsFacade } from '../../services/news-facade.service';
import { MatCardModule } from '@angular/material/card';
import { NewsItemMain } from '../../interfaces/news.interfaces';
import { NewsItemCard } from '../../shared/components/news-item-card/news-item-card';
import { alldata } from './allData';
import { AllNewsMapper } from '../../mappers/all-news-mappers';

@Component({
  selector: 'app-news',
  imports: [MatCardModule, NewsItemCard],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export default class NewsComponent {
  api = inject(NewsFacade);
  allData = AllNewsMapper.mapNewsItemToNewsItemMainArray(alldata);
  newsItemList = signal<NewsItemMain[] | null>(this.allData);

  ngOnInit(): void {
    //TODO: pendiente implementar observable
    // this.api.loadAll().subscribe((resp) => {
    //   console.log(resp);
    //   this.newsItemList.set(resp);
    // });
  }
}
