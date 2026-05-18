import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toast.message()) {
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        class="toast toast--{{ toast.type() }}">
        {{ toast.message() }}
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 1rem;
      right: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      z-index: 1000;
    }
    .toast--success { background: #d4dfcc; color: #1b5e20; border: 1px solid #437a22; }
    .toast--error { background: #e0ced7; color: #561740; border: 1px solid #a12c7b; }
    @media (prefers-reduced-motion: reduce) { .toast { animation: none; } }
  `]
})
export class ToastComponent {
  toast = inject(ToastService);
}