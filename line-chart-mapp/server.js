#!/usr/bin/env node
// Simple MQTT -> WebSocket bridge for the line-chart
// Usage: set BROKER (e.g. mqtt://test.mosquitto.org) and TOPIC (e.g. test/linechart)

const mqtt = require('mqtt');
const WebSocket = require('ws');

const BROKER = process.env.BROKER || 'mqtt://test.mosquitto.org';
const TOPIC = process.env.TOPIC || 'test/linechart';
const WS_PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 8080;

// Data structure: days Mon-Fri mapped to arrays of 24 values (0/1/2 or null)
const days = ['Mon','Tue','Wed','Thu','Fri'];
const store = {};
for (const d of days) store[d] = Array(24).fill(null);

function parseLevel(level){
  if (level === null || level === undefined) return null;
  if (typeof level === 'number'){
    if (level < 0.33) return 0;
    if (level < 0.66) return 1;
    return 2;
  }
  const s = String(level).toLowerCase();
  if (['low','låg','lag','0'].includes(s)) return 0;
  if (['med','medel','medium','1'].includes(s)) return 1;
  if (['high','hög','hog','2'].includes(s)) return 2;
  const v = parseFloat(s);
  if (!isNaN(v)) return parseLevel(v);
  return null;
}

function normalizeDay(d){
  if (!d) return null;
  const s = String(d).toLowerCase();
  if (['mon','monday','mån','måndag','månd'].includes(s)) return 'Mon';
  if (['tue','tuesday','tis','tisdag'].includes(s)) return 'Tue';
  if (['wed','wednesday','ons','onsdag'].includes(s)) return 'Wed';
  if (['thu','thursday','tor','torsdag'].includes(s)) return 'Thu';
  if (['fri','friday','fre','fredag'].includes(s)) return 'Fri';
  // also accept numeric weekday (1=Mon..5=Fri)
  const n = Number(s);
  if (!isNaN(n) && n>=1 && n<=5) return days[n-1];
  return null;
}

// Broadcast helper
const wss = new WebSocket.Server({ port: WS_PORT });
function broadcast(obj){
  const msg = JSON.stringify(obj);
  for (const client of wss.clients){
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  }
}

wss.on('connection', (ws)=>{
  // Send full store to new clients
  ws.send(JSON.stringify({type:'full', store}));
});

console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);

// MQTT client
const client = mqtt.connect(BROKER);
client.on('connect', ()=>{
  console.log('Connected to MQTT broker', BROKER, 'subscribing to', TOPIC);
  client.subscribe(TOPIC, (err)=>{ if (err) console.error('Subscribe error', err); });
});

client.on('message', (topic, payload)=>{
  let s = payload.toString();
  try {
    // Try JSON
    if (s.trim().startsWith('{')){
      const obj = JSON.parse(s);
      // if full day array provided
      if (obj.day && Array.isArray(obj.values) && obj.values.length===24){
        const d = normalizeDay(obj.day);
        if (d){
          store[d] = obj.values.map(v=>parseLevel(v));
          broadcast({type:'update-day', day:d, values:store[d]});
          return;
        }
      }
      // single value update
      const hour = obj.hour ?? obj.h;
      const day = normalizeDay(obj.day) ?? null;
      if (hour!==undefined){
        const idx = obj.level!==undefined ? parseLevel(obj.level) : (obj.probability!==undefined?parseLevel(obj.probability):null);
        if (idx!==null){
          if (day){ store[day][Number(hour)]=idx; broadcast({type:'point', day, hour:Number(hour), level:idx}); }
          else { // if no day specified, apply to all weekdays
            for (const d of days){ store[d][Number(hour)]=idx; }
            broadcast({type:'point-all', hour:Number(hour), level:idx});
          }
          return;
        }
      }
    }
    // Plain formats: "14:High" or "Mon:14:High" or "Mon,14,0.7"
    const parts = s.split(/[,:;|]+/).map(p=>p.trim());
    if (parts.length>=2){
      let day = normalizeDay(parts[0]);
      let hourIdx = 1;
      if (!day){ day = null; hourIdx = 0; }
      const hour = Number(parts[hourIdx]);
      const val = parts[hourIdx+1];
      const lvl = parseLevel(val);
      if (!isNaN(hour) && lvl!==null){
        if (day){ store[day][hour]=lvl; broadcast({type:'point', day, hour, level:lvl}); }
        else { for (const d of days) store[d][hour]=lvl; broadcast({type:'point-all', hour, level:lvl}); }
      }
    }
  } catch(e){
    console.warn('Failed to handle message:', s, e);
  }
});

console.log('Ready to receive MQTT messages.');

// optional simulation for local testing
if (process.env.SIMULATE){
  console.log('SIMULATE enabled: populating store with random values');
  for (const d of days){
    store[d] = Array.from({length:24}, ()=>{
      const r = Math.random();
      if (r < 0.33) return 0; if (r < 0.66) return 1; return 2;
    });
    broadcast({type:'update-day', day:d, values:store[d]});
  }
}
