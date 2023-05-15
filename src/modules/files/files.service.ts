import { ICarPrototype } from '../../models/car-prototype.model';
import { FilesRepository } from './files.repository';
import { IFileProperties, ITip4ItemJson } from './interfaces/file-properties.interface';

export class FilesService {

    filesRepository = new FilesRepository()

  createTip4Json(
    carPrototype: ICarPrototype,
    files: Express.Multer.File[],
    meta: string,
    { itemAddress, withAttributes }: { itemAddress?: string; withAttributes?: boolean } = {}
  ): string {
    const metaArr: IFileProperties[] = JSON.parse(meta)
    const fileInfo = files.map((file, index) => {
      return {
        source: file.path,
        ...metaArr[index],
      };
    });

    const json: ITip4ItemJson = {
      type: 'Basic NFT',
      name: JSON.stringify(carPrototype.car_features_id),
      description: carPrototype.description,
      files: fileInfo,
      external_url: itemAddress ? `drivefy.com/item/${itemAddress}` : 'drivefy.com',
    };

    return JSON.stringify(json);
  }

  async saveFilePrototype(files: Express.Multer.File[], car_prototype_id: number){
    for (const file of files){
        await this.filesRepository.saveFilePrototype(car_prototype_id, file.path)
    }
  }
}
