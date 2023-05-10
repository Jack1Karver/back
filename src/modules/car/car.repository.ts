import { AbstractRepository } from '../../db/abstract.repository';
import { ICountry } from '../../models/country.model';
import { IMark } from '../../models/mark.model';
import { IModel } from '../../models/model.model';

export class CarRepository extends AbstractRepository {
  async getPopularMarks(): Promise<IMark[]> {
    try {
      return (await this.getByFields('mark', { popular: true })) as IMark[];
    } catch (e) {
      throw new Error();
    }
  }

  async getUnpopularMarks(): Promise<IMark[]> {
    try {
      return (await this.getByFields('mark', { popular: false })) as IMark[];
    } catch (e) {
      throw new Error();
    }
  }

  async getMarkByName(name: string): Promise<IMark> {
    try {
      return (await this.getByFields('mark', { name }))[0] as IMark;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getModels(mark_id: number): Promise<IModel[]> {
    return (await this.getByFields('model', { mark_id })) as IModel[];
  }

  async getCountryById(id: number):Promise<ICountry>{
    return (await this.getByFields('country', {id}))[0] as ICountry
  }
}
