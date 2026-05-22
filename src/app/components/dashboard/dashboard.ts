import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ParticipantService } from '../../services/participant';
import { ToastService } from '../../services/toast';
import { ToastComponent } from '../toast.component';
import { AuthService } from '../../services/auth';
import { Participant } from '../../models/participant.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ToastComponent, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  service  = inject(ParticipantService);
  toast    = inject(ToastService);
  auth     = inject(AuthService);
  private fb = inject(FormBuilder);

  editingParticipant = signal<Participant | null>(null);

  editForm = this.fb.group({
    nom:                  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    cognom:               ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email:                ['', [Validators.required, Validators.email]],
    tipus_entrada:        ['Presencial', Validators.required],
    necessitats_especials: [false]
  });

  get isAdmin(): boolean {
    return this.auth.user()?.email === 'admin@hackaccess.dev';
  }

  ngOnInit() {
    this.service.load();
  }


  onEdit(participant: Participant) {
    this.editingParticipant.set(participant);
    this.editForm.patchValue({
      nom:                  participant.nom,
      cognom:               participant.cognom,
      email:                participant.email,
      tipus_entrada:        participant.tipus_entrada,
      necessitats_especials: participant.necessitats_especials
    });
  }

  onCancelEdit() {
    this.editingParticipant.set(null);
    this.editForm.reset();
  }

  onSubmitEdit() {
    if (this.editForm.invalid) return;
    const participant = this.editingParticipant();
    if (!participant) return;

    this.service.update(participant.id, this.editForm.value as any).subscribe({
      next: () => {
        this.service.load();
        this.editingParticipant.set(null);
        this.editForm.reset();
        this.toast.show('Participant actualitzat correctament.', 'success');
      },
      error: () => {
        this.toast.show('Error en actualitzar el participant.', 'error');
      }
    });
  }


  onDelete(id: number) {
    if (!confirm('Segur que vols eliminar aquest participant?')) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.service.load();
        this.toast.show('Participant eliminat correctament.', 'success');
      },
      error: () => {
        this.toast.show('Error en eliminar el participant.', 'error');
      }
    });
  }
}