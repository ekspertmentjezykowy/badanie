const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;

const links = [
  'https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vhUzz6U0EsNHlyUYUFUOUP1UQUtHS0FURVZTRU1OMVA3VzNaNjdEM1VNUy4u',
  'https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vjMfXirSG-RKtmxr434eEEFUNDFVSEJFTUw3WkxKMjlTTjVSUDVLU0VOWC4u',
  'https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vgeyG_p5pVxOjvYFHZJY8yJUQzJZUEVEMjhVRUI5SVNYSkUzVFFPUlVaUS4u',
  'https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vhUzz6U0EsNHlyUYUFUOUP1UODk1TE5OVTdTVEdYUTRMN1ZJOExBREZFWS4u'
];

const COUNTER_FILE = 'counter.json';

app.use(cookieParser());

function getCounts() {
  if (!fs.existsSync(COUNTER_FILE)) {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify([0, 0, 0, 0]));
  }
  return JSON.parse(fs.readFileSync(COUNTER_FILE));
}

function saveCounts(counts) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(counts));
}

app.get('/', (req, res) => {
  if (req.cookies.redirectIndex !== undefined) {
    const index = parseInt(req.cookies.redirectIndex);
    return res.redirect(links[index]);
  }

  let counts = getCounts();
  const minCount = Math.min(...counts);
  const index = counts.findIndex(c => c === minCount);
  counts[index]++;
  saveCounts(counts);

  res.cookie('redirectIndex', index, { maxAge: 1000 * 60 * 60 * 24 * 30 });
  res.redirect(links[index]);
});

app.listen(port, () => {
  console.log(`Redirector running on port ${port}`);
});