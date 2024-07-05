import { HttpInterceptorFn } from '@angular/common/http';

export const httpBasicAuthInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
