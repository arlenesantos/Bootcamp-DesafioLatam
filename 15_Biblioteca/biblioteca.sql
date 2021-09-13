--se crea la base de datos 
CREATE DATABASE biblioteca;
\c biblioteca

--se crea las tablas según el modelo definido
CREATE TABLE socio (
    rut VARCHAR(12) PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    direccion VARCHAR(100),
    telefono INT
);

CREATE TABLE libro (
    ISBN BIGINT PRIMARY KEY,
    titulo VARCHAR(100),
    paginas INT,    
    stock INT CHECK (stock >= 0)    
);

CREATE TABLE autor (
    codigo_autor SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    nacimiento DATE,
    muerte DATE    
);

CREATE TABLE libro_autor (
    id_libro BIGINT,
    id_autor INT,
    tipo_autor VARCHAR(12),
    PRIMARY KEY (id_autor, id_libro),
    FOREIGN KEY (id_autor) REFERENCES autor(codigo_autor),
    FOREIGN KEY (id_libro) REFERENCES libro(ISBN)
);

CREATE TABLE prestamo (
    id SERIAL PRIMARY KEY,
    id_socio VARCHAR(100),
    id_libro BIGINT,
    fecha_inicio DATE,
    fecha_esperada_devolucion DATE,
    fecha_real_devolucion DATE,
    FOREIGN KEY (id_socio) REFERENCES socio(rut),
    FOREIGN KEY (id_libro) REFERENCES libro(ISBN)
);

--se verifica las tablas creadas
\dt

--se insertan los registros en las tablas correspondientes. 
--los datos fueron basados en los registros/vistas presentados en el requerimiento de la prueba
\copy socio FROM 'src/socio.csv' csv header;
\copy libro FROM 'src/libro.csv' csv header;
\copy autor FROM 'src/autor.csv' csv header;
\copy libro_autor FROM 'src/libro_autor.csv' csv header;
\copy prestamo FROM 'src/prestamo.csv' csv header;

-- otra manera de insertar los registros en las tablas seria ocupar: INSERT INTO tabla (columna1, columna2, ...) VALUES ('valor1', 'valor2', ...);

--se configuran las secuencias
ALTER SEQUENCE autor_codigo_autor_seq
START WITH 6
RESTART;

ALTER SEQUENCE prestamo_id_seq
START WITH 8
RESTART;


--Consultas:

--Mostrar todos los libros que posean menos de 300 páginas
SELECT titulo, paginas 
FROM libro
WHERE paginas < 300;

--Mostrar todos los autores que hayan nacido después del 01-01-1970
SELECT nombre, apellido, nacimiento 
FROM autor
WHERE nacimiento > '1970-01-01';

--¿Cuál es el libro más solicitado?
SELECT p.id_libro, l.titulo, 
COUNT(*) 
FROM prestamo as p
LEFT JOIN libro as l ON p.id_libro = l.ISBN
GROUP BY p.id_libro, l.titulo
ORDER BY count DESC;


--Si se cobrara una multa de $100 por cada día de atraso, mostrar cuánto debería pagar cada usuario que entregue el préstamo después de 7 días.
SELECT p.id_socio, s.nombre, s.apellido,
SUM (
    CASE
        WHEN (fecha_real_devolucion > fecha_esperada_devolucion)
            THEN DATE_PART('day', AGE(fecha_real_devolucion, fecha_esperada_devolucion)) * 100 
        ELSE 0           
    END) AS multa
FROM prestamo as p
LEFT JOIN socio as s ON p.id_socio = s.rut
GROUP BY p.id_socio, s.nombre, s.apellido
ORDER BY s.nombre ASC;