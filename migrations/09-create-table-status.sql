CREATE TABLE public.status
(
    id serial NOT NULL,
    status character varying NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.status
    OWNER to "user";