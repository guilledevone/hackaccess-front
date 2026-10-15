import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl.replace(/\/+$/, '');

  const isApiRequest =
    req.url === apiUrl || req.url.startsWith(`${apiUrl}/`);

  if (!isApiRequest) {
    return next(req);
  }

  const token = inject(AuthService).token();

  const headers: Record<string, string> = {
    Accept: 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return next(req.clone({
    setHeaders: headers
  }));
};