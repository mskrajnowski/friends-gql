import { Inject, Injectable, OpaqueToken } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

export interface IStorage {
    get(key: string): string | null;
    set(key: string, data: string): void;
    delete(key: string): void;
}

export const AUTH_STORAGE = new OpaqueToken('API_AUTH_STORAGE');

export class AuthError extends Error {}
export class InvalidCredentialsError extends AuthError {}

@Injectable()
export class Auth {
  private _url = '/auth';
  private _tokenKey = 'api.auth.token';
  private _headers = new Headers();

  constructor(
    private http: Http,
    @Inject(AUTH_STORAGE) private storage: IStorage,
  ) {
    if (this.token) {
      this._headers = this.buildJWTHeaders(this.token);
    }
  }

  get isAuthenticated() {
    return this._headers.has('Authorization');
  }

  get headers() {
    return this._headers;
  }

  async authenticate(email: string, password: string) {
    this.token = await this.fetchToken(email, password);
  }

  clear() {
    this.token = '';
  }

  private get token() {
    return this.storage.get(this._tokenKey) || '';
  }

  private set token(value: string) {
    this.storage.set(this._tokenKey, value);
    this._headers = value ? this.buildJWTHeaders(value) : new Headers();
  }

  private buildBasicHeaders(email: string, password: string) {
    const credentials = `${email}:${password}`;
    const encodedCredentials = btoa(credentials);
    return new Headers({'Authorization': `Basic ${encodedCredentials}`});
  }

  private buildJWTHeaders(token: string) {
    return new Headers({'Authorization': `JWT ${token}`});
  }

  private async fetchToken(email: string, password: string): Promise<string> {
    const headers = this.buildBasicHeaders(email, password);

    try {
      const response = await this.http.get(this._url, {headers}).toPromise();
      return response.text();
    } catch (err) {
      if (err instanceof Response) {
        if (err.status === 401) {
          throw new InvalidCredentialsError('Invalid email and/or password');
        } else {
          throw new AuthError(`Unknown server error ${err.status}`);
        }
      } else {
        throw err;
      }
    }
  }
}
