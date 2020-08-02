import DraftEventManager from './DraftEvents';
import Draft from './Draft';
import OutOfOrderException from '../exceptions/draftExceptions/OutOfOrderException';
import { DraftEvents } from './types';
import Exception from '../exceptions/Exception';

export enum ActionType {
  BAN,
  PICK,
}

type Action = {
  action: ActionType,
  blue: boolean,
};

export default class DraftManager {
  private draft: Draft;
  private draftStack: Action[];
  public readonly eventManager: DraftEventManager;

  constructor(blueName: string, redName: string) {
    this.draft = new Draft(blueName, redName);
    this.eventManager = new DraftEventManager(this.draft);
    this.draftStack = [];
  }

  public get draftId() {
    return this.draft.id;
  }

  public toJson() {
    return this.draft.toJson();
  }

  public async begin() {
    const generator = this.execute();
    while (!generator.next().done) {
      while (this.draftStack.length > 0) {
        const event = this.draftStack.shift();
        if (event.action === ActionType.BAN) {
          await this.ban(event.blue);
        } else if (event.action === ActionType.PICK) {
          await this.pick(event.blue);
        }
      }
    }
  }

  public execute = function* execute() {
    this.eventManager.emit(DraftEvents.DRAFT_START, {});
    this.eventManager.emit(DraftEvents.BAN1_START, {});
    this.draftStack.push(
      { action: ActionType.BAN, blue: true }, // ban blue
      { action: ActionType.BAN, blue: false }, // ban red
      { action: ActionType.BAN, blue: true }, // ban blue
      { action: ActionType.BAN, blue: false }, // ban red
      { action: ActionType.BAN, blue: true }, // ban blue
      { action: ActionType.BAN, blue: false }, // ban red
    );
    yield; // wait for stack empty
    this.eventManager.emit(DraftEvents.PICK1_START, {});
    this.draftStack.push(
      { action: ActionType.PICK, blue: true }, // pick blue
      { action: ActionType.PICK, blue: false }, // pick red
      { action: ActionType.PICK, blue: false }, // pick red
      { action: ActionType.PICK, blue: true }, // pick blue
      { action: ActionType.PICK, blue: true }, // pick blue
      { action: ActionType.PICK, blue: false }, // pick red
    );
    yield; // wait for stack empty
    this.eventManager.emit(DraftEvents.BAN2_START, {});
    this.draftStack.push(
      { action: ActionType.BAN, blue: false }, // ban red
      { action: ActionType.BAN, blue: true }, // ban blue
      { action: ActionType.BAN, blue: false }, // ban red
      { action: ActionType.BAN, blue: true }, // ban blue
    );
    yield; // wait for stack empty
    this.eventManager.emit(DraftEvents.PICK2_START, {});
    this.draftStack.push(
      { action: ActionType.PICK, blue: false }, // pick red
      { action: ActionType.PICK, blue: true }, // pick blue
      { action: ActionType.PICK, blue: true }, // pick blue
      { action: ActionType.PICK, blue: false }, // pick red
    );
    yield; // wait for stack empty
    this.eventManager.emit(DraftEvents.DRAFT_END, {});
  };

  private pick(blue: boolean) {
    return new Promise((resolve, reject) => {
      this.eventManager.on(DraftEvents.BAN_ATTEMPT, (payload) => {
        this.eventManager.emit(DraftEvents.BAN_DECLINE, { ...payload, reason: new OutOfOrderException() });
      });
      this.eventManager.on(DraftEvents.PICK_ATTEMPT, (payload) => {
        if (blue !== payload.blue) {
          this.eventManager.emit(DraftEvents.PICK_DECLINE, { ...payload, reason: new OutOfOrderException() });
        }
        try {
          this.draft.pick(blue, payload.champion);
          this.eventManager.emit(DraftEvents.PICK_ACCEPT, payload);
          resolve();
        } catch (err) {
          if (err instanceof Exception) {
            this.eventManager.emit(DraftEvents.PICK_DECLINE, { ...payload, reason: err });
          } else {
            reject(err);
          }
        }
      });
    });
  }

  private async ban(blue: boolean) {
    return new Promise((resolve, reject) => {
      this.eventManager.on(DraftEvents.PICK_ATTEMPT, (payload) => {
        this.eventManager.emit(DraftEvents.PICK_DECLINE, { ...payload, reason: new OutOfOrderException() });
      });
      this.eventManager.on(DraftEvents.BAN_ATTEMPT, (payload) => {
        if (blue !== payload.blue) {
          this.eventManager.emit(DraftEvents.BAN_DECLINE, { ...payload, reason: new OutOfOrderException() });
          return;
        }
        try {
          this.draft.ban(blue, payload.champion);
          this.eventManager.emit(DraftEvents.BAN_ACCEPT, payload);
          resolve();
        } catch (err) {
          if (err instanceof Exception) {
            this.eventManager.emit(DraftEvents.BAN_DECLINE, { ...payload, reason: err });
          } else {
            reject(err);
          }
        }
      });
    });
  }
}
