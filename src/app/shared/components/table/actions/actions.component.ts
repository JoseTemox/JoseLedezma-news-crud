/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export type Action = {
  name: string;
  color?: string;
  tooltip?: string;
  disabled?: boolean;
};

export type ActionEvent<T> = {
  row: T;
  action: string;
  index: number;
};

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  imports: [MatIconModule, CommonModule, MatMenuModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent {
  readonly element = input<Action[]>([]);
  readonly index = input(0);
  readonly row = input(null);
  readonly actionEvent = output<ActionEvent<unknown>>();

  firstActions: Action[] = [];
  secondActions: Action[] = [];
  readonly sortedElement = computed(() => {
    const items = this.element();
    if (!items || items.length <= 1) {
      return items.slice();
    }

    const weight: Record<string, number> = {
      edit: -1,
      find_in_page: -2,
      delete: 1,
    };

    const indexMap = new Map(items.map((v, i) => [v, i]));

    return items.slice().sort((a, b) => {
      const wa = weight[a.name] ?? 0;
      const wb = weight[b.name] ?? 0;
      if (wa !== wb) {
        return wa - wb;
      }
      return (indexMap.get(a) ?? 0) - (indexMap.get(b) ?? 0);
    });
  });

  readonly updateAction = effect(() => {
    if (this.element?.length > 4) {
      this.firstActions = this.element().slice(0, 4);
      this.secondActions = this.element().slice(4, this.element.length);
    }
  });
  emitAction(name: any): void {
    this.actionEvent.emit({
      index: this.index(),
      row: this.row,
      action: name,
    });
  }
}
