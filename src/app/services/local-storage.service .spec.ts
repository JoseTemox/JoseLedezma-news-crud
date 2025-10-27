import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { NewsItemMainTable } from '../interfaces/news.interfaces';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  const KEY = 'userData';

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });

    service = TestBed.inject(LocalStorageService);
  });

  it('should save empty array when no data in storage', () => {
    expect(localStorage.getItem(KEY)).toBeNull();

    service.saveFixedData([]);
    const raw = localStorage.getItem(KEY);
    expect(raw).toBe(JSON.stringify([]));
  });

  it('setData should append new item to existing storage', () => {
    const existing: NewsItemMainTable[] = [
      { number: 1, mainTitle: 'A' } as any,
    ];
    localStorage.setItem(KEY, JSON.stringify(existing));

    const newItem: NewsItemMainTable = { number: 2, mainTitle: 'B' } as any;
    service.setData(newItem);

    const stored = JSON.parse(
      localStorage.getItem(KEY) as string
    ) as NewsItemMainTable[];
    expect(stored.length).toBe(2);
    expect(stored.find((s) => s.number === 2)?.mainTitle).toBe('B');
  });

  it('setData should create array if storage empty', () => {
    expect(localStorage.getItem(KEY)).toBeNull();
    const newItem: NewsItemMainTable = { number: 1, mainTitle: 'X' } as any;
    service.setData(newItem);

    const stored = JSON.parse(
      localStorage.getItem(KEY) as string
    ) as NewsItemMainTable[];
    expect(stored).toEqual([
      jasmine.objectContaining({ number: 1, mainTitle: 'X' }),
    ]);
  });

  it('updateData should replace item with same number', () => {
    const initial: NewsItemMainTable[] = [
      { number: 1, mainTitle: 'A' } as any,
      { number: 2, mainTitle: 'B' } as any,
    ];
    localStorage.setItem(KEY, JSON.stringify(initial));

    const updated: NewsItemMainTable = {
      number: 2,
      mainTitle: 'B-updated',
    } as any;
    service.updateData(updated);

    const stored = JSON.parse(
      localStorage.getItem(KEY) as string
    ) as NewsItemMainTable[];
    expect(stored.length).toBe(2);
    expect(stored.find((s) => s.number === 2)?.mainTitle).toBe('B-updated');
  });

  it('deleteItem should remove the item by number and persist', () => {
    const initial: NewsItemMainTable[] = [
      { number: 1, mainTitle: 'A' } as any,
      { number: 2, mainTitle: 'B' } as any,
      { number: 3, mainTitle: 'C' } as any,
    ];
    localStorage.setItem(KEY, JSON.stringify(initial));

    const toDelete: NewsItemMainTable = { number: 2 } as any;
    service.deleteItem(toDelete);

    const stored = JSON.parse(
      localStorage.getItem(KEY) as string
    ) as NewsItemMainTable[];
    expect(stored.length).toBe(2);
    expect(stored.find((s) => s.number === 2)).toBeUndefined();
  });

  it('deleteItem should not throw if item not present', () => {
    const initial: NewsItemMainTable[] = [{ number: 1, mainTitle: 'A' } as any];
    localStorage.setItem(KEY, JSON.stringify(initial));

    const toDelete: NewsItemMainTable = { number: 99 } as any;
    expect(() => service.deleteItem(toDelete)).not.toThrow();

    const stored = JSON.parse(
      localStorage.getItem(KEY) as string
    ) as NewsItemMainTable[];
    expect(stored.length).toBe(1);
  });

  it('saveFixedData should overwrite storage with provided array', () => {
    const data: NewsItemMainTable[] = [
      { number: 10, mainTitle: 'X' } as any,
      { number: 11, mainTitle: 'Y' } as any,
    ];
    service.saveFixedData(data);

    const stored = JSON.parse(
      localStorage.getItem(KEY) as string
    ) as NewsItemMainTable[];
    expect(stored).toEqual(data);
  });

  it('handles corrupted JSON gracefully (getAllUserData returns empty array)', () => {
    localStorage.setItem(KEY, '{invalidJson');

    const newItem: NewsItemMainTable = {
      number: 1,
      mainTitle: 'Recovered',
    } as any;
    service.setData(newItem);

    const stored = JSON.parse(
      localStorage.getItem(KEY) as string
    ) as NewsItemMainTable[];
    expect(stored.length).toBe(1);
    expect(stored[0].mainTitle).toBe('Recovered');
  });
});
