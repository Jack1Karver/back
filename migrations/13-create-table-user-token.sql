CREATE TABLE user_token (
    id serial NOT NULL,
    user_id integer NOT NULL,
    expire_at varchar NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT user_token_fk0 FOREIGN KEY (user_id) 
    REFERENCES public.user_table (id) MATCH SIMPLE
)