export { Auth, AuthError, InvalidCredentialsError } from './auth.service';
export { ApiModule } from './api.module';
export { IsAuthenticatedGuard, AUTHENTICATE_URL } from './auth.guards';
export { PROVIDE_STORAGE as PROVIDE_LOCAL_STORAGE } from './storage/local'
export { PROVIDE_STORAGE as PROVIDE_INMEM_STORAGE } from './storage/in-mem'
