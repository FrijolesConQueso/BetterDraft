import { EventEmitter } from 'events';
import Draft from './Draft';
import {
  DraftEvents, DraftStartPayload, Ban1StartPayload,
  Ban2StartPayload, BanAcceptPayload, Pick1StartPayload,
  Pick2StartPayload, PickAcceptPayload, DraftEndPayload,
  BanAttemptPayload, BanDeclinePayload, PickAttemptPayload,
  PickDeclinePayload,
} from './types';

export default class DraftEventManager extends EventEmitter {
  private draft: Draft;

  constructor(draft: Draft) {
    super();
    this.draft = draft;
  }

  public on(event: DraftEvents.DRAFT_START, listener: (payload: DraftStartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.BAN1_START, listener: (payload: Ban1StartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.BAN2_START, listener: (payload: Ban2StartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.BAN_ATTEMPT, listener: (payload: BanAttemptPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.BAN_ACCEPT, listener: (payload: BanAcceptPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.BAN_DECLINE, listener: (payload: BanDeclinePayload, draft: Draft) => void): this;
  public on(event: DraftEvents.PICK1_START, listener: (payload: Pick1StartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.PICK2_START, listener: (payload: Pick2StartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.PICK_ATTEMPT, listener: (payload: PickAttemptPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.PICK_ACCEPT, listener: (payload: PickAcceptPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.PICK_DECLINE, listener: (payload: PickDeclinePayload, draft: Draft) => void): this;
  public on(event: DraftEvents.DRAFT_END, listener: (payload: DraftEndPayload, draft: Draft) => void): this;
  public on(event: DraftEvents, listener: (payload: any, draft: Draft) => void) {
    return super.on(event, listener);
  }

  public emit(event: DraftEvents.DRAFT_START, payload: DraftStartPayload): boolean;
  public emit(event: DraftEvents.BAN1_START, payload: Ban1StartPayload): boolean;
  public emit(event: DraftEvents.BAN2_START, payload: Ban2StartPayload): boolean;
  public emit(event: DraftEvents.BAN_ATTEMPT, payload: BanAttemptPayload): boolean;
  public emit(event: DraftEvents.BAN_ACCEPT, payload: BanAcceptPayload): boolean;
  public emit(event: DraftEvents.BAN_DECLINE, payload: BanDeclinePayload): boolean;
  public emit(event: DraftEvents.PICK1_START, payload: Pick1StartPayload): boolean;
  public emit(event: DraftEvents.PICK2_START, payload: Pick2StartPayload): boolean;
  public emit(event: DraftEvents.PICK_ATTEMPT, payload: PickAttemptPayload): boolean;
  public emit(event: DraftEvents.PICK_ACCEPT, payload: PickAcceptPayload): boolean;
  public emit(event: DraftEvents.PICK_DECLINE, paylaod: PickDeclinePayload): boolean;
  public emit(event: DraftEvents.DRAFT_END, payload: DraftEndPayload): boolean;
  public emit(event: DraftEvents, payload: any) {
    return super.emit(event, payload, this.draft);
  }
}
