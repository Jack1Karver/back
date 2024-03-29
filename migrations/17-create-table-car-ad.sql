CREATE TABLE car_ad(
    id serial NOT NULL,
    car_features_id integer NOT NULL,
    address varchar,
    owner_id integer NOT NULL,
    description varchar,
    offer_id integer,
    PRIMARY KEY (id),
    CONSTRAINT car_ad_fk0 FOREIGN KEY (car_features_id) 
REFERENCES car_features (id), 
CONSTRAINT car_ad_fk1 FOREIGN KEY (owner_id) 
REFERENCES user_table (id),
CONSTRAINT car_ad_fk2 FOREIGN KEY (offer_id) 
REFERENCES offer (id)
)