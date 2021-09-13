
-- Requerimiento 1: Cargar el respaldo de la base de datos unidad2.sql
CREATE DATABASE unidad2;
\c unidad2
\q
psql -U postgres -d unidad2 -f src/unidad2.sql


-- Requerimiento 2: 
-- El cliente usuario01 ha realizado la siguiente compra:
-- ● producto: producto9
-- ● cantidad: 5
-- ● fecha: fecha del sistema

BEGIN TRANSACTION;
-- se agrega la compra
INSERT INTO compra (id, cliente_id, fecha) VALUES (33, 9, current_date);
-- se agrega los detalles de la compra 
INSERT INTO detalle_compra (id, producto_id, compra_id, cantidad) VALUES (43, 9, 33, 5);
-- se intenta actualizar el stock del producto vendido, pero no será posible realizar la venta debido a la restriccion de stock
UPDATE producto SET stock = stock - 5 WHERE descripcion = 'producto9';
COMMIT;
-- se realiza un rollback automatico

-- se consulta la tabla producto para validar que no se realizó la compra
SELECT * FROM producto;



-- Requerimiento 3:
-- El cliente usuario02 ha realizado la siguiente compra:
-- ● producto: producto1, producto 2, producto 8
-- ● cantidad: 3 de cada producto
-- ● fecha: fecha del sistema

BEGIN TRANSACTION;
-- se agrega la compra
INSERT INTO compra (id, cliente_id, fecha) VALUES (33, 1, current_date);
INSERT INTO compra (id, cliente_id, fecha) VALUES (34, 2, current_date);
INSERT INTO compra (id, cliente_id, fecha) VALUES (35, 8, current_date);

-- se agrega los detalles de la compra 
INSERT INTO detalle_compra (id, producto_id, compra_id, cantidad) VALUES (43, 1, 33, 3);
INSERT INTO detalle_compra (id, producto_id, compra_id, cantidad) VALUES (44, 2, 34, 3);
INSERT INTO detalle_compra (id, producto_id, compra_id, cantidad) VALUES (45, 8, 35, 3);

-- se actualiza el stock de los productos vendidos
-- no será posible realizar la venta debido a la restriccion de stock para producto8
UPDATE producto SET stock = stock - 3 WHERE descripcion = 'producto1';
UPDATE producto SET stock = stock - 3 WHERE descripcion = 'producto2';
UPDATE producto SET stock = stock - 3 WHERE descripcion = 'producto8';

COMMIT;
-- se realiza un rollback automatico

-- se consulta la tabla producto para validar que no se realizó la compra
SELECT * FROM producto;



--Requerimiento 4

--Deshabilitar el AUTOCOMMIT
\set AUTOCOMMIT off

--Insertar un nuevo cliente
INSERT INTO cliente (id, nombre, email) VALUES (11, 'usuario011', 'usuario011@gmail.com');

--Confirmar que fue agregado en la tabla cliente
SELECT * FROM cliente;

--Realizar un ROLLBACK
ROLLBACK;

--Confirmar que se restauró la información, sin considerar la inserción del punto b
SELECT * FROM cliente;

--Habilitar de nuevo el AUTOCOMMIT
\set AUTOCOMMIT on



