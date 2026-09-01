const T = {
  ru: {
    home: "Главная", teams: "Команды", roster: "Состав", simulate: "Играть",
    sub: "Олимпиада-2010 · матч в браузере",
    lead: "Собери 23-ку любой сборной Ванкувера и сразу сыграй текстовый матч. Никакой очереди и предпрогона: состав выбираешь ты, результат считает сайт.",
    btnRoster: "Собрать состав", btnSim: "Играть матч",
    teamsTitle: "Сборные ОИ-2010",
    teamsLead: "Нажми команду — откроется её пул. Официальные 23 можно подставить одной кнопкой.",
    groupsTitle: "Группы Ванкувера",
    rosterTitle: "Состав",
    rosterLead: "Отметь игроков. Цель — 23 (обычно 3G + 7–8D + 12–13F). Состав пишется в браузер сам.",
    fill: "Официальные 23", clear: "Сбросить", save: "Сохранить",
    playHere: "Играть этим составом",
    search: "Поиск",
    simTitle: "Матч",
    simLead: "Если 23-ка не собрана, берётся официальный состав. Живой ИИ-репортаж — позже; сейчас движок в браузере.",
    play: "Играть",
    group: "Группа",
    pool: "Пул", picked: "Твоя 23-ка",
    saved: "Состав сохранён.",
    players: "игроков",
    how1t: "1. Сборная", how1: "Выбери команду ОИ-2010.",
    how2t: "2. Состав", how2: "Собери 23 из пула или возьми официальных.",
    how3t: "3. Матч", how3: "Нажми «Играть» — трансляция появится сразу.",
    needData: "Не найден data.js. Лежит ли он в той же папке, что и index.html?"
  },
  en: {
    home: "Home", teams: "Teams", roster: "Roster", simulate: "Play",
    sub: "Olympics 2010 · match in the browser",
    lead: "Build a 23-man Vancouver roster and play a text match instantly. You pick the players; the site runs the game.",
    btnRoster: "Build roster", btnSim: "Play match",
    teamsTitle: "OI-2010 teams",
    teamsLead: "Click a team to open its pool. Official 23 can be loaded in one tap.",
    groupsTitle: "Vancouver groups",
    rosterTitle: "Roster",
    rosterLead: "Pick players. Target: 23 (usually 3G + 7–8D + 12–13F). Autosaved in this browser.",
    fill: "Official 23", clear: "Clear", save: "Save",
    playHere: "Play this roster",
    search: "Search",
    simTitle: "Match",
    simLead: "If no custom 23 is saved, the official roster is used. AI live report comes later; the engine runs here.",
    play: "Play",
    group: "Group",
    pool: "Pool", picked: "Your 23",
    saved: "Roster saved.",
    players: "players",
    how1t: "1. Team", how1: "Pick an OI-2010 side.",
    how2t: "2. Roster", how2: "Build 23 from the pool or load official.",
    how3t: "3. Match", how3: "Hit Play — the report appears at once.",
    needData: "data.js is missing. Keep it next to index.html."
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

function go(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("on", p.id === id));
  document.querySelectorAll("nav [data-go]").forEach(b => b.classList.toggle("active", b.dataset.go === id));
  location.hash = id;
}

function teamNameById(id) {
  const p = DRS_DATA.pools[id];
  return p ? (lang === "ru" ? p.nameRu : p.nameEn) : id;
}

function renderGroups(targetId, clickable) {
  const root = document.getElementById(targetId);
  if (!root) return;
  root.innerHTML = "";
  Object.entries(DRS_DATA.teams.groups).forEach(([g, list]) => {
    const card = document.createElement("article");
    card.className = "card" + (clickable ? " click" : "");
    card.innerHTML = `<h3>${L().group} ${g}</h3>` + list.map(t => {
      const pool = DRS_DATA.pools[t.id];
      const n = pool ? pool.players.length : 0;
      const saved = (selected[t.id] || []).length;
      return `<div data-team="${t.id}">${t.flag} ${tn(t)} <span class="pill">${n}</span>${saved ? ` · ${saved}/23` : ""}</div>`;
    }).join("");
    if (clickable) {
      card.querySelectorAll("[data-team]").forEach(el => {
        el.style.cursor = "pointer";
        el.onclick = () => {
          document.getElementById("teamSelect").value = el.dataset.team;
          renderPlayers();
          go("roster");
        };
      });
    }
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
  return (selected[teamId] || []).map(id => pool.players.find(p => p.id === id)).filter(Boolean);
}

function renderPlayers() {
  const teamId = currentTeamId();
  const pool = DRS_DATA.pools[teamId];
  const q = (document.getElementById("q").value || "").toLowerCase();
  const pos = document.getElementById("posFilter").value;
  const st = document.getElementById("statusFilter").value;
  const picked = new Set(selected[teamId] || []);
  const list = pool.players.filter(p => {
    const hay = (p.nameRu + " " + p.nameEn + " " + p.club).toLowerCase();
    return (!q || hay.includes(q)) && (!pos || p.pos === pos) && (!st || p.status === st);
  });
  document.getElementById("playerList").innerHTML = list.map(p => `
    <label class="row">
      <input type="checkbox" data-id="${p.id}" ${picked.has(p.id) ? "checked" : ""} />
      <span>${nm(p)} <small>${p.club}</small></span>
      <span class="badge ${p.status}">${p.pos} · ${p.status} · ${p.rating}</span>
    </label>`).join("");
  const pickedPlayers = playersOf(teamId);
  document.getElementById("pickedList").innerHTML = pickedPlayers.length
    ? pickedPlayers.map(p => `<div class="row"><span></span><span>${nm(p)}</span><span class="badge">${p.pos} ${p.rating}</span></div>`).join("")
    : `<p class="muted">0/23</p>`;
  document.querySelectorAll("#playerList input").forEach(inp => {
    inp.addEventListener("change", () => {
      const set = new Set(selected[teamId] || []);
      if (inp.checked) set.add(inp.dataset.id); else set.delete(inp.dataset.id);
      selected[teamId] = [...set];
      persist();
      renderPlayers();
    });
  });
  const ids = selected[teamId] || [];
  const byPos = { G:0, D:0, F:0 };
  ids.forEach(id => { const p = pool.players.find(x => x.id === id); if (p) byPos[p.pos]++; });
  const ok = ids.length === 23;
  document.getElementById("counts").className = "counts " + (ok ? "ok" : "warn");
  document.getElementById("counts").textContent =
    `${ids.length}/23  ·  G ${byPos.G}  D ${byPos.D}  F ${byPos.F}  ·  ${L().pool} ${pool.players.length}`;
}

function rosterForSim(teamId) {
  const pool = DRS_DATA.pools[teamId];
  let ids = selected[teamId] || [];
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

function play() {
  const a = rosterForSim(document.getElementById("homeTeam").value);
  const b = rosterForSim(document.getElementById("awayTeam").value);
  if (a.id === b.id) {
    document.getElementById("simOut").textContent = lang === "ru" ? "Выбери две разные команды." : "Pick two different teams.";
    return;
  }
  const src = (t) => t.source === "official"
    ? (lang === "ru" ? "официальный состав" : "official roster")
    : (lang === "ru" ? "твой состав" : "your roster");
  const chance = (att, opp) => {
    const atk = (att.avg - 78) / 9;
    const gk = att.g && opp.g ? (opp.g.rating - 80) / 18 : 0;
    return Math.max(0.04, Math.min(0.24, 0.09 + atk * 0.05 - gk * 0.04));
  };
  const periods = [];
  let ga = 0, gb = 0;
  for (let p = 1; p <= 3; p++) {
    const ev = [];
    const na = 7 + Math.floor(Math.random() * 5);
    const nb = 7 + Math.floor(Math.random() * 5);
    const slots = [];
    for (let i = 0; i < na; i++) slots.push({ m: 1 + Math.floor(Math.random() * 20), side: "a" });
    for (let i = 0; i < nb; i++) slots.push({ m: 1 + Math.floor(Math.random() * 20), side: "b" });
    slots.sort((x,y) => x.m - y.m);
    let pa = 0, pb = 0;
    slots.forEach(s => {
      const att = s.side === "a" ? a : b;
      const opp = s.side === "a" ? b : a;
      if (Math.random() < chance(att, opp) && att.f.length) {
        const scorer = pick(att.f);
        if (s.side === "a") { ga++; pa++; } else { gb++; pb++; }
        const mm = String(s.m).padStart(2, "0");
        ev.push(lang === "ru"
          ? `${mm}:00 — ГОЛ! ${scorer.nameRu} (${att.name}). ${ga}:${gb}`
          : `${mm}:00 — GOAL! ${scorer.nameEn} (${att.name}). ${ga}:${gb}`);
      } else if (Math.random() < 0.16 && att.f.length && opp.g) {
        const sh = pick(att.f);
        ev.push(lang === "ru"
          ? `${String(s.m).padStart(2,"0")}:00 — сейв ${opp.g.nameRu}. Бросал ${sh.nameRu}.`
          : `${String(s.m).padStart(2,"0")}:00 — save ${opp.g.nameEn}. Shot by ${sh.nameEn}.`);
      }
    });
    periods.push({ p, ev, pa, pb });
  }
  let extra = "";
  if (ga === gb) {
    const att = Math.random() < 0.5 ? a : b;
    const scorer = att.f[0];
    if (att === a) ga++; else gb++;
    extra = lang === "ru"
      ? `Овертайм / буллиты — ${scorer.nameRu} (${att.name}).`
      : `OT / SO — ${scorer.nameEn} (${att.name}).`;
  }
  const lines = [
    `${a.name} (${src(a)}) — ${b.name} (${src(b)})`,
    lang === "ru"
      ? `Вратари: ${a.g ? a.g.nameRu : "—"} / ${b.g ? b.g.nameRu : "—"}`
      : `Goalies: ${a.g ? a.g.nameEn : "—"} / ${b.g ? b.g.nameEn : "—"}`,
    ""
  ];
  periods.forEach(pr => {
    lines.push(lang === "ru" ? `—— ${pr.p}-й период ——` : `—— Period ${pr.p} ——`);
    if (!pr.ev.length) lines.push(lang === "ru" ? "Тихий отрезок." : "Quiet period.");
    else pr.ev.forEach(e => lines.push(e));
    lines.push("");
  });
  if (extra) lines.push(extra, "");
  lines.push(lang === "ru" ? `ИТОГ: ${a.name} ${ga}:${gb} ${b.name}` : `FINAL: ${a.name} ${ga}:${gb} ${b.name}`);
  document.getElementById("simOut").textContent = lines.join("\n");
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
  renderGroups("homeGroups", true);
  renderGroups("teamsGroups", true);
  fillSelects();
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
  selected[id] = DRS_DATA.pools[id].players.filter(p => p.status === "official").map(p => p.id);
  persist();
  renderPlayers();
};
document.getElementById("clearRoster").onclick = () => {
  selected[currentTeamId()] = [];
  persist();
  renderPlayers();
};
document.getElementById("saveRoster").onclick = () => {
  persist();
  alert(L().saved);
};
document.getElementById("playBtn").onclick = play;
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
