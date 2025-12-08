// Schedule data och relaterade funktioner

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
