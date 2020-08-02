import fetch from 'node-fetch';

export default class ChampionsApi {
  private versionUpdated: number = 0;
  private version: string;

  public async championsList() {
    const response = await fetch(
      `http://ddragon.leagueoflegends.com/cdn/${await this.getVersion()}/data/en_US/champion.json`,
    ).then(res => res.json());
    const champions: { [key: string]: any } = response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(champions).map(([key, value]) => ({
      id: value.id,
      key: value.key,
      name: value.name,
    }));
  }

  public async getVersion() {
    if (Date.now() - this.versionUpdated > 3600000) {
      const response = await fetch('https://ddragon.leagueoflegends.com/realms/na.json')
        .then(res => res.json());
      this.versionUpdated = Date.now();
      this.version = response.n.champion;
    }
    return this.version;
  }
}
