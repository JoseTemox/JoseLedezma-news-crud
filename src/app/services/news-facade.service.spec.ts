/* eslint-disable max-len */
import { TestBed } from '@angular/core/testing';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';

import { NewsFacade } from './news-facade.service';
import { NewsApiService } from './news-api.service';
import { LocalStorageService } from './local-storage.service';
import { IAGeneratorImageService } from './ia-generator-api.service';
import { AllNewsMapper } from '../mappers/all-news-mappers';
import { IaGeneratorMapper } from '../mappers/iagenerator-mapper';
import { ResultElementImage } from '../interfaces/iaGenerator.interface';
import {
  NewsDtoResponse,
  NewsItemMainTable,
} from '../interfaces/news.interfaces';
import { ActionBtn } from '../utils/consts';

const sampleItem: NewsItemMainTable = {
  number: 1,
  mainTitle: 'Main title',
  summary: 'Summary text',
  timestamp: '2025-10-27T00:00:00Z',
  images: { smallImageDetailsProxied: 'img.jpg', smallImageDetails: 'img.jpg' },
  source: 'Test source',
  newsLink: 'https://example.com',
  actions: [],
};

const NewsItemArray: NewsItemMainTable[] = [
  {
    number: 1,
    mainTitle: 'Main title',
    summary: 'Summary text',
    timestamp: '2025-10-27T00:00:00Z',
    images: {
      smallImageDetailsProxied: 'img.jpg',
      smallImageDetails: 'img.jpg',
    },
    source: 'Test source',
    newsLink: 'https://example.com',
    actions: [],
  },
  {
    number: 2,
    mainTitle: '2Main title',
    summary: '2Summary text',
    timestamp: '2025-10-27T00:00:00Z',
    images: {
      smallImageDetailsProxied: 'img.jpg',
      smallImageDetails: 'img.jpg',
    },
    source: '2Test source',
    newsLink: 'https://example.com',
    actions: [],
  },
];

