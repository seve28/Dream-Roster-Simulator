const T = {
  ru: {
    home: "Главная", teams: "Команды", roster: "Состав", simulate: "Играть",
    sub: "Олимпиада-2010 · матч в браузере",
    lead: "Собери сборную ОИ-2010 и сразу получи текст матча.",
    btnRoster: "Собрать состав", btnSim: "Играть матч",
    teamsTitle: "Сборные ОИ-2010",
    teamsLead: "Нажми команду — откроется её пул. Официальные 23 можно подставить одной кнопкой.",
    groupsTitle: "Группы Ванкувера",
    rosterTitle: "Состав",
    rosterLead: "Перетащи игрока из пула в слот справа: вратари, пары защиты, тройки нападения. Либо кликни игрока, потом слот.",
    fill: "Официальные 23", clear: "Сбросить", save: "Сохранить",
    playHere: "Играть этим составом",
    search: "Поиск",
    simTitle: "Матч",
    simLead: "Россия и Канада уже с официальной 23-кой. Можно сразу жать «Играть» или сначала поменять состав.",
    play: "Играть",
    group: "Группа",
    pool: "Пул", picked: "Состав по звеньям",
    saved: "Состав сохранён.",
    players: "игроков",
    how1t: "1. Сборная", how1: "Выбери команду ОИ-2010.",
    how2t: "2. Состав", how2: "Собери 23 из пула или возьми официальных.",
    how3t: "3. Матч", how3: "Нажми «Играть» и скопируй счёт в чат.",
    needData: "Не найден data.js. Лежит ли он в той же папке, что и index.html?",
    waitPlay: "Россия — Канада уже выбраны. Нажми «Играть».",
    copy: "Скопировать счёт",
    copied: "Скопировано"
  },
  en: {
    home: "Home", teams: "Teams", roster: "Roster", simulate: "Play",
    sub: "Olympics 2010 · match in the browser",
    lead: "Build a 2010 Olympic roster and get a text match at once.",
    btnRoster: "Build roster", btnSim: "Play match",
    teamsTitle: "OI-2010 teams",
    teamsLead: "Click a team to open its pool. Official 23 can be loaded in one tap.",
    groupsTitle: "Vancouver groups",
    rosterTitle: "Roster",
    rosterLead: "Drag a player from the pool onto a slot: goalies, D pairs, forward lines. Or click player, then slot.",
    fill: "Official 23", clear: "Clear", save: "Save",
    playHere: "Play this roster",
    search: "Search",
    simTitle: "Match",
    simLead: "Russia and Canada start with the official 23. Play now or edit the roster first.",
    play: "Play",
    group: "Group",
    pool: "Pool", picked: "Lines",
    saved: "Roster saved.",
    players: "players",
    how1t: "1. Team", how1: "Pick an OI-2010 side.",
    how2t: "2. Roster", how2: "Build 23 from the pool or load official.",
    how3t: "3. Match", how3: "Hit Play and copy the score to chat.",
    needData: "data.js is missing. Keep it next to index.html.",
    waitPlay: "Russia vs Canada is ready. Press Play.",
    copy: "Copy score",
    copied: "Copied"
  }
};

if (typeof DRS_DATA === "undefined") {
  document.querySelector("main").innerHTML = '<p class="err">data.js missing</p>';
  throw new Error("DRS_DATA");
}

let lang = localStorage.getItem("drs-lang") || "ru";
let selected = {};
try { selected = JSON.parse(localStorage.getItem("drs-selected") || "{}"); } catch (e) { selected = {}; }

function L() { return T[lang]; }
function nm(p) { return lang === "ru" ? p.nameRu : p.nameEn; }
function tn(t) { return lang === "ru" ? t.nameRu : t.nameEn; }
function persist() { localStorage.setItem("drs-selected", JSON.stringify(selected)); }

