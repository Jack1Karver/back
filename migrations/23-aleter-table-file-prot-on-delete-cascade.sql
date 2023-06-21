ALTER TABLE IF EXISTS public.file_prot DROP CONSTRAINT IF EXISTS file_fk0;

ALTER TABLE IF EXISTS public.file_prot
    ADD CONSTRAINT file_fk0 FOREIGN KEY (car_prototype_id)
    REFERENCES public.car_prototype (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;