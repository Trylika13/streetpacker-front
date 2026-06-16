export interface User {
    id: string;
    email: string;
    username?: string; // Le '?' signifie que c'est optionnel
    firstName?: string;
    lastName?: string;
    roles?: string[]; // Pratique si tu as de la gestion de droits plus tard
}