import { IaGeneratorMapper } from './iagenerator-mapper';
import {
  IAGeneratorResponse,
  ResultElementImage,
} from '../interfaces/iaGenerator.interface';

describe('IaGeneratorMapper', () => {
  it('maps a full IAGeneratorResponse to ResultElementImage correctly', () => {
    const input: IAGeneratorResponse = {
      result: {
        data: {
          results: [
            {
              index: 0,
              nsfw: false,
              origin: 'http://origin.example/img0.png',
              thumb: 'http://thumb.example/img0.png',
            },
          ],
        },
      },
    } as any;

    const out: ResultElementImage =
      IaGeneratorMapper.mapIaGeneratorResponseToResultElement(input);

    expect(out).toEqual({
      indexImage: 0,
      nsfwImage: false,
      originImage: 'http://origin.example/img0.png',
      thumbImage: 'http://thumb.example/img0.png',
    });
  });

  it('works when result array has multiple items and picks the first', () => {
    const input: IAGeneratorResponse = {
      result: {
        data: {
          results: [
            {
              index: 5,
              nsfw: true,
              origin: 'http://origin.example/img5.png',
              thumb: 'http://thumb.example/img5.png',
            },
            {
              index: 6,
              nsfw: false,
              origin: 'http://origin.example/img6.png',
              thumb: 'http://thumb.example/img6.png',
            },
          ],
        },
      },
    } as any;

    const out = IaGeneratorMapper.mapIaGeneratorResponseToResultElement(input);

    expect(out).toEqual({
      indexImage: 5,
      nsfwImage: true,
      originImage: 'http://origin.example/img5.png',
      thumbImage: 'http://thumb.example/img5.png',
    });
  });

  it('throws a clear error if the response shape is missing expected fields', () => {
    const badInput = {} as any;

    expect(() =>
      IaGeneratorMapper.mapIaGeneratorResponseToResultElement(badInput)
    ).toThrow();
  });

  it('throws if results array is empty', () => {
    const input: IAGeneratorResponse = {
      result: {
        data: {
          results: [],
        },
      },
    } as any;

    expect(() =>
      IaGeneratorMapper.mapIaGeneratorResponseToResultElement(input)
    ).toThrow();
  });
});
