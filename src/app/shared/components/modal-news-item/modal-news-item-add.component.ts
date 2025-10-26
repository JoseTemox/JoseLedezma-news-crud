import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  NewsItemMain,
  NewsItemMainTable,
} from '../../../interfaces/news.interfaces';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { FormUtils } from '../../../utils/form-utils';
import { DatePipe } from '@angular/common';
import { urlFormatValidator } from '../../../utils/url-format-checker';

@Component({
  selector: 'app-modal-news-item',
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSlideToggle,
    MatDividerModule,
    MatError,
  ],
  providers: [DatePipe],
  templateUrl: './modal-news-item-add.component.html',
  styleUrl: './modal-news-item-add.component.scss',
})
export class ModalNewsItemAddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ModalNewsItemAddComponent>);
  private readonly datePipe = inject(DatePipe);
  modalData = inject<NewsItemMainTable>(MAT_DIALOG_DATA);

  form: FormGroup = this.buildForm(this.modalData);
  formUtils = FormUtils;

  // eslint-disable-next-line complexity
  private buildForm(data?: NewsItemMainTable): FormGroup {
    return this.fb.group({
      mainTitle: [
        data?.mainTitle ?? '',
        [Validators.required, Validators.minLength(5)],
      ],
      summary: [
        data?.summary ?? '',
        [Validators.required, Validators.minLength(5)],
      ],
      timestamp: [
        {
          value: data?.timestamp
            ? this.datePipe.transform(data?.timestamp, 'yyyy-MM-dd', 'UTC')
            : this.datePipe.transform(
                new Date().getTime(),
                'yyyy-MM-dd',
                'UTC'
              ),
          disabled: true,
        },
      ],
      images: this.fb.nonNullable.group({
        smallImageDetails: [
          data?.images?.smallImageDetails,
          [urlFormatValidator()],
        ],
        smallImageDetailsProxied: [
          data?.images?.smallImageDetailsProxied,
          [urlFormatValidator()],
        ],
      }),
      subNews: this.fb.array(
        (data?.subNews ?? []).map((item) =>
          this.fb.group({
            timestamp: [
              {
                value: data?.timestamp
                  ? this.datePipe.transform(
                      item?.timestamp,
                      'yyyy-MM-dd',
                      'UTC'
                    )
                  : this.datePipe.transform(
                      new Date().getTime(),
                      'yyyy-MM-dd',
                      'UTC'
                    ),
                disabled: true,
              },
            ],
            mainTitle: item?.mainTitle ?? '',
            summary: item?.summary ?? '',
            images: this.fb.nonNullable.group({
              smallImageDetails: item?.images?.smallImageDetails,
              smallImageDetailsProxied: item?.images?.smallImageDetailsProxied,
            }),
            newsLink: item?.newsLink ?? '',
            source: item?.source,
          })
        )
      ),
      newsLink: [
        data?.newsLink ?? '',
        [Validators.required, urlFormatValidator()],
      ],
      source: [data?.source, [Validators.required, Validators.minLength(2)]],
      hasSubNews: data?.hasSubNews ?? false,
      number: data?.number,
      actions: data?.actions,
    });
  }

  get hasSubNews(): FormArray {
    return this.form.get('hasSubNews')?.value;
  }
  get subNews(): FormArray {
    return this.form.get('subNews') as FormArray;
  }
  get imagesGroup(): FormGroup {
    return this.form.get('images') as FormGroup;
  }

  save(): void {
    if (this.form.valid) {
      const allData: NewsItemMainTable = this.form.getRawValue();

      const timestamp = new Date(allData.timestamp).getTime();
      const value = {
        ...allData,
        timestamp,
        urlImages: allData.images?.smallImageDetailsProxied,
      };
      this.dialogRef.close(value);
    } else {
      this.form.markAllAsTouched();
    }
  }
  cancel(): void {}
  addSubnews(item?: NewsItemMain): void {
    const fg = this.fb.nonNullable.group({
      mainTitle: [
        item?.mainTitle ?? '',
        [Validators.required, Validators.minLength(5)],
      ],
      summary: [
        item?.summary ?? '',
        [Validators.required, Validators.minLength(5)],
      ],
      timestamp: item?.timestamp ?? '',
      images: this.fb.nonNullable.group({
        smallImageDetails: [
          item?.images?.smallImageDetails ?? '',
          urlFormatValidator(),
        ],
        smallImageDetailsProxied: [
          item?.images?.smallImageDetailsProxied ?? '',
          urlFormatValidator(),
        ],
      }),
      newsLink: [
        item?.newsLink ?? '',
        [Validators.required, urlFormatValidator()],
      ],
      source: [
        item?.source ?? '',
        [Validators.required, Validators.minLength(3)],
      ],
    });
    this.subNews.push(fg);
    this.form.patchValue({ hasSubNews: true });
  }
  removeSubNews(index: number): void {
    this.subNews.removeAt(index);
    if (this.subNews.length === 0) {
      this.form.patchValue({ hasSubNews: false });
    }
  }
  changeValidator(isExisting: boolean): void {
    if (!isExisting) {
      this.subNews.controls = [];
    }
  }
}
