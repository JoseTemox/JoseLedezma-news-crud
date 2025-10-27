import { ImagesMapper } from './images-mappers';
import { Images, ImagesDetails } from '../interfaces/news.interfaces';

describe('ImagesMapper', () => {
  it('mapImagesToImagesDetails maps thumbnail fields correctly', () => {
    const input: Images = {
      thumbnail: 'http://example.com/thumb.jpg',
      thumbnailProxied: 'http://proxy.example.com/thumb.jpg',
    } as any;

    const out: ImagesDetails = ImagesMapper.mapImagesToImagesDetails(input);

    expect(out).toEqual({
      smallImageDetails: 'http://example.com/thumb.jpg',
      smallImageDetailsProxied: 'http://proxy.example.com/thumb.jpg',
    });
  });

  it('mapImagesToImagesDetails handles missing optional fields gracefully', () => {
    const input: Partial<Images> = {};
    const out = ImagesMapper.mapImagesToImagesDetails(input as Images);

    expect(out).toEqual({
      smallImageDetails: undefined,
      smallImageDetailsProxied: undefined,
    } as any);
  });

  it('mapNewsItemMainToGifArray maps an array of Images to ImagesDetails array', () => {
    const items: Images[] = [
      { thumbnail: 'a', thumbnailProxied: 'pa' } as any,
      { thumbnail: 'b', thumbnailProxied: 'pb' } as any,
      { thumbnail: 'c', thumbnailProxied: 'pc' } as any,
    ];

    const out = ImagesMapper.mapNewsItemMainToGifArray(items);

    expect(out).toEqual([
      { smallImageDetails: 'a', smallImageDetailsProxied: 'pa' },
      { smallImageDetails: 'b', smallImageDetailsProxied: 'pb' },
      { smallImageDetails: 'c', smallImageDetailsProxied: 'pc' },
    ]);
  });

  it('mapNewsItemMainToGifArray returns empty array for empty input', () => {
    const out = ImagesMapper.mapNewsItemMainToGifArray([]);
    expect(out).toEqual([]);
  });
});
