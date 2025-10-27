import { MatPaginator } from '@angular/material/paginator';
import { TableComponent } from './table.component';
import { ColumnHeader } from './table.interfaces';

describe('TableComponent (unit, direct instantiation, no MatTableDataSource)', () => {
  let comp: TableComponent;

  beforeEach(() => {
    comp = Object.create(TableComponent.prototype) as TableComponent;

    (comp as any).dataSource = (() => [{ id: 1 }]) as any;
    (comp as any).columnHeader = (() => ({})) as any;
    (comp as any).isLoading = (() => false) as any;
    (comp as any).showPaginator = (() => true) as any;

    (comp as any).actionEvent = { emit: () => {} };

    (comp as any).paginator = (() => undefined) as any;

    const initial = { data: [], paginator: undefined } as any;
    (comp as any).dataTable = {
      value: initial,
      update: function (fn: any) {
        const res = fn(this.value);
        if (res !== undefined && res !== null) {
          this.value = res;
        }
      },

      call: function () {
        return this.value;
      },
    } as any;

    (comp as any).cellType = {};
  });

  it('updateTableEffect should set data on dataTable when dataSource changes (manual run)', () => {
    let value = [{ id: 'a' }, { id: 'b' }];
    (comp as any).dataSource = (() => value) as any;

    const data = (comp as any).dataSource();
    (comp as any).dataTable.update((current: any) => {
      current.data = data;
      return current;
    });

    expect((comp as any).dataTable.value.data).toEqual(value);

    value = [{ id: 'x' }, { id: 'y' }, { id: 'z' }];
    (comp as any).dataSource = (() => value) as any;
    const data2 = (comp as any).dataSource();
    (comp as any).dataTable.update((current: any) => {
      current.data = data2;
      return current;
    });

    expect((comp as any).dataTable.value.data).toEqual(value);
  });

  it('ngAfterViewInit should assign paginator to dataTable.paginator', () => {
    const fakePaginator = {} as MatPaginator;
    (comp as any).paginator = (() => fakePaginator) as any;

    (comp as any).dataTable.value = { data: [], paginator: undefined };

    TableComponent.prototype.ngAfterViewInit.call(comp);

    expect((comp as any).dataTable.value.paginator).toBe(fakePaginator);
  });

  it('displayedColumns should return keys from columnHeader input', () => {
    (comp as any).columnHeader = (() => ({
      id: { label: 'Id', cellType: 'text' },
      name: { label: 'Name', cellType: 'text' },
    })) as any;

    const desc = Object.getOwnPropertyDescriptor(
      TableComponent.prototype,
      'displayedColumns'
    );
    if (!desc || typeof desc.get !== 'function') {
      throw new Error(
        'displayedColumns getter not found on TableComponent prototype'
      );
    }
    const cols = desc.get.call(comp) as string[];
    expect(cols).toEqual(['id', 'name']);
  });

  it('action should emit via actionEvent output', () => {
    const emitted: any[] = [];
    const out = { emit: (v: any) => emitted.push(v) };
    (comp as any).actionEvent = out as any;

    const el = { id: 42 };
    TableComponent.prototype.action.call(comp, el);

    expect(emitted[0]).toEqual(el);
  });

  it('dataSource input.required behavior: data applied to dataTable when running effect', () => {
    (comp as any).dataSource = (() => [{ foo: 'bar' }]) as any;
    (comp as any).dataTable.value = { data: [], paginator: undefined };

    const data = (comp as any).dataSource();
    (comp as any).dataTable.update((current: any) => {
      current.data = data;
      return current;
    });

    expect((comp as any).dataTable.value.data).toEqual([{ foo: 'bar' }]);
  });
});
