import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injector, runInInjectionContext } from '@angular/core';
import { GenericCrudService } from './generic-crud.service';
type Item = { id: number; name: string };

describe('GenericCrudService ', () => {
  let injector: Injector;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    injector = TestBed.inject(Injector);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function createService(baseUrl = '/api/items') {
    return runInInjectionContext(
      injector,
      () => new GenericCrudService<Item[]>(baseUrl)
    );
  }

  it('list should do GET with no params and return Item[]', () => {
    const svc = createService('/api/items');
    const mockResp: Item[] = [{ id: 1, name: 'A' }];

    svc.list().subscribe((res) => {
      expect(res).toEqual(mockResp);
    });

    const req = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url === '/api/items'
    );
    expect(req.request.params.keys().length).toBe(0);
    req.flush(mockResp);
  });

  it('list should convert params to HttpParams and return Item[]', () => {
    const svc = createService('/api/items');
    const mockResp: Item[] = [{ id: 2, name: 'B' }];

    svc.list({ page: 2, q: 'test' }).subscribe((res) => {
      expect(res).toEqual(mockResp);
    });

    const req = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url === '/api/items'
    );
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('q')).toBe('test');
    req.flush(mockResp);
  });

  it('get should call GET with id in path and return Item[] element type', () => {
    const svc = createService('/api/items');
    const mockItem = { id: 5, name: 'X' } as unknown as Item[];

    svc.get(5).subscribe((res) => expect(res).toEqual(mockItem));

    const req = httpMock.expectOne('/api/items/5');
    expect(req.request.method).toBe('GET');
    req.flush(mockItem);
  });

  it('create should call POST with dto', () => {
    const svc = createService('/api/items');
    const dto = { name: 'New' } as any;
    const created = [{ id: 10, name: 'New' }] as unknown as Item[];

    svc.create(dto).subscribe((res) => expect(res).toEqual(created));

    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(created);
  });

  it('update should call PUT to /base/id with dto', () => {
    const svc = createService('/api/items');
    const dto = { name: 'Updated' } as any;
    const updated = [{ id: 3, name: 'Updated' }] as unknown as Item[];

    svc.update(3, dto).subscribe((res) => expect(res).toEqual(updated));

    const req = httpMock.expectOne('/api/items/3');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);
    req.flush(updated);
  });

  it('delete should call DELETE and return null when backend responds with null', () => {
    const svc = createService('/api/items');

    svc.delete(7).subscribe((res) => expect(res).toBeNull());

    const req = httpMock.expectOne('/api/items/7');
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });
});
