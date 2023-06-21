CREATE TABLE public.wallet
(
    id serial NOT NULL,
    address character varying NOT NULL,
    status character varying,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.wallet
    OWNER to "user";