import { Component, inject, input } from '@angular/core';
import { NewsItemMain } from '../../../interfaces/news.interfaces';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImgRender } from '../img-render/img-render.component';

@Component({
  selector: 'app-news-item-card',
  imports: [MatCardModule, DatePipe, MatButtonModule, MatListModule, ImgRender],
  templateUrl: './news-item-card.html',
  styleUrls: ['./news-item-card.scss'],
  standalone: true,
})
export class NewsItemCard {
  readonly newsItem = input.required<NewsItemMain>();
  readonly isDetailsMode = input(false);

  private readonly dialog = inject(MatDialog);

  goTo(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  async goToDetails(): Promise<void> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = this.newsItem();
    const { ModalCardDetailsComponent } = await import(
      '../modal-card-details/modal-card-details.component'
    );
    const dialogRef = this.dialog.open(ModalCardDetailsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe();
  }

  async generateGhibliIA(): Promise<void> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = { newsTitle: this.newsItem().mainTitle };
    const { ModalGhibliRenderComponent } = await import(
      '../modal-ghibli-render/modal-ghibli-render.component'
    );

    const dialogRef = this.dialog.open(
      ModalGhibliRenderComponent,
      dialogConfig
    );
  }
}
