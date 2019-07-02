const express = require('express')
const mongo = require('./mongo');
const _ = require('lodash');

const app = express();

let db;

function getIP(req) {
  let ip = req.headers['x-forwarded-for']
        || req.connection.remoteAddress
        || req.socket.remoteAddress;
  // in some cases, x-forwarded for returns multiple ip addresses
  ip = ip.replace(new RegExp(' ', 'g'), '').split(',');
  if (ip.length > 1) {
    for (const val of ip) {
      // check for any ipv6 address
      if (val.indexOf(':') > -1) {
        ip = val;
        break;
      }
    }
  }
  // if no ipv6 address, use the last address.
  if (typeof ip !== 'string') ip = ip[ip.length - 1];
  return ip;
}

app.use('/', express.static('public'))

app.use('/', async (req, res, next) => {
  db = await mongo.checkDbConnection(db);
  next();
});

app.get('/entry', async (req, res)=> {
  const data = req.query;
  if(_.isEmpty(data.team)) return res.send('team get parameter shouldnt be empty');
  if(_.isEmpty(data.name)) return res.send('name get parameter shouldnt be empty');
  let ip = getIP(req);
  ip += 'asdf';
  if (data.team !== 'mayank' && data.team !== 'atul') return res.send('team should be atul or mayank');
  e = await db.collection('entries').findOne({ip});
  if (e) return res.send('ip already used');
  e2 = await db.collection('entries').findOne({name: data.name});
  if (e2) return res.send('name already recorded');
  await db.collection('entries').insertOne({name:data.name, team:data.team, ip});
  res.send('Your entry has been noted, your ip is: ' + ip);
})

app.get('/list', async (req, res)=> {
  vals = await db.collection('entries').find().toArray();
  const resp = {};
  for(const val of vals) {
    if(_.isNil(resp[val.team])) resp[val.team] = [];
    resp[val.team].push({name: val.name, ip: val.ip });
  }
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(resp));
})

app.listen(5000);