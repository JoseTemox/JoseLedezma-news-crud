import { Pipe, type PipeTransform } from '@angular/core';
import { ImageUrlFixed } from '../../utils/consts';

@Pipe({
  name: 'noImage',
})
export class NoImagePipe implements PipeTransform {
  transform(value: string | undefined): string {
    return value ?? ImageUrlFixed.noImage;
  }
}
