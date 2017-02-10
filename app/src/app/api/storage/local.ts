import { ValueProvider } from '@angular/core';

import {IStorage, AUTH_STORAGE} from '../auth.service';

const wrapper: IStorage = {
  get(key: string) { return window.localStorage.getItem(key); },
  set(key: string, value: string) { window.localStorage.setItem(key, value); },
  delete(key: string) { window.localStorage.removeItem(key); },
};

export const PROVIDE_STORAGE: ValueProvider = {
  provide: AUTH_STORAGE,
  useValue: wrapper,
};
