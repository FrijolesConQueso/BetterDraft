import { v4 as uuid } from 'uuid';
import Team from './Team';
import ChampionNotAvailableException from '../../exceptions/draftExceptions/ChampionNotAvailableException';

export default class Draft {
  private draftId: string;
  private blueTeam: Team;
  private redTeam: Team;
  private usedChamps: Set<string>;

  constructor(blueName: string, redName: string) {
    this.draftId = uuid();
    this.blueTeam = new Team(blueName);
    this.redTeam = new Team(redName);
    this.usedChamps = new Set();
  }

  public get id() {
    return this.draftId;
  }

  public pick(blue: boolean, champion: string) {
    if (this.usedChamps.has(champion)) throw new ChampionNotAvailableException(champion);
    if (blue) this.blueTeam.pick(champion);
    else this.redTeam.pick(champion);
    this.usedChamps.add(champion);
  }

  public ban(blue: boolean, champion: string) {
    if (this.usedChamps.has(champion)) throw new ChampionNotAvailableException(champion);
    if (blue) this.blueTeam.ban(champion);
    else this.redTeam.ban(champion);
    this.usedChamps.add(champion);
  }

  public toJson() {
    return {
      id: this.draftId,
      teams: {
        blue: this.blueTeam.toJson(),
        red: this.redTeam.toJson(),
      },
    };
  }
}
