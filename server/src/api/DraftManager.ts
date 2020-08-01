import DraftEventManager from './DraftEvents';
import Draft from './Draft';
import ChampionNotAvailableException from '../exceptions/draftExceptions/ChampionNotAvailableException';
import OutOfOrderException from '../exceptions/draftExceptions/OutOfOrderException';
import { DraftEvents } from './types';
import Exception from '../exceptions/Exception';

export enum Action {
  BAN,
  PICK,
}

type Request = {
  action: Action,
  blue: boolean,
  payload: any,
};

export default class DraftManager {
  private draft: Draft;
  private eventManager: DraftEventManager;
  private draftStack: Request[];

  constructor(redName: string, blueName: string) {
    this.draft = new Draft(redName, blueName);
    this.eventManager = new DraftEventManager(this.draft);
    this.draftStack = [];
  }

  public async run() {
    const generator = this.execute();
    while (!generator.next().done) {
      while (this.draftStack.length > 0) {
        const event = this.draftStack.shift();
        if (event.action === Action.BAN) {

        }
      }
    }
  }

  public execute = function* execute() {
    this.eventManager.emit(DraftEvents.DRAFT_START, {});
    this.eventManager.emit(DraftEvents.BAN1_START, {});
    this.draftStack.push(
      { action: Action.BAN, blue: true, payload: null }, // ban blue
      { action: Action.BAN, blue: false, payload: null }, // ban red
      { action: Action.BAN, blue: true, payload: null }, // ban blue
      { action: Action.BAN, blue: false, payload: null }, // ban red
      { action: Action.BAN, blue: true, payload: null }, // ban blue
      { action: Action.BAN, blue: false, payload: null }, // ban red
    );
    yield; // wait for stack empty
    this.eventManager.emit(DraftEvents.PICK1_START, {});
    this.draftStack.push(
      { action: Action.PICK, blue: true, payload: null }, // pick blue
      { action: Action.PICK, blue: false, payload: null }, // pick red
      { action: Action.PICK, blue: false, payload: null }, // pick red
      { action: Action.PICK, blue: true, payload: null }, // pick blue
      { action: Action.PICK, blue: true, payload: null }, // pick blue
      { action: Action.PICK, blue: false, payload: null }, // pick red
    );
    yield; // wait for stack empty
    this.eventManager.emit(DraftEvents.BAN2_START, {});
    this.draftStack.push(
      { action: Action.BAN, blue: false, payload: null }, // ban red
      { action: Action.BAN, blue: true, payload: null }, // ban blue
      { action: Action.BAN, blue: false, payload: null }, // ban red
      { action: Action.BAN, blue: true, payload: null }, // ban blue
    );
    yield; // wait for stack empty
    this.eventManager.emit(DraftEvents.PICK2_START, {});
    this.draftStack.push(
      { action: Action.PICK, blue: false, payload: null }, // pick red
      { action: Action.PICK, blue: true, payload: null }, // pick blue
      { action: Action.PICK, blue: true, payload: null }, // pick blue
      { action: Action.PICK, blue: false, payload: null }, // pick red
    );
    yield; // wait for stack empty
    this.eventManager.emit(DraftEvents.DRAFT_END, {});
  };

  // public pick(blue: boolean, champion: string) {

  // }

  public ban(blue: boolean) {
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
        // this.eventManager.emit(DraftEvents.)
      } catch (err) {
        if (err instanceof Exception) {
          this.eventManager.emit(DraftEvents.BAN_DECLINE, { ...payload, reason: err });
        } else {
          throw err;
        }
      }
    });
  }
}
