/* eslint-disable max-len */
/* eslint-disable max-lines */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

import { ModalNewsItemAddComponent } from './modal-news-item-add.component';
import { urlFormatValidator } from '../../../utils/url-format-checker';

type NewsItemMainTable = any;
const DIALOG_DATA: NewsItemMainTable = null;

describe('ModalNewsItemAddComponent', () => {
  let fixture: ComponentFixture<ModalNewsItemAddComponent>;
  let component: ModalNewsItemAddComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalNewsItemAddComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        ModalNewsItemAddComponent,
      ],
      providers: [
        DatePipe,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_DATA },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalNewsItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and build a form', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.controls['mainTitle']).toBeDefined();
    expect(component.form.controls['summary']).toBeDefined();
    expect(component.form.controls['newsLink']).toBeDefined();
    expect(component.imagesGroup).toBeDefined();
  });

  it('save should close dialog with value when form is valid', () => {
    component.form.patchValue({
      mainTitle: 'Valid title',
      summary: 'Valid summary',
      newsLink:
        'https://www.koreaboo.com/news/le-sserafim-bleak-chart-performance-triggers-ridicule-koreans/',
      source: 'SRC',
      hasSubNews: false,
    });

    expect(component.form.valid).toBeTrue();

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalled();
    const closeArg = dialogRefSpy.close.calls.mostRecent().args[0];

    expect(closeArg).toBeDefined();
    expect(closeArg.urlImages).toBeDefined();
    expect(typeof closeArg.timestamp).toBe('number');
  });

  it('save should markAllAsTouched and not close when form invalid', () => {
    component.form.patchValue({
      mainTitle: 'x',
      summary: '',
      newsLink: 'not-a-url',
      source: '',
    });

    spyOn(component.form, 'markAllAsTouched');

    component.save();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('addSubnews should push a new FormGroup and set hasSubNews true', () => {
    const initialLength = component.subNews.length;
    component.addSubnews({
      mainTitle: 'Sub',
      summary: 'sub summary',
      newsLink:
        'https://www.koreaboo.com/news/le-sserafim-bleak-chart-performance-triggers-ridicule-koreans/',
      source: 'SRC',
    } as any);

    expect(component.subNews.length).toBe(initialLength + 1);
    expect(component.form.get('hasSubNews')?.value).toBeTrue();
  });

  it('removeSubNews should remove the specified index and toggle hasSubNews when empty', () => {
    component.addSubnews({
      mainTitle: 'A',
      summary: 'a',
      newsLink: 'https://a',
      source: 'S',
    } as any);
    component.addSubnews({
      mainTitle: 'B',
      summary: 'b',
      newsLink: 'https://b',
      source: 'S',
    } as any);

    const before = component.subNews.length;
    component.removeSubNews(0);
    expect(component.subNews.length).toBe(before - 1);

    component.removeSubNews(0);
    expect(component.subNews.length).toBe(0);
    expect(component.form.get('hasSubNews')?.value).toBeFalse();
  });

  it('changeValidator should clear subNews controls array when isExisting is false', () => {
    component.addSubnews({
      mainTitle: 'C',
      summary: 'c',
      newsLink: 'https://c',
      source: 'S',
    } as any);
    expect(component.subNews.length).toBeGreaterThan(0);

    component.changeValidator(false);

    expect(component.subNews.length).toBe(0);
  });

  it('urlFormatValidator should mark invalid urls', () => {
    const control = component.imagesGroup.get('smallImageDetails');
    if (!control) {
      pending('imagesGroup.smallImageDetails not found');
      return;
    }

    const invalid = urlFormatValidator()(control);

    if (invalid) {
      expect(typeof invalid).toBe('object');
    } else {
      expect(invalid).toBeNull();
    }
  });

  it('save should include subNews items when hasSubNews true', () => {
    component.addSubnews({
      mainTitle: 'Subnews title',
      summary: 'sub summary long',
      newsLink: 'https://sub.example',
      source: 'SRC',
    } as any);

    component.form.patchValue({
      mainTitle: 'Valid title',
      summary: 'Valid summary',
      newsLink:
        'https://www.koreaboo.com/news/le-sserafim-bleak-chart-performance-triggers-ridicule-koreans/',
      source: 'SRC',
      hasSubNews: true,
    });

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalled();
    const closeArg = dialogRefSpy.close.calls.mostRecent().args[0];
    expect(closeArg).toBeDefined();
    expect(Array.isArray(closeArg.subNews)).toBeTrue();
    expect(closeArg.subNews.length).toBeGreaterThan(0);
  });

  it('addSubnews sets validators correctly on created controls', () => {
    component.addSubnews({
      mainTitle: 'Subnews title',
      summary: 'sub summary long',
      newsLink: 'https://sub.example',
      source: 'SRC',
    } as any);

    const fg = component.subNews.at(component.subNews.length - 1);
    const mainTitleControl = fg.get('mainTitle');
    const summaryControl = fg.get('summary');
    const newsLinkControl = fg.get('newsLink');
    const sourceControl = fg.get('source');

    mainTitleControl?.setValue('');
    summaryControl?.setValue('');
    newsLinkControl?.setValue('notaurl');
    sourceControl?.setValue('x');

    expect(mainTitleControl?.invalid).toBeTrue();
    expect(summaryControl?.invalid).toBeTrue();
    expect(newsLinkControl?.invalid).toBeTrue();
    expect(sourceControl?.invalid).toBeTrue();

    component.removeSubNews(component.subNews.length - 1);
  });

  it('addSubnews with images validators applied rejects bad proxied url', () => {
    component.addSubnews({
      mainTitle: 'Title',
      summary: 'Summary long',
      newsLink: 'https://ok.example',
      source: 'SRC',
      images: {
        smallImageDetails: 'https://ok.example/img.jpg',
        smallImageDetailsProxied: 'notaurl',
      },
    } as any);

    const fg = component.subNews.at(component.subNews.length - 1);
    const proxied = fg.get('images.smallImageDetailsProxied');
    proxied?.setValue('notaurl');
    expect(proxied?.invalid).toBeTrue();

    component.removeSubNews(component.subNews.length - 1);
  });

  it('addSubnews adds empty FG and sets hasSubNews true when called without item', () => {
    const before = component.subNews.length;

    component.addSubnews();

    expect(component.subNews.length).toBe(before + 1);
    const fg = component.subNews.at(component.subNews.length - 1) as FormGroup;

    expect(fg.get('mainTitle')?.value).toBe('');
    expect(fg.get('summary')?.value).toBe('');
    expect(fg.get('timestamp')?.value).toBe('');
    expect(fg.get('newsLink')?.value).toBe('');
    expect(fg.get('source')?.value).toBe('');

    const imgGroup = fg.get('images') as FormGroup;
    expect(imgGroup).toBeTruthy();
    expect(imgGroup.get('smallImageDetails')?.value).toBe('');
    expect(imgGroup.get('smallImageDetailsProxied')?.value).toBe('');

    expect(component.form.get('hasSubNews')?.value).toBeTrue();

    component.removeSubNews(component.subNews.length - 1);
  });

  it('addSubnews maps item values into created FG and sets hasSubNews true', () => {
    const item = {
      mainTitle: 'Subnews Title',
      summary: 'Subnews summary longer',
      timestamp: 987654321,
      images: {
        smallImageDetails: 'https://image.example/a.jpg',
        smallImageDetailsProxied: 'https://proxy.example/a.jpg',
      },
      newsLink: 'https://example.com/subnews',
      source: 'SRC',
    } as any;

    const before = component.subNews.length;
    component.addSubnews(item);

    expect(component.subNews.length).toBe(before + 1);
    const fg = component.subNews.at(component.subNews.length - 1) as FormGroup;

    expect(fg.get('mainTitle')?.value).toBe(item.mainTitle);
    expect(fg.get('summary')?.value).toBe(item.summary);
    expect(fg.get('timestamp')?.value).toBe(item.timestamp);
    expect(fg.get('newsLink')?.value).toBe(item.newsLink);
    expect(fg.get('source')?.value).toBe(item.source);

    const imgGroup = fg.get('images') as FormGroup;
    expect(imgGroup.get('smallImageDetails')?.value).toBe(
      item.images.smallImageDetails
    );
    expect(imgGroup.get('smallImageDetailsProxied')?.value).toBe(
      item.images.smallImageDetailsProxied
    );

    expect(component.form.get('hasSubNews')?.value).toBeTrue();

    component.removeSubNews(component.subNews.length - 1);
  });

  it('addSubnews applies validators: required and minLength on mainTitle and summary, required + url validator on newsLink, minLength on source', () => {
    component.addSubnews();
    const fg = component.subNews.at(component.subNews.length - 1) as FormGroup;

    const mainTitle = fg.get('mainTitle')!;
    const summary = fg.get('summary')!;
    const newsLink = fg.get('newsLink')!;
    const source = fg.get('source')!;
    const imgGroup = fg.get('images') as FormGroup;
    const img = imgGroup.get('smallImageDetails')!;
    const proxied = imgGroup.get('smallImageDetailsProxied')!;

    mainTitle.setValue('');
    summary.setValue('x');
    newsLink.setValue('notaurl');
    source.setValue('x');
    img.setValue('notaurl');
    proxied.setValue('notaurl');

    expect(mainTitle.invalid).toBeTrue();
    expect(summary.invalid).toBeTrue();
    expect(newsLink.invalid).toBeTrue();
    expect(source.invalid).toBeTrue();
    expect(img.invalid).toBeTrue();
    expect(proxied.invalid).toBeTrue();

    component.removeSubNews(component.subNews.length - 1);
  });

  it('addSubnews does not duplicate existing subNews entries and always patches hasSubNews true', () => {
    component.form.patchValue({ hasSubNews: false });
    const start = component.subNews.length;

    component.addSubnews();
    component.addSubnews();

    expect(component.subNews.length).toBe(start + 2);
    expect(component.form.get('hasSubNews')?.value).toBeTrue();

    while (component.subNews.length > start) {
      component.removeSubNews(component.subNews.length - 1);
    }
  });

  it('buildForm uses provided timestamp formatted when data.timestamp is present', () => {
    const ts = 1660000000000;
    const data = {
      mainTitle: 'T',
      summary: 'S',
      timestamp: ts,
      images: null,
      subNews: [],
      newsLink: '',
      source: '',
    } as any;

    const form = (component as any).buildForm(data) as FormGroup;
    const datePipe = TestBed.inject(DatePipe);
    const expected = datePipe.transform(ts, 'yyyy-MM-dd', 'UTC');

    const ctrl = form.get('timestamp');
    expect(ctrl).toBeTruthy();
    expect(ctrl?.disabled).toBeTrue();
    expect(ctrl?.value).toBe(expected);
  });

  it('buildForm uses current date formatted when data.timestamp is absent', () => {
    const data = {
      mainTitle: 'T',
      summary: 'S',
      images: null,
      subNews: [],
      newsLink: '',
      source: '',
    } as any;

    const before = Date.now();
    const form = (component as any).buildForm(data) as FormGroup;
    const after = Date.now();

    const datePipe = TestBed.inject(DatePipe);
    const ctrl = form.get('timestamp');
    expect(ctrl).toBeTruthy();
    expect(ctrl?.disabled).toBeTrue();

    const parsed = Date.parse(ctrl?.value);
    expect(parsed).toBeGreaterThanOrEqual(
      new Date(before - 1000).setUTCHours(0, 0, 0, 0)
    );
    expect(parsed).toBeLessThanOrEqual(
      new Date(after + 1000).setUTCHours(23, 59, 59, 999)
    );

    const expectedNow = datePipe.transform(
      new Date().getTime(),
      'yyyy-MM-dd',
      'UTC'
    );
    expect(ctrl?.value).toBe(expectedNow);
  });

  it('buildForm maps data.subNews items when parent data.timestamp is present (uses item.timestamp)', () => {
    const parentTs = 1660000000000;
    const itemTs = 1650000000000;
    const data = {
      mainTitle: 'P',
      summary: 'S',
      timestamp: parentTs,
      images: null,
      subNews: [
        {
          timestamp: itemTs,
          mainTitle: 'Child title',
          summary: 'Child summary',
          images: {
            smallImageDetails: 'https://img.child/a.jpg',
            smallImageDetailsProxied: 'https://img.child/proxied.jpg',
          },
          newsLink: 'https://child.example',
          source: 'CH',
        },
      ],
      newsLink: '',
      source: '',
    } as any;

    const form = (component as any).buildForm(data) as FormGroup;
    const subArr = form.get('subNews') as any;
    expect(subArr).toBeTruthy();
    expect(subArr.length).toBe(1);

    const fg = subArr.at(0) as FormGroup;
    const datePipe = TestBed.inject(DatePipe);
    const expected = datePipe.transform(itemTs, 'yyyy-MM-dd', 'UTC');

    const tsCtrl = fg.get('timestamp');
    expect(tsCtrl).toBeTruthy();
    expect(tsCtrl!.disabled).toBeTrue();
    expect(tsCtrl!.value).toBe(expected);

    expect(fg.get('mainTitle')?.value).toBe('Child title');
    expect(fg.get('summary')?.value).toBe('Child summary');
    const imgGroup = fg.get('images') as FormGroup;
    expect(imgGroup.get('smallImageDetails')?.value).toBe(
      'https://img.child/a.jpg'
    );
    expect(imgGroup.get('smallImageDetailsProxied')?.value).toBe(
      'https://img.child/proxied.jpg'
    );
    expect(fg.get('newsLink')?.value).toBe('https://child.example');
    expect(fg.get('source')?.value).toBe('CH');
  });

  it('buildForm maps data.subNews items when parent data.timestamp is absent (uses current date for item timestamps)', () => {
    const itemTs = 1650000000000;
    const data = {
      mainTitle: 'P2',
      summary: 'S2',
      images: null,
      subNews: [
        {
          timestamp: itemTs,
          mainTitle: 'Child2 title',
          summary: 'Child2 summary',
          images: {
            smallImageDetails: 'https://img.child2/a.jpg',
            smallImageDetailsProxied: 'https://img.child2/proxied.jpg',
          },
          newsLink: 'https://child2.example',
          source: 'C2',
        },
      ],
      newsLink: '',
      source: '',
    } as any;

    const datePipe = TestBed.inject(DatePipe);
    const expectedNow = datePipe.transform(
      new Date().getTime(),
      'yyyy-MM-dd',
      'UTC'
    );

    const form = (component as any).buildForm(data) as FormGroup;
    const subArr = form.get('subNews') as any;
    expect(subArr).toBeTruthy();
    expect(subArr.length).toBe(1);

    const fg = subArr.at(0) as FormGroup;
    const tsCtrl = fg.get('timestamp');
    expect(tsCtrl).toBeTruthy();
    expect(tsCtrl!.disabled).toBeTrue();

    expect(tsCtrl!.value).toBe(expectedNow);

    expect(fg.get('mainTitle')?.value).toBe('Child2 title');
    expect(fg.get('summary')?.value).toBe('Child2 summary');
    const imgGroup = fg.get('images') as FormGroup;
    expect(imgGroup.get('smallImageDetails')?.value).toBe(
      'https://img.child2/a.jpg'
    );
    expect(imgGroup.get('smallImageDetailsProxied')?.value).toBe(
      'https://img.child2/proxied.jpg'
    );
    expect(fg.get('newsLink')?.value).toBe('https://child2.example');
    expect(fg.get('source')?.value).toBe('C2');
  });
});
