import DraftException from './DraftException';

export default class OutOfOrderException extends DraftException {
  constructor() {
    super('OutOfOrderException', 409, 'Attempted action is out of order');
  }
}
