--se crea la base de datos repertorio
CREATE DATABASE repertorio;
\c repertorio

--se crea la tabla repertorio
CREATE TABLE repertorio (
    id SERIAL, 
    cancion VARCHAR(50), 
    artista VARCHAR(50), 
    tono VARCHAR(10)
);
