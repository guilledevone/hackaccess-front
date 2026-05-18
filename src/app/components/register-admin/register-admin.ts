import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-register-admin',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register-admin.html',
    styleUrl: './register-admin.scss'
})
export class RegisterAdminComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    loading = false;
    error = '';

    form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    onSubmit() {
        if (this.form.invalid) return;
        this.loading = true;
        this.error = '';

        const { name, email, password } = this.form.value;

        this.auth.registerAdmin(name!, email!, password!).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (e) => {
                this.error = e.error?.message ?? 'Error en crear el compte';
                this.loading = false;
            }
        });
    }
}