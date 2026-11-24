/* Shared header, footer and content rendering. Facts and links live in site-config.js. */
(() => {
  const F = window.FIA;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  const todo = t => `<span class="todo">${esc(t)}</span>`;
  const here = location.pathname.split("/").pop() || "index.html";

  const NAV = [
    ["Home", "index.html"],
    ["About Us", "about.html", [
      ["Our Story", "#our-story"], ["Mission & Vision", "#mission"], ["Leadership Team", "#leadership"],
      ["Board of Trustees", "#trustees"], ["Advisory Board", "#advisors"], ["Partners", "#partners"],
      ["Our Impact", "impact.html"], ["Transparency & Governance", "transparency.html"]]],
    ["Our Work", "our-work.html", [
      ["Community Services", "#community"], ["Health & Vision Camps", "#health"], ["Food Drives", "#food"],
      ["Veterans Support", "#veterans"], ["Blood Drives", "#blood"], ["Education & Scholarships", "#education"],
      ["Environmental Initiatives", "#environment"], ["Special Initiatives", "special-initiatives.html"]]],
    ["Programs & Events", "programs-events.html", [
      ["Upcoming Events", "#upcoming"], ["Past Events", "#past"], ["Annual Celebrations", "#celebrations"],
      ["India Day Parade", "#parade"], ["Diwali", "#diwali"], ["International Women's Day", "#women"], ["Health Camps", "#camps"]]],
    ["News & Media", "news-media.html", [
      ["Press Releases", "#press"], ["News Coverage", "#coverage"], ["Photo Gallery", "#photos"],
      ["Video Gallery", "#videos"], ["FIA Chronicles", "#chronicles"], ["Media Mentions", "#mentions"]]],
    ["Get Involved", "get-involved.html", [
      ["Become a Volunteer", "#volunteer"], ["Membership", "#membership"], ["Become a Partner", "#partner"],
      ["Corporate Sponsorship", "#sponsorship"], ["Community Collaboration", "#collaboration"]]],
    ["Contact Us", "contact.html", [
      ["Contact Information", "#information"], ["General Inquiries", "#general"], ["Sponsorship Inquiries", "#sponsorship"],
      ["Volunteer Inquiries", "#volunteer"], ["Location", "#location"]]],
    ["Donate", "donate.html", [
      ["Make a Donation", "#give"], ["Corporate Giving", "#corporate"], ["Event Sponsorship", "#events"],
      ["Fundraising Campaigns", "#campaigns"], ["Donation Receipts", "#receipts"]]]
  ];
  const brand = `<a class="brand" href="index.html"><span class="logo" aria-hidden="true">FIA</span><span class="brand-text"><strong>FIA New England</strong><span>Foundation of Indian Americans</span></span></a>`;

  customElements.define("fia-header", class extends HTMLElement {
    connectedCallback() {
      const item = ([label, page, subs], i) => {
        const cur = page === here || subs?.some(s => s[1] === here);
        const link = `<a href="${page}"${cur ? ' aria-current="page"' : ""}${label === "Donate" ? ' class="btn"' : ""}>${esc(label)}</a>`;
        if (!subs) return `<li><div class="top">${link}</div></li>`;
        const list = subs.map(([t, h]) => `<li><a href="${h[0] === "#" ? page + h : h}"${h[0] === "#" ? "" : ' class="page"'}>${esc(t)}</a></li>`).join("");
        return `<li><div class="top">${link}<button class="caret" type="button" aria-expanded="false" aria-controls="drop-${i}" aria-label="${esc(label)} menu"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg></button></div><ul class="drop" id="drop-${i}">${list}</ul></li>`;
      };
      this.innerHTML = `<a class="skip" href="#main">Skip to content</a><div class="ribbon"></div><nav class="nav" aria-label="Main">${brand}
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
        <ul class="menu" id="menu">${NAV.map(item).join("")}</ul></nav>`;
      const menu = this.querySelector(".menu"), btn = this.querySelector(".menu-btn");
      const setMenu = on => { menu.classList.toggle("open", on); btn.setAttribute("aria-expanded", on); };
      const setDrop = (li, on) => { li.classList.toggle("open", on); li.querySelector(".caret")?.setAttribute("aria-expanded", on); };
      const closeAll = except => menu.querySelectorAll(":scope > li.open").forEach(li => li !== except && setDrop(li, false));
      btn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
      menu.addEventListener("click", e => {
        const caret = e.target.closest(".caret");
        if (caret) { const li = caret.closest(".menu > li"); closeAll(li); setDrop(li, !li.classList.contains("open")); }
        else if (e.target.closest("a")) {
          // Close after choosing a section on this page, even while the pointer still hovers
          const li = e.target.closest(".menu > li");
          li.classList.add("shut"); closeAll(); setMenu(false);
        }
      });
      menu.querySelectorAll(":scope > li").forEach(li => li.addEventListener("mouseleave", () => li.classList.remove("shut")));
      this.addEventListener("keydown", e => {
        if (e.key !== "Escape") return;
        const open = menu.querySelector(":scope > li.open");
        if (open) { setDrop(open, false); open.querySelector(".caret").focus(); }
        else if (menu.classList.contains("open")) { setMenu(false); btn.focus(); }
      });
      document.addEventListener("click", e => { if (!this.contains(e.target)) { closeAll(); setMenu(false); } });
    }
  });

  const contactValue = {
    email: () => F.contact.email ? `<a href="mailto:${esc(F.contact.email)}">${esc(F.contact.email)}</a>` : todo("Email to be added"),
    phone: () => F.contact.phone ? `<a href="tel:${esc(F.contact.phone.replace(/[^+\d]/g, ""))}">${esc(F.contact.phone)}</a>` : todo("Phone to be added"),
    address: () => F.contact.address ? esc(F.contact.address) : todo("Mailing address to be added"),
    ein: () => F.contact.ein ? esc(F.contact.ein) : todo("to be added"),
    map: () => F.contact.address ? `<a class="link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(F.contact.address)}">Open in Google Maps</a>` : "",
    period: () => F.impactPeriod ? `Figures for ${esc(F.impactPeriod)}.` : todo("Reporting period to be added"),
    donate: () => F.links.donate ? `<a class="btn" href="${esc(F.links.donate)}">Donate online</a>`
      : `<p class="empty-note">Online giving is not open yet. Please get in touch and we will help you make a gift.</p><div class="actions"><a class="btn" href="contact.html?topic=donation#form">Ask about giving</a></div>`,
    membership: () => `<a class="btn" href="${esc(F.links.membership || "contact.html?topic=membership#form")}">${F.links.membership ? "Join online" : "Ask about membership"}</a>`
  };

  customElements.define("fia-footer", class extends HTMLElement {
    connectedCallback() {
      const ul = a => `<ul>${a.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join("")}</ul>`;
      this.innerHTML = `<footer><div class="wrap">
        <div class="foot-news"><h2>Event news in your inbox</h2><form data-kind="newsletter"><label class="sr-only" for="news-email">Email address</label><input id="news-email" name="email" type="email" required placeholder="you@example.com" autocomplete="email"><button class="btn" type="submit">Subscribe</button><p class="form-note" role="status"></p></form></div>
        <div class="foot-grid">
          <div>${brand}<p>A 501(c)(3) non-profit organization celebrating Indian heritage and serving communities across New England.</p></div>
          <div><h3>Explore</h3>${ul(NAV.slice(0, 5).map(n => [n[0], n[1]]))}</div>
          <div><h3>Take part</h3>${ul([["Volunteer", "get-involved.html#volunteer"], ["Membership", "get-involved.html#membership"], ["Sponsorship", "get-involved.html#sponsorship"], ["Donate", "donate.html"], ["Contact Us", "contact.html"]])}</div>
          <div><h3>Contact and nonprofit information</h3><ul><li>${contactValue.address()}</li><li>${contactValue.email()}</li><li>${contactValue.phone()}</li><li>EIN: ${contactValue.ein()}</li><li><a href="transparency.html">Transparency &amp; Governance</a></li></ul></div>
          <div><h3>Follow</h3><ul>${Object.entries(F.social).map(([n, u]) => `<li>${u ? `<a href="${esc(u)}">${esc(n)}</a>` : todo(n)}</li>`).join("")}</ul></div>
        </div>
        <div class="foot-end"><span>&copy; ${new Date().getFullYear()} Foundation of Indian Americans, New England</span><span>Donations are tax-deductible to the extent allowed by law.</span></div>
      </div></footer>`;
    }
  });

  const fmt = (d, o) => new Date(d + "T12:00").toLocaleDateString("en-US", o);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const eventRow = (e, past) => `<article class="event">
    <div class="date">${fmt(e.date, { month: "short" })}<b>${fmt(e.date, { day: "numeric" })}</b>${fmt(e.date, { year: "numeric" })}</div>
    <div><h3>${esc(e.title)}</h3><p>${esc(e.text)} ${past ? esc(e.venue) : e.confirmed ? (e.venue ? esc(e.venue) : "Venue to be announced.") : "Observance date shown; event date and venue to be announced."}</p></div>
    ${past ? "" : e.register ? `<a class="btn" href="${esc(e.register)}">Register</a>` : `<a class="btn btn-ghost" href="contact.html?topic=event&amp;event=${encodeURIComponent(e.title)}#form" aria-label="Ask about ${esc(e.title)}">Ask about this event</a>`}
  </article>`;
  const newsRow = n => `<li><div><strong>${esc(n.title)}</strong><span>${esc([n.source, n.date && fmt(n.date, { dateStyle: "long" })].filter(Boolean).join(", "))}</span></div>${n.url ? `<a class="link" href="${esc(n.url)}">Read<span class="sr-only"> ${esc(n.title)}</span></a>` : ""}</li>`;
  const rows = (list, row, none) => list.length ? `<ul class="rows">${list.map(row).join("")}</ul>` : `<p class="empty-note">${esc(none)}</p>`;
  const person = (p, i) => `<div class="person"><div class="photo face p${i % 4 + 1}">${p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy">` : ""}</div><h3>${p.name ? esc(p.name) : todo("Name to be added")}</h3><p>${esc(p.role)}</p></div>`;

  const render = {
    upcoming: el => {
      const list = F.events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, +el.dataset.max || 99);
      return list.length ? list.map(e => eventRow(e)).join("") : `<p class="empty-note">New dates will be posted here soon.</p>`;
    },
    past: () => {
      const list = F.events.filter(e => e.confirmed && e.date < today).sort((a, b) => b.date.localeCompare(a.date));
      return list.length ? list.map(e => eventRow(e, true)).join("") : `<p class="empty-note">Past events will be listed here.</p>`;
    },
    impact: () => F.impact.map(s => `<div class="stat"><b>${s.value ? esc(s.value) : '<span aria-hidden="true">&ndash;</span><span class="sr-only">Figure to be added</span>'}</b><span>${esc(s.label)}</span></div>`).join(""),
    people: el => F.people[el.dataset.group].slice(0, +el.dataset.max || 99).map(person).join(""),
    partners: () => F.partners.length ? F.partners.map(p => `<a class="partner" href="${esc(p.url || "#")}">${p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">` : esc(p.name)}</a>`).join("")
      : Array(4).fill('<div class="partner empty">Partner logo to be added</div>').join(""),
    news: el => rows(F.news[el.dataset.group], newsRow, el.dataset.none),
    videos: () => rows(F.videos, v => newsRow({ ...v, source: "Video" }), "Videos will be posted here."),
    documents: () => rows(F.documents, d => `<li><div><strong>${esc(d.title)}</strong><span>${esc(d.note)}</span></div>${d.url ? `<a class="link" href="${esc(d.url)}">View<span class="sr-only"> ${esc(d.title)}</span></a>` : todo("Document to be added")}</li>`, ""),
    latest: el => {
      const n = el.dataset.group === "videos" ? F.videos[0] : F.news[el.dataset.group][0];
      return n ? `<a class="link" href="${esc(n.url || "news-media.html")}">${esc(n.title)}</a>` : esc(el.dataset.none);
    },
    gallery: () => F.gallery.length ? F.gallery.map(g => `<figure class="photo"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><figcaption>${esc(g.caption)}</figcaption></figure>`).join("")
      : ["India Day Parade", "Diwali", "Health camps", "Food drives", "Women's Day", "Blood drives", "Scholarships", "Community service"].map((c, i) => `<figure class="photo p${i % 4 + 1}"><figcaption>${c}</figcaption></figure>`).join("")
  };

  function hero() {
    const box = document.querySelector(".hero-media");
    if (!box || !F.heroPhotos.length) return;
    box.innerHTML = F.heroPhotos.map((p, i) => `<img src="${esc(p.src)}" alt="${esc(p.alt)}"${i ? ' loading="lazy"' : ' class="on"'}>`).join("");
    const imgs = [...box.children];
    if (imgs.length < 2) return;
    let i = 0, timer = null;
    const ctl = document.createElement("button");
    ctl.type = "button"; ctl.className = "hero-ctl";
    const play = on => {
      clearInterval(timer);
      timer = on ? setInterval(() => { imgs[i].classList.remove("on"); i = (i + 1) % imgs.length; imgs[i].classList.add("on"); }, 6000) : null;
      ctl.textContent = on ? "Pause slideshow" : "Play slideshow";
    };
    ctl.addEventListener("click", () => play(!timer));
    box.parentElement.append(ctl);
    play(!matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  async function submit(e) {
    const form = e.target.closest("form[data-kind]");
    if (!form) return;
    e.preventDefault();
    const note = form.querySelector(".form-note"), news = form.dataset.kind === "newsletter";
    const data = new FormData(form), endpoint = news ? F.newsletterEndpoint : F.formEndpoint;
    if (endpoint) {
      const button = form.querySelector("[type=submit]");
      button.disabled = true; note.textContent = "Sending...";
      try {
        const r = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error(r.status);
        form.reset();
        note.textContent = news ? "Thank you. You are subscribed." : "Thank you. Your message has been sent.";
      } catch { note.textContent = "Your message could not be sent. Please try again."; }
      button.disabled = false;
    } else if (F.contact.email && !news) {
      const seen = [...new Set(data.keys())];
      const body = seen.map(k => `${k}: ${data.getAll(k).join(", ")}`).join("\n");
      const topic = form.querySelector("select[name=topic]")?.selectedOptions[0].text || "Volunteer";
      location.href = `mailto:${F.contact.email}?subject=${encodeURIComponent("FIA New England: " + topic)}&body=${encodeURIComponent(body)}`;
      note.textContent = "Your email app should open with this message. Press send there to finish.";
    } else note.textContent = "This form is not connected yet, so nothing was sent.";
  }

  document.addEventListener("submit", submit);
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-render]").forEach(el => { el.innerHTML = render[el.dataset.render](el); });
    document.querySelectorAll("[data-fill]").forEach(el => { el.innerHTML = contactValue[el.dataset.fill](); });
    document.querySelectorAll("[data-photo]").forEach(el => {
      const src = F.photos[el.dataset.photo];
      if (src) el.insertAdjacentHTML("afterbegin", `<img src="${esc(src)}" alt="" loading="lazy">`);
    });
    hero();
    const q = new URLSearchParams(location.search), topic = document.querySelector("select[name=topic]");
    if (topic && [...topic.options].some(o => o.value === q.get("topic"))) topic.value = q.get("topic");
    const msg = document.querySelector("textarea[name=message]");
    if (msg && q.get("event")) msg.value = `I would like to know more about: ${q.get("event")}`;
    // Content above a #section has just been filled in, so line the page up with it again
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });
  });
})();
