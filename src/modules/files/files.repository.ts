import { AbstractRepository } from "../../db/abstract.repository";
import { IFile } from "../../models/file.model";


export class FilesRepository extends AbstractRepository{

    async saveFilePrototype(car_prototype_id: number, path: string){
        await this.insertAndGetID('file_prot', {car_prototype_id, path})
    }

    async getPrototypeFiles(id: number):Promise<IFile[]>{
        return (await this.getByFields('file_prot', {car_prototype_id: id}))
    }

    async getFiles(id: string):Promise<IFile[]>{
        return (await this.getByFields('file', {car_ad_id: id}))
    }
}