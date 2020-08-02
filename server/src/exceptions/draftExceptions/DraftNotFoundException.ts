import DraftException from './DraftException';

export default class DraftNotFoundException extends DraftException {
  public readonly draftId: string;

  constructor(draftId: string) {
    super('DraftNotFound', 404, `Draft ${draftId} not found`);
    this.draftId = draftId;
  }
}
