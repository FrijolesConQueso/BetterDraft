import Exception from '../Exception';

export default class DraftException extends Exception {
  constructor(name: string, code: number, message: string) {
    super(name, code, 'DRAFT', message);
  }
}
