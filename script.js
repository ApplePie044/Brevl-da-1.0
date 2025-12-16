

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
