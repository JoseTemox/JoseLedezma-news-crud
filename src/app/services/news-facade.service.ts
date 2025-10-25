import { inject, Injectable, signal } from '@angular/core';
import { GenericCrudService } from './generic-crud.service';
// import { NewsDtoResponse } from '../interfaces/news.interfaces';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsApiService } from './news-api.service';
import { AllNewsMapper } from '../mappers/all-news-mappers';
import { map, Observable, tap } from 'rxjs';
import { NewsItemMain } from '../interfaces/news.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NewsFacade {
  private api = inject(NewsApiService);

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  loadAll(): Observable<NewsItemMain[] | null> {
    return this.api
      .list()
      .pipe(
        map((response) =>
          AllNewsMapper.mapNewsItemToNewsItemMainArray(response.items)
        )
      );
  }

  constructor() {}
}
