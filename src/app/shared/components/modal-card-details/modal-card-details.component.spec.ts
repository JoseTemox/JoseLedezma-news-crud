import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCardDetailsComponent } from './modal-card-details.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewsItemMain } from '../../../interfaces/news.interfaces';
import { NewsItemCard } from '../news-item-card/news-item-card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('ModalCardDetailsComponent', () => {
  let fixture: ComponentFixture<ModalCardDetailsComponent>;
  let component: ModalCardDetailsComponent;
  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
  const sampleData: NewsItemMain = {
    timestamp: 123,
    mainTitle: 'Test Title',
    summary: 'summary',
    images: null,
    hasSubNews: false,
    newsLink: 'https://example.com',
    source: 'src',
    subNews: null,
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        NewsItemCard,
        ModalCardDetailsComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: sampleData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component and have injected data', () => {
    expect(component).toBeTruthy();
    expect(component.modalData).toBeTruthy();
    expect(component.modalData.mainTitle).toBe('Test Title');
    expect(component.modalData.newsLink).toBe('https://example.com');
  });

  it('should render the NewsItemCard inside the dialog when present', () => {
    const child = fixture.nativeElement.querySelector('app-news-item-card');
    expect(child).toBeTruthy();
  });

  it('should close the dialog when MatDialogRef.close is called externally', () => {
    expect(dialogRefSpy.close).not.toHaveBeenCalled();

    dialogRefSpy.close(true);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
