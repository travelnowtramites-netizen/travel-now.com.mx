(function(){

/* =========================================================
   DETECCION DEVTOOLS
========================================================= */

let blocked = false;
const threshold = 160;

function detectDevtools(){
  const w = window.outerWidth - window.innerWidth;
  const h = window.outerHeight - window.innerHeight;

  if((w > threshold || h > threshold) && !blocked){
    blocked = true;
    activateProtection();
  }
}

/* =========================================================
   ACTIVAR PROTECCION
========================================================= */

function activateProtection(){

  console.clear();
  console.warn("Modo protegido activado");

  document.documentElement.classList.add("devtools-lock");

  /* ---- detener chatbot ---- */
  window.__IDAPPSH_CHATBOT_INIT__ = true;

  const chat = document.getElementById("idappsh-chat-launcher");
  const panel = document.getElementById("idappsh-chat-panel");
  if(chat) chat.remove();
  if(panel) panel.remove();

  /* ---- cerrar modales ---- */
  document.querySelectorAll(".modal, .is-open, .open").forEach(el=>{
    el.classList.remove("is-open","open");
    el.style.display="none";
  });

  /* ---- bloquear API ---- */
  window.fetch = () => Promise.reject("blocked");
  XMLHttpRequest.prototype.open = function(){};

  /* ---- bloquear formularios ---- */
  document.querySelectorAll("input,textarea,select").forEach(el=>{
    el.disabled = true;
    el.placeholder = "Contenido protegido";
  });

  /* ---- borrar info privada ---- */
  document.querySelectorAll("[data-private]").forEach(el=>{
    el.textContent = "•••";
  });

  /* ---- bloquear selección ---- */
  disableCopyPaste();

  /* ---- cerrar pagina ---- */
  tryClosePage();
}

/* =========================================================
   BLOQUEO COPIAR / PEGAR / SELECCION
========================================================= */

function disableCopyPaste(){

  const prevent = e => e.preventDefault();

  document.addEventListener("copy", prevent, true);
  document.addEventListener("cut", prevent, true);
  document.addEventListener("paste", prevent, true);
  document.addEventListener("selectstart", prevent, true);
  document.addEventListener("dragstart", prevent, true);

  document.body.style.userSelect = "none";
  document.body.style.webkitUserSelect = "none";

  /* bloquear atajos teclado */
  document.addEventListener("keydown", function(e){

    if(
      (e.ctrlKey && ["c","x","v","a","s","u"].includes(e.key.toLowerCase())) ||
      (e.ctrlKey && e.shiftKey && ["i","j","c"].includes(e.key.toLowerCase())) ||
      e.key === "F12"
    ){
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

  }, true);
}
function disableCopyPaste(){

  const kill = e=>{
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  };

  /* eventos reales */
  ["copy","cut","paste","selectstart","dragstart","contextmenu"].forEach(evt=>{
    document.addEventListener(evt, kill, true);
    window.addEventListener(evt, kill, true);
  });

  /* bloquear teclado */
  document.addEventListener("keydown", function(e){

    const k = e.key.toLowerCase();

    if(
      (e.ctrlKey && ["c","x","v","a","u","s","p"].includes(k)) ||
      (e.ctrlKey && e.shiftKey && ["i","j","c"].includes(k)) ||
      k === "f12"
    ){
      kill(e);
    }

  }, true);

  /* limpiar selección continuamente */
  setInterval(()=>{
    const sel = window.getSelection();
    if(sel && sel.rangeCount) sel.removeAllRanges();
  },50);

  /* bloquear clipboard API moderna */
  if(navigator.clipboard){
    navigator.clipboard.writeText = async ()=>{};
    navigator.clipboard.readText = async ()=>"";
  }

}
/* =========================================================
   INTENTO CERRAR PAGINA
========================================================= */

function tryClosePage(){

  // intento cierre real
  window.open('', '_self');
  window.close();

  // destruir contenido si no permite cerrar
  setTimeout(()=>{
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    location.replace("about:blank");
  },120);
}

/* =========================================================
   BLOQUEOS EXTRA
========================================================= */

/* clic derecho */
document.addEventListener("contextmenu", e=> e.preventDefault());

/* deteccion continua */
setInterval(detectDevtools, 700);

})();
