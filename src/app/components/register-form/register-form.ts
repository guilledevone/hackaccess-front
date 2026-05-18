import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ToastComponent],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss'
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(ParticipantService);
  private router = inject(Router);
  toast = inject(ToastService);

  form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    cognom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    tipus_entrada: ['Presencial' as const, Validators.required],
    necessitats_especials: [false]
  });

  getError(field: 'nom' | 'cognom' | 'email' | 'tipus_entrada'): string {
    const control = this.form.get(field);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) return 'Aquest camp es obligatori.';
    if (control.hasError('minlength')) return `Minim ${control.getError('minlength').requiredLength} caracters.`;
    if (control.hasError('maxlength')) return `Maxim ${control.getError('maxlength').requiredLength} caracters.`;
    if (control.hasError('email')) return 'El correu electronic no es valid.';
    return '';
  }

  isInvalid(field: 'nom' | 'cognom' | 'email' | 'tipus_entrada'): boolean {
    const control = this.form.get(field);
    return !!control && control.touched && control.invalid;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Revisa els camps del formulari.', 'error');
      return;
    }

    this.service.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.show('Participant registrat correctament!', 'success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Error en registrar el participant.';
        this.toast.show(msg, 'error');
      }
    });
  }
}