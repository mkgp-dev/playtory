export interface Game {
    id: number;
    title: string;
    description: string | null;
    genre_id: number;
    developer_id: number | null;
    platform: string;
    release_year: number | null;
    status: string;
    price_paid: number | null;
    genre_name?: string;
    developer_name?: string | null;
}