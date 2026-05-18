import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/landing/landing')
                .then(m => m.LandingComponent)
    },
    {
        path: 'register-admin',   // ← NUEVA, pública
        loadComponent: () =>
            import('./components/register-admin/register-admin')
                .then(m => m.RegisterAdminComponent)
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./components/login/login')
                .then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/dashboard/dashboard')
                .then(m => m.DashboardComponent)
    },
    {
        path: 'register',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/register-form/register-form')
                .then(m => m.RegisterFormComponent)
    },
    { path: '**', redirectTo: '' }
];