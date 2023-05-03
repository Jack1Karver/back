import { Router } from 'express';
import { errorHandler } from '../../utils/error.utils';
import { CarService } from './car.service';

export const CarController = Router();

const carService = new CarService();

CarController.get('/popular', async (req, res) => {
  try {
    const result = await carService.getPopular();
    return res.status(200).json(result);
  } catch (e) {
    errorHandler(e, res);
  }
});
