CREATE TABLE skater (
id SERIAL PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL,
	email VARCHAR (125) NOT NULL UNIQUE,
	password VARCHAR(25) NOT NULL,
	anos_experiencia INT NOT NULL DEFAULT 0,
	especialidad VARCHAR (50) NOT NULL,
	foto_perfil VARCHAR (255) NOT NULL,
	admin BOOLEAN DEFAULT false,
	estado BOOLEAN DEFAULT false
);

SELECT * FROM skater;

INSERT INTO skater VALUES
(DEFAULT, 'Tony Hawk', 'tony@example.com', '1234', 50, 'profesional', 'img_tony.jpg', true, true),
(DEFAULT, 'Steve Caballero', 'stevey@example.com', '1234', 30, 'pista', 'img_steve.jpg', DEFAULT, DEFAULT),
(DEFAULT, 'Leticia Bufoni', 'leticia@example.com', '1234', 20, 'skateboarding', 'img_leticia.jpg', DEFAULT, DEFAULT);



drop table skater;