/* support-fab.js (SAFE) */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);

  function ensureSupportUI() {
    let overlay = $("#supportOverlay");
    let fab = $("#supportFab");
    let panel = $("#supportPanel");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "supportOverlay";
      overlay.className = "support-overlay";
      document.body.appendChild(overlay);
    }

    if (!fab) {
      fab = document.createElement("button");
      fab.id = "supportFab";
      fab.className = "support-fab";
      fab.type = "button";
      fab.setAttribute("aria-label", "Abrir soporte");
      fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7v3a3 3 0 0 0 3 3h1v-5H6V9a6 6 0 1 1 12 0v1h-3v5h1a3 3 0 0 0 3-3V9a7 7 0 0 0-7-7Zm-2 17h4v2h-4v-2Z"/></svg>';
      document.body.appendChild(fab);
    }

    if (!panel) {
      panel = document.createElement("div");
      panel.id = "supportPanel";
      panel.className = "support-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "false");
      panel.innerHTML = `
        <div class="support-head">
          <div class="support-title">Soporte rápido</div>
          <button type="button" class="support-close" id="supportClose">Cerrar</button>
        </div>
        <div class="support-actions">
          <a class="social-btn is-wa" data-wa-link href="#">
            <div class="left">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.68 15l-1.1 4.02 4.12-1.08A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.07-1.1l-.29-.17-2.45.65.66-2.35-.19-.3A8 8 0 1 1 12 20Zm4.2-6.05c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.52.12-.15.23-.6.75-.74.9-.14.15-.27.17-.5.06-.23-.12-.97-.36-1.85-1.14-.68-.61-1.14-1.35-1.27-1.58-.13-.23-.01-.35.1-.46.1-.1.23-.27.34-.4.11-.14.15-.23.23-.38.08-.15.04-.28-.02-.4-.06-.12-.52-1.24-.71-1.7-.19-.44-.38-.38-.52-.38h-.44c-.15 0-.4.05-.6.28-.2.23-.78.76-.78 1.85s.8 2.14.91 2.29c.12.15 1.58 2.48 3.86 3.38.54.23.97.36 1.3.46.55.18 1.05.15 1.44.09.44-.07 1.36-.56 1.55-1.1.19-.55.19-1.01.13-1.1-.06-.1-.21-.15-.44-.27Z"/>
              </svg>
              <div class="meta"><div class="label">WhatsApp</div><div class="sub">Respuesta rápida</div></div>
            </div><span>→</span>
          </a>
          <a class="social-btn is-ig" data-ig-link href="https://www.instagram.com/thayspostres/" target="_blank" rel="noopener noreferrer">
            <div class="left">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4Zm-4.5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2ZM17.7 6.1a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z"/></svg>
              <div class="meta"><div class="label">Instagram</div><div class="sub">@thayspostres</div></div>
            </div><span>→</span>
          </a>
          <a class="social-btn is-fb" data-fb-link href="https://www.facebook.com/thayspostres/" target="_blank" rel="noopener noreferrer">
            <div class="left">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6H16.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.2V11H7.5v3H10v8h3.5Z"/></svg>
              <div class="meta"><div class="label">Facebook</div><div class="sub">Página oficial</div></div>
            </div><span>→</span>
          </a>
        </div>`;
      document.body.appendChild(panel);
    }
    return { overlay, fab, panel };
  }

  function init() {
    const { overlay, fab, panel } = ensureSupportUI();
    const closeBtn = document.getElementById("supportClose");

    const open = () => { overlay.classList.add("is-open"); panel.classList.add("is-open"); fab.setAttribute("aria-expanded","true"); };
    const close = () => { overlay.classList.remove("is-open"); panel.classList.remove("is-open"); fab.setAttribute("aria-expanded","false"); };
    const isOpen = () => panel.classList.contains("is-open");

    fab.addEventListener("click", () => (isOpen() ? close() : open()));
    overlay.addEventListener("click", close);
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  document.addEventListener("DOMContentLoaded", init);
})();


// USO DE HACKS PARA ASISNTENTE MODAL
(function(){
  
  function openRealAssistant(){
    const realBtn = document.getElementById("assistantBtn");
    if(realBtn) realBtn.click();
  }
  
  document.addEventListener("click", function(e){
    const btn = e.target.closest(".is-assistant");
    if(!btn) return;
    
    e.preventDefault();
    openRealAssistant();
  });

})();

/* ================= ASSISTANT MODAL CONTROL ================= */
/* ================= ASSISTANT MODAL CONTROL (FIX REAL) ================= */
(function(){

  const assistantModal = document.getElementById("assistantModal");
  const assistantOverlay = document.getElementById("assistantOverlay");
  const closeAssistant = document.getElementById("closeAssistant");

  if(!assistantModal || !assistantOverlay) return;

  function openAssistant(){
    assistantModal.classList.add("is-open");
    assistantOverlay.classList.add("is-open");
    assistantModal.setAttribute("aria-hidden","false");
  }

  function closeAssistantModal(){
    assistantModal.classList.remove("is-open");
    assistantOverlay.classList.remove("is-open");
    assistantModal.setAttribute("aria-hidden","true");
  }

  /* abrir desde cualquier botón maestro */
  document.addEventListener("click", function(e){
    const btn = e.target.closest(".is-assistant");
    if(!btn) return;

    e.preventDefault();
    e.stopPropagation();   // 🔥 evita que cierre el maestro
    openAssistant();
  });

  /* click fuera = cerrar SOLO formulario */
  assistantOverlay.addEventListener("click", function(e){
    e.stopPropagation();   // 🔥 evita cerrar el maestro
    closeAssistantModal();
  });

  /* click dentro del modal NO cierra nada */
  assistantModal.addEventListener("click", function(e){
    e.stopPropagation();
  });

  if(closeAssistant){
    closeAssistant.addEventListener("click", function(e){
      e.stopPropagation();
      closeAssistantModal();
    });
  }

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && assistantModal.classList.contains("is-open")){
      closeAssistantModal();
    }
  });

})();
/* abrir panel maestro desde cualquier boton */
(function(){

  function openSupportPanel(){
    const fab = document.getElementById("supportFab");
    if(fab) fab.click();
  }

  document.addEventListener("click", function(e){
    const btn = e.target.closest(".is-support");
    if(!btn) return;

    e.preventDefault();
    openSupportPanel();
  });

})();
