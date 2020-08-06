import { EventEmitter } from 'events';
import Draft from './Draft';
import {
  DraftEvents, DraftStartPayload, Ban1StartPayload,
  Ban2StartPayload, Pick1StartPayload, Pick2StartPayload,
  DraftEndPayload, ChampSelectionPayload, DeclinePayload,
} from './types';
import CriticalFailure from '../../exceptions/CriticalFailure';

type AcceptAttempt = DraftEvents.BAN_ATTEMPT | DraftEvents.BAN_ACCEPT | DraftEvents.PICK_ATTEMPT | DraftEvents.PICK_ACCEPT;
type Decline = DraftEvents.BAN_DECLINE | DraftEvents.PICK_DECLINE;

export default class DraftEventManager extends EventEmitter {
  private draft: Draft;

  constructor(draft: Draft) {
    super();
    this.draft = draft;
  }

  public on(event: DraftEvents.DRAFT_START, listener: (payload: DraftStartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.BAN1_START, listener: (payload: Ban1StartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.BAN2_START, listener: (payload: Ban2StartPayload, draft: Draft) => void): this;
  public on(event: AcceptAttempt, listener: (payload: ChampSelectionPayload, draft: Draft) => void): this;
  public on(event: Decline, listener: (payload: DeclinePayload, draft: Draft) => void): this;
  public on(event: DraftEvents.PICK1_START, listener: (payload: Pick1StartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.PICK2_START, listener: (payload: Pick2StartPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.DRAFT_END, listener: (payload: DraftEndPayload, draft: Draft) => void): this;
  public on(event: DraftEvents.DRAFT_FAILURE, listener: (payload: { reason: CriticalFailure }, draft: Draft) => void): this;
  public on(event: DraftEvents, listener: (payload: any, draft: Draft) => void) {
    return super.on(event, listener);
  }

  public emit(event: DraftEvents.DRAFT_START, payload: DraftStartPayload): boolean;
  public emit(event: DraftEvents.BAN1_START, payload: Ban1StartPayload): boolean;
  public emit(event: DraftEvents.BAN2_START, payload: Ban2StartPayload): boolean;
  public emit(event: AcceptAttempt, payload: ChampSelectionPayload): boolean;
  public emit(event: Decline, payload: DeclinePayload): boolean;
  public emit(event: DraftEvents.PICK1_START, payload: Pick1StartPayload): boolean;
  public emit(event: DraftEvents.PICK2_START, payload: Pick2StartPayload): boolean;
  public emit(event: DraftEvents.DRAFT_END, payload: DraftEndPayload): boolean;
  public emit(event:DraftEvents.DRAFT_FAILURE, payload: { reason: CriticalFailure }): boolean;
  public emit(event: DraftEvents, payload: any) {
    return super.emit(event, payload, this.draft);
  }
}
