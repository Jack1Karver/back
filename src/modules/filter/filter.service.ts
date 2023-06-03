import { ICarAd } from '../../models/car-ad.model';
import { CarService } from '../car/car.service';
import { ICar } from '../car/interfaces/car.dto';
import { UserService } from '../user/user.service';
import { FilterRepository } from './filter.repository';
import { ICarFilter } from './interfaces/filter.interface';

export class FilterService {
  carService = new CarService();
  filterRepository = new FilterRepository();
  userService = new UserService();

  async getCarsByFilter(filter: ICarFilter) {

    let ownerId: number | null = null;
    let modelId: number | null = null;
    let markId: number | null = null;
    if (filter.owner) {
      ownerId = (await this.userService.getUserBySlug(filter.owner)).id;
    }
    if (filter.mark) {
      markId = (await this.carService.getMarkByName(filter.mark)).id;
      if (filter.model) {
        modelId = (await this.carService.getModelByName(filter.model, `${markId}`)).id;
      }
    }
    let cars: ICarAd[] = (await this.filterRepository.getCarsByFilter(
      {
        markId,
        modelId,
        ownerId,
        yearFrom: filter.year_from,
        year_to: filter.year_to,
      },
      filter.limit,
      filter.offset
    ))
     let carsSerialized: ICar[] = []
     for(let car of cars){
        const carSer = await this.carService.serializeCar(car)
        if(carSer){
            carsSerialized.push(carSer)
        }
     }
     const count = await this.filterRepository.getCarsCount({
      markId,
      modelId,
      ownerId,
      yearFrom: filter.year_from,
      year_to: filter.year_to,
    },)
    
    return {items: carsSerialized, count}
  }
  
}
