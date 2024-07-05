import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BasicAuthService } from './basic-auth.service';


export const httpBasicAuthInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const basicAuthService = inject(BasicAuthService);
  let basicAuthHeaderString = basicAuthService.getAuthenticatedToken();
  let username = basicAuthService.getAuthenticateduser();

  if (basicAuthHeaderString && username) {
    req = req.clone({
      setHeaders: {
        Authorization: basicAuthHeaderString
      }
    })
  }
  return next(req);};
