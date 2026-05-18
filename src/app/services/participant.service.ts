import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../models/participant.model';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
    private http = inject(HttpClient);
    private API = environment.apiUrl;

    // Estado privado (Signals)
    private _participants = signal<Participant[]>([]);
    private _loading = signal<boolean>(false);
    private _error = signal<string | null>(null);

    // Estado público (read-only)
    readonly participants = this._participants.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    // Valores computados automáticamente
    readonly total = computed(() => this._participants().length);
    readonly totalNecessitats = computed(() =>
        this._participants().filter(p => p.necessitats_especials).length
    );
    readonly totalPresencial = computed(() =>
        this._participants().filter(p => p.tipus_entrada === 'Presencial').length
    );

    load(): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<{ data: Participant[] }>(`${this.API}/participants`).subscribe({
            next: (res) => {
                this._participants.set(res.data);
                this._loading.set(false);
            },
            error: () => {
                this._error.set('No s\'han pogut carregar els participants. Comprova que l\'API està activa a http://localhost:8000.');
                this._loading.set(false);
            }
        });
    }

    register(data: Omit<Participant, 'id' | 'nom_complet' | 'registrat_el'>): Observable<{ data: Participant }> {
        return this.http.post<{ data: Participant }>(`${this.API}/participants`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API}/participants/${id}`);
    }
}