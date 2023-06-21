import moment from 'moment';

export function addOneDay(): moment.Moment {
  return moment().add(1, 'day');
}

export function add5Minutes(): moment.Moment {
  return moment().add(5, 'minutes');
}