const SLOTS = [
  { id:"G1", pos:"G", group:"g", labelRu:"Основной", labelEn:"Starter" },
  { id:"G2", pos:"G", group:"g", labelRu:"Запасной", labelEn:"Backup" },
  { id:"G3", pos:"G", group:"g", labelRu:"3-й", labelEn:"3rd" },
  { id:"D1A", pos:"D", group:"d1", labelRu:"П1", labelEn:"P1" },
  { id:"D1B", pos:"D", group:"d1", labelRu:"П1", labelEn:"P1" },
  { id:"D2A", pos:"D", group:"d2", labelRu:"П2", labelEn:"P2" },
  { id:"D2B", pos:"D", group:"d2", labelRu:"П2", labelEn:"P2" },
  { id:"D3A", pos:"D", group:"d3", labelRu:"П3", labelEn:"P3" },
  { id:"D3B", pos:"D", group:"d3", labelRu:"П3", labelEn:"P3" },
  { id:"D7", pos:"D", group:"d7", labelRu:"7-й", labelEn:"7th" },
  { id:"F1L", pos:"F", group:"f1", labelRu:"ЛН", labelEn:"LW" },
  { id:"F1C", pos:"F", group:"f1", labelRu:"Ц", labelEn:"C" },
  { id:"F1R", pos:"F", group:"f1", labelRu:"ПН", labelEn:"RW" },
  { id:"F2L", pos:"F", group:"f2", labelRu:"ЛН", labelEn:"LW" },
  { id:"F2C", pos:"F", group:"f2", labelRu:"Ц", labelEn:"C" },
  { id:"F2R", pos:"F", group:"f2", labelRu:"ПН", labelEn:"RW" },
  { id:"F3L", pos:"F", group:"f3", labelRu:"ЛН", labelEn:"LW" },
  { id:"F3C", pos:"F", group:"f3", labelRu:"Ц", labelEn:"C" },
  { id:"F3R", pos:"F", group:"f3", labelRu:"ПН", labelEn:"RW" },
  { id:"F4L", pos:"F", group:"f4", labelRu:"ЛН", labelEn:"LW" },
  { id:"F4C", pos:"F", group:"f4", labelRu:"Ц", labelEn:"C" },
  { id:"F4R", pos:"F", group:"f4", labelRu:"ПН", labelEn:"RW" },
  { id:"FX", pos:"F", group:"fx", labelRu:"13-й", labelEn:"13th" }
];

function emptySlots() {
  const o = {};
  SLOTS.forEach(s => o[s.id] = null);
  return o;
}

function fillOfficialSlots(teamId) {
  const off = DRS_DATA.pools[teamId].players.filter(p => p.status === "official");
  const s = emptySlots();
  const take = (pos) => off.filter(p => p.pos === pos).sort((a,b) => b.rating - a.rating).map(p => p.id);
  const g = take("G"), d = take("D"), f = take("F");
  SLOTS.filter(x => x.pos==="G").forEach((x,i) => s[x.id] = g[i] || null);
  SLOTS.filter(x => x.pos==="D").forEach((x,i) => s[x.id] = d[i] || null);
  SLOTS.filter(x => x.pos==="F").forEach((x,i) => s[x.id] = f[i] || null);
  return s;
}

function ensureStarterRosters() {
  ["RUS", "CAN"].forEach(id => {
    const cur = selected[id];
    const empty = !cur || Array.isArray(cur) || usedIds(id).length === 0;
    if (empty) selected[id] = fillOfficialSlots(id);
  });
  persist();
}


function teamSlots(teamId) {
  let v = selected[teamId];
  if (!v) { selected[teamId] = emptySlots(); return selected[teamId]; }
  if (Array.isArray(v)) {
    const s = emptySlots();
    const pool = DRS_DATA.pools[teamId];
    const gs = v.map(id => pool.players.find(p => p.id === id)).filter(Boolean);
    const by = { G:[], D:[], F:[] };
    gs.forEach(p => by[p.pos] && by[p.pos].push(p.id));
    SLOTS.filter(x => x.pos==="G").forEach((x,i) => s[x.id] = by.G[i] || null);
    SLOTS.filter(x => x.pos==="D").forEach((x,i) => s[x.id] = by.D[i] || null);
    SLOTS.filter(x => x.pos==="F").forEach((x,i) => s[x.id] = by.F[i] || null);
    selected[teamId] = s;
    return s;
  }
  SLOTS.forEach(s => { if (!(s.id in v)) v[s.id] = null; });
  return v;
}

