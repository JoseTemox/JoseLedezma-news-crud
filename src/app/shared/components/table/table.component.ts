/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ActionEvent, ActionsComponent } from './actions/actions.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CellType, ColumnHeader } from './table.interfaces';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImgRender } from '../img-render/img-render.component';

@Component({
  selector: 'app-table',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    ActionsComponent,
    MatPaginatorModule,
    MatTooltipModule,
    ImgRender,
  ],
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit {
  readonly dataSource = input.required<any[]>();
  readonly columnHeader = input<ColumnHeader>({});
  readonly isLoading = input(false);
  readonly showPaginator = input(true);
  readonly actionEvent = output<ActionEvent<unknown>>();
  readonly paginator = viewChild(MatPaginator);
  readonly dataTable = signal(new MatTableDataSource<any>([]));
  cellType = CellType;

  readonly updateTableEffect = effect(() => {
    const data = this.dataSource();
    this.dataTable.update((current: any) => {
      current.data = data;
      return current;
    });
  });

  ngAfterViewInit(): void {
    this.dataTable.update((current) => {
      current.paginator = this.paginator();
      return current;
    });
  }

  get displayedColumns(): string[] {
    const displayedColumns = Object.keys(this.columnHeader());

    return displayedColumns;
  }
  action(element: any): void {
    this.actionEvent.emit(element);
  }
}
