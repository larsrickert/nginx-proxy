-- according to: https://onexlab-io.medium.com/docker-compose-postgres-multiple-database-bbc0816db603
-- TODO: CHANGE ME: password has to match "ROUNDCUBE_DB_PW" env variable
CREATE USER roundcube WITH PASSWORD 'somePassword' CREATEDB;
CREATE DATABASE roundcube
    WITH
    OWNER = roundcube
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
