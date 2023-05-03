import { CarRepository } from "./car.repository"


export class CarService {
    carRepository = new CarRepository

    async getPopular(){
        try{
            return await this.carRepository.getPopularMarks()
        } catch(e){
            throw new Error
        }
    }
}