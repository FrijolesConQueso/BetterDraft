import * as express from 'express';
import ChampionsApi from '../api/riot/champions';

const app = express();
const port = 3000;
const championsApi = new ChampionsApi();

app.post('/', (req, res) => res.send('test'));
app.get('/champions', async (req, res) => {
  const champions = await championsApi.championsList();
  res.send(champions);
});

app.listen(port, () => console.log(`Sore kinda stinky at http://localhost:${port}`));
