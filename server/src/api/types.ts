import Exception from '../exceptions/Exception';

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
}

export type DraftStartPayload = {};
export type Ban1StartPayload = {};
export type BanAttemptPayload = {
  champion: string;
  blue: boolean;
};
export type BanAcceptPayload = {};
export type BanDeclinePayload = {
  champion: string;
  blue: boolean;
  reason: Exception;
};
export type Pick1StartPayload = {};
export type PickAttemptPayload = {};
export type PickAcceptPayload = {};
export type PickDeclinePayload = {};
export type Ban2StartPayload = {};
export type Pick2StartPayload = {};
export type DraftEndPayload = {};
