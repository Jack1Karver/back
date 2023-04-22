CREATE TABLE country 
(
    id serial NOT NULL,
    name character varying NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE mark
(
    id character varying NOT NULL,
    name character varying NOT NULL,
    popular boolean NOT NULL DEFAULT 'false',
    country_id integer NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE mark ADD CONSTRAINT "mark_fk0" FOREIGN KEY ("country_id") REFERENCES "country"("id")