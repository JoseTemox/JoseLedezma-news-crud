import { Images, ImagesDetails } from '../interfaces/news.interfaces';

export class ImagesMapper {
  static mapImagesToImagesDetails(item: Images): ImagesDetails {
    return {
      smallImageDetails: item.thumbnail,
      smallImageDetailsProxied: item.thumbnailProxied,
    };
  }
  static mapNewsItemMainToGifArray(items: Images[]): ImagesDetails[] {
    return items.map(this.mapImagesToImagesDetails);
  }
}
