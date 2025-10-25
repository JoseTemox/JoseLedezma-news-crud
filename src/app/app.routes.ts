import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    title: 'All News',
    loadComponent: () => import('./pages/all-news/news.component'),
  },
  {
    path: 'management',
    title: 'Management News',
    loadComponent: () =>
      import('./pages/news-item-management/news-item-management.component'),
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
