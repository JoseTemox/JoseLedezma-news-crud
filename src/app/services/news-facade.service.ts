import { inject, Injectable, signal } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { AllNewsMapper } from '../mappers/all-news-mappers';
import { map } from 'rxjs';
import { NewsItemMain, NewsItemMainTable } from '../interfaces/news.interfaces';
import { Action } from '../shared/components/table/table.interfaces';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class NewsFacade {
  private readonly apiService = inject(NewsApiService);
  private readonly localStorageService = inject(LocalStorageService);

  private readonly loading = signal(false);
  readonly allData = signal<NewsItemMainTable[]>([]);

  loadAll(): void {
    this.apiService
      .list()
      .pipe(
        map((response) =>
          AllNewsMapper.mapNewsItemToNewsItemMainArray(response.items)
        ),
        map((items) => {
          if (!Array.isArray(items) || items.length === 0) {
            return [];
          }
          return items?.map((itemList, indexList) => {
            return {
              ...itemList,
              urlImages: itemList.images?.smallImageDetailsProxied,
              number: indexList + 1,
              actions: this.actions,
            };
          }) as NewsItemMain[];
        })
      )
      .subscribe((resp) => {
        this.allData.set(resp);
        this.saveFixedData(resp);
      });
  }
  get actions(): Action[] {
    return [{ name: 'find_in_page' }, { name: 'edit' }, { name: 'delete' }];
  }

  constructor() {
    this.loadAll();
  }

  setData(data: NewsItemMainTable): void {
    this.localStorageService.setData(data);
  }
  updateData(data: NewsItemMainTable): void {
    this.localStorageService.updateData(data);
  }
  deleteItem(data: NewsItemMainTable): void {
    this.localStorageService.deleteItem(data);
  }
  saveFixedData(data: NewsItemMainTable[]): void {
    this.localStorageService.saveFixedData(data);
  }
}
