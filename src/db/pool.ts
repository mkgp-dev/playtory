import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE) {
    throw new Error("Database is needed for this project.");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE,
});