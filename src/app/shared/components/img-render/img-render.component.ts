import { Component, effect, input, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ImageUrlFixed } from '../../../utils/consts';

@Component({
  selector: 'app-img-render',
  imports: [MatProgressSpinner],
  templateUrl: './img-render.component.html',
  styleUrl: './img-render.component.scss',
})
export class ImgRender {
  readonly newsItemUrl = input.required<string | undefined>();
  readonly title = input<string>('News-Item');

  readonly width = input<number | string | undefined>(96);
  readonly height = input<number | string | undefined>(96);
  readonly marginLeft = input<number | string | undefined>(0);
  readonly marginRight = input<number | string | undefined>(0);
  readonly isIconType = input(false);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly failed = signal(false);

  readonly currentSrc = signal<string | undefined>(undefined);
  readonly fallback = ImageUrlFixed.noImage;

  get styleWidth(): string | null {
    return this.toCssValue(this.width());
  }
  get styleHeight(): string | null {
    return this.toCssValue(this.height());
  }
  get styleMarginLeft(): string | null {
    return this.toCssValue(this.marginLeft());
  }
  get styleMarginRight(): string | null {
    return this.toCssValue(this.marginRight());
  }

  private toCssValue(v: number | string | undefined): string | null {
    if (v === null || v === undefined) {
      return null;
    }
    return typeof v === 'number' ? `${v}px` : v;
  }

  private destroyEffect = effect(() => {
    this.resetFlags();

    const candidate = this.newsItemUrl();

    if (!candidate) {
      this.currentSrc.set(this.fallback);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.currentSrc.set(candidate);
  });

  onLoaded(): void {
    this.loading.set(false);
    this.loaded.set(true);
    this.failed.set(false);
  }
  onError(): void {
    if (this.currentSrc() !== this.fallback) {
      this.failed.set(true);
      this.loading.set(false);
      this.loaded.set(false);
      this.currentSrc.set(this.fallback);
    } else {
      this.failed.set(true);
      this.loading.set(false);
      this.loaded.set(false);
    }
  }
  private resetFlags(): void {
    this.loading.set(false);
    this.loaded.set(false);
    this.failed.set(false);
  }
}
