import { IAGeneratorResponse, ResultElementImage } from '../interfaces/iaGenerator.interface';

export class IaGeneratorMapper {
  static mapIaGeneratorResponseToResultElement(item: IAGeneratorResponse): ResultElementImage {
    const found = item.result.data.results[0];
    return {
      indexImage: found.index,
      nsfwImage: found.nsfw,
      originImage: found.origin,
      thumbImage: found.thumb,
    };
  }
}
