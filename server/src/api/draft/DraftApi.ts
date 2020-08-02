import DraftManager from './DraftManager';
import { DraftEvents } from './types';
import DraftNotFoundException from '../../exceptions/draftExceptions/DraftNotFoundException';

export default class DraftApi {
  private drafts: { [id: string]: DraftManager };

  public createDraft(blueName: string, redName: string) {
    const draft = new DraftManager(blueName, redName);
    this.drafts[draft.draftId] = draft;
  }

  public pick(draftId: string, champion: string, blue: boolean) {
    const draft = this.getDraft(draftId);
    draft.eventManager.emit(DraftEvents.PICK_ATTEMPT, { champion, blue });
  }

  public ban(draftId: string, champion: string, blue: boolean) {
    const draft = this.getDraft(draftId);
    draft.eventManager.emit(DraftEvents.BAN_ATTEMPT, { champion, blue });
  }

  public draftToJson(draftId: string) {
    const draft = this.getDraft(draftId);
    return draft.toJson();
  }

  private getDraft(draftId: string) {
    if (this.drafts[draftId]) return this.drafts[draftId];
    throw new DraftNotFoundException(draftId);
  }
}
