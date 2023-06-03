CREATE TABLE offer(
    id serial NOT NULL,
    contract_address varchar,
    price bigint NOT NULL,
    date_created date NOT NULL,
    date_closed date,
    PRIMARY KEY (id)
)