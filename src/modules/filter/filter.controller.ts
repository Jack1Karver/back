import { Router } from 'express';
import { errorHandler } from '../../utils/error.utils';
import { FilterService } from './filter.service';
import { ICarFilter } from './interfaces/filter.interface';

export const FilterController = Router();

const filterService = new FilterService();

FilterController.get('/cars', async (req, res) => {
  try {
    const filter = req.query as ICarFilter;
    const result = await filterService.getCarsByFilter(filter);
    return res.status(200).json(result);
  } catch (e) {
    errorHandler(e, res);
  }
});
