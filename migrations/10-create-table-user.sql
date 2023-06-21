CREATE TABLE public.user_table
(
    id serial NOT NULL,
    slug character varying NOT NULL,
    wallet_id integer NOT NULL,
    name character varying NOT NULL,
    bio character varying,
    role_id integer NOT NULL,
    status_id integer NOT NULL,
    nonce character varying,
    memo character varying,
    PRIMARY KEY (id),
    CONSTRAINT wallet_id_fk0 FOREIGN KEY (wallet_id)
        REFERENCES public.wallet (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT role_id_fk1 FOREIGN KEY (role_id)
        REFERENCES public.role (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT status_id_fk2 FOREIGN KEY (status_id)
        REFERENCES public.status (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.user_table
    OWNER to "user";