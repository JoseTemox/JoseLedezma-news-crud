import { inject, Injectable, signal } from '@angular/core';
import { NewsApiService } from './news-api.service';
import { AllNewsMapper } from '../mappers/all-news-mappers';
import { finalize, map, Observable } from 'rxjs';
import { NewsItemMain, NewsItemMainTable } from '../interfaces/news.interfaces';
import { Action } from '../shared/components/table/table.interfaces';
import { LocalStorageService } from './local-storage.service';
import { IAGeneratorImageService } from './ia-generator-api.service';
import {
  GeneratorRequest,
  ResultElementImage,
} from '../interfaces/iaGenerator.interface';
import { IaGeneratorMapper } from '../mappers/iagenerator-mapper';
import { ActionBtn, IAConstApi } from '../utils/consts';

@Injectable({
  providedIn: 'root',
})
export class NewsFacade {
  private readonly apiService = inject(NewsApiService);
  private readonly localStorageService = inject(LocalStorageService);
  iaGeneratorService = inject(IAGeneratorImageService);

  readonly loading = signal(false);
  readonly allData = signal<NewsItemMainTable[]>([]);

  loadAll(): void {
    this.loading.set(true);
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
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((resp) => {
        this.allData.set(resp);
        this.saveFixedData(resp);
      });
  }
  get actions(): Action[] {
    return [
      { name: ActionBtn.find_in_page },
      { name: ActionBtn.edit },
      { name: ActionBtn.delete },
    ];
  }

  constructor() {
    this.loadAll();
  }

  saveNewsItemInList(dataResponseWithActions: NewsItemMainTable): void {
    this.allData.update((list) =>
      [dataResponseWithActions, ...list].map((item, index) => ({
        ...item,
        number: index + 1,
      }))
    );
    this.saveFixedData(this.allData());
  }

  updateNewsItemInList(
    dataResponseWithActions: NewsItemMainTable,
    modalResponse: NewsItemMainTable
  ): void {
    this.allData.update((list) =>
      list.map((item) =>
        item.number === modalResponse.number ? dataResponseWithActions : item
      )
    );
    this.updateData(dataResponseWithActions);
  }

  deleteNewsItemInList(data: NewsItemMainTable): void {
    this.allData.update((list) => {
      const idx = list.findIndex((i) => i.number === data.number);
      if (idx === -1) {
        return list;
      }
      const copy = list.slice();
      copy.splice(idx, 1);
      return copy;
    });
    this.deleteItem(data);
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

  iaTitleNewsGenerator(title: string): Observable<ResultElementImage> {
    const data: GeneratorRequest = {
      prompt: title,
      style_id: IAConstApi.styleId,
      size: IAConstApi.size,
    };
    return this.iaGeneratorService
      .create(data)
      .pipe(
        map((item) =>
          IaGeneratorMapper.mapIaGeneratorResponseToResultElement(item)
        )
      );
  }
}
