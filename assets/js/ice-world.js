(function (root) {
  'use strict';
  class IceWorld {
    constructor(saved = {}) {
      saved = saved || {};
      this.limit = 8;
      this.period = 20000;
      this.tiles = Number.isFinite(saved.tiles) ? Math.max(0, Math.min(this.limit, Math.floor(saved.tiles))) : 4;
      this.elapsed = Number.isFinite(saved.elapsed) ? Math.max(0, Math.min(this.period - 1, saved.elapsed)) : 0;
      this.lost = Number.isFinite(saved.lost) ? Math.max(0, saved.lost) : 0;
    }
    tick(ms) {
      if (!Number.isFinite(ms) || ms < 0 || this.tiles === 0) return 0;
      this.elapsed += ms;
      let lost = 0;
      while (this.elapsed >= this.period && this.tiles > 0) {
        this.elapsed -= this.period;
        this.tiles--; this.lost++; lost++;
      }
      if (!this.tiles) this.elapsed = 0;
      return lost;
    }
    rescue() { const gained = this.tiles < this.limit; this.tiles = Math.min(this.limit, this.tiles + 1); this.elapsed = 0; return gained; }
    undoRescue(gained) { if (gained) this.tiles = Math.max(0, this.tiles - 1); }
    get seconds() { return Math.max(0, Math.ceil((this.period - this.elapsed) / 1000)); }
    snapshot() { return { tiles: this.tiles, elapsed: this.elapsed, lost: this.lost }; }
    reset() { this.tiles = 4; this.elapsed = 0; this.lost = 0; }
  }
  root.IceWorld = IceWorld;
})(typeof window === 'undefined' ? globalThis : window);