function usedIds(teamId) {
  return Object.values(teamSlots(teamId)).filter(Boolean);
}

function initials(p) {
  const n = (p.nameEn || p.nameRu || "?").trim().split(/\s+/);
  const a = (n[0]||"?")[0] || "?";
  const b = (n[n.length-1]||"?")[0] || "";
  return (a+b).toUpperCase();
}
function avColor(id) {
  let h = 0;
  for (let i=0;i<id.length;i++) h = (h*31 + id.charCodeAt(i)) >>> 0;
  const hues = [210, 222, 198, 188, 230, 200];
  return `hsl(${hues[h % hues.length]} 62% 38%)`;
}
function avatar(p) {
  const url = (window.DRS_PHOTOS || {})[p.id];
  if (url) return `<img class="avatar" src="${url}" alt="${nm(p)}" />`;
  return `<span class="avatar" style="background:${avColor(p.id)}">${initials(p)}</span>`;
}

let dragId = null;
let pickId = null;
let dragScrollTimer = null;

function dragAutoScroll(e) {
  const y = e.clientY;
  const edge = 80;
  let dy = 0;
  if (y < edge) dy = -22;
  else if (y > window.innerHeight - edge) dy = 22;
  if (dy) window.scrollBy(0, dy);
  const sheet = document.getElementById("pickedList");
  if (sheet) {
    const r = sheet.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right) {
      if (y < r.top + 50) sheet.scrollTop -= 18;
      else if (y > r.bottom - 50) sheet.scrollTop += 18;
    }
  }
}
if (!window.__drsDragScroll) {
  window.__drsDragScroll = true;
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragAutoScroll(e);
  });
}


function go(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("on", p.id === id));
  document.querySelectorAll("nav [data-go]").forEach(b => b.classList.toggle("active", b.dataset.go === id));
  location.hash = id;
}

function teamNameById(id) {
  const p = DRS_DATA.pools[id];
  return p ? (lang === "ru" ? p.nameRu : p.nameEn) : id;
}

function openTeam(id) {
  document.getElementById("teamSelect").value = id;
  renderPlayers();
  go("roster");
}

function renderGroups(targetId, clickable) {
  const root = document.getElementById(targetId);
  if (!root) return;
  root.innerHTML = "";
  Object.entries(DRS_DATA.teams.groups).forEach(([g, list]) => {
    const card = document.createElement("article");
    card.className = "card group-card";
    const rows = list.map(t => {
      const pool = DRS_DATA.pools[t.id];
      const players = pool ? pool.players : [];
      const n = players.length;
      const off = players.filter(p => p.status === "official").length;
      const gN = players.filter(p => p.pos === "G").length;
      const dN = players.filter(p => p.pos === "D").length;
      const fN = players.filter(p => p.pos === "F").length;
      const saved = (selected[t.id] || []).length;
      const savedTxt = saved ? (lang === "ru" ? `сохранено ${saved}/23` : `saved ${saved}/23`) : "";
      const openTxt = lang === "ru" ? "Открыть состав" : "Open roster";
      const hint = lang === "ru" ? "Наведи — откроется карточка" : "Hover to preview";
      return `<div class="team-row" data-team="${t.id}" tabindex="0">
        <div class="team-main">
          <span class="cc">${t.id}</span>
          <span class="team-name">${tn(t)}</span>
          <span class="pill">${n}</span>
        </div>
        <div class="team-pop">
          <div class="pop-meta">G ${gN} · D ${dN} · F ${fN} · official ${off}</div>
          ${savedTxt ? `<div class="pop-meta">${savedTxt}</div>` : ""}
          <button type="button" class="btn pop-btn" data-open="${t.id}">${openTxt}</button>
        </div>
      </div>`;
    }).join("");
    card.innerHTML = `<h3>${L().group} ${g}</h3>${rows}`;
    card.querySelectorAll("[data-open]").forEach(btn => {
      btn.onclick = (e) => { e.stopPropagation(); openTeam(btn.dataset.open); };
    });
    card.querySelectorAll(".team-row").forEach(row => {
      row.onclick = (e) => {
        if (e.target.closest("[data-open]")) return;
        openTeam(row.dataset.team);
      };
      row.onkeydown = (e) => { if (e.key === "Enter") openTeam(row.dataset.team); };
    });
    root.appendChild(card);
  });
}

