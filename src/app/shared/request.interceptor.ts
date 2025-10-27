/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalMessagesComponent } from './components/modal-messages/modal-messages.component';

export function requestInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const dialog = inject(MatDialog);
  const selectedHost = req.url.includes('image-generator')
    ? environment.x_rapidapi_image_generato_host
    : environment.x_rapidapi_google_host;
  const newReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': environment.x_rapidapi_key,
      'x-rapidapi-host': selectedHost,
    },
  });

  return next(newReq).pipe(
    catchError(({ error }) => {
      dialog.open(ModalMessagesComponent, {
        data: {
          title: 'Error',
          message: error.message,
          cancelLabel: 'Cancel',
        },
      });

      return throwError(() => error.message ?? error);
    })
  );
}
