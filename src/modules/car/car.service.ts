import { ICreateFromEventOptions } from '../../interfaces/create-from-event-options.interface';
import { ITokenMintedEvent } from '../../interfaces/token-minted-event.interface';
import { ICarAd } from '../../models/car-ad.model';
import { ICarFeatures } from '../../models/car-features.model';
import { ICarPrototype } from '../../models/car-prototype.model';
import { IMark } from '../../models/mark.model';
import { IModel } from '../../models/model.model';
import { IUser } from '../../models/user.model';
import { hexToUtf8 } from '../../utils/contract.util';
import { FilesService } from '../files/files.service';
import { UserService } from '../user/user.service';
import { createHashName } from '../../utils/crypt.util';
import { CarRepository } from './car.repository';
import { ICarPrototypeDto } from './interfaces/car-prototype.dto';
import { ICar, ICarFeaturesDto } from './interfaces/car.dto';
import { IMarkDto } from './interfaces/mark.dto';
import { IModelDto } from './interfaces/model.dto';
import { IUploadFileDto } from './interfaces/upload-file.dto';
import { OfferService } from '../offer/offer.service';
import { OfferRepository } from '../offer/offer.repository';
import { OfferSerializer } from '../offer/offer.serializer';

export class CarService {
  userService = new UserService();
  filesService = new FilesService();
  carRepository = new CarRepository();
  offerRepository = new OfferRepository();
  offerSerializer = new OfferSerializer();

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
      date_created: new Date(),
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


  updateOwner = (ownerId:number, carId: string)=>{
    this.carRepository.updateOwner(carId, ownerId)
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
    return await this.serializePrototype(await this.carRepository.getPrototype(carPrototype.id));
  }

  async deletePrototype(id: string | number) {
    await this.carRepository.deletePrototype(id);
  }

  async findPrototypeOnCreation(json: string, ownerAddr: string) {
    return await this.carRepository.getPrototypeOnCreation(json, ownerAddr);
  }

  async createItemFromEvent(eventValue: ITokenMintedEvent) {
    let carPrototype = await this.findPrototypeOnCreation(hexToUtf8(eventValue.url), eventValue.ownerAddr);
    this.createCar(carPrototype, eventValue.dataAddr);
  }

  async createCar(carPrototype: ICarPrototype, address: string) {
    const files = await this.carRepository.getFilesPrototype(carPrototype.id);
    const carId = await this.carRepository.createCar(carPrototype, address);
    Promise.all(
      files.map(async file => {
        await this.carRepository.addFile(file.path, carId);
      })
    );
    const car = await this.carRepository.getCar(carId);
    this.deletePrototype(carPrototype.id);
  }

  async getMarkByName(name: string) {
    return await this.serializeMark(await this.carRepository.getMarkByName(name));
  }

  async getModelByName(name: string, markId: string) {
    return await this.serializeModel(await this.carRepository.getModelByName(name, markId));
  }

  async findCar(id: number) {
    return await this.serializeCar(await this.carRepository.getCar(id));
  }

  async findCarByAddress(address: string) {
    return await this.serializeCar(await this.carRepository.getCarByAddress(address));
  }

  async getOffers() {
    const cars = await this.carRepository.getOffers();
    return await Promise.all(
      cars.map(async car => {
        return await this.serializeCar(car);
      })
    );
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
        const files = this.filesService.getPrototypeFiles(prototype.id);
        return {
          id: prototype.id,
          carFeatures: await this.serializeFeatures(await this.carRepository.getCarFeatures(prototype.car_features_id)),
          description: prototype.description,
          owner: owner,
          json: prototype.json,
          jsonHash: prototype.json_hash,
          files: await this.filesService.getPrototypeFiles(prototype.id),
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
        id: features.id,
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

  async serializeCar(car: ICarAd): Promise<ICar | null> {
    const owner = await this.userService.getUserById(car.owner_id);
    const status_id = await this.carRepository.getStatusId('opened')
    const offer = await this.offerRepository.findActiveByCarId(car.id, status_id);
    console.log(car.id)
    console.log(offer)
    if (owner) {
      return {
        id: car.id,
        carFeatures: await this.serializeFeatures(await this.carRepository.getCarFeatures(car.car_features_id)),
        address: car.address,
        description: car.description,
        owner: owner,
        json: car.json,
        jsonHash: car.json_hash,
        dateCreated: car.date_created,
        files: await this.filesService.getFiles(car.id),
        offer: offer ? await this.offerSerializer.serializeOffer(offer) : undefined,
      };
    }
    return null;
  }
}
