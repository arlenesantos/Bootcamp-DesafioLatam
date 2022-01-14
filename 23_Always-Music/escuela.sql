
--se crea la base de datos escuela
CREATE DATABASE escuela;
\c escuela


--se crea la tabla estudiante
CREATE TABLE estudiante (
    rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,    
    curso VARCHAR(25) NOT NULL,
    nivel INT NOT NULL
);