import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export class GenericCrudService<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
> {
  protected http = inject(HttpClient);

  constructor(protected baseUrl: string) {}

  list(params?: Record<string, string | number>): Observable<T> {
    const httpParams = params
      ? new HttpParams({
          fromObject: Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)])
          ),
        })
      : undefined;
    return this.http.get<T>(this.baseUrl, { params: httpParams });
  }

  get(id: string | number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateDto): Observable<T> {
    return this.http.post<T>(this.baseUrl, dto);
  }

  update(id: string | number, dto: UpdateDto): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
