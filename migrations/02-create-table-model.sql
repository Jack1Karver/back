CREATE TABLE model
(
    id serial NOT NULL,
    mark_id integer NOT NULL,
    name character varying NOT NULL,
    class character varying,
    year_from integer NOT NULL,
    year_to integer,
    PRIMARY KEY (id)
);

ALTER TABLE model ADD CONSTRAINT "model_fk0" FOREIGN KEY ("mark_id") REFERENCES "mark"("id")