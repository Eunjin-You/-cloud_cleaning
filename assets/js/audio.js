(function () {
  'use strict';
  let context, master, loading;
  let musicBuffer, musicLoading, musicBus, musicSource, musicWanted = false;
  const musicBpm = 138, musicBar = 240 / musicBpm, musicLevel = .85;
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
    if (document.body.dataset.mode === 'cleaning') prepareMusic();
  }
  function playRecording(name) {
    if (!prefs.sound || !prefs.volume || document.hidden) return;
    unlock();
    const clip = clips[name];
    duckMusic(clip.duration);
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
  // Render an original eight-bar groove once. Buffer looping keeps the beat steady
  // while the browser animates files, with no timer-driven notes during play.
  function prepareMusic() {
    if (musicLoading) return musicLoading;
    const Renderer = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Renderer || !context) return Promise.resolve();
    const rate = 24000, loopEnd = musicBar * 9;
    const renderer = new Renderer(1, Math.ceil((loopEnd + .5) * rate), rate);
    const mix = renderer.createGain(); mix.gain.value = .9; mix.connect(renderer.destination);
    const noise = renderer.createBuffer(1, Math.ceil(rate * .3), rate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const hz = midi => 440 * 2 ** ((midi - 69) / 12);
    const filters = new Map();
    function instrumentFilter(frequency, type = 'lowpass') {
      const key = `${type}-${frequency}`;
      if (!filters.has(key)) {
        const filter = renderer.createBiquadFilter(); filter.type = type;
        filter.frequency.value = frequency; filter.Q.value = .5;
        filter.connect(mix); filters.set(key, filter);
      }
      return filters.get(key);
    }
    function tone(frequency, at, duration, level, type = 'triangle', cutoff = 1800, fallTo = 0) {
      const voice = renderer.createOscillator(), gain = renderer.createGain();
      voice.type = type; voice.frequency.setValueAtTime(frequency, at);
      if (fallTo) voice.frequency.exponentialRampToValueAtTime(fallTo, at + .1);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(level, at + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
      voice.connect(gain); gain.connect(instrumentFilter(cutoff));
      voice.start(at); voice.stop(at + duration + .01);
    }
    function percussion(at, duration, level, frequency) {
      const voice = renderer.createBufferSource(), gain = renderer.createGain();
      voice.buffer = noise;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(level, at + .003);
      gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
      voice.connect(gain); gain.connect(instrumentFilter(frequency, 'bandpass'));
      voice.start(at); voice.stop(at + duration + .005);
    }
    const chords = [[62, 66, 69, 73], [61, 64, 69, 71], [62, 66, 69, 74], [62, 66, 67, 71]];
    const roots = [50, 45, 47, 43];
    const melody = [[66, 69, 73, 69, 66], [64, 69, 71, 69, 64], [66, 69, 74, 73, 69], [67, 71, 69, 66, 64]];
    const melodySteps = [2, 5, 7, 10, 14];
    const sixteenth = 60 / musicBpm / 4;
    // A preceding bar carries note tails across the loop boundary naturally.
    for (let bar = 0; bar < 9; bar++) {
      const phrase = (bar + 7) % 8, chord = Math.floor(phrase / 2);
      for (let step = 0; step < 16; step++) {
        const at = bar * musicBar + step * sixteenth;
        if (step % 4 === 0) tone(165, at, .2, .5, 'sine', 1000, 66);
        if (step === 14 && phrase % 2) tone(145, at, .13, .19, 'sine', 900, 70);
        if (step === 4 || step === 12) {
          percussion(at + .006, .11, .19, 1500);
          tone(190, at, .07, .045, 'triangle', 900);
        }
        if (step % 2 === 0) percussion(at + (step % 4 ? .009 : 0), .037, step % 4 ? .085 : .04, 4100);
        if (step === 7 || step === 15) percussion(at + .009, .025, .028, 3500);
        if ([0, 3, 6, 8, 10, 14].includes(step)) {
          const octave = step === 6 || step === 14 ? 12 : 0;
          tone(hz(roots[chord] + octave), at, step === 0 || step === 8 ? .24 : .15, .19, 'triangle', 780);
        }
        if ([2, 6, 10, 14].includes(step)) {
          chords[chord].forEach((note, i) => tone(hz(note), at + .009 + i * .003, .21, .045, 'triangle', 1700));
        }
        const index = melodySteps.indexOf(step);
        if (index >= 0) {
          const note = phrase % 2 && index === 4 ? melody[chord][0] + 12 : melody[chord][index];
          tone(hz(note), at + .012, .26, .095, 'sine', 2300);
          tone(hz(note) * 2, at + .012, .12, .018, 'sine', 2300);
        }
      }
    }
    musicLoading = renderer.startRendering().then(buffer => {
      musicBuffer = buffer;
      if (musicWanted) playMusic();
      return buffer;
    }).catch(() => { musicLoading = null; });
    return musicLoading;
  }
  function playMusic() {
    if (musicSource || !musicWanted || !musicBuffer || !context || !prefs.music || !prefs.sound || !prefs.volume || document.hidden) return;
    if (!musicBus) { musicBus = context.createGain(); musicBus.connect(master); }
    const now = context.currentTime, source = context.createBufferSource();
    source.buffer = musicBuffer; source.loop = true;
    source.loopStart = musicBar; source.loopEnd = musicBar * 9;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setValueAtTime(0, now);
    musicBus.gain.linearRampToValueAtTime(musicLevel, now + .18);
    source.connect(musicBus); musicSource = source;
    source.onended = () => { source.disconnect(); if (musicSource === source) musicSource = null; };
    source.start(now, source.loopStart);
  }
  function duckMusic(duration) {
    if (!musicSource || !musicBus) return;
    const now = context.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setTargetAtTime(.32, now, .015);
    musicBus.gain.setTargetAtTime(musicLevel, now + Math.min(duration, .8), .14);
  }
  function pauseMusic() {
    if (!musicSource) return;
    const now = context.currentTime, source = musicSource; musicSource = null;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setTargetAtTime(0, now, .015);
    source.stop(now + .06);
  }
  function start() {
    musicWanted = true; unlock();
    return prepareMusic().then(playMusic);
  }
  function stop() { musicWanted = false; pauseMusic(); }
  function set(key, value) {
    prefs[key] = key === 'volume' ? Math.max(0, Math.min(1, Number(value) || 0)) : value;
    if (master) master.gain.setTargetAtTime(prefs.sound ? prefs.volume : 0, context.currentTime, .03);
    if (!prefs.music || !prefs.sound || !prefs.volume) pauseMusic();
    else if (musicWanted) playMusic();
    if (key === 'sound' && !value || key === 'volume' && !prefs.volume) {
      for (const clip of Object.values(clips)) for (const element of clip.pool) element.pause();
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseMusic();
      context?.suspend();
      for (const clip of Object.values(clips)) for (const element of clip.pool) element.pause();
    } else if (context?.state === 'suspended') context.resume().then(playMusic).catch(() => {});
    else if (musicWanted) playMusic();
  });
  window.CleanupAudio = { prefs, unlock, paper, crumple, whoosh, crack, restore, impact, applause, vibrate, testHaptics, hapticSupport, start, stop, set };
})();
