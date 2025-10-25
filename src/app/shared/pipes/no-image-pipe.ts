import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'noImage',
})
export class NoImagePipe implements PipeTransform {
  transform(value: string | undefined): string {
    return value ?? './no-image.jpg';
  }
}
