import DraftManager from './DraftManager';
import { DraftEvents } from './types';
import DraftNotFoundException from '../../exceptions/draftExceptions/DraftNotFoundException';
import Draft from './Draft';

export default class DraftApi {
  private drafts: { [id: string]: DraftManager };

  constructor() {
    this.drafts = {};
  }

  public createDraft(blueName: string, redName: string) {
    const draft = new DraftManager(blueName, redName);
    this.drafts[draft.draftId] = draft;
    return draft.draftId;
  }

  public startDraft(draftId: string) {
    const draft = this.getDraft(draftId);
    draft.begin();
  }

  public async pick(draftId: string, champion: string, blue: boolean) {
    return this.eventCallback(draftId, champion, blue, 'PICK');
  }

  public async ban(draftId: string, champion: string, blue: boolean) {
    return this.eventCallback(draftId, champion, blue, 'BAN');
  }

  public draftToJson(draftId: string) {
    const draft = this.getDraft(draftId);
    return draft.toJson();
  }

  public getEventEmitter(draftId: string) {
    const draft = this.getDraft(draftId);
    return draft.toJson();
  }

  private getDraft(draftId: string) {
    if (this.drafts[draftId]) return this.drafts[draftId];
    throw new DraftNotFoundException(draftId);
  }

  private eventCallback(draftId: string, champion: string, blue: boolean, eventPrefix: string) {
    return new Promise<void>((resolve, reject) => {
      const acceptEvent = DraftEvents[`${eventPrefix}_ACCEPT`];
      const declineEvent = DraftEvents[`${eventPrefix}_DECLINE`];
      const attemptEvent = DraftEvents[`${eventPrefix}_ATTEMPT`];
      const draft = this.getDraft(draftId);
      let off: () => void;
      const accept = (payload, eventDraft: Draft) => {
        if (eventDraft.id !== draftId) return;
        off();
        resolve();
      };
      const deny = (payload: { reason: Error }, eventDraft: Draft) => {
        if (eventDraft.id !== draftId) return;
        off();
        reject(payload.reason);
      };
      off = () => {
        draft.eventManager
          .off(acceptEvent, accept)
          .off(declineEvent, deny);
      };
      draft.eventManager
        .on(<any>acceptEvent, accept)
        .on(<any>declineEvent, deny)
        .emit(<any>attemptEvent, { champion, blue });
    });
  }
}
