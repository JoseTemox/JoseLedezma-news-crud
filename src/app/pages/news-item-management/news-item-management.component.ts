import { Component, inject, signal } from '@angular/core';
import {
  NewsItemMain,
  NewsItemMainTable,
} from '../../interfaces/news.interfaces';
import {
  ActionEmitter,
  CellType,
  ColumnHeader,
} from '../../shared/components/table/table.interfaces';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalCardDetailsComponent } from '../../shared/components/modal-card-details/modal-card-details.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalNewsItemAddComponent } from '../../shared/components/modal-news-item/modal-news-item-add.component';
import { MatButton } from '@angular/material/button';
import { ModalMessagesComponent } from '../../shared/components/modal-messages/modal-messages.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { NewsFacade } from '../../services/news-facade.service';
import { ActionBtn } from '../../utils/consts';

@Component({
  selector: 'app-news-item-management',
  imports: [TableComponent, MatIconModule, MatButton],
  templateUrl: './news-item-management.component.html',
  styleUrl: './news-item-management.component.scss',
})
export default class NewsItemManagementComponent {
  storageService = inject(LocalStorageService);
  facadeNewsService = inject(NewsFacade);

  dataSource = this.facadeNewsService.allData;
  private readonly dialog = inject(MatDialog);
  columnHeader: ColumnHeader = {
    number: { label: 'Number #' },
    mainTitle: { label: 'Title', showToggle: true },
    hasSubNews: { label: 'HasSubNes' },
    newsLink: { label: 'Link', type: CellType.LINK },
    source: { label: 'Source' },
    urlImages: { label: 'Image', type: CellType.IMAGES },
    actions: {
      label: 'Actions',
      type: CellType.ACTIONS,
    },
  };
  readonly isLoading = signal(false);

  actionHandler: {
    [key: string]: (
      event: ActionEmitter,
      dialogConfig: MatDialogConfig
    ) => void;
  } = {
    [ActionBtn.edit]: (event: ActionEmitter) => {
      this.addNew(event.row());
    },
    [ActionBtn.delete]: (event: ActionEmitter) => {
      const data: NewsItemMainTable = event.row();
      const dialogRef = this.dialog.open(ModalMessagesComponent, {
        data: {
          title: 'Confirm deletion',
          message: 'Are you sure you want to delete this record?',
          confirmLabel: 'Yes, delete',
          cancelLabel: 'Cancel',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.facadeNewsService.deleteNewsItemInList(data);
        }
      });
    },
    [ActionBtn.find_in_page]: (
      event: ActionEmitter,
      dialogConfig: MatDialogConfig
    ) => {
      dialogConfig.disableClose = false;
      dialogConfig.data = event.row() as NewsItemMain;
      this.dialog.open(ModalCardDetailsComponent, dialogConfig);
    },
  };

  action(event: ActionEmitter): void {
    const dialogConfig = new MatDialogConfig();
    this.actionHandler[event.action](event, dialogConfig);
  }

  addNew(data?: NewsItemMain): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = data ?? null;
    const dialogRef = this.dialog.open(ModalNewsItemAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((modalResponse: NewsItemMainTable) => {
      const dataResponseWithActions = {
        ...modalResponse,
        actions: this.facadeNewsService.actions,
      };
      if (modalResponse && modalResponse?.number === null) {
        this.facadeNewsService.saveNewsItemInList(dataResponseWithActions);
      }
      if (modalResponse && modalResponse.number !== null) {
        this.facadeNewsService.updateNewsItemInList(
          dataResponseWithActions,
          modalResponse
        );
      }
    });
  }
}
