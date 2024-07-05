import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { BasicAuthService } from './service/http/basic-auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(BasicAuthService);
  const router = inject(Router);
  if (authService.isUserLoggedIn()) {
    return true;
  }

  // route to login

  router.navigate(['login']);
  return false;
};
