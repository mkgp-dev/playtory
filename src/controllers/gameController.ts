import { Request, Response } from "express";
import { pool } from "../db/pool";
import { Game } from "../models/game";
import { Genre } from "../models/genre";
import { Developer } from "../models/developer";

export async function game_list(req: Request, res: Response) {
    const result = await pool.query<Game & { genre_name: string; developer_name: string | null }>(
        `SELECT
        g.*,
        gn.name AS genre_name,
        d.name AS developer_name
        FROM games g
        JOIN genres gn ON g.genre_id = gn.id
        LEFT JOIN developers d ON g.developer_id = d.id
        ORDER BY g.title ASC`
    );

    res.render("games/list", { title: "View games", games: result.rows });
}

export async function game_form(req: Request, res: Response) {
    const genres = await pool.query<Genre>("SELECT * FROM genres ORDER BY name ASC");
    const developers = await pool.query<Developer>("SELECT * FROM developers ORDER BY name ASC");

    res.render("games/form", {
        title: "Add a new game",
        game: null,
        genres: genres.rows,
        developers: developers.rows,
        errors: [],
    });
}

export async function game_detail(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.redirect("/games");

    const result = await pool.query<Game & { genre_name: string; developer_name: string | null }>(
        `SELECT
        g.*,
        gn.name AS genre_name,
        d.name AS developer_name
        FROM games g
        JOIN genres gn ON g.genre_id = gn.id
        LEFT JOIN developers d ON g.developer_id = d.id
        WHERE g.id = $1`,
        [id]
    );

    if (result.rowCount === 0) return res.redirect("/games");

    res.render("games/detail", { title: result.rows[0].title, game: result.rows[0] });
}

export async function game_create(req: Request, res: Response) {
    const {
        title,
        description,
        genre_id,
        developer_id,
        platform,
        release_year,
        status,
        price_paid,
    } = req.body;

    const errors: string[] = [];

    if (!title || title.trim() === "") errors.push("Title is required.");
    if (!genre_id) errors.push("Genre is required.");
    if (!platform) errors.push("Platform is required.");

    const genres = await pool.query<Genre>("SELECT * FROM genres ORDER BY name ASC");
    const developers = await pool.query<Developer>("SELECT * FROM developers ORDER BY name ASC");

    const pricePaid = price_paid === "" || price_paid == null ? null : Number(price_paid);

    const currentYear = new Date().getFullYear();
    const releaseYear = release_year === "" || release_year == null ? null : Number(release_year);
    if (releaseYear !== null && (Number.isNaN(releaseYear) || releaseYear! < 1970 || releaseYear! > currentYear)) errors.push(`Released year must be between 1970 and ${currentYear}.`);

    if (errors.length > 0) {
        return res.render("games/form", {
            title: "Add a new game",
            game: { ...req.body },
            genres: genres.rows,
            developers: developers.rows,
            errors,
        });
    }

    await pool.query(
        `INSERT INTO games
        (title, description, genre_id, developer_id, platform, release_year, status, price_paid)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
            title.trim(),
            description || null,
            Number(genre_id),
            developer_id ? Number(developer_id) : null,
            platform,
            releaseYear,
            status || "owned",
            pricePaid,
        ]
    );

    res.redirect("/games");
}

export async function game_edit(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.redirect("/games");

    const gameResult = await pool.query<Game>("SELECT * FROM games WHERE id = $1", [id]);
    if (gameResult.rowCount === 0) return res.redirect("/games");

    const genres = await pool.query<Genre>("SELECT * FROM genres ORDER BY name ASC");
    const developers = await pool.query<Developer>("SELECT * FROM developers ORDER BY name ASC");

    res.render("games/form", {
        title: `Edit ${gameResult.rows[0].title}`,
        game: gameResult.rows[0],
        genres: genres.rows,
        developers: developers.rows,
        errors: [],
    });
}

export async function game_update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.redirect("/games");

    const {
        title,
        description,
        genre_id,
        developer_id,
        platform,
        release_year,
        status,
        price_paid,
        secret_password,
    } = req.body;

    const errors: string[] = [];

    if (!title || title.trim() === "") errors.push("Title is required.");
    if (!genre_id) errors.push("Genre is required.");
    if (!platform) errors.push("Platform is required.");

    if (secret_password !== process.env.SECRET_KEY) errors.push("Invalid admin password.");

    const genres = await pool.query<Genre>("SELECT * FROM genres ORDER BY name ASC");
    const developers = await pool.query<Developer>("SELECT * FROM developers ORDER BY name ASC");

    const pricePaid = price_paid === "" || price_paid == null ? null : Number(price_paid);

    const currentYear = new Date().getFullYear();
    const releaseYear = release_year === "" || release_year == null ? null : Number(release_year);
    if (releaseYear !== null && (Number.isNaN(releaseYear) || releaseYear! < 1970 || releaseYear! > currentYear)) errors.push(`Released year must be between 1970 and ${currentYear}.`);

    if (errors.length > 0) {
        return res.render("games/form", {
            title: `Edit ${title}`,
            game: { id, ...req.body },
            genres: genres.rows,
            developers: developers.rows,
            errors,
        });
    }

    await pool.query(
        `UPDATE games
        SET title = $1,
        description = $2,
        genre_id = $3,
        developer_id = $4,
        platform = $5,
        release_year = $6,
        status = $7,
        price_paid = $8
        WHERE id = $9`,
        [
            title.trim(),
            description || null,
            Number(genre_id),
            developer_id ? Number(developer_id) : null,
            platform,
            releaseYear,
            status || "owned",
            pricePaid,
            id,
        ]
    );

    res.redirect(`/games/${id}`);
}

export async function game_delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.redirect("/games");

    const { secret_password } = req.body;

    const result = await pool.query<Game & { genre_name: string; developer_name: string | null }>(
        `SELECT
        g.*,
        gn.name AS genre_name,
        d.name AS developer_name
        FROM games g
        JOIN genres gn ON g.genre_id = gn.id
        LEFT JOIN developers d ON g.developer_id = d.id
        WHERE g.id = $1`,
        [id]
    );

    if (result.rowCount === 0) return res.render("games/detail", { title: "Game not found", msgError: "Sorry, the game you’re looking for is not in our database." });

    if (secret_password !== process.env.SECRET_KEY) return res.render("games/detail", { title: result.rows[0].title, game: result.rows[0], msgError: "Invalid password." });

    await pool.query("DELETE FROM games WHERE id = $1", [id]);
    res.redirect("/games");
}