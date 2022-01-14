--se crear la base de datos llamada banco
CREATE DATABASE banco;
\c banco

--se crea la tabla transacciones
CREATE TABLE transacciones (
    descripcion VARCHAR(50), 
    fecha VARCHAR(10), 
    monto DECIMAL, 
    cuenta INT    
);

--se crea la tabla cuentas
CREATE TABLE cuentas (
    id INT,
    saldo DECIMAL CHECK (saldo >= 0)   
);

-- se registra al menos 1 cuenta en la tabla cuentas con un saldo inicial
INSERT INTO cuentas VALUES (1, 20000);

