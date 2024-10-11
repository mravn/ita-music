import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

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

const port = process.env.PORT || 3000;
const server = express();

server.use(express.static('frontend'));
server.use(onEachRequest);
server.get('/api/albums', onGetAlbums);
server.listen(port, onServerReady);

async function onGetAlbums(request, response) {
    const query = request.query;
    const start = query.start;
    const end = query.end;
    const dbResult = await db.query(`
        select   stage_name as "Artist",
                 title as "Title",
                 to_char(release_date, 'YYYY-MM-DD') as "Released",
                 riaa_certificate as "RIAA"
        from     albums
        join     artists using (artist_id)
        where    to_date($1, 'YYYY') <= release_date and release_date < to_date($2, 'YYYY')
        order by release_date asc`,
        [start, end]);
    response.send(dbResult.rows);
}

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}

function onServerReady() {
    console.log('Webserver running on port', port);
}
