CREATE TABLE file_prot (
id serial NOT NULL,
car_prototype_id integer NOT NULL,
path varchar not null,
PRIMARY KEY (id),
CONSTRAINT file_fk0 FOREIGN KEY (car_prototype_id) 
REFERENCES car_prototype (id)
)