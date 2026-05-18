import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParticipantService } from '../../services/participant';
import { ToastService } from '../../services/toast';
import { ToastComponent } from '../toast.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ToastComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  service = inject(ParticipantService);
  toast = inject(ToastService);

  ngOnInit() {
    this.service.load();
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