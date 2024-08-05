import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _auth  =  inject(AuthService);
  if(_auth.getAuthUser() && _auth.getAuthUser().id  ){
    return true;
  }
  return false;
};
