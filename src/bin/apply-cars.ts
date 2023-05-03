import { AbstractRepository } from '../db/abstract.repository';
import { Connection } from '../db/connection';
import fs from 'node:fs';

interface Cars {
  name: string;
  popular: boolean;
  country: string;
  models: Car[];
}

interface Car {
  name: string;
  class: string;
  'year-from': number;
  'year-to': number | null;
}

class ApplyCars extends AbstractRepository {
  constructor() {
    super();
  }

  applyCars = async () => {
    try {
      const file = JSON.parse(
        fs.readFileSync('src/resources/cars.json', {
          encoding: 'utf-8',
        })
      ) as Cars[];
      for (let mark of file) {
        const country = await this.getIdOrInsert('country', { name: mark.country });
        mark.name = mark.name.replace(`'`, `''`)
        const markId = await this.getIdOrInsert('mark', {
          name: mark.name,
          popular: mark.popular,
          country_id: country,
        }, true);
        for (let model of mark.models) {
          model.name = model.name.replace(`'`, `''`)
          await this.getIdOrInsert('model', {
            mark_id: markId,
            name: model.name,
            class: model.class,
            year_from: model['year-from'],
            year_to: model['year-to'],
          }, true);
        }
      }
     
    } catch (e) {
      console.log(e);
    }
  };
}

const apply = new ApplyCars();
apply.applyCars();
