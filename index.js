const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const links = [
  "https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vgeyG_p5pVxOjvYFHZJY8yJUQzJZUEVEMjhVRUI5SVNYSkUzVFFPUlVaUS4u",
  "https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vhUzz6U0EsNHlyUYUFUOUP1UODk1TE5OVTdTVEdYUTRMN1ZJOExBREZFWS4u"
];

const counterFile = path.join(__dirname, "counter.json");

app.use(cookieParser());

app.get("/", (req, res) => {
  let index;

  // Jeśli ciasteczko już istnieje — użyj tego samego linku
  if (req.cookies.redirectIndex !== undefined) {
    index = parseInt(req.cookies.redirectIndex);
    res.redirect(links[index]);
    return;
  }

  // Pobierz dane z pliku counter.json
  let counts = JSON.parse(fs.readFileSync(counterFile));

  // Znajdź indeks z najmniejszą liczbą przydzielonych osób
  index = counts.indexOf(Math.min(...counts));

  // Zaktualizuj licznik
  counts[index]++;
  fs.writeFileSync(counterFile, JSON.stringify(counts));

  // Ustaw ciasteczko na 1 rok
  res.cookie("redirectIndex", index, { maxAge: 365 * 24 * 60 * 60 * 1000 });
  
  // Przekieruj
  res.redirect(links[index]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
