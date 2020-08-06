export enum DraftEvents {
  DRAFT_START = 'DRAFT_START',
  BAN1_START = 'BAN1_START',
  BAN_ATTEMPT = 'BAN_ATTEMPT',
  BAN_ACCEPT = 'BAN_ACCEPT',
  BAN_DECLINE = 'BAN_DECLINE',
  PICK1_START = 'PICK1_START',
  PICK_ATTEMPT = 'PICK_ATTEMPT',
  PICK_ACCEPT = 'PICK_ACCEPT',
  PICK_DECLINE = 'PICK_DECLINE',
  BAN2_START = 'BAN2_START',
  PICK2_START = 'PICK2_START',
  DRAFT_END = 'DRAFT_END',
  DRAFT_FAILURE = 'DRAFT_FAILURE',
}

interface BasePayload { }

export interface DraftStartPayload extends BasePayload { }
export interface Ban1StartPayload extends BasePayload { }
export interface ChampSelectionPayload extends BasePayload {
  champion: string;
  blue: boolean;
}
export interface DeclinePayload extends ChampSelectionPayload {
  reason: Error;
}
export interface Pick1StartPayload extends BasePayload { }
export interface Ban2StartPayload extends BasePayload { }
export interface Pick2StartPayload extends BasePayload { }
export interface DraftEndPayload extends BasePayload { }
