import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _message = signal<string | null>(null);
    private _type = signal<'success' | 'error'>('success');

    readonly message = this._message.asReadonly();
    readonly type = this._type.asReadonly();

    show(msg: string, kind: 'success' | 'error' = 'success') {
        this._message.set(msg);
        this._type.set(kind);
        setTimeout(() => this._message.set(null), 4000);
    }
}