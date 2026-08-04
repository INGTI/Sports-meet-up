/* =====================================================================
   ESF ONE-DAY CHRISTIAN FELLOWSHIP SPORTS MEET 2026
   script.js — vanilla JS only, no frameworks
   ===================================================================== */

/* ---------------------------------------------------------------------
   CONFIG — edit these two lines for your real event
   ------------------------------------------------------------------- */
const CONFIG = {
  // Replace with the real WhatsApp number in international format,
  // digits only, no + or spaces (e.g. "919864012345" for +91 98640 12345).
  WHATSAPP_NUMBER: "917638008096",

  // Event date/time used by the countdown timer. ISO format with the
  // +05:30 (IST) offset baked in so it counts down correctly for
  // visitors in any timezone.
  EVENT_DATE_ISO: "2026-08-15T08:00:00+05:30"
};

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileNav();
  initSmoothScroll();
  initCountdown();
  initScrollReveal();
  initEventCardAccordions();
  initRulesAccordion();
  initRegistrationForm();
  initWhatsAppLinks();
  initGallery();
  initBackToTop();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------------------
   HEADER: add shadow once the page has scrolled past the hero
   ------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------------------
   MOBILE NAV: hamburger toggle, closes after a link is tapped
   ------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------------------
   SMOOTH SCROLL for in-page anchor links (native CSS handles most of
   this already via `scroll-behavior: smooth`; this adds an offset so
   sections aren't hidden under the sticky header).
   ------------------------------------------------------------------- */
function initSmoothScroll() {
  const header = document.getElementById("siteHeader");
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length <= 1) return; // guard against bare "#"
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ---------------------------------------------------------------------
   COUNTDOWN TIMER — ticks down to CONFIG.EVENT_DATE_ISO every second
   ------------------------------------------------------------------- */
function initCountdown() {
  const target = new Date(CONFIG.EVENT_DATE_ISO).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs")
  };

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    let diff = target - now;

    if (diff <= 0) {
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.mins.textContent = "00";
      els.secs.textContent = "00";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------------------------------------------------------------------
   SCROLL REVEAL — fade + rise elements with class `.reveal` into view
   using IntersectionObserver (falls back gracefully if unsupported)
   ------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   EVENT CARD "Show rules" toggles (inside each Pinterest-style card)
   ------------------------------------------------------------------- */
function initEventCardAccordions() {
  document.querySelectorAll(".event-rules-toggle").forEach((btn) => {
    const list = btn.nextElementSibling;
    btn.addEventListener("click", () => {
      const isOpen = list.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      btn.querySelector("span").textContent = isOpen ? "Hide rules" : "Show rules";
    });
  });
}

/* ---------------------------------------------------------------------
   RULES SECTION ACCORDION — one open panel at a time, first one open
   by default (matches aria-expanded="true" already set in the HTML)
   ------------------------------------------------------------------- */
function initRulesAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");

  function setPanelHeight(panel, open) {
    panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
  }

  triggers.forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    const startOpen = trigger.getAttribute("aria-expanded") === "true";
    setPanelHeight(panel, startOpen);

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Close all panels first (accordion behaviour: one open at a time)
      triggers.forEach((t) => {
        t.setAttribute("aria-expanded", "false");
        setPanelHeight(t.nextElementSibling, false);
      });

      // Re-open the clicked one unless it was already open
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        setPanelHeight(panel, true);
      }
    });
  });

  // Recalculate open panel height on resize (text can reflow)
  window.addEventListener("resize", () => {
    triggers.forEach((t) => {
      if (t.getAttribute("aria-expanded") === "true") {
        setPanelHeight(t.nextElementSibling, true);
      }
    });
  });
}

/* ---------------------------------------------------------------------
   REGISTRATION FORM — builds a pre-filled WhatsApp message and opens
   wa.me with it. No server, no database: everything happens client-side.
   ------------------------------------------------------------------- */
