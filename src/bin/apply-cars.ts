import { Connection } from '../db/connection';
import fs from 'node:fs';

const connection = new Connection();

interface Cars {
  id: string;
  name: string;
  popular: boolean;
  country: string;
  models: Car[];
}

interface Car {
  id: string;
  name: string;
  class: string;
  year_from: number;
  year_to: number;
}

const applyCars = () => {
  const file = JSON.parse(
    fs.readFileSync('src/resources/cars.json', {
      encoding: 'utf-8',
    })
  ); 
  file.map(() => {});
};

applyCars();
