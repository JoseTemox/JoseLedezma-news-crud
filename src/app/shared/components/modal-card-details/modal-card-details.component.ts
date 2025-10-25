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
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-modal-card-details',
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
    JsonPipe,
    NewsItemCard,
  ],
  templateUrl: './modal-card-details.component.html',
  styleUrls: ['./modal-card-details.component.scss'],
})
export class ModalCardDetailsComponent {
  private readonly dialogRef = inject(MatDialogRef<ModalCardDetailsComponent>);
  modalData = inject<NewsItemMain>(MAT_DIALOG_DATA);

  // ngOnInit(): void {
  //   console.log(this.modalData);
  // }
}
