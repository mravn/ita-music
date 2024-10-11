import pg from 'pg';
import dotenv from 'dotenv';
import { pipeline } from 'node:stream/promises'
import fs from 'node:fs'
import { from as copyFrom } from 'pg-copy-streams'

dotenv.config();
console.log('Connecting to database', process.env.PG_DATABASE);
const db = new pg.Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
});
const dbResult = await db.query('select now()');
console.log('Database connection established on', dbResult.rows[0].now);

console.log('Resetting tables...');
db.query(`
drop table if exists albums;
drop table if exists artists;

create table albums (
	album_id         integer,
	artist_id        integer,
	release_date     date,
	title            text,
    riaa_certificate text
);

create table artists (
	artist_id   integer,
	nationality char(2),
	stage_name  text
);
`);

{
	console.log('Copying artists...');
	const client = await db.connect();
	try {
        const ingestStream = client.query(copyFrom('copy artists (artist_id, stage_name, nationality) from stdin with csv'));
        const sourceStream = fs.createReadStream('db/artists.csv')
        await pipeline(sourceStream, ingestStream);
	} finally {
		client.release();
	}
}
{
	console.log('Copying albums...');
	const client = await db.connect();
	try {
		const ingestStream = client.query(copyFrom('copy albums (album_id, title, artist_id, release_date, riaa_certificate) from stdin with csv header'))
		const sourceStream = fs.createReadStream('db/albums.csv');
		await pipeline(sourceStream, ingestStream);
	} finally {
		client.release();
	}
}
await db.end();
console.log('Data copied');