describe('NewsFacade', () => {
  let injector: Injector;
  let mockApi: jasmine.SpyObj<NewsApiService>;
  let mockLocalStorage: jasmine.SpyObj<LocalStorageService>;
  let mockIaService: jasmine.SpyObj<IAGeneratorImageService>;

  beforeEach(async () => {
    mockApi = jasmine.createSpyObj('NewsApiService', ['list']);
    mockApi.list.and.returnValue(of({ status: 'ok', items: [] }));
    mockLocalStorage = jasmine.createSpyObj('LocalStorageService', [
      'setData',
      'updateData',
      'deleteItem',
      'saveFixedData',
    ]);
    mockIaService = jasmine.createSpyObj('IAGeneratorImageService', ['create']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: NewsApiService, useValue: mockApi },
        { provide: LocalStorageService, useValue: mockLocalStorage },
        { provide: IAGeneratorImageService, useValue: mockIaService },
      ],
    }).compileComponents();

    injector = TestBed.inject(Injector);
  });

  it('actions getter should return find_in_page, edit and delete actions', () => {
    const facade = runInInjectionContext(injector, () => new NewsFacade());
    const acts = facade.actions;
    expect(Array.isArray(acts)).toBeTrue();
    expect(acts.map((a) => a.name)).toEqual([
      ActionBtn.find_in_page,
      ActionBtn.edit,
      ActionBtn.delete,
    ]);
  });

  it('setData/updateData/deleteItem/saveFixedData should delegate to LocalStorageService', () => {
    const facade = runInInjectionContext(injector, () => new NewsFacade());
    const sample = { number: 1 } as NewsItemMainTable;

    facade.setData(sample);
    facade.updateData(sample);
    facade.deleteItem(sample);
    facade.saveFixedData([sample]);

    expect(mockLocalStorage.setData).toHaveBeenCalledWith(sample);
    expect(mockLocalStorage.updateData).toHaveBeenCalledWith(sample);
    expect(mockLocalStorage.deleteItem).toHaveBeenCalledWith(sample);
    expect(mockLocalStorage.saveFixedData).toHaveBeenCalledWith([sample]);
  });

  it('iaTitleNewsGenerator should call iaGeneratorService.create and map the response', (done) => {
    const facade = runInInjectionContext(injector, () => new NewsFacade());
    const responseFromApi = { raw: 'resp' } as any;
    const mappedResult: ResultElementImage = { url: 'generated' } as any;

    mockIaService.create.and.returnValue(of(responseFromApi));
    spyOn(
      IaGeneratorMapper,
      'mapIaGeneratorResponseToResultElement'
    ).and.returnValue(mappedResult);

    facade.iaTitleNewsGenerator('some title').subscribe((res) => {
      expect(mockIaService.create).toHaveBeenCalledWith({
        prompt: 'some title',
        style_id: 68,
        size: '1-1',
      });
      expect(
        IaGeneratorMapper.mapIaGeneratorResponseToResultElement
      ).toHaveBeenCalledWith(responseFromApi);
      expect(res).toBe(mappedResult);
      done();
    });
  });

  it('loadAll should handle empty or non-array mapper results by setting allData to empty array and calling saveFixedData', (done) => {
    const apiResponse: NewsDtoResponse = {
      status: 'ok',
      items: [],
    } as NewsDtoResponse;
    mockApi.list.and.returnValue(of(apiResponse));
    spyOn(AllNewsMapper, 'mapNewsItemToNewsItemMainArray').and.returnValue(
      [] as any
    );

    const facade = runInInjectionContext(injector, () => new NewsFacade());

    setTimeout(() => {
      expect(facade.allData()).toEqual([]);
      expect(mockLocalStorage.saveFixedData).toHaveBeenCalledWith([]);
      done();
    }, 0);
  });

  it('saveNewsItemInList should prepend item, reindex, and call saveFixedData', () => {
    const facade = runInInjectionContext(injector, () => new NewsFacade());

    facade.allData.set([sampleItem as NewsItemMainTable]);

    const newItem = {
      number: 1,
      mainTitle: 'Main title New',
      summary: 'Summary text New',
      timestamp: '2025-10-27T00:00:00Z',
      images: {
        smallImageDetailsProxied: 'img.jpg',
        smallImageDetails: 'img.jpg',
      },
      source: 'Test source New',
      newsLink: 'https://example.com',
      actions: [],
    } as NewsItemMainTable;

    facade.saveNewsItemInList(newItem);

    const result = facade.allData();
    expect(result.length).toBe(2);
    expect(result[0].mainTitle).toBe('Main title New');
    expect(result[0].number).toBe(1);
    expect(result[1].number).toBe(2);
    expect(mockLocalStorage.saveFixedData).toHaveBeenCalledWith(result);
  });

  it('updateNewsItemInList should replace matching item and call updateData', () => {
    const facade = runInInjectionContext(injector, () => new NewsFacade());

    facade.allData.set(NewsItemArray);

    const updated = {
      number: 2,
      mainTitle: '2Main title Updated',
      summary: '2Summary text',
      timestamp: '2025-10-27T00:00:00Z',
      images: {
        smallImageDetailsProxied: 'img.jpg',
        smallImageDetails: 'img.jpg',
      },
      source: '2Test source',
      newsLink: 'https://example.com',
      actions: [],
    } as NewsItemMainTable;

    facade.updateNewsItemInList(updated, updated);

    const result = facade.allData();
    expect(result.find((i) => i.number === 2)?.mainTitle).toBe(
      '2Main title Updated'
    );
    expect(mockLocalStorage.updateData).toHaveBeenCalledWith(updated);
  });

  it('deleteNewsItemInList should remove matching item and call deleteItem', () => {
    const facade = runInInjectionContext(injector, () => new NewsFacade());

    facade.allData.set(NewsItemArray);

    const toDelete = {
      number: 1,
      mainTitle: 'Main title',
      summary: 'Summary text',
      timestamp: '2025-10-27T00:00:00Z',
      images: {
        smallImageDetailsProxied: 'img.jpg',
        smallImageDetails: 'img.jpg',
      },
      source: 'Test source',
      newsLink: 'https://example.com',
      actions: [],
    } as NewsItemMainTable;

    facade.deleteNewsItemInList(toDelete);

    const result = facade.allData();
    expect(result.length).toBe(1);
    expect(result[0].number).toBe(2);
    expect(mockLocalStorage.deleteItem).toHaveBeenCalledWith(toDelete);
  });
});
