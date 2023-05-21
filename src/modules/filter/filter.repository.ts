import { AbstractRepository } from '../../db/abstract.repository';
import { ICarAd } from '../../models/car-ad.model';

import { TFields } from './interfaces/fields.interface';


export class FilterRepository extends AbstractRepository {
  async getCarsByFilter(filter: TFields, limit?: string, offset?: string) {
    const conditions: string[] = [];
    filter.modelId ? conditions.push(`model.id = ${filter.modelId}`) : null;
    filter.markId ? conditions.push(`mark.id = ${filter.markId}`) : null;
    filter.ownerId ? conditions.push(`car.owner_id = ${filter.ownerId}`) : null;
    filter.yearFrom ? conditions.push(`model.year_from >= ${filter.yearFrom}`) : null;
    filter.yearTo ? conditions.push(`model.year_to <= ${filter.yearTo}`) : null;

    return (await this.connection.sqlQuery(`SELECT car.* FROM car_ad as car 
        JOIN car_features as cf ON cf.id = car.car_features_id 
        JOIN model ON cf.model_id = model.id 
        JOIN mark ON model.mark_id = mark.id ${conditions.join(' AND ')} 
        ${limit ? `LIMIT ${limit}` : ''} ${offset ? `OFFSET ${offset}` : ''}
        `)) as ICarAd[];
  }

  async getCarsCount(filter: TFields){
    const conditions: string[] = [];
    filter.modelId ? conditions.push(`model.id = ${filter.modelId}`) : null;
    filter.markId ? conditions.push(`mark.id = ${filter.markId}`) : null;
    filter.ownerId ? conditions.push(`car.owner_id = ${filter.ownerId}`) : null;
    filter.yearFrom ? conditions.push(`model.year_from >= ${filter.yearFrom}`) : null;
    filter.yearTo ? conditions.push(`model.year_to <= ${filter.yearTo}`) : null;

    return (await this.connection.sqlQuery(`SELECT COUNT(*) as count FROM car_ad as car 
        JOIN car_features as cf ON cf.id = car.car_features_id 
        JOIN model ON cf.model_id = model.id 
        JOIN mark ON model.mark_id = mark.id ${conditions.join(' AND ')}        
        `))[0].count as number;
  
  }
}
