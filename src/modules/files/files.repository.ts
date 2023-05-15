import { AbstractRepository } from "../../db/abstract.repository";


export class FilesRepository extends AbstractRepository{

    async saveFilePrototype(car_prototype_id: number, path: string){
        await this.insertAndGetID('file_prot', {car_prototype_id, path})
    }
}