import { Injectable } from '@angular/core';
import { NewsItemMainTable } from '../interfaces/news.interfaces';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly DATA_USER_KEY = 'userData';

  private getAllUserData(): NewsItemMainTable[] {
    const raw = localStorage.getItem(this.DATA_USER_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as NewsItemMainTable[];
    } catch {
      return [];
    }
  }

  setData(data: NewsItemMainTable): void {
    const currentData = this.getAllUserData();
    const dataUpdated = [...currentData, { ...data }] as NewsItemMainTable[];
    this.saveFixedData(dataUpdated);
  }
  updateData(data: NewsItemMainTable): void {
    const currentData = this.getAllUserData();
    const dataUpdated = currentData.map((item) =>
      item.number === data.number ? data : item
    );
    this.saveFixedData(dataUpdated);
  }

  deleteItem(data: NewsItemMainTable): void {
    const numberToRemove = data.number;
    const currentData = this.getAllUserData();
    const idx = currentData.findIndex((i) => i.number === numberToRemove);
    if (idx !== -1) {
      currentData.splice(idx, 1);
    }
    this.saveFixedData(currentData);
  }

  saveFixedData(data: NewsItemMainTable[]): void {
    localStorage.setItem(this.DATA_USER_KEY, JSON.stringify(data));
  }
}
