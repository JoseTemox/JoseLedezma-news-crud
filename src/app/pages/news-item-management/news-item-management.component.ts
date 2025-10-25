import { Component, signal } from '@angular/core';
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
import { MatDialogConfig } from '@angular/material/dialog';
// import { concatMap, catchError, throwError, takeUntil, of } from 'rxjs';

@Component({
  selector: 'app-news-item-management',
  imports: [TableComponent],
  templateUrl: './news-item-management.component.html',
  styleUrl: './news-item-management.component.scss',
})
export default class NewsItemManagementComponent {
  allData = AllNewsMapper.mapNewsItemToNewsItemMainArray(
    alldata
  ) as NewsItemMain[];
  newsItemList = signal<NewsItemMain[]>(this.allData);
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
  readonly dataSource = signal<NewsItemMainTable[]>(
    this.allData.map((item, index) => {
      return {
        ...item,
        urlImages: item.images?.smallImageDetailsProxied,
        number: index + 1,
        actions: this.actions,
      };
    })
  );
  readonly isLoading = signal(false);

  actionHandler: {
    [key: string]: (
      event: ActionEmitter,
      dialogConfig: MatDialogConfig
    ) => void;
  } = {
    edit: (event: ActionEmitter, dialogConfig: MatDialogConfig) => {
      console.log('Edit');
      // dialogConfig.disableClose = false;
      // dialogConfig.width = '90%';
      // dialogConfig.height = '75%';
      // dialogConfig.data = { ticket: event.row(), event: this.currentEvent() };
      // const dialogref = this.dialog.open(
      //   TicketRegisterDialogComponent,
      //   dialogConfig
      // );
      // dialogref
      //   .afterClosed()
      //   .subscribe(() => this.getData(this.currentEvent().uuid ?? 'null'));
    },
    delete: (event: ActionEmitter) => {
      console.log('delete');
      // this.alertService
      //   .confirmDialogNew(
      //     'Confirmar Borrado',
      //     '¿Estás seguro de que deseas eliminar este ticket?',
      //     'Eliminar',
      //     'Cancelar'
      //   )
      //   .pipe(
      //     concatMap((result) => {
      //       if (result.isConfirmed) {
      //         this.isLoading.set(true);
      //         this.dataSource.set([]);
      //         return this.ticketsServices
      //           .deleteTicket(event.row().uuid ?? null)
      //           .pipe(
      //             concatMap(() => {
      //               return this.alertService.rightMessage(
      //                 'Eliminado',
      //                 'El Jugador ha sido eliminado correctamente.'
      //               );
      //             }),
      //             catchError(() => {
      //               this.isLoading.set(false);
      //               return throwError(() => new Error('Error'));
      //             }),
      //             takeUntil(this.onDestroy$)
      //           );
      //       }
      //       return of(result);
      //     })
      //   )
      //   .subscribe(() => {
      //     this.getData(this.currentEvent().uuid ?? 'null');
      //   });
    },
    find_in_page: (event: ActionEmitter, dialogConfig: MatDialogConfig) => {
      console.log('detail');
      // dialogConfig.disableClose = false;
      // dialogConfig.width = '90%';
      // dialogConfig.height = '75%';
      // dialogConfig.data = event.row();
      // const dialogref = this.dialog.open(TicketDialogComponent, dialogConfig);
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
}
