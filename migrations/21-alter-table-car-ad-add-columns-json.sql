ALTER TABLE car_prototype 
ADD COLUMN json varchar,
ADD COLUMN json_hash varchar;

ALTER TABLE car_ad
ADD COLUMN json varchar,
ADD COLUMN json_hash varchar;
