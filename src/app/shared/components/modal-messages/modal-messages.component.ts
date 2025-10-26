import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
export interface ConfirmDeleteData {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-modal-messages',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './modal-messages.component.html',
  styleUrl: './modal-messages.component.scss',
})
export class ModalMessagesComponent {
  private dialogRef = inject(MatDialogRef<ModalMessagesComponent, boolean>);
  data = inject(MAT_DIALOG_DATA) as ConfirmDeleteData | null;

  title = this.data?.title ?? 'Eliminar elemento';
  message = this.data?.message ?? '¿Está seguro que desea eliminar este elemento?';
  confirmLabel = this.data?.confirmLabel ?? 'Sí';
  cancelLabel = this.data?.cancelLabel ?? 'No';

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
