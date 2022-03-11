CREATE DATABASE menu;
\c menu

CREATE TABLE admin (    
    name VARCHAR(45),
    email VARCHAR(45) PRIMARY KEY,
    password VARCHAR(45)    
);

INSERT INTO admin (name, email, password) VALUES ('Admin Junaeb', 'admin@junaeb.cl', '12345678');

CREATE TABLE schools (    
    id SERIAL PRIMARY KEY, 
    name VARCHAR(45), 
    school VARCHAR(45),
    email VARCHAR(45),
    password VARCHAR(45)      
);

INSERT INTO schools (name, school, email, password) VALUES
('Andrea', 'San Bosco', 'sanbosco@school.com', '123'),
('Marcos', 'Liceo 32', 'liceo32@school.com', '456');


CREATE TABLE orders (
    id SERIAL PRIMARY KEY, 
    date DATE,
    is_rectified BOOLEAN,
    observations TEXT,
    school_id INT,
    vegetarian INT,
    vegetarian_real INT DEFAULT 0,
    celiac INT,
    celiac_real INT DEFAULT 0,
    standard INT,
    standard_real INT DEFAULT 0,
    caloric INT,
    caloric_real INT DEFAULT 0,
    ethnic INT,
    ethnic_real INT DEFAULT 0,
    FOREIGN KEY(school_id) REFERENCES schools(id),
    UNIQUE (date, school_id)

);


INSERT INTO orders (date, is_rectified, school_id, vegetarian, vegetarian_real, celiac, celiac_real, standard, standard_real, caloric, caloric_real, ethnic, ethnic_real) VALUES ('2022-03-02', false, 1, 345, 321, 34, 23, 700, 657, 21, 20, 67, 67), 
('2022-03-01', true, 1, 340, 324, 30, 26, 678, 650, 25, 18, 68, 59), 
('2022-03-01', false, 2, 340, 324, 38, 27, 658, 609, 19, 17, 54, 45),
('2022-03-04', true, 2, 359, 256, 48, 35, 639, 609, 20, 17, 64, 57);


CREATE TABLE noticias ( 
    id SERIAL PRIMARY KEY,   
    title VARCHAR(100) NOT NULL,
    date DATE DEFAULT NOW(),
    content TEXT NOT NULL       
);

INSERT INTO noticias (title, content) VALUES ('Noticia 1', 'contenido noticia 1');
INSERT INTO noticias (title, content) VALUES ('Noticia 2', 'contenido noticia 2');
INSERT INTO noticias (title, content) VALUES ('Noticia 3', 'contenido noticia 3');
INSERT INTO noticias (title, content) VALUES ('Noticia 4', 'contenido noticia 4');
INSERT INTO noticias (title, content) VALUES ('Noticia 5', 'contenido noticia 5');
INSERT INTO noticias (title, content) VALUES ('Noticia 6', 'contenido noticia 6');





