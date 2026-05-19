/* post.js — sidenote interaction
   • Click .sn-mark in body → highlight matching .sn card; others fade.
   • Click .sn card → toggle highlight (and on mobile, open the body).
   • On mobile, .sn cards are collapsible — click .sn-toggle to expand. */

(function () {
  const post = document.querySelector(".post");
  if (!post) return;

  const marks = [...post.querySelectorAll(".sn-mark")];
  const cards = [...post.querySelectorAll(".sn")];
  const byId  = (id) => cards.find(c => c.dataset.sn === id);

  let active = null;

  function setActive(id) {
    active = (active === id) ? null : id;
    post.classList.toggle("has-active", active !== null);
    marks.forEach(m => m.classList.toggle("is-active", m.dataset.snTarget === active));
    cards.forEach(c => c.classList.toggle("is-active", c.dataset.sn === active));

    // On narrow screens, also open the collapsed card.
    if (active && window.matchMedia("(max-width: 900px)").matches) {
      const card = byId(active);
      if (card) {
        card.setAttribute("data-open", "true");
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  marks.forEach(m => {
    m.addEventListener("click", (e) => {
      e.preventDefault();
      setActive(m.dataset.snTarget);
    });
  });

  cards.forEach(c => {
    // Whole-card click toggles active on desktop.
    c.addEventListener("click", (e) => {
      if (e.target.closest(".sn-toggle")) return;
      if (window.matchMedia("(max-width: 900px)").matches) return;
      setActive(c.dataset.sn);
    });

    // Mobile collapsible toggle.
    const toggle = c.querySelector(".sn-toggle");
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const open = c.getAttribute("data-open") === "true";
        c.setAttribute("data-open", open ? "false" : "true");
      });
    }
  });
})();