function initRegistrationForm() {
  const form = document.getElementById("regForm");
  const eventSelect = document.getElementById("eventSelect");

  // Clicking "Register for X" on an event card jumps to the form AND
  // pre-selects that event in the dropdown.
  document.querySelectorAll(".event-register").forEach((btn) => {
    btn.addEventListener("click", () => {
      const eventName = btn.dataset.event;
      [...eventSelect.options].forEach((opt) => {
        if (opt.value === eventName || opt.textContent === eventName) {
          eventSelect.value = opt.value || opt.textContent;
        }
      });
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const message = buildWhatsAppMessage({
      church: data.get("churchName"),
      team: data.get("teamName"),
      captain: data.get("captainName"),
      phone: data.get("phoneNumber"),
      whatsapp: data.get("whatsappNumber") || data.get("phoneNumber"),
      age: data.get("ageCategory"),
      event: data.get("eventSelect"),
      players: data.get("numPlayers"),
      remarks: data.get("remarks")
    });

    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });
}

/**
 * Builds the plain-text WhatsApp registration message from form fields.
 */
function buildWhatsAppMessage(fields) {
  const lines = [
    "*New Team Registration – ESF Sports Meet 2026*",
    `Church: ${fields.church}`,
    `Team Name: ${fields.team}`,
    `Captain: ${fields.captain}`,
    `Phone: ${fields.phone}`,
    `WhatsApp: ${fields.whatsapp}`,
    `Age Category: ${fields.age}`,
    `Event: ${fields.event}`,
    `Players: ${fields.players}`
  ];
  if (fields.remarks) lines.push(`Remarks: ${fields.remarks}`);
  return lines.join("\n");
}

/* ---------------------------------------------------------------------
   WHATSAPP LINKS — the "Scan to Register" QR code and the direct
   WhatsApp buttons (registration section + contact section) all point
   at the same general-registration chat. The QR image itself is
   generated at runtime from a public QR-image API so no QR file needs
   to be produced or re-uploaded whenever the phone number changes —
   only CONFIG.WHATSAPP_NUMBER above needs editing.
   ------------------------------------------------------------------- */
function initWhatsAppLinks() {
  const genericMessage = "Hi ESF! I'd like to register a team for the Sports Meet 2026.";
  const waUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(genericMessage)}`;

  const directLink = document.getElementById("whatsappDirectLink");
  if (directLink) directLink.href = waUrl;

  const contactLink = document.getElementById("contactWhatsappLink");
  if (contactLink) contactLink.href = waUrl;

  const qrImg = document.getElementById("registerQr");
  if (qrImg) {
    // Public QR-code image generator: encodes the WhatsApp URL above.
    // Swap this for a locally-hosted QR image if you prefer not to
    // rely on a third-party service.
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(waUrl)}`;
    qrImg.alt = "QR code linking to WhatsApp registration chat";

    // Graceful fallback if the QR image service can't be reached
    // (e.g. no internet at build/preview time): hide the broken image
    // icon and let the "Open WhatsApp Directly" button carry the flow.
    qrImg.addEventListener("error", () => {
      qrImg.closest(".qr-frame").innerHTML =
        '<p style="font-size:13px;color:var(--ink-soft);margin:0;">QR code unavailable right now — use the button below instead.</p>';
    }, { once: true });
  }
}

/* ---------------------------------------------------------------------
   GALLERY LIGHTBOX — fullscreen viewer with prev/next + keyboard + esc
   ------------------------------------------------------------------- */
function initGallery() {
  const items = [...document.querySelectorAll(".gallery-item[data-full]")];
  if (!items.length) return;

  const lightbox = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightboxImg");
  const captionEl = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    const item = items[currentIndex];
    imgEl.src = item.dataset.full;
    imgEl.alt = item.dataset.caption || "";
    captionEl.textContent = item.dataset.caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + items.length) % items.length;
    open(currentIndex);
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => open(index));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}

/* ---------------------------------------------------------------------
   BACK TO TOP button — appears after scrolling past the hero
   ------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6),
    { passive: true }
  );
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
