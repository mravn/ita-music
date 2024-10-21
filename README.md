# music

A demo web application project.

## Project overview

```
db/            CSV files and code to (re-)create database tables from those files
backend/       express webserver code
frontend/      HTML, CSS, and JavaScript resources used by the browser
```

## Setup

Execute `npm install` to fetch and install dependencies.

Add a local `.env` file to the project containing PostgreSQL configuration
such as the following for a local PostgreSQL server:
```
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=music
PG_USER=postgres
PG_PASSWORD=1234
```
or the following for a remote PostgreSQL server, e.g. hosted on neon.tech:
```
PG_HOST=ep-foo-bar.eu-central-1.aws.neon.tech
PG_PORT=5432
PG_DATABASE=music
PG_USER=music_owner
PG_PASSWORD=v3ry_s3cr3t
PG_REQUIRE_SSL=true
```

## (Re-)Create database

Execute `npm run create_db` to recreate the database from the CSV files.

## Run local webserver

Execute `npm run dev` to start the webserver locally, in development mode.
Then navigate your browser to `http://localhost:3000`.
