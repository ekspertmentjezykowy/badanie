const express = require('express');
const cookieParser = require('cookie-parser');
const { db, doc, getDoc, updateDoc, setDoc } = require('./firebase');

const app = express();
app.use(cookieParser());

const forms = [
  'https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vhUzz6U0EsNHlyUYUFUOUP1UQUtHS0FURVZTRU1OMVA3VzNaNjdEM1VNUy4u',
  'https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vjMfXirSG-RKtmxr434eEEFUNDFVSEJFTUw3WkxKMjlTTjVSUDVLU0VOWC4u',
  'https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vhUzz6U0EsNHlyUYUFUOUP1UODk1TE5OVTdTVEdYUTRMN1ZJOExBREZFWS4u',
  'https://forms.office.com/Pages/ResponsePage.aspx?id=UJdqtbZoL0qmXCbF96J7vgeyG_p5pVxOjvYFHZJY8yJUQzJZUEVEMjhVRUI5SVNYSkUzVFFPUlVaUS4u'
];

async function getCounters() {
  const ref = doc(db, 'counters', 'formCounts');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { counts: [0, 0, 0, 0] });
    return [0, 0, 0, 0];
  }
  return snap.data().counts;
}

async function updateCounters(index) {
  const ref = doc(db, 'counters', 'formCounts');
  const snap = await getDoc(ref);
  const counts = snap.data().counts;
  counts[index]++;
  await updateDoc(ref, { counts });
}

app.get('/', async (req, res) => {
  if (req.cookies.formIndex) {
    return res.redirect(forms[parseInt(req.cookies.formIndex)]);
  }

  const counts = await getCounters();
  const min = Math.min(...counts);
  const index = counts.indexOf(min);

  res.cookie('formIndex', index, { maxAge: 365 * 24 * 60 * 60 * 1000 });
  await updateCounters(index);

  return res.redirect(forms[index]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
