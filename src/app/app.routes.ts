import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/dashboard/dashboard')
                .then(m => m.DashboardComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/register-form/register-form')
                .then(m => m.RegisterFormComponent)
    },
    { path: '**', redirectTo: '' }
];