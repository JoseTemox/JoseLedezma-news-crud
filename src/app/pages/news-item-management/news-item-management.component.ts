import { Component, inject, signal } from '@angular/core';
import {
  NewsItemMain,
  NewsItemMainTable,
} from '../../interfaces/news.interfaces';
import { AllNewsMapper } from '../../mappers/all-news-mappers';
import { alldata } from '../all-news/allData';
import {
  Action,
  ActionEmitter,
  CellType,
  ColumnHeader,
} from '../../shared/components/table/table.interfaces';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalCardDetailsComponent } from '../../shared/components/modal-card-details/modal-card-details.component';
// import { concatMap, catchError, throwError, takeUntil, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ModalNewsItemAddComponent } from '../../shared/components/modal-news-item/modal-news-item-add.component';
import { MatButton } from '@angular/material/button';
import { ModalMessagesComponent } from '../../shared/components/modal-messages/modal-messages.component';

@Component({
  selector: 'app-news-item-management',
  imports: [TableComponent, MatIconModule, MatButton],
  templateUrl: './news-item-management.component.html',
  styleUrl: './news-item-management.component.scss',
})
export default class NewsItemManagementComponent {
  allData = (
    AllNewsMapper.mapNewsItemToNewsItemMainArray(alldata) as NewsItemMain[]
  ).map((item, index) => {
    return {
      ...item,
      urlImages: item.images?.smallImageDetailsProxied,
      number: index + 1,
      actions: this.actions,
    };
  });
  private readonly dialog = inject(MatDialog);
  readonly newsItemList = signal<NewsItemMain[]>(this.allData);
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
  readonly dataSource = signal<NewsItemMainTable[]>(this.allData);
  readonly isLoading = signal(false);

  actionHandler: {
    [key: string]: (
      event: ActionEmitter,
      dialogConfig: MatDialogConfig
    ) => void;
  } = {
    edit: (event: ActionEmitter, dialogConfig: MatDialogConfig) => {
      this.addNew(event.row());
    },
    delete: (event: ActionEmitter) => {
      const numberToRemove = event.row().number;
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
          this.dataSource.update((list) => {
            const idx = list.findIndex((i) => i.number === numberToRemove);
            if (idx === -1) {
              return list;
            }
            const copy = list.slice();
            copy.splice(idx, 1);
            return copy;
          });
          // ejecutar eliminación
        }
      });
    },
    find_in_page: (event: ActionEmitter, dialogConfig: MatDialogConfig) => {
      dialogConfig.disableClose = false;
      dialogConfig.data = event.row() as NewsItemMain;
      const dialogref = this.dialog.open(
        ModalCardDetailsComponent,
        dialogConfig
      );
      // dialogref.afterClosed().subscribe();
    },
  };

  get actions(): Action[] {
    return [{ name: 'find_in_page' }, { name: 'edit' }, { name: 'delete' }];
  }

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
      console.log(modalResponse?.number);
      if (modalResponse && modalResponse?.number === null) {
        console.log('****');
        this.dataSource.update((list) =>
          [{ ...modalResponse, actions: this.actions }, ...list].map(
            (item, index) => ({ ...item, number: index + 1 })
          )
        );
      }
      if (modalResponse && modalResponse.number !== null) {
        console.log('update');
        this.dataSource.update((list) =>
          list.map((item) =>
            item.number === modalResponse.number ? modalResponse : item
          )
        );
      }
    });
  }
}
