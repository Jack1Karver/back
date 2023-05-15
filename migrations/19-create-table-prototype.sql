CREATE TABLE car_prototype(
    id serial NOT NULL,
    car_features_id integer NOT NULL,
    address varchar,
    owner_id integer NOT NULL,
    description varchar,
    PRIMARY KEY (id),
    CONSTRAINT car_prot_fk0 FOREIGN KEY (car_features_id) 
REFERENCES car_features (id), 
CONSTRAINT car_prot_fk1 FOREIGN KEY (owner_id) 
REFERENCES user_table (id)
)