(function (root) {
  'use strict';
  class CleanupSession {
    constructor(files, saved = {}) {
      this.files = files;
      this.decisions = {};
      for (const file of files) {
        if (['keep', 'hold', 'delete'].includes(saved.decisions?.[file.id])) this.decisions[file.id] = saved.decisions[file.id];
      }
      this.history = [];
      this.combo = 0;
      this.best = Number.isFinite(saved.best) ? saved.best : 0;
      this.queue = [];
      this.folder = null;
    }
    open(folder, held = false) {
      this.folder = folder;
      this.held = held;
      this.queue = this.files.filter(f => (!folder || f.category === folder) && (held ? this.decisions[f.id] === 'hold' : !this.decisions[f.id])).map(f => f.id);
      this.cursor = 0;
      this.combo = 0;
      this.history = [];
    }
    get current() { return this.files.find(f => f.id === this.queue[this.cursor]); }
    get done() { return this.cursor >= this.queue.length; }
    decide(action) {
      if (!['keep', 'hold', 'delete'].includes(action) || !this.current) return false;
      const file = this.current;
      this.history.push({ id: file.id, previous: this.decisions[file.id], combo: this.combo, best: this.best });
      this.decisions[file.id] = action;
      this.combo = action === 'delete' ? this.combo + 1 : 0;
      this.best = Math.max(this.best, this.combo);
      this.cursor++;
      return file;
    }
    undo() {
      const last = this.history.pop();
      if (!last) return false;
      if (last.previous) this.decisions[last.id] = last.previous;
      else delete this.decisions[last.id];
      this.combo = last.combo;
      this.best = last.best;
      this.cursor--;
      return true;
    }
    stats(folder) {
      const list = this.files.filter(f => !folder || f.category === folder);
      const stats = { total: list.length, pending: 0, keep: 0, hold: 0, delete: 0, freed: 0, size: 0 };
      for (const f of list) {
        const action = this.decisions[f.id] || 'pending';
        stats[action]++;
        stats.size += f.sizeMB;
        if (action === 'delete') stats.freed += f.sizeMB;
      }
      stats.reviewed = stats.total - stats.pending;
      return stats;
    }
    snapshot() { return { decisions: this.decisions, best: this.best }; }
    reset() { this.decisions = {}; this.history = []; this.combo = 0; this.best = 0; this.queue = []; this.cursor = 0; }
  }
  root.CleanupSession = CleanupSession;
})(typeof window === 'undefined' ? globalThis : window);
