import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ModalGhibliRenderComponent } from './modal-ghibli-render.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewsFacade } from '../../../services/news-facade.service';
import { ImgRender } from '../img-render/img-render.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

describe('ModalGhibliRenderComponent', () => {
  let fixture: ComponentFixture<ModalGhibliRenderComponent>;
  let component: ModalGhibliRenderComponent;

  const newsFacadeMock = {
    iaTitleNewsGenerator: jasmine
      .createSpy('iaTitleNewsGenerator')
      .and.callFake((title: string) => {
        return of(`http://fake.image/${encodeURIComponent(title)}`);
      }),
  };

  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        ImgRender,
        MatProgressSpinner,
        ModalGhibliRenderComponent,
      ],
      providers: [
        { provide: NewsFacade, useValue: newsFacadeMock },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { newsTitle: 'Prueba Ghibli' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalGhibliRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create without stream errors and have injected data', () => {
    expect(component).toBeTruthy();
    expect(component.modalData).toBeTruthy();
    expect(component.modalData.newsTitle).toBe('Prueba Ghibli');
  });

  it('newsFacade.iaTitleNewsGenerator should have been defined and callable', (done) => {
    const title = component.modalData.newsTitle;

    const obs$ = (
      newsFacadeMock.iaTitleNewsGenerator as jasmine.Spy
    ).calls.mostRecent()
      ? newsFacadeMock.iaTitleNewsGenerator(title)
      : newsFacadeMock.iaTitleNewsGenerator(title);

    expect(newsFacadeMock.iaTitleNewsGenerator).toBeDefined();
    expect(obs$).toBeTruthy();

    (obs$ as any).subscribe({
      next: (val: any) => {
        expect(typeof val).toBe('string');
        done();
      },
      error: (err: any) => {
        fail('Observable from iaTitleNewsGenerator errored: ' + err);
        done();
      },
    });
  });

  it('urlImage signal should start empty', () => {
    expect(component.urlImage()).toBe('');
  });
});
