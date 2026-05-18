import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private API = environment.apiUrl;

    private _token = signal<string | null>(null);
    private _user = signal<{ name: string; email: string } | null>(null);

    readonly isAuthenticated = () => !!this._token();
    readonly user = this._user.asReadonly();
    readonly token = this._token.asReadonly();

    login(email: string, password: string) {
        return this.http.post<{ token: string; user: any }>(
            `${this.API}/login`, { email, password }
        ).pipe(
            tap(res => {
                this._token.set(res.token);
                this._user.set(res.user);
            })
        );
    }

    logout() {
        this.http.post(`${this.API}/logout`, {}).subscribe({
            complete: () => {
                this._token.set(null);
                this._user.set(null);
                localStorage.removeItem('ha_token');
                localStorage.removeItem('ha_user');
                this.router.navigate(['/']);
            }
        });
    }
    registerAdmin(name: string, email: string, password: string) {
        return this.http.post<{ token: string; user: any }>(
            `${this.API}/register`, { name, email, password }
        ).pipe(
            tap(res => {
                this._token.set(res.token);
                this._user.set(res.user);
                localStorage.setItem('ha_token', res.token);
                localStorage.setItem('ha_user', JSON.stringify(res.user));
            })
        );
    }
}