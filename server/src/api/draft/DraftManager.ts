import DraftEventManager from './DraftEvents';
import Draft from './Draft';
import OutOfOrderException from '../../exceptions/draftExceptions/OutOfOrderException';
import { DraftEvents, ChampSelectionPayload } from './types';
import Exception from '../../exceptions/Exception';
import CriticalFailure from '../../exceptions/CriticalFailure';

export enum ActionType {
  BAN,
  PICK,
}

type Action = {
  action: ActionType,
  blue: boolean,
};

type TriEvents = {
  accept: DraftEvents.PICK_ACCEPT | DraftEvents.BAN_ACCEPT,
  decline: DraftEvents.PICK_DECLINE | DraftEvents.BAN_DECLINE,
  attempt: DraftEvents.PICK_ATTEMPT | DraftEvents.BAN_ATTEMPT;
};

const pickEvents: TriEvents = {
  accept: DraftEvents.PICK_ACCEPT,
  decline: DraftEvents.PICK_DECLINE,
  attempt: DraftEvents.PICK_ATTEMPT,
};

const banEvents: TriEvents = {
  accept: DraftEvents.BAN_ACCEPT,
  decline: DraftEvents.BAN_DECLINE,
  attempt: DraftEvents.BAN_ATTEMPT,
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
        try {
          if (event.action === ActionType.BAN) {
            await this.ban(event.blue);
          } else if (event.action === ActionType.PICK) {
            await this.pick(event.blue);
          }
        } catch (err) {
          let failure: CriticalFailure;
          if (err instanceof CriticalFailure) failure = err;
          else failure = new CriticalFailure(err);
          this.eventManager.emit(DraftEvents.DRAFT_FAILURE, { reason: failure });
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
    return this.eventListener(true, blue);
  }

  private async ban(blue: boolean) {
    return this.eventListener(false, blue);
  }

  private eventListener(picking: boolean, blue: boolean) {
    const [{ accept, decline, attempt }, { decline: oppDecline, attempt: oppAttempt }] = picking
      ? [pickEvents, banEvents] : [banEvents, pickEvents];
    return new Promise((resolve, reject) => {
      let off: () => void;
      const autoFail = (payload, draft: Draft) => {
        if (draft.id !== this.draftId) return;
        this.eventManager.emit(oppDecline, { ...payload, reason: new OutOfOrderException() });
      };
      const attemptFunc = (payload: ChampSelectionPayload, draft: Draft) => {
        if (draft.id !== this.draftId) return;
        if (blue !== payload.blue) {
          this.eventManager.emit(decline, { ...payload, reason: new OutOfOrderException() });
          return;
        }
        try {
          if (picking) this.draft.pick(blue, payload.champion);
          else this.draft.ban(blue, payload.champion);
          this.eventManager.emit(accept, payload);
          off();
          resolve();
        } catch (err) {
          if (err instanceof Exception) {
            this.eventManager.emit(decline, { ...payload, reason: err });
          } else {
            const failure = new CriticalFailure(err);
            this.eventManager.emit(decline, { ...payload, reason: failure });
            off();
            reject(failure);
          }
        }
      };
      off = () => {
        this.eventManager.off(oppAttempt, autoFail)
          .off(attempt, attemptFunc);
      };
      this.eventManager.on(oppAttempt, autoFail)
        .on(attempt, attemptFunc);
    });
  }
}
