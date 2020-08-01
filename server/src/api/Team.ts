export default class Team {
  private teamName: string;
  private bans: string[];
  private picks: string[];

  constructor(teamName: string) {
    this.teamName = teamName;
  }

  public get name() {
    return this.teamName;
  }

  public get pickCounter() {
    return this.picks.length;
  }

  public get banCounter() {
    return this.bans.length;
  }

  public pick(champion: string) {
    this.picks.push(champion);
  }

  public ban(champion: string) {
    this.bans.push(champion);
  }
}
