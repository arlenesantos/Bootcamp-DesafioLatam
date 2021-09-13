--crear base de datos llamada blog
CREATE DATABASE blog;
\c blog

--crear las tablas indicadas de acuerdo al modelo de datos
CREATE TABLE usuario (
    id SERIAL UNIQUE NOT NULL,
    email VARCHAR(25),
    PRIMARY KEY (id)
);

CREATE TABLE post (
    id SERIAL UNIQUE NOT NULL,
    usuario_id INT,
    titulo VARCHAR(50),
    fecha DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE comentario (
    id SERIAL UNIQUE NOT NULL,
    post_id INT,
    usuario_id INT,
    texto VARCHAR(100),
    fecha DATE,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- insertar los registros uno por uno 
--INSERT INTO usuario (email) VALUES ('usuario01@hotmail.com');

-- importando datos de un .csv
\copy usuario FROM 'src/usuarios.csv' csv header;
\copy post FROM 'src/post.csv' csv header;
\copy comentario FROM 'src/comentarios.csv' csv header;

-- Configuracian de las secuencias post import csv
alter sequence usuario_id_seq
start with 10
restart;
alter sequence post_id_seq
start with 16
restart;
alter sequence comentario_id_seq
start with 16
restart;

--seleccionar el correo, id y título de todos los post publicados por el usuario 5
SELECT email, post.id, post.titulo
FROM usuario
INNER JOIN post ON usuario.id = post.usuario_id
WHERE usuario.id='5';


--listar el correo, id y el detalle de todos los comentarios que no hayan sido realizados por el usuario con email 'usuario06@hotmail.com'
SELECT usuario.id, email
FROM usuario
INNER JOIN comentario ON usuario.id = comentario.usuario_id
WHERE usuario.email <> 'usuario06@hotmail.com';


--listar los usuarios que no han publicado ningún post
SELECT usuario.id, email
FROM usuario
LEFT JOIN post ON usuario.id = post.usuario_id
WHERE post.id IS NULL;


--Listar todos los post con sus comentarios (incluyendo aquellos que no poseen comentarios)
SELECT *
FROM post
FULL OUTER JOIN comentario ON post.id = comentario.post_id
ORDER BY post_id;


--listar todos los usuarios que hayan publicado un post en Junio
SELECT id, email
FROM usuario
WHERE id IN (
    SELECT usuario_id
    FROM post
    WHERE fecha BETWEEN '2020-06-01' AND '2020-06-30'
);





