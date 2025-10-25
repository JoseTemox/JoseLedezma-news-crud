/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

export function requestInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const newReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': environment.x_rapidapi_key,
      'x-rapidapi-host': environment.x_rapidapi_host,
    },
  });
  return next(newReq);
}
