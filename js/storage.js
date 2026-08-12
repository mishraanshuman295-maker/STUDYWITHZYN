/**
 * ZYN Bhaiya Tracker - Storage Module
 * localStorage with profiles, progress, streaks, notes
 */

(function () {
  "use strict";

  const STORAGE_KEY = "zyn_bhaiya_tracker_v1";

  function safeGet() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("Storage read failed", e);
      return null;
    }
  }

  function safeSet(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn("Storage write failed", e);
      return false;
    }
  }

  function createEmptyState() {
    return {
      version: 1,
      activeProfileId: null,
      profiles: []
    };
  }

  function createProfile(name, grade) {
    const id = "p_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    return {
      id,
      name: name.trim() || "Student",
      grade: grade || 10,
      createdAt: new Date().toISOString(),
      datesheet: {},          // { subjectId: "YYYY-MM-DD" }
      progress: {},           // { chapterKey: { theory: true, ncert: true, ... } }
      notes: {},              // { chapterKey: "text" }
      streak: { current: 0, best: 0, lastDate: null },
      studyLog: [],           // [{ date, minutes, subject }]
      lastActive: new Date().toISOString()
    };
  }

  function getChapterKey(subjectId, groupId, chapterId) {
    if (groupId && groupId !== subjectId) {
      return `${subjectId}.${groupId}.${chapterId}`;
    }
    return `${subjectId}.${chapterId}`;
  }

  function loadState() {
    let state = safeGet();
    if (!state || !state.profiles) {
      state = createEmptyState();
      safeSet(state);
    }
    return state;
  }

  function saveState(state) {
    return safeSet(state);
  }

  function getActiveProfile(state) {
    if (!state || !state.activeProfileId) return null;
    return state.profiles.find(p => p.id === state.activeProfileId) || null;
  }

  function updateProfile(state, profileId, updater) {
    const idx = state.profiles.findIndex(p => p.id === profileId);
    if (idx === -1) return false;
    state.profiles[idx] = typeof updater === "function"
      ? updater(state.profiles[idx])
      : { ...state.profiles[idx], ...updater };
    state.profiles[idx].lastActive = new Date().toISOString();
    return saveState(state);
  }

  function recordActivity(profile) {
    const today = new Date().toISOString().slice(0, 10);
    if (profile.streak.lastDate === today) return profile;

    if (profile.streak.lastDate) {
      const last = new Date(profile.streak.lastDate);
      const diff = Math.floor((new Date(today) - last) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        profile.streak.current += 1;
      } else if (diff > 1) {
        profile.streak.current = 1;
      }
    } else {
      profile.streak.current = 1;
    }
    profile.streak.best = Math.max(profile.streak.best, profile.streak.current);
    profile.streak.lastDate = today;
    return profile;
  }

  window.ZYN_STORAGE = {
    loadState,
    saveState,
    createEmptyState,
    createProfile,
    getActiveProfile,
    updateProfile,
    getChapterKey,
    recordActivity
  };
})();
