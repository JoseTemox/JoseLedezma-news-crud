import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NewsItemCard } from '../news-item-card/news-item-card';
import { NewsItemMain } from '../../../interfaces/news.interfaces';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { IAGeneratorImageService } from '../../../services/ia-generator-api.service';
import { NewsFacade } from '../../../services/news-facade.service';
import { ImgRender } from '../img-render/img-render.component';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-modal-ghibli-render',
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,

    MatProgressSpinner,
    ImgRender,
  ],
  templateUrl: './modal-ghibli-render.component.html',
  styleUrl: './modal-ghibli-render.component.scss',
})
export class ModalGhibliRenderComponent {
  private readonly dialogRef = inject(MatDialogRef<ModalGhibliRenderComponent>);
  modalData = inject<{ newsTitle: string }>(MAT_DIALOG_DATA);
  private readonly newsFacadeService = inject(NewsFacade);
  readonly urlImage = signal<string>('');

  iaGeneratorResource = rxResource({
    params: () => this.modalData.newsTitle,
    stream: (title) =>
      this.newsFacadeService.iaTitleNewsGenerator(title.params),
  });
}