function fillSelects() {
  const opts = Object.values(DRS_DATA.pools).map(p =>
    `<option value="${p.teamId}">${lang === "ru" ? p.nameRu : p.nameEn}</option>`
  ).join("");
  ["teamSelect", "homeTeam", "awayTeam"].forEach(id => {
    const el = document.getElementById(id);
    const keep = el.value;
    el.innerHTML = opts;
    if ([...el.options].some(o => o.value === keep)) el.value = keep;
  });
  if (!document.getElementById("homeTeam").value) document.getElementById("homeTeam").value = "RUS";
  if (!document.getElementById("awayTeam").value) document.getElementById("awayTeam").value = "CAN";
}

function currentTeamId() { return document.getElementById("teamSelect").value || "RUS"; }

function playersOf(teamId) {
  const pool = DRS_DATA.pools[teamId];
  return usedIds(teamId).map(id => pool.players.find(p => p.id === id)).filter(Boolean);
}

function findPlayer(teamId, id) {
  return DRS_DATA.pools[teamId].players.find(p => p.id === id);
}

function placePlayer(teamId, slotId, playerId) {
  const slots = teamSlots(teamId);
  const spec = SLOTS.find(s => s.id === slotId);
  const p = findPlayer(teamId, playerId);
  if (!spec || !p || p.pos !== spec.pos) return false;
  for (const k of Object.keys(slots)) if (slots[k] === playerId) slots[k] = null;
  slots[slotId] = playerId;
  persist();
  return true;
}

