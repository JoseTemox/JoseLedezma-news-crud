import { AllNewsMapper } from './all-news-mappers';
import { ImagesMapper } from './images-mappers';
import { NewsItem, NewsItemMain } from '../interfaces/news.interfaces';

describe('AllNewsMapper', () => {
  it('maps a NewsItem to NewsItemMain with images mapped', () => {
    const input: NewsItem = {
      timestamp: '123456',
      title: 'Main title',
      snippet: 'A short summary',
      images: { thumbnail: 't.jpg', thumbnailProxied: 'tp.jpg' } as any,
      hasSubnews: true,
      newsUrl: 'https://news.example/item',
      publisher: 'Example',
      subnews: undefined,
    } as any;

    const out = AllNewsMapper.mapNewsItemToNewsItemMain(input);

    expect(out.timestamp).toBe('123456');
    expect(out.mainTitle).toBe('Main title');
    expect(out.summary).toBe('A short summary');
    expect(out.newsLink).toBe('https://news.example/item');
    expect(out.source).toBe('Example');
    expect(out.hasSubNews).toBeTrue();
    expect(out.images).toEqual({
      smallImageDetails: 't.jpg',
      smallImageDetailsProxied: 'tp.jpg',
    });
    expect(out.subNews).toBeNull();
  });

  it('maps null images to null in output when input.images is falsy', () => {
    const input: NewsItem = {
      timestamp: 1,
      title: 'No image',
      snippet: 'No image here',
      images: null,
      hasSubnews: false,
      newsUrl: 'url',
      publisher: 'P',
      subnews: undefined,
    } as any;

    const out = AllNewsMapper.mapNewsItemToNewsItemMain(input);
    expect(out.images).toBeNull();
  });

  it('maps nested subnews array to subNews recursively', () => {
    const child: NewsItem = {
      timestamp: 2,
      title: 'Child',
      snippet: 'child summary',
      images: null,
      hasSubnews: false,
      newsUrl: 'child-url',
      publisher: 'P2',
      subnews: undefined,
    } as any;

    const parent: NewsItem = {
      timestamp: 10,
      title: 'Parent',
      snippet: 'parent summary',
      images: null,
      hasSubnews: true,
      newsUrl: 'parent-url',
      publisher: 'P1',
      subnews: [child],
    } as any;

    const out = AllNewsMapper.mapNewsItemToNewsItemMain(parent);
    expect(Array.isArray(out.subNews)).toBeTrue();
    expect((out.subNews as NewsItemMain[])[0].mainTitle).toBe('Child');
    expect((out.subNews as NewsItemMain[])[0].newsLink).toBe('child-url');
  });

  it('returns null for subNews when input.subnews is undefined', () => {
    const input: NewsItem = {
      timestamp: 5,
      title: 'No subnews',
      snippet: '',
      images: null,
      hasSubnews: false,
      newsUrl: 'u',
      publisher: 'X',
      subnews: undefined,
    } as any;

    const out = AllNewsMapper.mapNewsItemToNewsItemMain(input);
    expect(out.subNews).toBeNull();
  });

  it('mapNewsItemToNewsItemMainArray returns mapped array or null correctly', () => {
    const items: NewsItem[] = [
      {
        timestamp: 1,
        title: 'A',
        snippet: 's',
        images: null,
        hasSubnews: false,
        newsUrl: 'u',
        publisher: 'p',
        subnews: undefined,
      } as any,
    ];

    const mapped = AllNewsMapper.mapNewsItemToNewsItemMainArray(items);
    expect(Array.isArray(mapped)).toBeTrue();
    expect((mapped as NewsItemMain[])[0].mainTitle).toBe('A');

    const mappedNull = AllNewsMapper.mapNewsItemToNewsItemMainArray(undefined);
    expect(mappedNull).toBeNull();
  });
});
