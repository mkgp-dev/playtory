import { pool } from "./pool";

interface NamedRow {
    id: number;
    name: string;
}

interface GameSeed {
    title: string;
    description: string;
    genreName: string;
    developerName: string | null;
    platform: string;
    release_year: number | null;
    status: string;
    price_paid: number | null;
}

async function seed() {
    try {
        console.log("Reset data.");

        await pool.query("DELETE FROM games");
        await pool.query("DELETE FROM developers");
        await pool.query("DELETE FROM genres");

        console.log("Genre data.");

        const genresResult = await pool.query<NamedRow>(
            `INSERT INTO genres (name, description)
            VALUES
            ('Action', 'Fast-paced games focused on combat or reflexes.'),
            ('RPG', 'Character progression, stories, and builds.'),
            ('JRPG', 'Japanese-style role-playing games.'),
            ('Adventure', 'Story-driven exploration and quests.'),
            ('Strategy', 'Tactics, planning, and long-term decisions.'),
            ('Simulation', 'Simulating systems, worlds, or daily life.'),
            ('Indie', 'Independent games with unique ideas.'),
            ('Roguelike', 'Randomized runs with permadeath elements.'),
            ('Soulslike', 'Challenging action RPGs inspired by Dark Souls.'),
            ('Metroidvania', 'Exploration-heavy platformers with ability gating.')
            RETURNING id, name`
        );

        const genreIdByName = new Map<string, number>();
        genresResult.rows.forEach((g) => genreIdByName.set(g.name, g.id));

        console.log("Developer data.");

        const developersResult = await pool.query<NamedRow>(
            `INSERT INTO developers (name, website, country)
            VALUES
            ('FromSoftware', 'https://www.fromsoftware.jp', 'Japan'),
            ('Nintendo', 'https://www.nintendo.com', 'Japan'),
            ('CD Projekt Red', 'https://cdprojektred.com', 'Poland'),
            ('ConcernedApe', 'https://www.concernedape.com', 'USA'),
            ('Supergiant Games', 'https://www.supergiantgames.com', 'USA'),
            ('Larian Studios', 'https://larian.com', 'Belgium'),
            ('Valve', 'https://www.valvesoftware.com', 'USA'),
            ('Team Cherry', 'https://www.teamcherry.com.au', 'Australia'),
            ('Hello Games', 'https://www.nomanssky.com', 'UK'),
            ('Mojang Studios', 'https://www.minecraft.net', 'Sweden'),
            ('Atlus', 'https://atlus.com', 'Japan'),
            ('Square Enix', 'https://square-enix-games.com', 'Japan'),
            ('Unknown Indie Dev', NULL, NULL)
            RETURNING id, name`
        );

        const devIdByName = new Map<string, number>();
        developersResult.rows.forEach((d) => devIdByName.set(d.name, d.id));

        console.log("Game data.");

        const games: GameSeed[] = [
            {
                title: "Elden Ring",
                description: "Open-world Soulslike full of exploration and bosses.",
                genreName: "Soulslike",
                developerName: "FromSoftware",
                platform: "PC",
                release_year: 2022,
                status: "owned",
                price_paid: 59.99,
            },
            {
                title: "Dark Souls III",
                description: "Challenging action RPG with tight level design.",
                genreName: "Soulslike",
                developerName: "FromSoftware",
                platform: "PC",
                release_year: 2016,
                status: "completed",
                price_paid: 29.99,
            },
            {
                title: "Sekiro: Shadows Die Twice",
                description: "Precise, parry-focused action game by FromSoftware.",
                genreName: "Soulslike",
                developerName: "FromSoftware",
                platform: "PC",
                release_year: 2019,
                status: "backlog",
                price_paid: 39.99,
            },
            {
                title: "Bloodborne",
                description: "Aggressive Gothic Soulslike set in Yharnam.",
                genreName: "Soulslike",
                developerName: "FromSoftware",
                platform: "PS4",
                release_year: 2015,
                status: "backlog",
                price_paid: 19.99,
            },
            {
                title: "Hollow Knight",
                description: "Atmospheric Metroidvania with tight controls.",
                genreName: "Metroidvania",
                developerName: "Team Cherry",
                platform: "PC",
                release_year: 2017,
                status: "completed",
                price_paid: 14.99,
            },
            {
                title: "Hollow Knight: Silksong",
                description: "Upcoming sequel to Hollow Knight (wishlist).",
                genreName: "Metroidvania",
                developerName: "Team Cherry",
                platform: "PC",
                release_year: null,
                status: "wishlist",
                price_paid: null,
            },
            {
                title: "Celeste",
                description: "Precision platformer about climbing a mountain.",
                genreName: "Indie",
                developerName: "Unknown Indie Dev",
                platform: "PC",
                release_year: 2018,
                status: "completed",
                price_paid: 19.99,
            },
            {
                title: "The Witcher 3: Wild Hunt",
                description: "Story-rich open-world RPG about Geralt of Rivia.",
                genreName: "RPG",
                developerName: "CD Projekt Red",
                platform: "PC",
                release_year: 2015,
                status: "completed",
                price_paid: 19.99,
            },
            {
                title: "Cyberpunk 2077",
                description: "Futuristic open-world RPG in Night City.",
                genreName: "RPG",
                developerName: "CD Projekt Red",
                platform: "PC",
                release_year: 2020,
                status: "owned",
                price_paid: 39.99,
            },
            {
                title: "Baldur's Gate 3",
                description: "Dice-based RPG with deep choices and party systems.",
                genreName: "RPG",
                developerName: "Larian Studios",
                platform: "PC",
                release_year: 2023,
                status: "backlog",
                price_paid: 59.99,
            },
            {
                title: "Hades",
                description: "Action roguelike set in the Greek underworld.",
                genreName: "Roguelike",
                developerName: "Supergiant Games",
                platform: "PC",
                release_year: 2020,
                status: "completed",
                price_paid: 24.99,
            },
            {
                title: "Hades II",
                description: "Sequel expanding on the Hades formula.",
                genreName: "Roguelike",
                developerName: "Supergiant Games",
                platform: "PC",
                release_year: 2024,
                status: "wishlist",
                price_paid: null,
            },
            {
                title: "Stardew Valley",
                description: "Farming and life sim in a small town.",
                genreName: "Simulation",
                developerName: "ConcernedApe",
                platform: "PC",
                release_year: 2016,
                status: "completed",
                price_paid: 14.99,
            },
            {
                title: "Minecraft",
                description: "Sandbox building and survival in blocky worlds.",
                genreName: "Simulation",
                developerName: "Mojang Studios",
                platform: "PC",
                release_year: 2011,
                status: "owned",
                price_paid: 26.95,
            },
            {
                title: "No Man's Sky",
                description: "Procedurally generated space exploration game.",
                genreName: "Simulation",
                developerName: "Hello Games",
                platform: "PC",
                release_year: 2016,
                status: "owned",
                price_paid: 19.99,
            },
            {
                title: "The Legend of Zelda: Breath of the Wild",
                description: "Open-world adventure redefining exploration.",
                genreName: "Adventure",
                developerName: "Nintendo",
                platform: "Switch",
                release_year: 2017,
                status: "completed",
                price_paid: 59.99,
            },
            {
                title: "The Legend of Zelda: Tears of the Kingdom",
                description: "Sequel with sky islands and underground exploration.",
                genreName: "Adventure",
                developerName: "Nintendo",
                platform: "Switch",
                release_year: 2023,
                status: "owned",
                price_paid: 69.99,
            },
        ];

        for (const game of games) {
            const genreId = genreIdByName.get(game.genreName);
            if (!genreId) {
                throw new Error(`Genre not found for game "${game.title}": ${game.genreName}`);
            }

            let developerId: number | null = null;
            if (game.developerName) {
                const devId = devIdByName.get(game.developerName);
                if (!devId) {
                    throw new Error(
                        `Developer not found for game "${game.title}": ${game.developerName}`
                    );
                }
                developerId = devId;
            }

            await pool.query(
                `INSERT INTO games
                (title, description, genre_id, developer_id, platform, release_year, status, price_paid)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    game.title,
                    game.description,
                    genreId,
                    developerId,
                    game.platform,
                    game.release_year,
                    game.status,
                    game.price_paid,
                ]
            );
        }

        console.log("Seed complete.")
    } catch (error) {
        console.error("Error during seeding:", error);
    } finally {
        await pool.end();
    }
}

seed();