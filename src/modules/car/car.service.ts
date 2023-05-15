import { ICarFeatures } from '../../models/car-features.model';
import { ICarPrototype } from '../../models/car-prototype.model';
import { IMark } from '../../models/mark.model';
import { IModel } from '../../models/model.model';
import { IUser } from '../../models/user.model';
import { ContractsService } from '../contracts/contracts.service';
import { FilesService } from '../files/files.service';
import { UserService } from '../user/user.service';
import { createHashName } from '../wallet/crypt.util';
import { CarRepository } from './car.repository';
import { CarSubscriber } from './car.subscriber';
import { ICarPrototypeDto } from './interfaces/car-prototype.dto';
import { ICarFeaturesDto } from './interfaces/car.dto';
import { IMarkDto } from './interfaces/mark.dto';
import { IModelDto } from './interfaces/model.dto';
import { IUploadFileDto } from './interfaces/upload-file.dto';

export class CarService {
  contractsSubscriber = new CarSubscriber(this.contractsService);
  userService = new UserService();
  filesService = new FilesService();

  constructor(private readonly contractsService: ContractsService) {
    this.contractsSubscriber.onModuleInit();
  }

  carRepository = new CarRepository();

  async getPopularMarks() {
    try {
      const marks = await this.carRepository.getPopularMarks();
      return Promise.all(
        marks.map(mark => {
          return this.serializeMark(mark);
        })
      );
    } catch (e) {
      throw new Error();
    }
  }

  async getMarks() {
    const marks = [...(await this.carRepository.getPopularMarks()), ...(await this.carRepository.getUnpopularMarks())];
    return Promise.all(
      marks.map(mark => {
        return this.serializeMark(mark);
      })
    );
  }

  async getModels(mark: string) {
    const markId = (await this.carRepository.getMarkByName(mark)).id;
    return await this.carRepository.getModels(markId);
  }

  async getCountryById(country_id: number) {
    return await this.carRepository.getCountryById(country_id);
  }

  async createCarPrototype(car: ICarPrototypeDto, user: IUser) {
    const prototype = await this.carRepository.createPrototype({
      car_features_id: await this.createFeatures(car.carFeatures),
      description: car.description,
      owner_id: user.id,
    });

    return await this.serializePrototype(await this.carRepository.getPrototype(prototype));
  }

  private async createFeatures(features: ICarFeaturesDto) {
    return await this.carRepository.createFeatures({
      model_id: features.model.id,
      year_prod: features.yearProd,
      engine_capacity: features.engineCapacity,
      hp: features.hp,
      color: features.color,
      mileage: features.mileage,
      engine_type_id: await this.carRepository.getEngineTypeId(features.engineType),
      gearbox_type_id: await this.carRepository.getGearboxTypeId(features.gearboxType),
      drive_type_id: await this.carRepository.getDriveTypeId(features.driveType),
    });
  }

  async uploadCarPrototypeFiles(files: Express.Multer.File[], upload: IUploadFileDto) {
    const carPrototype = await this.carRepository.getPrototype(upload.carId);
    if (carPrototype) {
      await this.filesService.saveFilePrototype(files, carPrototype.id);
      const json = this.filesService.createTip4Json(carPrototype, files, upload.fileMeta);
      carPrototype.json = json;
      carPrototype.json_hash = createHashName(json);

      await this.carRepository.updateCarPrototype(carPrototype);
    }
  }

  async serializeMark(mark: IMark): Promise<IMarkDto> {
    return {
      id: mark.id,
      name: mark.name,
      popular: mark.popular,
      country: await this.getCountryById(mark.country_id),
    };
  }

  async serializePrototype(prototype: ICarPrototype): Promise<ICarPrototypeDto> {
    try {
      const owner = await this.userService.getUserById(prototype.owner_id);
      if (owner) {
        return {
          id: prototype.id,
          carFeatures: await this.serializeFeatures(await this.carRepository.getCarFeatures(prototype.car_features_id)),
          description: prototype.description,
          owner: owner,
        };
      } else throw { message: 'User not found' };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async serializeFeatures(features: ICarFeatures): Promise<ICarFeaturesDto> {
    try {
      return {
        model: await this.serializeModel(await this.carRepository.getModelById(features.model_id)),
        yearProd: features.year_prod,
        engineType: (await this.carRepository.getEngineTypeById(features.engine_type_id)).e_type,
        engineCapacity: features.engine_capacity,
        driveType: (await this.carRepository.getDriveTypeById(features.drive_type_id)).d_type,
        gearboxType: (await this.carRepository.getGearboxTypeById(features.gearbox_type_id)).g_type,
        hp: features.hp,
        color: features.color,
        mileage: features.mileage,
      };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async serializeModel(model: IModel): Promise<IModelDto> {
    try {
      return {
        id: model.id,
        name: model.name,
        mark: await this.serializeMark(await this.carRepository.getMarkById(model.mark_id)),
        year_from: model.year_from,
        year_to: model.year_to,
      };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }
}
