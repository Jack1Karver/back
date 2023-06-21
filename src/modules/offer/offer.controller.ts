import { Router } from "express";
import { ContractsService } from "../contracts/contracts.service";
import { OfferService } from "./offer.service";
import { OfferSubscriber } from "./offer.subscriber";
import { CarService } from "../car/car.service";
import { errorHandler } from "../../utils/error.utils";

const contractsService = new ContractsService
const offerService = new OfferService
const carService = new CarService
export const OfferController = Router()
const offerSubscriber = new OfferSubscriber(contractsService, offerService, carService);
offerSubscriber.onModuleInit()

