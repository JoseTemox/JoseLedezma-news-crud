import { Action } from '../shared/components/table/table.interfaces';

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export interface NewsDtoResponse {
  status: string;
  items: NewsItem[];
}

export interface NewsItem {
  timestamp: string;
  title: string;
  snippet: string;
  images?: Images;
  hasSubnews?: boolean;
  newsUrl: string;
  publisher: string;
  subnews?: NewsItem[];
}
export interface NewsItemMain {
  timestamp: string;
  mainTitle: string;
  summary: string;
  images: ImagesDetails | null;
  hasSubNews?: boolean;
  newsLink: string;
  source: string;
  subNews?: NewsItemMain[] | null;
}
export interface NewsItemMainTable extends NewsItemMain {
  urlImages?: string;
  number?: number;
  actions?: Action[];
}

export interface Images {
  thumbnail: string;
  thumbnailProxied: string;
}
export interface ImagesDetails {
  smallImageDetails: string;
  smallImageDetailsProxied?: string;
}
