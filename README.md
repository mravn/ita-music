# music

A demo web application project.

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