function renderPlayers() {
  const teamId = currentTeamId();
  const pool = DRS_DATA.pools[teamId];
  const q = (document.getElementById("q").value || "").toLowerCase();
  const pos = document.getElementById("posFilter").value;
  const st = document.getElementById("statusFilter").value;
  const used = new Set(usedIds(teamId));
  const list = pool.players.filter(p => {
    const hay = (p.nameRu + " " + p.nameEn + " " + p.club).toLowerCase();
    return (!q || hay.includes(q)) && (!pos || p.pos === pos) && (!st || p.status === st);
  });
  document.getElementById("playerList").innerHTML = list.map(p => `
    <div class="pool-card${used.has(p.id) ? " in" : ""}" draggable="true" data-id="${p.id}">
      ${avatar(p)}
      <span>${nm(p)} <small>${p.club}</small></span>
      <span class="badge ${p.status}">${p.pos} · ${p.rating}</span>
    </div>`).join("");

  const slots = teamSlots(teamId);
  const slabel = (s) => lang === "ru" ? s.labelRu : s.labelEn;
  const cell = (sid) => {
    const spec = SLOTS.find(s => s.id === sid);
    const id = slots[sid];
    const p = id ? findPlayer(teamId, id) : null;
    const inner = p
      ? `<div class="top">${avatar(p)}<div class="who">${nm(p)}<small> · ${p.rating}</small></div></div>`
      : `<span class="empty">${lang === "ru" ? "пусто" : "empty"}</span>`;
    return `<div class="slot" data-slot="${sid}" data-pos="${spec.pos}"><span class="lab">${slabel(spec)}</span>${inner}</div>`;
  };
  const titles = lang === "ru"
    ? { g:"Вратари", d1:"1-я пара", d2:"2-я пара", d3:"3-я пара", d7:"7-й защитник", f1:"1 звено", f2:"2 звено", f3:"3 звено", f4:"4 звено", fx:"13-й нап." }
    : { g:"Goalies", d1:"1st pair", d2:"2nd pair", d3:"3rd pair", d7:"7th D", f1:"1st line", f2:"2nd line", f3:"3rd line", f4:"4th line", fx:"13th F" };
  document.getElementById("pickedList").innerHTML = `
    <div class="unit"><h4>${titles.g}</h4><div class="slots">${cell("G1")+cell("G2")+cell("G3")}</div></div>
    <div class="unit"><h4>${titles.d1}</h4><div class="slots pair">${cell("D1A")+cell("D1B")}</div></div>
    <div class="unit"><h4>${titles.d2}</h4><div class="slots pair">${cell("D2A")+cell("D2B")}</div></div>
    <div class="unit"><h4>${titles.d3}</h4><div class="slots pair">${cell("D3A")+cell("D3B")}</div></div>
    <div class="unit"><h4>${titles.d7}</h4><div class="slots">${cell("D7")}</div></div>
    <div class="unit"><h4>${titles.f1}</h4><div class="slots line">${cell("F1L")+cell("F1C")+cell("F1R")}</div></div>
    <div class="unit"><h4>${titles.f2}</h4><div class="slots line">${cell("F2L")+cell("F2C")+cell("F2R")}</div></div>
    <div class="unit"><h4>${titles.f3}</h4><div class="slots line">${cell("F3L")+cell("F3C")+cell("F3R")}</div></div>
    <div class="unit"><h4>${titles.f4}</h4><div class="slots line">${cell("F4L")+cell("F4C")+cell("F4R")}</div></div>
    <div class="unit"><h4>${titles.fx}</h4><div class="slots">${cell("FX")}</div></div>`;

  document.querySelectorAll(".pool-card").forEach(el => {
    el.addEventListener("dragstart", () => { dragId = el.dataset.id; pickId = el.dataset.id; });
    el.addEventListener("click", () => { pickId = el.dataset.id; });
  });
  document.querySelectorAll(".slot").forEach(el => {
    el.addEventListener("dragover", e => { e.preventDefault(); el.classList.add("over"); });
    el.addEventListener("dragleave", () => el.classList.remove("over"));
    el.addEventListener("drop", e => {
      e.preventDefault(); el.classList.remove("over");
      if (dragId) placePlayer(teamId, el.dataset.slot, dragId);
      dragId = null;
      renderPlayers();
    });
    el.addEventListener("click", () => {
      if (pickId) {
        placePlayer(teamId, el.dataset.slot, pickId);
        pickId = null;
        renderPlayers();
      } else if (slots[el.dataset.slot]) {
        slots[el.dataset.slot] = null;
        persist();
        renderPlayers();
      }
    });
  });

  const ids = usedIds(teamId);
  const byPos = { G:0, D:0, F:0 };
  ids.forEach(id => { const p = findPlayer(teamId, id); if (p) byPos[p.pos]++; });
  const ok = ids.length === 23;
  document.getElementById("counts").className = "counts " + (ok ? "ok" : "warn");
  document.getElementById("counts").textContent =
    `${ids.length}/23  ·  G ${byPos.G}  D ${byPos.D}  F ${byPos.F}  ·  ${L().pool} ${pool.players.length}`;
}

function rosterForSim(teamId) {
  const pool = DRS_DATA.pools[teamId];
  let ids = usedIds(teamId);
  let source = ids.length === 23 ? "custom" : "official";
  if (ids.length !== 23) ids = pool.players.filter(p => p.status === "official").map(p => p.id);
  const players = ids.map(id => pool.players.find(p => p.id === id)).filter(Boolean);
  const g = players.filter(p => p.pos === "G").sort((a,b) => b.rating - a.rating)[0];
  const f = players.filter(p => p.pos === "F").sort((a,b) => b.rating - a.rating);
  const d = players.filter(p => p.pos === "D").sort((a,b) => b.rating - a.rating);
  const avg = players.reduce((s, p) => s + p.rating, 0) / Math.max(players.length, 1);
  return { avg, players, g, f, d, source, name: teamNameById(teamId), id: teamId };
}

function pick(arr) {
  const w = arr.map(p => Math.max(1, p.rating - 68));
  let s = w.reduce((a,b) => a+b, 0), r = Math.random() * s;
  for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; }
  return arr[arr.length - 1];
}

function emptyBoard() {
  const el = document.getElementById("board");
  el.className = "board empty";
  el.textContent = L().waitPlay;
}

