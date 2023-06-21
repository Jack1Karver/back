ALTER TABLE offer ADD COLUMN status_id integer;

ALTER TABLE offer ADD CONSTRAINT offer_fk0 FOREIGN KEY (status_id)
REFERENCES status(id)
