CREATE DATABASE skatepark;
\c skatepark

CREATE TABLE skaters (
    id SERIAL PRIMARY KEY, 
    email VARCHAR(50) UNIQUE NOT NULL, 
    nombre VARCHAR(25) NOT NULL, 
    password VARCHAR(25) NOT NULL, 
    anos_experiencia INT NOT NULL, 
    especialidad VARCHAR(50) NOT NULL, 
    estado BOOLEAN NOT NULL
);
