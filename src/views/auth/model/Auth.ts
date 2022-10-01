export interface Auth {
    _id?: string;
    username: string;
    password: string;
    cards?: string[];
    chips?: number;
    phone?: number;
    ban?: boolean;
}
