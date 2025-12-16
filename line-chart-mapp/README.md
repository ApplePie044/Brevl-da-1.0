# Line Chart MQTT Bridge

This project provides:
- `server.js`: a Node.js MQTT -> WebSocket bridge that subscribes to an MQTT topic and broadcasts updates to connected clients.
- `index.html`: a minimal chart showing 24 hours (x-axis) and three categorical probability levels on y-axis (Låg/Medel/Hög). Choose a weekday (Mån–Fre) to view the day's data.

Quick start:

1. Install dependencies:

```bash
npm install
```

2. Run the bridge (set `BROKER` and `TOPIC` env vars if needed):

```bash
BROKER=mqtt://test.mosquitto.org TOPIC=test/linechart npm start
```

- For quick local testing you can also pre-fill the weekdays with random values using `SIMULATE=true`:

```bash
SIMULATE=true npm start
```

3. Open `index.html` in the browser (or your existing site that includes the chart). The page will connect to `ws://localhost:8080` and receive real-time updates.

Message formats accepted on the MQTT topic:

- Single point (JSON): `{"hour":14,"level":"High","day":"Mon"}` or `{"hour":14,"probability":0.85,"day":"Mon"}`
- Single point for all weekdays (no `day`): `{"hour":14,"level":"High"}` will apply to Mon–Fri
- Full day array (JSON): `{"day":"Tue","values":[null,0,1,2,...]}` where `values` is length 24
- Plaintext examples: `Mon:14:High`, `14:0.7` (applies to all weekdays), `Tue,10,High`

The WebSocket server sends messages to clients in the following shape:
- On connect: `{type:'full', store}` where `store` contains day arrays
- When a full day is replaced: `{type:'update-day', day:'Mon', values:[...]}`
- When a single point changes: `{type:'point', day:'Tue', hour:14, level:2}` or `{type:'point-all', hour:14, level:1}`

If you want, I can:
- Persist values to disk
- Add an optional HTTP endpoint for downloading CSVs
- Add authentication to the WebSocket
