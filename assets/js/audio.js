(function () {
  'use strict';
  let context, master, timer, step = 0, loading;
  const voices = new Set();
  const prefs = { sound: true, haptics: true, music: true, volume: .35 };
  const script = document.currentScript?.src || new URL('../assets/js/audio.js', document.baseURI).href;
  const clips = {
    paper: { url: new URL('../audio/page-turn.mp3', script).href, gain: .5, duration: .68 },
    crumple: { url: new URL('../audio/paper-crumple.mp3', script).href, gain: .78, duration: 1.05 }
  };
  // HTMLAudio also supports opening the prototype directly as a local HTML file.
  for (const clip of Object.values(clips)) {
    clip.pool = Array.from({ length: 2 }, () => {
      const element = new Audio(clip.url);
      element.preload = 'auto';
      element.setAttribute('playsinline', '');
      return element;
    });
    clip.next = 0;
  }
  function loadClips() {
    if (loading || !context || location.protocol === 'file:') return;
    loading = Promise.all(Object.values(clips).map(async clip => {
      try {
        const response = await fetch(clip.url);
        if (!response.ok) return;
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        let peak = 0;
        for (let c = 0; c < buffer.numberOfChannels; c++) {
          const samples = buffer.getChannelData(c);
          for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
        }
        const scale = peak ? Math.min(3, .75 / peak) : 1;
        for (let c = 0; c < buffer.numberOfChannels; c++) {
          const samples = buffer.getChannelData(c);
          for (let i = 0; i < samples.length; i++) samples[i] *= scale;
        }
        clip.buffer = buffer;
      } catch { /* Use the local HTMLAudio recording if decoding is unavailable. */ }
    }));
  }
  function unlock() {
    if (!context) {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      if (AudioEngine) {
        try {
          context = new AudioEngine();
          master = context.createGain();
          const highpass = context.createBiquadFilter(), lowpass = context.createBiquadFilter(), compressor = context.createDynamicsCompressor();
          highpass.type = 'highpass'; highpass.frequency.value = 75; highpass.Q.value = .5;
          lowpass.type = 'lowpass'; lowpass.frequency.value = 4800; lowpass.Q.value = .5;
          compressor.threshold.value = -18; compressor.knee.value = 18; compressor.ratio.value = 2.5;
          compressor.attack.value = .008; compressor.release.value = .15;
          master.gain.value = prefs.sound ? prefs.volume : 0;
          master.connect(highpass); highpass.connect(lowpass); lowpass.connect(compressor); compressor.connect(context.destination);
        } catch { context = null; }
      }
    }
    if (context?.state === 'suspended') context.resume().catch(() => {});
    loadClips();
  }
  function playRecording(name) {
    if (!prefs.sound || !prefs.volume || document.hidden) return;
    unlock();
    const clip = clips[name];
    if (clip.buffer && context) {
      const now = context.currentTime, source = context.createBufferSource(), gain = context.createGain();
      const duration = Math.min(clip.duration, clip.buffer.duration);
      source.buffer = clip.buffer;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(clip.gain, now + .018);
      gain.gain.setValueAtTime(clip.gain, now + Math.max(.025, duration - .13));
      gain.gain.linearRampToValueAtTime(0, now + duration);
      source.connect(gain); gain.connect(master);
      const voice = { source, gain };
      voices.add(voice);
      // Crossfade older rustles instead of stacking a harsh wall of sound.
      if (voices.size > 2) {
        const oldest = voices.values().next().value;
        oldest.gain.gain.cancelScheduledValues(now);
        oldest.gain.gain.setTargetAtTime(0, now, .025);
        oldest.source.stop(now + .1); voices.delete(oldest);
      }
      source.onended = () => { voices.delete(voice); source.disconnect(); gain.disconnect(); };
      source.start(now); source.stop(now + duration + .015);
      return;
    }
    const element = clip.pool[clip.next++ % clip.pool.length];
    clearTimeout(element.fadeTimer); clearTimeout(element.stopTimer);
    element.pause(); element.currentTime = 0;
    const level = prefs.volume * clip.gain;
    element.volume = level;
    element.play().catch(() => {});
    element.fadeTimer = setTimeout(function fade() {
      element.volume *= .6;
      if (element.volume > .003) element.fadeTimer = setTimeout(fade, 20);
    }, Math.max(0, clip.duration * 1000 - 120));
    element.stopTimer = setTimeout(() => element.pause(), clip.duration * 1000 + 25);
  }
  function breath(duration = .12, level = .02, frequency = 350) {
    if (!context || !prefs.sound || document.hidden) return;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < samples.length; i++) { previous = (previous + (Math.random() * 2 - 1) * .035) / 1.035; samples[i] = previous; }
    const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain(), now = context.currentTime;
    source.buffer = buffer; filter.type = 'lowpass'; filter.frequency.value = frequency;
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(level, now + .015); gain.gain.linearRampToValueAtTime(0, now + duration);
    source.connect(filter); filter.connect(gain); gain.connect(master); source.start(); source.stop(now + duration);
  }
  function paper() { playRecording('paper'); }
  function crumple() { playRecording('crumple'); }
  function whoosh() { breath(.17, .05, 600); }
  function crack() { breath(.22, .075, 850); vibrate([16, 40, 30]); }
  function restore() { /* The ice animation supplies the confirmation without a chime. */ }
  function impact() { breath(.1, .16, 160); vibrate([14, 20, 65]); }
  function applause() { playRecording('paper'); vibrate([30, 60, 30, 60, 70]); }
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
    unlock(); if (timer || !prefs.music) return;
    step = 0;
    timer = setInterval(() => {
      if (!context || !prefs.sound || !prefs.music || document.hidden) return;
      // A very quiet, low register pulse; no high pitched arpeggio or combo beeps.
      const now = context.currentTime, tone = context.createOscillator(), gain = context.createGain();
      tone.type = 'sine'; tone.frequency.value = [130.81, 164.81, 146.83, 196][Math.floor(step++ / 2) % 4];
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(.025, now + .02); gain.gain.exponentialRampToValueAtTime(.0001, now + .19);
      tone.connect(gain); gain.connect(master); tone.start(); tone.stop(now + .2);
    }, 520);
  }
  function stop() { clearInterval(timer); timer = null; }
  function set(key, value) {
    prefs[key] = key === 'volume' ? Math.max(0, Math.min(1, Number(value) || 0)) : value;
    if (master) master.gain.setTargetAtTime(prefs.sound ? prefs.volume : 0, context.currentTime, .03);
    if (key === 'music' && !value) stop();
    if (key === 'sound' && !value || key === 'volume' && !prefs.volume) {
      for (const clip of Object.values(clips)) for (const element of clip.pool) element.pause();
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      context?.suspend();
      for (const clip of Object.values(clips)) for (const element of clip.pool) element.pause();
    } else if (context?.state === 'suspended') context.resume().catch(() => {});
  });
  window.CleanupAudio = { prefs, unlock, paper, crumple, whoosh, crack, restore, impact, applause, vibrate, testHaptics, hapticSupport, start, stop, set };
})();
