import { AbstractRepository } from '../../db/abstract.repository';
import { ICarFeatures } from '../../models/car-features.model';
import { ICarPrototype } from '../../models/car-prototype.model';
import { ICountry } from '../../models/country.model';
import { IDriveType } from '../../models/drive-type.model';
import { IEngineType } from '../../models/engine-type.model';
import { IGearboxType } from '../../models/gearbox-type.model';
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

  async getMarkById(id: number): Promise<IMark> {
    try {
      return (await this.getByFields('mark', { id }))[0] as IMark;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getModels(mark_id: number): Promise<IModel[]> {
    try {
      return (await this.getByFields('model', { mark_id })) as IModel[];
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getModelById(id: number): Promise<IModel> {
    try {
      return (await this.getByFields('model', { id }))[0] as IModel;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getCountryById(id: number): Promise<ICountry> {
    try {
      return (await this.getByFields('country', { id }))[0] as ICountry;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async createPrototype(prot: Omit<ICarPrototype, 'id'>) {
    try {
      return await this.insertAndGetID('car_prototype', prot);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getDriveTypeId(d_type: string) {
    try {
      return await this.getIdOrInsert('drive_type', { d_type });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
  async getGearboxTypeId(g_type: string) {
    try {
      return await this.getIdOrInsert('gearbox_type', { g_type });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
  async getEngineTypeId(e_type: string) {
    try {
      return await this.getIdOrInsert('engine_type', { e_type });
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getDriveTypeById(id: number): Promise<IDriveType> {
    try {
      return (await this.getByFields('drive_type', { id }))[0] as IDriveType;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
  async getGearboxTypeById(id: number): Promise<IGearboxType> {
    try {
      return (await this.getByFields('gearbox_type', { id }))[0] as IGearboxType;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
  async getEngineTypeById(id: number): Promise<IEngineType> {
    try {
      return (await this.getByFields('engine_type', { id }))[0] as IEngineType;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async createFeatures(features: Omit<ICarFeatures, 'id'>) {
    try {
      return await this.insertAndGetID('car_features', features);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getPrototype(id: number) {
    try {
      return (await this.getByFields('car_prototype', { id }))[0] as ICarPrototype;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async getCarFeatures(id: number) {
    try {
      return (await this.getByFields('car_features', { id }))[0] as ICarFeatures;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async updateCarPrototype(carProt: ICarPrototype){
    try {
      await this.updateTable('car_prototype',  carProt);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
}