function play() {
  const a = rosterForSim(document.getElementById("homeTeam").value);
  const b = rosterForSim(document.getElementById("awayTeam").value);
  const board = document.getElementById("board");
  if (a.id === b.id) {
    board.className = "board empty";
    board.textContent = lang === "ru" ? "Выбери две разные команды." : "Pick two different teams.";
    return;
  }
  const src = (tm) => tm.source === "official"
    ? (lang === "ru" ? "официальный состав" : "official roster")
    : (lang === "ru" ? "твой состав" : "your roster");
  const pname = (pl) => lang === "ru" ? pl.nameRu : pl.nameEn;
  const chance = (att, opp) => {
    const atk = (att.avg - 78) / 9;
    const gk = att.g && opp.g ? (opp.g.rating - 80) / 18 : 0;
    return Math.max(0.04, Math.min(0.24, 0.09 + atk * 0.05 - gk * 0.04));
  };
  const periods = [];
  let ga = 0, gb = 0;
  for (let p = 1; p <= 3; p++) {
    const ev = [];
    const slots = [];
    for (let i = 0; i < 7 + Math.floor(Math.random() * 5); i++) slots.push({ m: 1 + Math.floor(Math.random() * 20), side: "a" });
    for (let i = 0; i < 7 + Math.floor(Math.random() * 5); i++) slots.push({ m: 1 + Math.floor(Math.random() * 20), side: "b" });
    slots.sort((x,y) => x.m - y.m);
    slots.forEach(s => {
      const att = s.side === "a" ? a : b;
      const opp = s.side === "a" ? b : a;
      const mm = String(s.m).padStart(2, "0");
      if (Math.random() < chance(att, opp) && att.f.length) {
        const scorer = pick(att.f);
        if (s.side === "a") ga++; else gb++;
        ev.push({ goal: true, text: lang === "ru"
          ? `${mm}:00 — ГОЛ! ${pname(scorer)} (${att.name}). ${ga}:${gb}`
          : `${mm}:00 — GOAL! ${pname(scorer)} (${att.name}). ${ga}:${gb}` });
      } else if (Math.random() < 0.16 && att.f.length && opp.g) {
        const sh = pick(att.f);
        ev.push({ goal: false, text: lang === "ru"
          ? `${mm}:00 — сейв ${pname(opp.g)}. Бросал ${pname(sh)}.`
          : `${mm}:00 — save ${pname(opp.g)}. Shot by ${pname(sh)}.` });
      }
    });
    periods.push({ p, ev });
  }
  let extra = "";
  if (ga === gb) {
    const att = Math.random() < 0.5 ? a : b;
    const scorer = att.f[0];
    if (att === a) ga++; else gb++;
    extra = lang === "ru"
      ? `Овертайм / буллиты — ${pname(scorer)} (${att.name}).`
      : `OT / SO — ${pname(scorer)} (${att.name}).`;
  }
  const gkLine = lang === "ru"
    ? `Вратари: ${a.g ? a.g.nameRu : "—"} / ${b.g ? b.g.nameRu : "—"}`
    : `Goalies: ${a.g ? a.g.nameEn : "—"} / ${b.g ? b.g.nameEn : "—"}`;
  let html = `<div class="score">
    <div class="side">${a.name}<span class="src">${src(a)}</span></div>
    <div class="nums">${ga}:${gb}</div>
    <div class="side r">${b.name}<span class="src">${src(b)}</span></div>
  </div>`;
  html += `<div class="period"><div class="muted">${gkLine}</div></div>`;
  periods.forEach(pr => {
    html += `<div class="period"><h3>${lang === "ru" ? pr.p + "-й период" : "Period " + pr.p}</h3>`;
    if (!pr.ev.length) html += `<div class="muted">${lang === "ru" ? "Тихий отрезок." : "Quiet period."}</div>`;
    pr.ev.forEach(e => html += `<div class="event${e.goal ? " goal" : ""}">${e.text}</div>`);
    html += `</div>`;
  });
  if (extra) html += `<div class="period event goal">${extra}</div>`;
  html += `<div class="final">${lang === "ru" ? "Итог" : "Final"}: ${a.name} ${ga}:${gb} ${b.name}</div>`;
  const copyLine = `${a.name} ${ga}:${gb} ${b.name} — Dream Roster Simulator\nhttps://seve28.github.io/Dream-Roster-Simulator/`;
  html += `<div class="copybar"><button class="btn ghost" type="button" id="copyScore">${L().copy}</button></div>`;
  board.className = "board";
  board.innerHTML = html;
  const btn = document.getElementById("copyScore");
  if (btn) btn.onclick = async () => {
    try { await navigator.clipboard.writeText(copyLine); }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = copyLine; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    btn.textContent = L().copied;
    setTimeout(() => btn.textContent = L().copy, 1500);
  };
}

