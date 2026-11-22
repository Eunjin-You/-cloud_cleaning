(function () {
  'use strict';
  let context, master, timer, step = 0;
  const prefs = { sound: true, haptics: true };
  function unlock() {
    if (!context) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      context = new Audio();
      master = context.createGain();
      master.gain.value = prefs.sound ? .48 : 0;
      master.connect(context.destination);
    }
    if (context.state === 'suspended') context.resume().catch(() => {});
  }
  function note(frequency, duration = .12, volume = .12, time = 0, type = 'sine') {
    if (!context || !prefs.sound) return;
    const at = context.currentTime + time, tone = context.createOscillator(), gain = context.createGain();
    tone.type = type; tone.frequency.value = frequency;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + .008);
    gain.gain.exponentialRampToValueAtTime(.001, at + duration);
    tone.connect(gain); gain.connect(master); tone.start(at); tone.stop(at + duration + .02);
  }
  function noise(duration, volume, filter = 1000, delay = 0) {
    if (!context || !prefs.sound) return;
    const at = context.currentTime + delay, buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1;
    const source = context.createBufferSource(), eq = context.createBiquadFilter(), gain = context.createGain();
    source.buffer = buffer; eq.type = 'bandpass'; eq.frequency.value = filter;
    gain.gain.setValueAtTime(volume, at); gain.gain.exponentialRampToValueAtTime(.001, at + duration);
    source.connect(eq); eq.connect(gain); gain.connect(master); source.start(at); source.stop(at + duration);
  }
  function paper() { unlock(); noise(.22, .45, 2300); noise(.1, .2, 3800, .07); }
  function crumple() { unlock(); [0, .045, .11, .18].forEach(t => noise(.11, .4, 1400 + Math.random() * 1800, t)); }
  function whoosh() { unlock(); noise(.24, .2, 650); noise(.18, .24, 2600, .09); }
  function crack() { unlock(); noise(.3, .5, 500); noise(.12, .4, 2100, .05); note(74, .3, .18); vibrate([16, 40, 30]); }
  function restore() { unlock(); [523, 784, 1047].forEach((n,i) => note(n, .22, .12, i * .06)); }
  function impact(combo) {
    unlock(); note(72, .2, .42); noise(.07, .65, 800); noise(.12, .18, 2200, .05);
    const pitch = 523 * Math.pow(1.12246, Math.min(combo, 8));
    note(pitch, .2, .19, .045); note(pitch * 1.5, .25, .1, .12);
    vibrate([14, 20, 65]);
  }
  function applause() {
    unlock();
    for (let i = 0; i < 22; i++) noise(.08 + Math.random() * .05, .12, 900 + Math.random() * 2600, i * .06 + Math.random() * .02);
    [523, 659, 784, 1047].forEach((n, i) => note(n, .36, .15, i * .1));
    vibrate([30, 60, 30, 60, 70]);
  }
  function hapticSupport() {
    const available = typeof navigator.vibrate === 'function';
    return { available, detail: available ? '브라우저가 진동 요청을 지원해요. 아래에서 확인해 보세요.' : '이 브라우저에서는 진동을 지원하지 않아요. 소리와 화면 효과로 반응해요.' };
  }
  function vibrate(pattern = 15) {
    if (!prefs.haptics || !hapticSupport().available || document.hidden) return false;
    try { return navigator.vibrate(pattern) !== false; } catch { return false; }
  }
  function testHaptics() { return vibrate([25, 55, 45]); }
  function start() {
    unlock(); if (timer) return;
    step = 0;
    timer = setInterval(() => {
      if (document.hidden) return;
      const melody = [262, 0, 330, 392, 330, 0, 294, 392, 262, 330, 440, 392, 330, 294, 330, 0];
      const n = step++ % melody.length;
      if (n % 2 === 0) note(n % 4 === 0 ? 65 : 98, .18, .13);
      if (melody[n]) note(melody[n] * 2, .11, .035, 0, 'triangle');
      noise(.025, .045, 6500);
    }, 260);
  }
  function stop() { clearInterval(timer); timer = null; }
  function set(key, value) { prefs[key] = value; if (master) master.gain.setTargetAtTime(prefs.sound ? .48 : 0, context.currentTime, .03); }
  document.addEventListener('visibilitychange', () => { if (document.hidden) context?.suspend(); else if (context?.state === 'suspended') context.resume().catch(() => {}); });
  window.CleanupAudio = { prefs, unlock, paper, crumple, whoosh, crack, restore, impact, applause, vibrate, testHaptics, hapticSupport, start, stop, set };
})();
