// Enkel data med exempel tider. Redigera vid behov.
const schedule = {
  "måndag": ["08:30","15:00"],
  "tisdag": ["08:30","15:00"],
  "onsdag": ["08:30","15:00"],
  "torsdag": ["08:30","15:00"],
  "fredag": ["08:30","15:00"],
  "lördag": ["10:00"],
  "söndag": []
};

const dayOrder = ["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"];

function getTodaySwedish(){
  const jsDay = new Date().getDay(); // 0 = Sunday
  return dayOrder[jsDay];
}

function renderTimes(day){
  const selectedDayEl = document.getElementById('selected-day');
  const timesList = document.getElementById('times-list');
  const note = document.getElementById('note');
  selectedDayEl.textContent = day[0].toUpperCase() + day.slice(1);
  timesList.innerHTML = '';
  const times = schedule[day] || [];
  if(times.length === 0){
    note.textContent = 'Ingen postleverans förväntas denna dag.';
    return;
  }

  note.textContent = '';

  // convert hex color to [r,g,b]
  function hexToRgb(hex){
    hex = (hex || '#0b5cff').trim().replace('#','');
    if(hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
    const n = parseInt(hex,16);
    return [(n>>16)&255, (n>>8)&255, n&255];
  }

  const accentRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--accent'));

  // create meter: integer-hour segments across 06:00 - 20:00 (peak centered on expected time)
  function createMeter(expectedTime){
    const [hh,mm] = expectedTime.split(':').map(n=>parseInt(n,10));
    const expected = (hh || 0) + ((mm || 0) / 60);
    const expectedHour = Math.floor(expected); // make the hour containing the expected time the peak
    const sigma = 1.6; // spread in hours (wider)

    const meter = document.createElement('div');
    meter.className = 'meter';

    const startHour = 6;
    const endHour = 20;

    let bestIndex = 0;
    let bestVal = -Infinity;

    for(let h=startHour; h<=endHour; h++){
      const seg = document.createElement('div');
      seg.className = 'meter-segment';
      // compute intensity based on difference to the expected hour (so the expected hour is strongest)
      const diff = h - expectedHour;
      const intensity = Math.exp(-(diff*diff)/(2*sigma*sigma)); // 0..1
      if(intensity > bestVal){ bestVal = intensity; bestIndex = h - startHour; }
      const alpha = 0.12 + intensity * 0.88; // min alpha 0.12 -> max 1
      seg.style.backgroundColor = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${alpha.toFixed(3)})`;
      // attach data for tooltip
      seg.dataset.time = `${String(h).padStart(2,'0')}:00`;
      seg.dataset.prob = String(Math.round(intensity * 100));
      // remove native title to avoid double tooltip
      seg.removeAttribute('title');
      meter.appendChild(seg);
    }

    // highlight the most likely hour (the expected hour)
    const children = meter.children;
    if(children && children[bestIndex]){
      children[bestIndex].style.boxShadow = `0 0 0 2px rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, 0.22)`;
    }

    // hour labels row
    const hoursRow = document.createElement('div');
    hoursRow.className = 'meter-hours';
    const leftLabel = document.createElement('span');
    leftLabel.textContent = `${startHour}:00`;
    const rightLabel = document.createElement('span');
    rightLabel.textContent = `${endHour}:00`;
    hoursRow.appendChild(leftLabel);
    hoursRow.appendChild(rightLabel);

    const wrap = document.createElement('div');
    wrap.appendChild(meter);
    wrap.appendChild(hoursRow);
    // attach tooltip handlers for this meter's segments
    attachSegmentTooltips(meter);
    return wrap;
  }

  // ensure single tooltip element exists
  function ensureTooltip(){
    let tip = document.getElementById('meter-tooltip');
    if(!tip){
      tip = document.createElement('div');
      tip.id = 'meter-tooltip';
      tip.className = 'meter-tooltip';
      document.body.appendChild(tip);
    }
    return tip;
  }

  // attach hover/move/leave handlers on segments to show custom tooltip
  function attachSegmentTooltips(meterEl){
    const tip = ensureTooltip();
    Array.from(meterEl.children).forEach(seg => {
      seg.addEventListener('mouseenter', (e)=>{
        const t = seg.dataset.time || '';
        const p = seg.dataset.prob ? seg.dataset.prob + '%' : '';
        tip.textContent = t + (p ? ' — ' + p : '');
        tip.classList.add('visible');
        positionTooltip(e, tip);
      });
      seg.addEventListener('mousemove', (e)=> positionTooltip(e, tip));
      seg.addEventListener('mouseleave', ()=>{ tip.classList.remove('visible'); });
    });
  }

  function positionTooltip(evt, tip){
    const pad = 10; // offset
    let x = evt.clientX;
    let y = evt.clientY;
    // position slightly above cursor
    tip.style.left = (x) + 'px';
    tip.style.top = (y - pad) + 'px';
  }

  // render each time as a card with meter
  times.forEach(t => {
    const li = document.createElement('li');
    const card = document.createElement('div'); card.className = 'time-card';
    const lbl = document.createElement('div'); lbl.className = 'time-label'; lbl.textContent = t;
    card.appendChild(lbl);
    card.appendChild(createMeter(t));
    li.appendChild(card);
    timesList.appendChild(li);
  });
}

function selectButton(day){
  const buttons = document.querySelectorAll('.day-buttons button');
  buttons.forEach(b => {
    if(b.dataset.day === day){
      b.classList.add('selected');
      b.setAttribute('aria-selected','true');
      b.setAttribute('tabindex','0');
    } else {
      b.classList.remove('selected');
      b.removeAttribute('aria-selected');
      b.setAttribute('tabindex','-1');
    }
  });
}

function init(){
  const buttons = document.querySelectorAll('.day-buttons button');
  buttons.forEach(btn => {
    btn.addEventListener('click', ()=>{
      const day = btn.dataset.day;
      selectButton(day);
      renderTimes(day);
    });
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Välj dagens dag som standard
  const today = getTodaySwedish();
  const defaultDay = today || 'måndag';
  selectButton(defaultDay);
  renderTimes(defaultDay);

  // Inloggningsmodal: öppna/stäng
  const openBtn = document.getElementById('open-login');
  const modal = document.getElementById('login-modal');
  const closeBtn = modal && modal.querySelector('.modal-close');
  const form = modal && modal.querySelector('#login-form');

  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }

  function openModal(){
    if(!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    const first = modal.querySelector('input');
    if(first) first.focus();
  }

  if(openBtn && modal){
    openBtn.addEventListener('click', ()=> openModal());
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });
  }

  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const username = form.elements['username'] ? form.elements['username'].value : '';
      try{ localStorage.setItem('postkoll_user', username); } catch(e){}
      alert(username ? `Inloggad som ${username}` : 'Inloggad');
      closeModal();
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
