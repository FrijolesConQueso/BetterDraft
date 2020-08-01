import DraftException from './DraftException';

export default class ChampionNotAvailableException extends DraftException {
  public readonly champion: string;

  constructor(champion: string) {
    super('ChampionNotAvailableException', 409, `${champion} is not available for use`);
    this.champion = champion;
  }
}
