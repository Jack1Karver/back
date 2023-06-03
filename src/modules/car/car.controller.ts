import { Router } from 'express';
import { errorHandler } from '../../utils/error.utils';
import { CarService } from './car.service';
import { ContractsService } from '../contracts/contracts.service';
import passport, { use } from 'passport';
import { IUser } from '../../models/user.model';
import { upload } from '../../midleware/multer';
import { CarSubscriber } from './car.subscriber';


export const CarController = Router();

const contractsService = new ContractsService();
const carService = new CarService();

const contractsSubscriber = new CarSubscriber(contractsService);
contractsSubscriber.onModuleInit();

CarController.get('/popular', async (req, res) => {
  try {
    const result = await carService.getPopularMarks();
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

CarController.get('/marks', async (req, res) => {
  try {
    const result = await carService.getMarks();
    return res.status(200).json(result);
  } catch (e) {
    errorHandler(e, res);
  }
});

CarController.get('/mark', async (req, res) => {
  const name = req.query.name as string;
  try {
    const result = await carService.getMarkByName(name);
    return res.status(200).json(result);
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


CarController.get('/offers', async (req, res) => {
  try {   
    const result = await carService.getOffers();
    return res.status(200).json(result);
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

CarController.delete('/delete', async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      await carService.deletePrototype(id as string);
    }
    return res.status(200);
  } catch (e) {
    errorHandler(e, res);
  }
});



CarController.get('/model', async (req, res) => {
  try {
    const name = req.query.name as string;
    const markId = req.query.markId as string;
    const result = carService.getModelByName(name, markId);
    return res.status(200).json(result);
  } catch (e) {
    errorHandler(e, res);
  }
});

CarController.get('/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const result = await carService.findCarByAddress(address);
    return res.status(200).json(result);
  } catch (e) {
    errorHandler(e, res);
    console.log(e)
  }
});
