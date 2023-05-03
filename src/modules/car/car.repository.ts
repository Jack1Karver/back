import { AbstractRepository } from '../../db/abstract.repository';

export class CarRepository extends AbstractRepository {
  async getPopularMarks() {
    try {
      return await this.getByFields('mark', { popular: true });
    } catch (e) {
      throw new Error();
    }
  }
}
