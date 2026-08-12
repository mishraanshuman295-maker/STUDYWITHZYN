/**
 * ZYN Bhaiya Study Tracker - Main App
 * Fully working SPA with progress, videos, streaks, insights
 */

(function () {
  "use strict";

  let state = null;
  let currentScreen = "dashboard";
  let activeSubject = "science";
  let openChapters = new Set();

  // ========== INIT ==========
  function init() {
    state = ZYN_STORAGE.loadState();
    initTheme();

    if (!state.activeProfileId || !ZYN_STORAGE.getActiveProfile(state)) {
      currentScreen = "onboarding";
    }

    render();
    setupListeners();
  }

  function initTheme() {
    const saved = localStorage.getItem("zyn_theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("zyn_theme", next);
  }

  // ========== RENDER ==========
  function render() {
    const root = document.getElementById("app");
    if (!root) return;

    if (currentScreen === "onboarding") {
      root.innerHTML = renderOnboarding();
      return;
    }

    const profile = ZYN_STORAGE.getActiveProfile(state);
    if (!profile) {
      currentScreen = "onboarding";
      render();
      return;
    }

    root.innerHTML = `
      <header class="header">
        <div class="header-inner">
          <div class="logo">
            <div class="logo-icon">Z</div>
            <span>ZYN Bhaiya</span>
          </div>
          <div class="header-actions">
            <button class="btn-icon" id="btn-theme" title="Toggle theme">🌓</button>
            <button class="btn-icon" id="btn-profile" title="Profile">👤</button>
          </div>
        </div>
      </header>

      <div class="app-shell">
        ${currentScreen === "dashboard" ? renderDashboard(profile) : ""}
        ${currentScreen === "tracker" ? renderTracker(profile) : ""}
        ${currentScreen === "datesheet" ? renderDatesheet(profile) : ""}
        ${currentScreen === "insights" ? renderInsights(profile) : ""}
      </div>

      <nav class="bottom-nav">
        <button class="nav-item ${currentScreen === "dashboard" ? "active" : ""}" data-screen="dashboard">
          <span class="icon">🏠</span> Home
        </button>
        <button class="nav-item ${currentScreen === "tracker" ? "active" : ""}" data-screen="tracker">
          <span class="icon">📚</span> Tracker
        </button>
        <button class="nav-item ${currentScreen === "datesheet" ? "active" : ""}" data-screen="datesheet">
          <span class="icon">📅</span> Dates
        </button>
        <button class="nav-item ${currentScreen === "insights" ? "active" : ""}" data-screen="insights">
          <span class="icon">📊</span> Insights
        </button>
      </nav>
    `;

    bindScreenEvents();
  }

  // ========== ONBOARDING ==========
  function renderOnboarding() {
    return `
      <div class="onboarding-wrap">
        <div class="onboarding-card">
          <div style="text-align:center;margin-bottom:8px;font-size:2.5rem;">🚀</div>
          <h1>Welcome to ZYN Bhaiya</h1>
          <p class="subtitle">CBSE Class 9 & 10 Study Tracker — Track every stage, watch short lectures, crush the boards.</p>
          
          <div class="form-group">
            <label>Student Name</label>
            <input type="text" id="ob-name" placeholder="e.g. Aarav / Priya" maxlength="40" />
          </div>
          
          <div class="form-group">
            <label>Class / Grade</label>
            <select id="ob-grade">
              <option value="10">Class 10 (5 Stages)</option>
              <option value="9">Class 9 (3 Stages)</option>
            </select>
          </div>
          
          <button class="btn-primary" id="ob-start">Start Tracking →</button>
          
          <p style="text-align:center;margin-top:20px;font-size:0.75rem;color:var(--text-muted);">
            Built with ❤️ by ZYN Bhaiya • Progress saved locally
          </p>
        </div>
      </div>
    `;
  }

  // ========== DASHBOARD ==========
  function renderDashboard(profile) {
    const stats = computeStats(profile);
    const quote = ZYN_DATA.getRandomQuote();

    return `
      <div class="hero-stats">
        <div class="stat-card">
          <div class="stat-value">${stats.overall}%</div>
          <div class="stat-label">Overall</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.doneChapters}/${stats.totalChapters}</div>
          <div class="stat-label">Chapters Done</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${profile.streak.current}🔥</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${profile.streak.best}</div>
          <div class="stat-label">Best Streak</div>
        </div>
      </div>

      <div class="quote-banner">
        <div class="icon">💬</div>
        <div>
          <div class="quote-text">"${quote.text}"</div>
          <div class="quote-author">— ${quote.author}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">👋 Hey ${escapeHtml(profile.name)}!</div>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:12px;">
          Class ${profile.grade} • Keep the momentum going.
        </p>
        <button class="btn-primary" style="width:auto;padding:12px 24px;" data-screen="tracker">
          Continue Tracking →
        </button>
      </div>

      <div class="card">
        <div class="card-title">📈 Subject Snapshot</div>
        <div class="bar-chart">
          ${stats.bySubject.map(s => `
            <div class="bar-row">
              <div class="bar-label">${s.icon} ${s.name}</div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${s.pct}%;background:${s.color};"></div>
              </div>
              <div class="bar-pct">${s.pct}%</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // ========== TRACKER ==========
  function renderTracker(profile) {
    const data = profile.grade === 9 ? ZYN_DATA.CLASS_9 : ZYN_DATA.CLASS_10;
    const stages = ZYN_DATA.getStageKeys(profile.grade);

    const subjectTabs = data.map(sub => `
      <button class="subject-tab ${activeSubject === sub.id ? "active" : ""}" data-subject="${sub.id}">
        ${sub.icon} ${sub.name}
      </button>
    `).join("");

    const subject = data.find(s => s.id === activeSubject) || data[0];
    activeSubject = subject.id;

    let chaptersHtml = "";
    subject.groups.forEach(group => {
      if (group.name) {
        chaptersHtml += `<div class="group-header">${group.name}</div>`;
      }
      group.chapters.forEach(ch => {
        const key = ZYN_STORAGE.getChapterKey(subject.id, group.id, ch.id);
        const prog = profile.progress[key] || {};
        const doneCount = stages.filter(s => prog[s]).length;
        const pct = Math.round((doneCount / stages.length) * 100);
        const isOpen = openChapters.has(key);
        const video = ZYN_DATA.getVideoForChapter(profile.grade, subject.id, ch.id, ch.name);
        const note = profile.notes[key] || "";

        chaptersHtml += `
          <div class="chapter-card ${isOpen ? "open" : ""}" data-key="${key}">
            <div class="chapter-header" data-toggle="${key}">
              <div class="chapter-num">${ch.no}</div>
              <div class="chapter-info">
                <div class="chapter-name">${escapeHtml(ch.name)}</div>
                <div class="chapter-progress-bar">
                  <div class="chapter-progress-fill" style="width:${pct}%"></div>
                </div>
              </div>
              <div class="chapter-pct">${pct}%</div>
            </div>
            <div class="chapter-body">
              <div class="stages-grid">
                ${stages.map(st => {
                  const done = !!prog[st];
                  return `
                    <button class="stage-btn ${done ? "done" : ""}" data-stage="${st}" data-chkey="${key}">
                      <span class="check">${done ? "✅" : ZYN_DATA.STAGE_ICONS[st] || "○"}</span>
                      ${ZYN_DATA.getStageLabel(st)}
                    </button>
                  `;
                }).join("")}
              </div>

              <div class="video-rec">
                <div class="video-rec-text">
                  <strong>${video.title || "🎥 Short Lecture"}</strong>
                  ${video.tip || "Yah video dekh lo — 1 short lecture"}
                </div>
                <a class="btn-video" href="${video.url}" target="_blank" rel="noopener">
                  ▶ Watch Now
                </a>
              </div>

              <div class="notes-area">
                <textarea placeholder="Apne notes yahan likho..." data-note="${key}">${escapeHtml(note)}</textarea>
              </div>
            </div>
          </div>
        `;
      });
    });

    return `
      <div class="subject-tabs">${subjectTabs}</div>
      <div class="chapter-list">${chaptersHtml}</div>
    `;
  }

  // ========== DATESHEET ==========
  function renderDatesheet(profile) {
    const data = profile.grade === 9 ? ZYN_DATA.CLASS_9 : ZYN_DATA.CLASS_10;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const items = data.map(sub => {
      const dateStr = profile.datesheet[sub.id] || "";
      let countdown = "";
      if (dateStr) {
        const exam = new Date(dateStr);
        const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
        if (diff > 0) countdown = `${diff} days left`;
        else if (diff === 0) countdown = "Today! 🔥";
        else countdown = "Passed";
      }
      return `
        <div class="datesheet-item">
          <div>
            <strong>${sub.icon} ${sub.name}</strong>
            ${countdown ? `<div class="countdown">${countdown}</div>` : ""}
          </div>
          <input type="date" data-datesheet="${sub.id}" value="${dateStr}" />
        </div>
      `;
    }).join("");

    return `
      <div class="card">
        <div class="card-title">📅 Exam Datesheet</div>
        <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:16px;">
          Apne board exam dates daalo. Countdown automatically dikhega.
        </p>
        <div class="datesheet-grid">${items}</div>
      </div>
    `;
  }

  // ========== INSIGHTS ==========
  function renderInsights(profile) {
    const stats = computeStats(profile);
    const stages = ZYN_DATA.getStageKeys(profile.grade);

    return `
      <div class="card">
        <div class="card-title">📊 Overall Progress</div>
        <div class="text-center" style="font-size:3rem;font-weight:700;background:linear-gradient(135deg,#818cf8,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          ${stats.overall}%
        </div>
        <p class="text-center" style="color:var(--text-muted);">${stats.doneStages} / ${stats.totalStages} stages complete</p>
      </div>

      <div class="card">
        <div class="card-title">📚 By Subject</div>
        <div class="bar-chart">
          ${stats.bySubject.map(s => `
            <div class="bar-row">
              <div class="bar-label">${s.icon} ${s.name}</div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${s.pct}%;background:${s.color};"></div>
              </div>
              <div class="bar-pct">${s.pct}%</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-title">🔥 Streak</div>
        <p style="font-size:1.2rem;">Current: <strong>${profile.streak.current} days</strong></p>
        <p style="color:var(--text-secondary);">Best ever: ${profile.streak.best} days</p>
      </div>

      <div class="card">
        <div class="card-title">🛠️ Tools</div>
        <div class="flex gap-2" style="flex-wrap:wrap;">
          <button class="btn-secondary" id="btn-export">Export Progress</button>
          <button class="btn-secondary" id="btn-reset">Reset Progress</button>
        </div>
      </div>
    `;
  }

  // ========== STATS ==========
  function computeStats(profile) {
    const data = profile.grade === 9 ? ZYN_DATA.CLASS_9 : ZYN_DATA.CLASS_10;
    const stages = ZYN_DATA.getStageKeys(profile.grade);
    let totalStages = 0, doneStages = 0, totalChapters = 0, doneChapters = 0;
    const bySubject = [];

    data.forEach(sub => {
      let subTotal = 0, subDone = 0, chCount = 0, chDone = 0;
      sub.groups.forEach(g => {
        g.chapters.forEach(ch => {
          const key = ZYN_STORAGE.getChapterKey(sub.id, g.id, ch.id);
          const prog = profile.progress[key] || {};
          const done = stages.filter(s => prog[s]).length;
          subTotal += stages.length;
          subDone += done;
          chCount++;
          if (done === stages.length) chDone++;
        });
      });
      totalStages += subTotal;
      doneStages += subDone;
      totalChapters += chCount;
      doneChapters += chDone;
      bySubject.push({
        id: sub.id,
        name: sub.name,
        icon: sub.icon,
        color: sub.color,
        pct: subTotal ? Math.round((subDone / subTotal) * 100) : 0
      });
    });

    return {
      overall: totalStages ? Math.round((doneStages / totalStages) * 100) : 0,
      totalStages,
      doneStages,
      totalChapters,
      doneChapters,
      bySubject
    };
  }

  // ========== EVENTS ==========
  function setupListeners() {
    document.addEventListener("click", (e) => {
      // Onboarding
      if (e.target.id === "ob-start") {
        const name = document.getElementById("ob-name")?.value || "Student";
        const grade = parseInt(document.getElementById("ob-grade")?.value || "10", 10);
        const profile = ZYN_STORAGE.createProfile(name, grade);
        state.profiles.push(profile);
        state.activeProfileId = profile.id;
        ZYN_STORAGE.saveState(state);
        currentScreen = "dashboard";
        render();
        return;
      }

      // Theme
      if (e.target.id === "btn-theme" || e.target.closest("#btn-theme")) {
        toggleTheme();
        return;
      }

      // Profile switch / new
      if (e.target.id === "btn-profile" || e.target.closest("#btn-profile")) {
        if (confirm("Naya profile banao? (Current progress safe rahega)")) {
          currentScreen = "onboarding";
          state.activeProfileId = null;
          ZYN_STORAGE.saveState(state);
          render();
        }
        return;
      }

      // Bottom nav & buttons with data-screen
      const screenBtn = e.target.closest("[data-screen]");
      if (screenBtn) {
        currentScreen = screenBtn.dataset.screen;
        render();
        return;
      }

      // Subject tabs
      const subBtn = e.target.closest("[data-subject]");
      if (subBtn) {
        activeSubject = subBtn.dataset.subject;
        render();
        return;
      }

      // Chapter toggle
      const toggle = e.target.closest("[data-toggle]");
      if (toggle) {
        const key = toggle.dataset.toggle;
        if (openChapters.has(key)) openChapters.delete(key);
        else openChapters.add(key);
        render();
        return;
      }

      // Stage toggle
      const stageBtn = e.target.closest("[data-stage]");
      if (stageBtn) {
        const stage = stageBtn.dataset.stage;
        const chKey = stageBtn.dataset.chkey;
        const profile = ZYN_STORAGE.getActiveProfile(state);
        if (!profile) return;

        if (!profile.progress[chKey]) profile.progress[chKey] = {};
        profile.progress[chKey][stage] = !profile.progress[chKey][stage];

        ZYN_STORAGE.recordActivity(profile);
        ZYN_STORAGE.updateProfile(state, profile.id, profile);

        // Confetti if fully done
        const stages = ZYN_DATA.getStageKeys(profile.grade);
        const allDone = stages.every(s => profile.progress[chKey][s]);
        if (allDone) showConfetti();

        render();
        return;
      }

      // Export
      if (e.target.id === "btn-export") {
        const profile = ZYN_STORAGE.getActiveProfile(state);
        const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `zyn-progress-${profile.name}.json`;
        a.click();
        return;
      }

      // Reset
      if (e.target.id === "btn-reset") {
        if (confirm("Saara progress reset ho jayega. Sure?")) {
          const profile = ZYN_STORAGE.getActiveProfile(state);
          profile.progress = {};
          profile.notes = {};
          profile.streak = { current: 0, best: profile.streak.best, lastDate: null };
          ZYN_STORAGE.updateProfile(state, profile.id, profile);
          render();
        }
        return;
      }
    });

    // Notes & datesheet (input events)
    document.addEventListener("change", (e) => {
      const profile = ZYN_STORAGE.getActiveProfile(state);
      if (!profile) return;

      if (e.target.dataset.note !== undefined) {
        const key = e.target.dataset.note;
        profile.notes[key] = e.target.value;
        ZYN_STORAGE.updateProfile(state, profile.id, profile);
      }

      if (e.target.dataset.datesheet !== undefined) {
        const subId = e.target.dataset.datesheet;
        profile.datesheet[subId] = e.target.value;
        ZYN_STORAGE.updateProfile(state, profile.id, profile);
        render();
      }
    });

    // Debounced notes on input
    let noteTimer;
    document.addEventListener("input", (e) => {
      if (e.target.dataset.note === undefined) return;
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        const profile = ZYN_STORAGE.getActiveProfile(state);
        if (!profile) return;
        profile.notes[e.target.dataset.note] = e.target.value;
        ZYN_STORAGE.updateProfile(state, profile.id, profile);
      }, 500);
    });
  }

  function bindScreenEvents() {
    // already handled by global listeners
  }

  function showConfetti() {
    const el = document.createElement("div");
    el.className = "confetti-burst";
    el.textContent = "🎉✨🔥";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Start
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
