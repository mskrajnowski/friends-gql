import { ValueProvider } from '@angular/core';

import {IStorage, AUTH_STORAGE} from '../auth.service';

export const PROVIDE_STORAGE: ValueProvider = {
  provide: AUTH_STORAGE,
  useValue: new Map<string, string>() as IStorage,
};
