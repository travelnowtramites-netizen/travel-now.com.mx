/* =====================================================
   HERO SLIDER — FIX PROPORCIONAL REAL
===================================================== */

const hero = document.querySelector(".hero");
const bgA = document.querySelector(".hero-bg-a");
const bgB = document.querySelector(".hero-bg-b");

const trigger = document.querySelector("#heroNext .next-content");
const wrap = document.querySelector("#heroNext .next-wrap");

const title = document.getElementById("heroTitle");
const text = document.getElementById("heroText");
const nextTitle = document.getElementById("nextTitle");
const nextImg = document.getElementById("nextImg");

/* ===== seguridad ===== */
if(hero && bgA && bgB && trigger && wrap){

let current = 0;
let animating = false;


/* =====================================================
   SLIDES (posición inteligente)
===================================================== */

const slides = [
{
  img:"assets/img/banner/banner.webp",
  pos:"60% center",
  title:"Tramitamos tu visa <br>de forma rápida y segura",
  text:"Te acompañamos paso a paso con requisitos correctos, preparación profesional y seguimiento real.",
  label:"Gestionamos tu pasaporte"
},
{
  img:"assets/img/banner/banner2.webp",
  pos:"35% center",
  title:"Gestionamos tu pasaporte<br>para que viajes tranquilo",
  text:"Evita filas y errores. Nosotros revisamos y preparamos tu trámite correctamente.",
  label:"Asesoría migratoria"
},
{
  img:"assets/img/banner/banner3.webp",
  pos:"center center",
  title:"Asesoría experta<br>en trámites migratorios",
  text:"Casos especiales, rechazos o renovaciones.",
  label:"Tramitamos tu visa"
}
];


/* =====================================================
   APLICAR IMAGEN SEGURO
===================================================== */

function applySlide(el,slide){

  if(!el || !slide) return;

  el.style.backgroundImage = `url("${slide.img}")`;

  /* 🔥 CLAVE REAL */
  el.style.backgroundSize = "contain";
  el.style.backgroundRepeat = "no-repeat";
  el.style.backgroundPosition = slide.pos || "center";

}


/* =====================================================
   PREVIEW
===================================================== */

function updatePreview(){
  nextTitle.textContent = slides[current].label;
  nextImg.src = slides[current].img;
}


/* =====================================================
   CAMBIO SLIDE
===================================================== */

function changeSlide(){

  hero.classList.remove("show-text");

  const next = (current+1)%slides.length;

  applySlide(bgB,slides[next]);

  hero.classList.add("is-switching");

  setTimeout(()=>{

    applySlide(bgA,slides[next]);

    hero.classList.remove("is-switching");

    title.innerHTML = slides[next].title;
    text.textContent = slides[next].text;

    current = next;
    updatePreview();

    setTimeout(()=>{
      hero.classList.add("show-text");
      wrap.classList.remove("move");

      animating=false;
      trigger.style.pointerEvents="auto";

    },20);

  },350);
}


/* =====================================================
   TRANSICION
===================================================== */

function runTransition(){

  if(animating) return;

  animating=true;
  trigger.style.pointerEvents="none";

  wrap.classList.remove("move");
  void wrap.offsetWidth;
  wrap.classList.add("move");

  setTimeout(changeSlide,420);
}


/* =====================================================
   CLICK
===================================================== */

trigger.addEventListener("click",()=>{
  runTransition();
  restartAuto();
});


/* =====================================================
   AUTO
===================================================== */

const AUTO_DELAY=5000;
let autoTimer=null;

function startAuto(){
  stopAuto();
  autoTimer=setInterval(runTransition,AUTO_DELAY);
}

function stopAuto(){
  if(autoTimer){
    clearInterval(autoTimer);
    autoTimer=null;
  }
}

function restartAuto(){
  startAuto();
}


/* =====================================================
   INIT
===================================================== */

applySlide(bgA,slides[0]);
updatePreview();

setTimeout(()=>{
  hero.classList.add("show-text");
},400);

startAuto();

}