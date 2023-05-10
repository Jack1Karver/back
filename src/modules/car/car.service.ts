import { IMark } from "../../models/mark.model"
import { IModel } from "../../models/model.model"
import { CarRepository } from "./car.repository"
import { IMarkDto } from "./interfaces/mark.interface"
import { IModelDto } from "./interfaces/model.interface"


export class CarService {
    carRepository = new CarRepository

    async getPopularMarks(){
        try{
            const marks =  await this.carRepository.getPopularMarks();
            return Promise.all(marks.map(mark=>{
                return this.serializeMark(mark)
            }))
        } catch(e){
            throw new Error
        }
    }

    async getMarks(){
        const marks = [...await this.carRepository.getPopularMarks(), ...await this.carRepository.getUnpopularMarks()]
        return Promise.all(marks.map(mark=>{
            return this.serializeMark(mark)
        }))
    }

    async getModels(mark: string){
        const markId = (await this.carRepository.getMarkByName(mark)).id
        return (await this.carRepository.getModels(markId))
    }
    
    async serializeMark(mark: IMark): Promise<IMarkDto>{
        return{
            id: mark.id,
            name: mark.name,
            popular: mark.popular,
            country: await this.getCountryById(mark.country_id)
        }
    }

    async getCountryById(country_id: number){
        return (await this.carRepository.getCountryById(country_id))
    }
}