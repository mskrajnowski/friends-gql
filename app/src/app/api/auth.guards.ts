import { Inject, Injectable, OpaqueToken, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { Auth } from './auth.service';

export const AUTHENTICATE_URL = new OpaqueToken('api.auth.authenticateUrl');

@Injectable()
export class IsAuthenticatedGuard implements CanActivate, CanActivateChild {
  constructor(
    private auth: Auth,
    private location: Location,

    @Optional()
    private router: Router,

    @Inject(AUTHENTICATE_URL)
    @Optional()
    private authenticateUrl: string,
  ) {}

  canActivate() {
    const can = this.auth.isAuthenticated;

    if (this.router && this.authenticateUrl && !can) {
      this.router.navigate([this.authenticateUrl], {
        queryParams: {
          next: this.location.path(),
        },
      });
    }

    return can;
  }

  canActivateChild() {
    return this.canActivate();
  }
}
