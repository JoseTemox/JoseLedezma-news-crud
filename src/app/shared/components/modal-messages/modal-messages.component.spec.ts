import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ModalMessagesComponent,
  ConfirmDeleteData,
} from './modal-messages.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('ModalMessagesComponent', () => {
  let fixture: ComponentFixture<ModalMessagesComponent>;
  let component: ModalMessagesComponent;
  let dialogRefSpy: jasmine.SpyObj<
    MatDialogRef<ModalMessagesComponent, boolean>
  >;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        ModalMessagesComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalMessagesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use default labels and messages when no data provided', () => {
    fixture.detectChanges();
    expect(component.title).toBe('Eliminar elemento');
    expect(component.message).toBe(
      '¿Está seguro que desea eliminar este elemento?'
    );
    expect(component.confirmLabel).toBe('Sí');
    expect(component.cancelLabel).toBe('No');
  });

  it('should use provided data to override defaults', async () => {
    const data: ConfirmDeleteData = {
      title: 'Custom Title',
      message: 'Custom message',
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
    };

    TestBed.resetTestingModule();

    const dialogRef2 = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        ModalMessagesComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef2 },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    }).compileComponents();

    const fixture2 = TestBed.createComponent(ModalMessagesComponent);
    const component2 = fixture2.componentInstance;
    fixture2.detectChanges();

    expect(component2.title).toBe('Custom Title');
    expect(component2.message).toBe('Custom message');
    expect(component2.confirmLabel).toBe('Confirmar');
    expect(component2.cancelLabel).toBe('Cancelar');
  });

  it('confirm should close the dialog with true', () => {
    fixture.detectChanges();
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('cancel should close the dialog with false', () => {
    fixture.detectChanges();
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
