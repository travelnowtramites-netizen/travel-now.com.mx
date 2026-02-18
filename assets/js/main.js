document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".nav");
  const headerContent = document.querySelector(".header-content");

  // Crear icono hamburguesa
  const navToggle = document.createElement("div");
  navToggle.classList.add("nav-toggle");
  for (let i = 0; i < 3; i++) {
    const span = document.createElement("span");
    navToggle.appendChild(span);
  }
  headerContent.appendChild(navToggle);

  // Abrir / cerrar menú
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Scroll suave a secciones
  const links = document.querySelectorAll(".nav a");
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetID = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetID);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: "smooth"
        });
      }
      if (nav.classList.contains("show")) nav.classList.remove("show");
    });

    // Hover animado opcional: aumentar tamaño
    link.addEventListener("mouseenter", () => {
      link.style.transform = "scale(1.1)";
      link.style.color = "#0284c7";
    });
    link.addEventListener("mouseleave", () => {
      link.style.transform = "scale(1)";
      link.style.color = "#ffffff";
    });
  });
});





(function () {
  "use strict";

  // Helpers seguros
  function safeStr(v) { return (typeof v === "string" ? v.trim() : ""); }
  function byId(id) { return document.getElementById(id); }
  function getVal(id) {
    var el = byId(id);
    if (!el) return "";
    var v = el.value;
    return typeof v === "string" ? v.trim() : "";
  }

  // ===== Mobile menu =====
  var menuBtn = byId("menuBtn");
  var nav = byId("nav");

  function closeNav() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", function (e) {
      var target = e && e.target;
      if (!target) return;
      var clickedInside = nav.contains(target) || menuBtn.contains(target);
      if (!clickedInside && nav.classList.contains("open")) closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeNav();
    });
  }

  // ===== Assistant Modal =====
  var assistantBtn = byId("assistantBtn");
  var modal = byId("assistantModal");
  var closeBtn = byId("closeAssistant");
  var form = byId("assistantForm");

  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var first = modal.querySelector("input, select, textarea, button, a");
    if (first) first.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (assistantBtn) assistantBtn.focus();
  }

  if (assistantBtn) assistantBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", function (e) {
      var box = modal.querySelector(".box");
      if (!box) return;
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!modal || !modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre = getVal("a_nombre");
      var tramite = getVal("a_tramite");
      var ciudad = getVal("a_ciudad");
      var detalle = getVal("a_detalle");

      var parts = [];
      parts.push("Hola, quiero asesoría para un trámite.");
      if (nombre) parts.push("Nombre: " + nombre);
      if (tramite) parts.push("Trámite: " + tramite);
      if (ciudad) parts.push("Ubicación: " + ciudad);
      if (detalle) parts.push("Detalles: " + detalle);
      parts.push("Vengo desde travel-now.com.mx");

      var text = encodeURIComponent(parts.join("\n"));
      var url = "https://wa.me/525521114448?text=" + text;
      window.open(url, "_blank", "noopener");
    });
  }

  // ===== Reseñas 3D (AUTO) =====
  var stage = byId("reviews3dStage");
  var dataEl = byId("reviewsData");
  var btnPrev = byId("revPrev");
  var btnNext = byId("revNext");
  var countEl = byId("reviewsCount");
  var shell = byId("reviewsShell");

  if (!stage || !dataEl) return;

  var reviews = [];
  try {
    var raw = safeStr(dataEl.textContent || "");
    reviews = raw ? JSON.parse(raw) : [];
  } catch (err) {
    reviews = [];
  }
  if (!Array.isArray(reviews)) reviews = [];
  if (countEl) countEl.textContent = String(reviews.length || 0) + " reseñas";
  if (reviews.length === 0) return;

  function clampIndex(i) {
    var n = reviews.length;
    return (i % n + n) % n;
  }

  function starsLine(n) {
    var v = Number(n);
    var s = (isFinite(v) ? Math.max(1, Math.min(5, Math.round(v))) : 5);
    return "★★★★★".slice(0, s) + "☆☆☆☆☆".slice(0, 5 - s);
  }

  function formatDate(iso) {
    var str = safeStr(iso);
    if (!str) return "";
    var d = new Date(str);
    if (isNaN(d.getTime())) return str;
    try {
      return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });
    } catch (e) {
      return str;
    }
  }

  function makeEl(tag, className) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  var index = 0;
  var autoTimer = null;
  var isPaused = false;
  var AUTO_MS = 4500;

  function renderCard(item, pos, isActive) {
    var card = makeEl("article", "r3d-card");
    card.setAttribute("data-pos", pos);
    card.tabIndex = 0;

    var head = makeEl("div", "r3d-head");
    var avatar = makeEl("div", "r3d-avatar");
    avatar.textContent = safeStr(item.avatar) || "AV";

    var info = makeEl("div", "");
    var name = makeEl("div", "r3d-name");
    name.textContent = safeStr(item.name) || "Reseña";

    var meta = makeEl("div", "r3d-meta");
    var date = safeStr(item.date);
    var tag = safeStr(item.tag);

    var chip = makeEl("span", "src-chip");
    var dot = makeEl("span", "src-dot");
    dot.setAttribute("aria-hidden", "true");
    chip.appendChild(dot);
    chip.appendChild(document.createTextNode("Google"));

    var metaText = [];
    if (date) metaText.push(formatDate(date));
    if (tag) metaText.push(tag);

    meta.textContent = metaText.join(" • ");
    if (meta.textContent) meta.appendChild(document.createTextNode(" "));
    meta.appendChild(chip);

    info.appendChild(name);
    info.appendChild(meta);

    head.appendChild(avatar);
    head.appendChild(info);

    var stars = makeEl("div", "r3d-stars");
    stars.textContent = starsLine(item.stars);

    var text = makeEl("div", "r3d-text");
    text.textContent = safeStr(item.text) || "";

    var more = makeEl("button", "r3d-more");
    more.type = "button";
    more.textContent = "Ver más";
    more.setAttribute("data-action", "toggle");
    if (!isActive) {
      // Solo el activo muestra botón (para que no estorbe)
      more.style.display = "none";
    }

    card.appendChild(head);
    card.appendChild(stars);
    card.appendChild(text);
    card.appendChild(more);

    return card;
  }

  function build(directionClass) {
    // directionClass: "slide-next" / "slide-prev" / ""
    while (stage.firstChild) stage.removeChild(stage.firstChild);

    if (directionClass) {
      stage.classList.remove("slide-next", "slide-prev");
      stage.classList.add(directionClass);
      // reset rápido para que la animación no se quede pegada
      setTimeout(function () {
        if (stage) stage.classList.remove(directionClass);
      }, 380);
    }

    var prevIdx = clampIndex(index - 1);
    var nextIdx = clampIndex(index + 1);

    stage.appendChild(renderCard(reviews[prevIdx], "prev", false));
    stage.appendChild(renderCard(reviews[index], "active", true));
    stage.appendChild(renderCard(reviews[nextIdx], "next", false));
  }

  function go(step) {
    index = clampIndex(index + step);
    build(step > 0 ? "slide-next" : "slide-prev");
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () {
      if (isPaused) return;
      go(1);
    }, AUTO_MS);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function pause() { isPaused = true; }
  function resume() { isPaused = false; }

  // Inicial
  build("");
  startAuto();

  if (btnPrev) btnPrev.addEventListener("click", function () { go(-1); });
  if (btnNext) btnNext.addEventListener("click", function () { go(1); });

  // Pausa al hover/focus (y no se “rompe” en touch)
  if (shell) {
    shell.addEventListener("mouseenter", pause);
    shell.addEventListener("mouseleave", resume);
    shell.addEventListener("focusin", pause);
    shell.addEventListener("focusout", resume);
    shell.addEventListener("touchstart", pause, { passive: true });
    shell.addEventListener("touchend", function () { setTimeout(resume, 800); }, { passive: true });
  }

  // Visibilidad de pestaña
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) pause();
    else resume();
  });

  // Delegación para "Ver más"
  stage.addEventListener("click", function (e) {
    var t = e && e.target;
    if (!t) return;
    var action = t.getAttribute && t.getAttribute("data-action");
    if (action !== "toggle") return;

    var card = t.closest ? t.closest(".r3d-card") : null;
    if (!card) return;

    var isExpanded = card.classList.toggle("expanded");
    t.textContent = isExpanded ? "Ver menos" : "Ver más";
  });

  // Teclado (izq/der) cuando estás en la sección
  stage.addEventListener("keydown", function (e) {
    if (!e) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  });
})();

