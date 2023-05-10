import { Router } from 'express';
import { errorHandler } from '../../utils/error.utils';
import { CarService } from './car.service';

export const CarController = Router();

const carService = new CarService();

CarController.get('/popular', async (req, res) => {
  try {
    const result = await carService.getPopularMarks();
    return res.status(200).json(result);
  } catch (e) {
    errorHandler(e, res);
  }
});

CarController.get('/marks', async (req, res) => {
  try {
    const result = await carService.getMarks();
    return res.status(200).json(result);
  } catch (e) {
    errorHandler(e, res);
  }
});

CarController.get('/models', async (req, res)=>{
  try {
    const mark = req.query.mark
    if(mark){
    const result = await carService.getModels(mark as string);
    return res.status(200).json(result);
    } else throw new Error
  } catch (e) {
    errorHandler(e, res);
  }
})
