import { Injectable } from '@angular/core';
import { GenericCrudService } from './generic-crud.service';
import { environment } from '../../environments/environment';
import { NewsDtoResponse } from '../interfaces/news.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NewsApiService extends GenericCrudService<NewsDtoResponse> {
  constructor() {
    super(environment.urlNewsApi);
  }
}
