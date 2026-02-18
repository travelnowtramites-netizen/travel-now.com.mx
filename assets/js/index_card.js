/* ================= TESTIMONIOS ================= */

const section = document.querySelector(".testimonios-section");

if(section){

  const cards = section.querySelectorAll(".card.reveal");
  const gap = 700;
  const wait = 6000;

  let timer = null;
  let running = false;
  let pendingRestart = false;
  let started = false;


  function scheduleNext(){
    clearTimeout(timer);
    timer = setTimeout(runCycle, wait);
  }


  async function runCycle(){

    if(running){
      pendingRestart = true;
      return;
    }

    running = true;

    // RESET
    cards.forEach(c=>{
      c.classList.remove("show");
      c.classList.add("prepare");
    });

    await new Promise(r=>requestAnimationFrame(r));
    await new Promise(r=>requestAnimationFrame(r));

    cards.forEach(c=>c.classList.remove("prepare"));

    for(const card of cards){
      card.classList.add("show");
      await new Promise(r=>setTimeout(r,gap));
    }

    running = false;

    if(pendingRestart){
      pendingRestart = false;
      runCycle();
      return;
    }

    scheduleNext();
  }


  /* ===== ACTIVAR AL ENTRAR EN PANTALLA (MOBILE + DESKTOP) ===== */

  const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{
      if(entry.isIntersecting && !started){
        started = true;
        runCycle();
      }
    });

  },{
    threshold:0.35
  });

  observer.observe(section);

}
