CREATE TABLE file (
id serial NOT NULL,
car_ad_id integer NOT NULL,
path varchar not null,
PRIMARY KEY (id),
CONSTRAINT file_fk0 FOREIGN KEY (car_ad_id) 
REFERENCES car_ad (id)
)