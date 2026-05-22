import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../models/participant.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
    private http = inject(HttpClient);
    private API = environment.apiUrl;

    private _participants = signal<Participant[]>([]);
    private _loading = signal<boolean>(false);
    private _error = signal<string | null>(null);

    readonly participants = this._participants.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    readonly total = computed(() => this._participants().length);

    readonly totalNecessitats = computed(() =>
        this._participants().filter(p => p.necessitats_especials).length
    );

    readonly totalPresencial = computed(() =>
        this._participants().filter(p => p.tipus_entrada === 'Presencial').length
    );

    readonly totalOnline = computed(() =>
        this._participants().filter(p => p.tipus_entrada === 'Online').length
    );

    readonly totalMentor = computed(() =>
        this._participants().filter(p => p.tipus_entrada === 'Mentor').length
    );

    load(): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<{ data: Participant[] }>(`${this.API}/participants`).subscribe({
            next: (res) => {
                this._participants.set(res.data);
                this._loading.set(false);
            },
            error: (e) => {
                this._error.set('Error carregant els participants. Comprova la connexió.');
                this._loading.set(false);
                console.error(e);
            }
        });
    }

    register(data: Omit<Participant, 'id' | 'nom_complet' | 'registrat_el'>) {
        return this.http.post<{ data: Participant }>(`${this.API}/participants`, data);
    }

    create(data: Omit<Participant, 'id' | 'nom_complet' | 'registrat_el'>) {
        return this.http.post<{ data: Participant }>(`${this.API}/participants`, data);
    }

    delete(id: number) {
        return this.http.delete(`${this.API}/participants/${id}`);
    }
    update(id: number, data: Partial<Omit<Participant, 'id' | 'nom_complet' | 'registrat_el'>>) {
    return this.http.put<Participant>(`${this.API}/participants/${id}`, data);
}
}