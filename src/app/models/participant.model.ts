export interface Participant {
    id: number;
    nom: string;
    cognom: string;
    nom_complet: string;
    email: string;
    tipus_entrada: 'Presencial' | 'Online' | 'Mentor';
    necessitats_especials: boolean;
    registrat_el: string;
}