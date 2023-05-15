import { Router } from 'express';
import { errorHandler } from '../../utils/error.utils';
import { CarService } from './car.service';
import { ContractsService } from '../contracts/contracts.service';
import passport, { use } from 'passport';
import { IUser } from '../../models/user.model';
import { upload } from '../../midleware/multer';

export const CarController = Router();

const contractsService = new ContractsService();
const carService = new CarService(contractsService);

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

CarController.get('/models', async (req, res) => {
  try {
    const mark = req.query.mark;
    if (mark) {
      const result = await carService.getModels(mark as string);
      return res.status(200).json(result);
    } else throw new Error();
  } catch (e) {
    errorHandler(e, res);
  }
});

CarController.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = req.user;
    const prot = req.body.prototype;
    if (user) {
      const result = await carService.createCarPrototype(prot, user as IUser);
      return res.status(200).json(result);
    } else {
      errorHandler({ code: 401 }, res);
    }
  } catch (e) {
    errorHandler(e, res);
  }
});

CarController.post(
  '/upload',
  [upload.array('files'), passport.authenticate('jwt', { session: false })],
  async (req, res) => {
    try {
      const result = await carService.uploadCarPrototypeFiles(req.files, req.body);
      return res.status(200).json(result);
    } catch (e) {
      errorHandler(e, res);
    }
  }
);