function applyLang() {
  document.getElementById("logoSub").textContent = L().sub;
  document.querySelectorAll("nav [data-go]").forEach(el => { el.textContent = L()[el.dataset.go] || el.dataset.go; });
  document.getElementById("langBtn").textContent = lang === "ru" ? "EN" : "RU";
  document.getElementById("homeLead").textContent = L().lead;
  document.getElementById("btnRoster").textContent = L().btnRoster;
  document.getElementById("btnSim").textContent = L().btnSim;
  document.getElementById("teamsTitle").textContent = L().teamsTitle;
  document.getElementById("teamsLead").textContent = L().teamsLead;
  document.getElementById("groupsTitle").textContent = L().groupsTitle;
  document.getElementById("rosterTitle").textContent = L().rosterTitle;
  document.getElementById("rosterLead").textContent = L().rosterLead;
  document.getElementById("fillOfficial").textContent = L().fill;
  document.getElementById("clearRoster").textContent = L().clear;
  document.getElementById("saveRoster").textContent = L().save;
  document.getElementById("playFromRoster").textContent = L().playHere;
  document.getElementById("q").placeholder = L().search;
  document.getElementById("simTitle").textContent = L().simTitle;
  document.getElementById("simLead").textContent = L().simLead;
  document.getElementById("playBtn").textContent = L().play;
  document.getElementById("poolLabel").textContent = L().pool;
  document.getElementById("pickedLabel").textContent = L().picked;
  document.getElementById("howGrid").innerHTML = [1,2,3].map(i =>
    `<article class="card"><h3>${L()["how"+i+"t"]}</h3><p>${L()["how"+i]}</p></article>`
  ).join("");
  if (!document.getElementById("board").innerHTML || document.getElementById("board").classList.contains("empty")) emptyBoard();
  renderGroups("homeGroups", true);
  renderGroups("teamsGroups", true);
  ensureStarterRosters();
  fillSelects();
  document.getElementById("homeTeam").value = "RUS";
  document.getElementById("awayTeam").value = "CAN";
  document.getElementById("teamSelect").value = "RUS";
  renderPlayers();
}

document.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
document.getElementById("langBtn").onclick = () => {
  lang = lang === "ru" ? "en" : "ru";
  localStorage.setItem("drs-lang", lang);
  applyLang();
};
document.getElementById("teamSelect").onchange = renderPlayers;
document.getElementById("q").oninput = renderPlayers;
document.getElementById("posFilter").onchange = renderPlayers;
document.getElementById("statusFilter").onchange = renderPlayers;
document.getElementById("fillOfficial").onclick = () => {
  const id = currentTeamId();
  selected[id] = fillOfficialSlots(id);
  persist();
  renderPlayers();
};
document.getElementById("clearRoster").onclick = () => {
  selected[currentTeamId()] = emptySlots();
  persist();
  renderPlayers();
};
document.getElementById("saveRoster").onclick = () => {
  persist();
  alert(L().saved);
};
document.getElementById("playBtn").onclick = play;
document.getElementById("swapBtn").onclick = () => {
  const h = document.getElementById("homeTeam");
  const a = document.getElementById("awayTeam");
  const tmp = h.value; h.value = a.value; a.value = tmp;
};
document.getElementById("playFromRoster").onclick = () => {
  document.getElementById("homeTeam").value = currentTeamId();
  if (document.getElementById("awayTeam").value === currentTeamId()) {
    document.getElementById("awayTeam").value = currentTeamId() === "RUS" ? "CAN" : "RUS";
  }
  go("simulate");
  play();
};

applyLang();
const start = (location.hash || "#home").slice(1);
go(["home","teams","roster","simulate"].includes(start) ? start : "home");
