/**
 * Guard to check if user is authenticated
 */
import { CanActivate  } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { appStorage } from '../../shared/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    if (appStorage.get(appStorage.keys.SESSION)) { return true; }

    this.router.navigate(['/login']);
    return false;
  }
}
