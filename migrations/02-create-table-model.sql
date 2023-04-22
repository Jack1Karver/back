CREATE TABLE model
(
    id character varying NOT NULL,
    model_id character varying NOT NULL,
    name character varying NOT NULL,
    class character varying,
    year_from integer NOT NULL,
    year_to integer NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE model ADD CONSTRAINT "model_fk0" FOREIGN KEY ("model_id") REFERENCES "model"("id")