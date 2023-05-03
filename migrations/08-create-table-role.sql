CREATE TABLE public.role
(
    id serial NOT NULL,
    role character varying NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.role
    OWNER to "user";