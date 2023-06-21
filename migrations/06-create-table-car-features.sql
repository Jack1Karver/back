CREATE TABLE public.car_features
(
    id serial NOT NULL,
    model_id integer NOT NULL,
    year_prod integer NOT NULL,
    engine_type_id integer NOT NULL,
    drive_type_id integer NOT NULL,
    gearbox_type_id integer NOT NULL,
    hp integer NOT NULL,
    engine_capacity real NOT NULL,
    color character varying NOT NULL,
    mileage integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT engine_type__id_fk0 FOREIGN KEY (engine_type_id)
        REFERENCES public.engine_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT drive_type_id_fk1 FOREIGN KEY (drive_type_id)
        REFERENCES public.drive_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT gearbox_type_id_fk2 FOREIGN KEY (gearbox_type_id)
        REFERENCES public.gearbox_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.car_features
    OWNER to "user";