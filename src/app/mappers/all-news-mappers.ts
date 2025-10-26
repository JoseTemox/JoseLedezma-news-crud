import { NewsItem, NewsItemMain } from '../interfaces/news.interfaces';
import { ImagesMapper } from './images-mappers';

export class AllNewsMapper {
  static mapNewsItemToNewsItemMain(item: NewsItem): NewsItemMain {
    return {
      timestamp: item.timestamp,
      mainTitle: item.title,
      summary: item.snippet,
      images: item.images ? ImagesMapper.mapImagesToImagesDetails(item.images) : null,
      hasSubNews: item.hasSubnews,
      newsLink: item.newsUrl,
      source: item.publisher,
      subNews: AllNewsMapper.mapNewsItemToNewsItemMainArray(item.subnews),
    };
  }
  static mapNewsItemToNewsItemMainArray(items: NewsItem[] | undefined): NewsItemMain[] | null {
    return items ? items.map(this.mapNewsItemToNewsItemMain) : null;
  }
}
