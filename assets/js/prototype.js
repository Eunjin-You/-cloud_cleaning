(function () {
  'use strict';
  const mode = document.body.dataset.mode;
  const game = mode === 'cleaning', climate = mode === 'environment';
  const { files, categories, formatSize } = window.CloudData;
  const audio = window.CleanupAudio;
  const storageKey = `little-space-v3-${mode}`;
  let saved = {}; try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch {}
  const model = new window.CleanupSession(files, saved);
  const ice = new window.IceWorld(saved.ice);
  let iceHistory = [], iceEvent = '', iceEventAt = 0, tickAt = performance.now();
  if (saved.sound === false) audio.set('sound', false);
  if (saved.haptics === false) audio.set('haptics', false);
  if (saved.music === false) audio.set('music', false);
  if (Number.isFinite(saved.volume)) audio.set('volume', saved.volume);
  const app = document.querySelector('#app');
  const labels = { assignments: '학교 과제', leisure: '취미 생활', study: '공부 자료', media: '사진·동영상' };
  const colors = ['#dfb56a', '#a5b49b', '#9bacbf', '#c5a4ae'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tutorialKey = `little-space-guide-swipes-v1-${mode}`;
  let tutorialSeen = false;
  try { tutorialSeen = localStorage.getItem(tutorialKey) === 'seen'; } catch {}
  let view = 'home', busy = false, stage = 'review', modal = tutorialSeen ? '' : 'tutorial', activeFolder = null;
  let toastTimer, animationTimer, drag = null, suppressClick = false;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paths = {
    cloud: '<path d="M6 18h12a4 4 0 0 0 .6-7.95A6.5 6.5 0 0 0 6.2 8.3 4.9 4.9 0 0 0 6 18Z"/>',
    sound: '<path d="m11 4-6 5H2v6h3l6 5V4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
    muted: '<path d="m11 4-6 5H2v6h3l6 5V4ZM16 9l6 6m0-6-6 6"/>',
    settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="16" cy="17" r="3" fill="currentColor"/>',
    back: '<path d="m14 6-6 6 6 6"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>',
    keep: '<path d="m5 12 4 4L19 6"/>', hold: '<path d="M8 6v12M16 6v12"/>',
    bin: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    undo: '<path d="M4 10h10a6 6 0 1 1-5.5 8M4 10l5-5M4 10l5 5"/>',
    folder: '<path d="M3 6h7l2 3h9v11H3V6Z"/>',
    leaf: '<path d="M19 3C6 3 2 7 5 15s15 3 14-12ZM4 21 15 9"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8L21 9h-8V2Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    star: '<path d="m12 2 2.8 6 6.6.7-4.9 4.6 1.4 6.6-5.9-3.3-5.9 3.3 1.4-6.6L2.6 8.7l6.6-.7L12 2Z"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="m3 8-2 4 2 4m18-8 2 4-2 4M10 18h4"/>',
    spark: '<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z"/>',
    file: '<path d="M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8m-8 4h6"/>'
  };
  function icon(name, cls = '') { return `<svg class="icon ${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`; }
  function save() { try { localStorage.setItem(storageKey, JSON.stringify({ ...model.snapshot(), ...audio.prefs, ...(climate ? { ice: ice.snapshot() } : {}) })); } catch {} }
  function swipeAction(dx, dy, threshold = 60) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return '';
    if (Math.abs(dx) > Math.abs(dy)) return 'hold';
    return dy > 0 ? 'delete' : 'keep';
  }
  function header(back = false) {
    return `<header class="app-header">${back ? `<button class="icon-button" data-do="home" aria-label="책상으로 돌아가기">${icon('back')}</button>` : `<a class="wordmark" href="../index.html" aria-label="정리 방식 선택">${icon('cloud')}<span>작은 여유<span class="brand-period">.</span></span></a>`}${back ? `<span class="header-title">${model.held ? '보류' : labels[activeFolder]}</span>` : ''}<div class="header-tools"><button class="icon-button" data-do="sound" aria-label="${audio.prefs.sound ? '소리 끄기' : '소리 켜기'}" aria-pressed="${audio.prefs.sound}">${icon(audio.prefs.sound ? 'sound' : 'muted')}</button><button class="icon-button" data-do="settings" aria-label="설정">${icon('settings')}</button></div></header>`;
  }
  function shell(content, cls = '') {
    return `<main class="phone ${game ? 'game' : climate ? 'climate' : 'quiet'} ${cls}">${content}<div id="toast" class="toast" role="status" aria-live="polite"></div><div id="effects" class="effects" aria-hidden="true"></div></main>`;
  }
  function scene(empty = false, opening = false) {
    return `<div class="office ${game ? 'play-office' : ''} ${empty ? 'empty-office' : ''} ${opening ? 'opening' : ''}" aria-label="${empty ? '정리가 끝난 깨끗한 책상' : game ? '폴더 네 개가 쌓인 사무실 책상' : '클라우드 폴더가 담긴 서랍 네 개와 책상'}"><div class="wall-lines"></div><div class="office-window"><div class="sun"></div><div class="sky-cloud sky-cloud-one"></div><div class="sky-cloud sky-cloud-two"></div><div class="window-hill"></div><div class="window-cross"></div></div><div class="wall-note"><span>${game ? '하나씩 비우면,' : climate ? '보이지 않아도,' : '새로 시작하는'}</span><strong>${game ? '기분 좋은 여유.' : climate ? '영향은 남아요.' : '작은 공간.'}</strong><i></i></div><div class="desk-surface"></div><div class="desk-edge"></div><div class="desk-leg leg-left"></div><div class="desk-leg leg-right"></div><div class="desk-lamp"><i></i><b></b><span></span></div><div class="plant"><i></i><i></i><i></i><i></i><div></div></div><div class="coffee"><i></i></div>${empty ? `<div class="clear-desk">${icon(game ? 'spark' : 'keep')}<span>${game ? '작지만 확실한 성취.' : '한결 가벼워졌어요.'}</span></div>` : game ? folderTower() : cabinet()}<div class="floor-shadow"></div></div>`;
  }
  function folderTower() {
    return `<div class="folder-tower">${categories.map((c, i) => {
      const s = model.stats(c.id);
      return `<button class="physical-folder folder-${i} ${s.pending ? '' : 'finished-folder'}" style="--folder-color:${colors[i]};--tilt:${[-5, 3, -3, 4][i]}deg" data-folder="${c.id}" aria-label="${labels[c.id]} 폴더 열기, 확인할 파일 ${s.pending}개"><span class="folder-tab"></span><span class="folder-papers"></span><span class="folder-face"><b>${labels[c.id]}</b><span>${s.pending ? `정리할 파일 ${s.pending}개` : '정리 완료'} ${!s.pending ? icon('keep') : ''}</span></span></button>`;
    }).join('')}</div>`;
  }
  function cabinet() {
    return `<div class="cabinet"><div class="cabinet-top"></div>${categories.map((c, i) => {
      const s = model.stats(c.id);
      return `<button class="drawer drawer-${i} ${s.pending ? '' : 'drawer-done'}" data-folder="${c.id}" aria-label="${labels[c.id]} 폴더 열기, 확인할 파일 ${s.pending}개"><span class="drawer-label">${labels[c.id]}</span><span class="drawer-handle"></span><small>${s.pending ? `${s.pending}개` : '확인 완료'}</small>${!s.pending ? icon('keep') : ''}</button>`;
    }).join('')}<div class="cabinet-foot"></div></div>`;
  }
  function storagePanel(compact = false) {
    const s = model.stats(), pct = Math.round((s.size - s.freed) / s.size * 100);
    return `<button class="storage-panel ${compact ? 'compact' : ''}" data-do="impact"><span class="storage-symbol">${icon('bolt')}</span><span class="storage-copy"><span>${compact ? '아직 보관 중인 용량' : '클라우드 속 파일도 공간을 차지해요'}</span><strong>${formatSize(Math.max(0, s.size - s.freed))}<small>의 예시 파일이 남아 있어요</small></strong><span class="load-track"><i style="width:${pct}%"></i></span><small>예시 파일 기준 · ${pct}% 남음</small></span>${icon('info')}</button>`;
  }
  function gameHud() {
    const s = model.stats(), level = Math.min(4, Math.floor(s.reviewed / 9) + 1);
    return `<div class="quest-hud"><span class="level-pill">${icon('star')} 레벨 ${level}</span><span class="quest-xp">${icon('bolt')} 경험치 ${s.delete * 100}</span></div>`;
  }
  function arcticScene(compact = false) {
    const n = ice.tiles, mood = n <= 2 ? 'sad' : n >= 6 ? 'happy' : 'neutral';
    const event = performance.now() - iceEventAt < 1400 ? iceEvent : '';
    const positions = [[30, 18, 22], [51, 17, -17], [12, 12, -12], [70, 11, 15], [21, 2, 10], [60, 1, -8], [2, 3, -18], [80, 0, 20]];
    return `<div class="polar-scene ${compact ? 'polar-compact' : ''} ${n <= 2 ? 'polar-danger' : ''} ${n === 0 ? 'polar-submerged' : ''} ${event ? `ice-${event}` : ''}" data-arctic-scene role="region" aria-label="북극곰의 보금자리, 빙하 8개 중 ${n}개 남음"><div class="polar-aurora"></div><div class="polar-snow" aria-hidden="true">${'<i></i>'.repeat(9)}</div><div class="polar-hud"><span class="ice-health">${icon('leaf')} 빙하 <strong>${String(n).padStart(2, '0')}</strong><small>/ 08</small></span><button class="polar-info" data-do="impact" aria-label="빙하 시뮬레이션 안내">${icon('info')}</button></div><div class="ice-platform">${positions.slice(0, n).map(([x,y,angle]) => `<img class="habitat-ice" src="../assets/images/ice.png" alt="" style="left:${x}%;bottom:${y}%;--ice-angle:${angle}deg">`).join('')}</div><div class="polar-bear-wrap"><img class="polar-bear" src="../assets/images/polar-bear-${mood}.png" alt="${n <= 2 ? '얼마 남지 않은 빙하 위에서 걱정하는 북극곰' : n >= 6 ? '넓어진 빙하 위에서 기뻐하는 북극곰' : '줄어드는 빙하 위에서 불안해하는 북극곰'}"></div><div class="polar-front-water"></div>${event === 'break' ? '<img class="falling-ice" src="../assets/images/ice.png" alt="빙하 조각이 떨어져 바다로 가라앉는 모습"><div class="ice-splash"></div>' : ''}${event === 'restore' ? '<div class="ice-gain">빙하 +1</div>' : ''}<div class="polar-bottom"><span class="habitat-status">${n === 0 ? '보금자리가 물에 잠겼어요.' : n <= 2 ? '보금자리가 거의 사라졌어요.' : n < 5 ? '보금자리가 무너지고 있어요.' : '머물 곳이 조금 넓어졌어요.'}</span><span class="melt-countdown">${icon('bolt')} ${n ? '빙하가 떨어지기까지' : '빙하를 되찾아 주세요'} <b data-melt-clock>${n ? `00:${String(ice.seconds).padStart(2,'0')}` : '0 / 8'}</b></span></div></div>`;
  }
  function climateHome() {
    const s = model.stats();
    return shell(`${header()}<section class="polar-home-intro"><div class="eyebrow">북극곰의 보금자리를 지켜 주세요</div><h1>쌓인 파일 뒤에,<br><em>사라지는 집.</em></h1><p>클라우드는 눈에 보이지 않아도,<br>환경에 남기는 흔적은 사라지지 않아요.</p></section>${arcticScene()}<div class="polar-rule"><span>${icon('bin')} 파일 하나를 지우면 빙하 한 조각이 돌아와요.</span><small>정리하는 동안 20초마다 빙하가 떨어져요.</small></div><section class="polar-folders"><div class="polar-folder-heading"><strong>정리할 폴더를 골라 주세요</strong><span>${s.reviewed} / 36개 확인</span></div><div class="polar-folder-grid">${categories.map((c,i) => { const st = model.stats(c.id); return `<button data-folder="${c.id}" class="polar-folder" style="--folder-color:${colors[i]}">${icon('folder')}<strong>${labels[c.id]}</strong><span>${st.pending ? `확인할 파일 ${st.pending}개` : '정리 완료'}</span></button>`; }).join('')}</div><button class="held-link" data-do="held">${icon('hold')} 보류 <span>${s.hold}</span></button><div class="demo-note">가상 환경 연출 · 예시 파일</div></section>`, 'home-screen polar-home');
  }
  function climateReview() {
    const pct = model.cursor / model.queue.length * 100;
    return shell(`${header(true)}${arcticScene(true)}<div class="polar-live-rule">${icon('bin')} 삭제하면 빙하가 돌아와요 <span>보관·보류 시 빙하는 늘지 않아요</span></div><section class="session-top"><div class="session-count"><span>지금도 빙하가 녹고 있어요</span><strong>${model.cursor + 1}<small> / ${model.queue.length}</small></strong></div><div class="session-track"><i style="width:${pct}%"></i></div></section><section class="sorting-desk"><div class="paper-stack"><div class="back-paper back-paper-one"></div>${fileCard(model.current)}</div></section><section class="decision-panel"><div class="gesture-guide"><span>아래로 밀기</span><span>위로 밀기</span><span>좌우로 밀기</span></div><div class="decision-actions"><button class="decision delete-button" data-decision="delete">${icon('bin')}<span>삭제</span></button><button class="decision keep-button" data-decision="keep">${icon('keep')}<span>보관</span></button><button class="decision hold-button" data-decision="hold">${icon('hold')}<span>보류</span></button></div><div class="session-footer"><button class="undo-button" data-do="undo" ${model.history.length ? '' : 'disabled'}>${icon('undo')} 되돌리기</button><span>가상 환경 · ${formatSize(model.stats().freed)} 정리</span></div></section>`, 'review-screen polar-review stage-review');
  }
  function updateArctic(event = '') {
    if (event) { iceEvent = event; iceEventAt = performance.now(); }
    const old = document.querySelector('[data-arctic-scene]');
    if (old) old.outerHTML = arcticScene(old.classList.contains('polar-compact'));
  }
  if (climate) setInterval(() => {
    const now = performance.now(), ms = now - tickAt; tickAt = now;
    if (document.hidden || modal || view !== 'review' || model.done) return;
    const lost = ice.tick(ms);
    if (lost) { save(); updateArctic('break'); audio.crack(); announce('빙하가 떨어졌어요. 북극곰의 집이 작아지고 있어요.'); }
    document.querySelectorAll('[data-melt-clock]').forEach(el => { el.textContent = ice.tiles ? `00:${String(ice.seconds).padStart(2,'0')}` : '0 / 8'; });
  }, 200);
  function home() {
    if (climate) return climateHome();
    const s = model.stats();
    return shell(`${header()}<section class="home-intro"><div class="eyebrow">${game ? `${icon('spark')} 작은 정리, 커다란 뿌듯함` : climate ? '쌓인 파일 뒤에 숨은 환경 부담' : '오늘은 클라우드도 가볍게'}</div><h1>${game ? '가볍게 비우고,<br><em>신나게 정리해요.</em>' : climate ? '클라우드에도<br><em>흔적이 남아요.</em>' : '클라우드도,<br><em>마음도 가볍게.</em>'}</h1><p>${game ? '쌓여 있는 파일도 하나씩 쏙쏙.<br>기분 좋은 정리를 시작해 볼까요?' : climate ? '파일 뒤에는 실제 서버가 있어요.<br>불필요한 사본도 자원을 차지해요.' : '폴더 하나, 파일 하나씩.<br>필요한 것만 남겨 볼까요?'}</p></section>${climate ? storagePanel() : ''}${game ? gameHud() : ''}<section class="office-section">${scene()}<div class="scene-caption"><span class="tiny-dot"></span>${game ? '정리할 파일 더미를 눌러 주세요' : '서랍을 눌러 폴더를 열어 주세요'}</div></section><section class="home-bottom"><div class="home-progress"><div><strong>${s.reviewed}<span> / ${s.total}</span></strong><small>확인한 파일</small></div><div class="mini-progress" style="--progress:${s.reviewed / s.total * 100}%"><i></i></div><div class="space-total"><strong>${formatSize(s.freed)}</strong><small>확보한 공간</small></div></div><button class="held-link" data-do="held">${icon('hold')} 보류 <span>${s.hold}</span></button><div class="demo-note">예시 파일로 체험해요. 실제 파일은 바뀌지 않아요.</div></section>`, 'home-screen');
  }
  function previewArt(file) {
    if (['JPG', 'PNG', 'MP4'].includes(file.type)) {
      const isSchedule = file.id === 'm7', isCoupon = file.id === 'l9', isPoster = file.id === 'm9';
      return `<div class="file-preview preview-${file.category} ${isSchedule ? 'schedule-preview' : isCoupon ? 'coupon-preview' : isPoster ? 'poster-preview' : 'landscape-preview'}" aria-hidden="true">${isSchedule ? '<div>월　화　수　목　금</div><i></i><i></i><i></i>' : isCoupon ? '<span>기분 좋은 날,<br>커피 한 잔</span><b>커피 1잔 무료</b>' : isPoster ? '<span>졸업 작품<br>전시회</span><b>2024. 11</b>' : `<div class="photo-sun"></div><div class="photo-mountain"></div><div class="photo-water"></div>${file.type === 'MP4' ? '<div class="play-symbol">▶</div>' : ''}`}<small>${file.type === 'MP4' ? '동영상 미리보기' : '이미지 미리보기'}</small></div>`;
    }
    return `<div class="document-preview" aria-hidden="true"><span>${file.type}</span><div class="doc-line long"></div><div class="doc-line medium"></div><div class="doc-chart"><i></i><i></i><i></i><i></i><i></i></div><div class="doc-line long"></div><div class="doc-line short"></div></div>`;
  }
  function fileCard(file) {
    const duplicate = file.duplicateKey && files.some(f => f.id !== file.id && f.duplicateKey === file.duplicateKey && model.decisions[f.id] !== 'delete');
    return `<article class="paper" id="file-card" tabindex="0" aria-label="${escape(file.name)}. ${game ? '아래로 밀어 구겨서 버리기' : '아래로 밀어 삭제'}, 위로 밀어 보관, 좌우로 밀어 보류."><div class="paper-top"><span class="file-type type-${file.type.toLowerCase()}">${icon('file')} ${file.type}</span><span>${formatSize(file.sizeMB)}</span></div><h2>${escape(file.name)}</h2><div class="file-age">${file.lastAccessMonths}개월 전 열어봄${duplicate ? '<span class="duplicate-tag">사본 있음</span>' : ''}</div>${previewArt(file)}<div class="preview-label">내용 미리보기</div><p class="file-excerpt" lang="ko">${escape(file.preview.slice(0, 155))}${file.preview.length > 155 ? '…' : ''}</p><div class="paper-footer"><span>${icon('cloud')} ${labels[file.category]}</span><span>예시 파일</span></div><div class="swipe-stamp" id="swipe-stamp" aria-hidden="true"></div></article>`;
  }
  function review() {
    if (model.done) return complete();
    if (climate) return climateReview();
    const pct = model.cursor / model.queue.length * 100;
    return shell(`${header(true)}${game ? gameHud() : ''}<section class="session-top"><div class="session-count"><span>${game ? '구기고, 던지고, 가볍게!' : '한 번에 파일 하나씩'}</span><strong>${model.cursor + 1}<small> / ${model.queue.length}</small></strong></div><div class="session-track"><i style="width:${pct}%"></i></div>${game ? `<div class="combo-bar"><span class="combo-badge ${model.combo >= 2 ? 'hot' : ''}">${icon('bolt')} <b>${model.combo > 1 ? `${model.combo}연속 콤보` : '연속 삭제에 도전해요'}</b></span><span>${model.best ? `최고 기록 ${model.best}연속` : '버릴 때마다 경험치 +100'}</span></div>` : '<div class="session-instruction">이 파일, 클라우드에 계속 둘까요?</div>'}</section><section class="sorting-desk"><div class="destination keep-destination">${icon('folder')}<span>보관</span></div><div class="destination hold-destination">${icon('hold')}<span>보류 <b>${model.stats().hold}</b></span></div><div class="desk-grain"></div><div class="paper-stack"><div class="back-paper back-paper-one"></div><div class="back-paper back-paper-two"></div>${fileCard(model.current)}</div>${game ? `<div class="bin-target-ring"></div><div class="trash-bin" id="trash-bin" aria-label="휴지통"><div class="bin-rim"></div><div class="bin-body"><i></i><i></i><i></i><span>${icon('bin')}</span></div><span class="bin-shadow"></span></div><span class="toss-desk-hint">아래로 쓱, 휴지통에 쏙!</span>` : ''}</section><section class="decision-panel"><div class="gesture-guide"><span>아래로 밀기</span><span>위로 밀기</span><span>좌우로 밀기</span></div><div class="decision-actions"><button class="decision delete-button" data-decision="delete">${icon('bin')}<span>${game ? '구겨서 버리기' : '삭제'}</span></button><button class="decision keep-button" data-decision="keep">${icon('keep')}<span>보관</span></button><button class="decision hold-button" data-decision="hold">${icon('hold')}<span>보류</span></button></div><div class="session-footer"><button class="undo-button" data-do="undo" ${model.history.length ? '' : 'disabled'}>${icon('undo')} 되돌리기</button><span>${game ? '한 번만 쓱 밀면 휴지통으로 쏙!' : '천천히 살펴보고 결정해도 괜찮아요.'}</span></div></section>`, 'review-screen stage-review');
  }
  function complete() {
    const sessionFiles = model.queue.map(id => files.find(f => f.id === id));
    const stats = model.held ? { keep: 0, hold: 0, delete: 0, freed: 0 } : model.stats(activeFolder);
    if (model.held) sessionFiles.forEach(f => { const d = model.decisions[f.id]; if (d) stats[d]++; if (d === 'delete') stats.freed += f.sizeMB; });
    return shell(`${header(true)}<section class="complete-intro"><div class="completion-seal">${icon(game ? 'star' : climate ? 'leaf' : 'keep')}</div><div class="eyebrow">${game ? '파일 더미 정리 완료' : '폴더 정리 완료'}</div><h1>${game ? '정리 끝! 잘했어요.' : climate ? '파일을 줄이면,<br>부담도 줄어요.' : '작은 공간에,<br>조금 더 큰 여유.'}</h1><p>${game ? '파일 더미 하나를 비웠어요. 한결 가벼워졌네요!' : climate ? '더는 필요하지 않은 파일을 정리했어요.' : '파일마다 자리를 정해 줬어요. 책상이 깨끗해졌네요.'}</p></section><div class="complete-scene">${climate ? arcticScene() : scene(true)}</div><section class="result-panel"><div class="result-space"><strong>${formatSize(stats.freed)}</strong><span>확보한 공간</span></div><div class="result-stats"><div>${icon('keep')}<strong>${stats.keep}</strong><span>보관</span></div><div>${icon('hold')}<strong>${stats.hold}</strong><span>보류</span></div><div>${icon('bin')}<strong>${stats.delete}</strong><span>삭제</span></div></div>${game && model.best > 1 ? `<div class="best-streak">${icon('bolt')} 최고 기록: ${model.best}개 연속 삭제</div>` : ''}${climate ? '<p class="result-note">예시 파일의 용량 변화이며, 실제 탄소 감축량은 아니에요.</p>' : ''}<button class="primary-button" data-do="home">책상으로 돌아가기</button>${model.history.length ? `<button class="text-button" data-do="undo">${icon('undo')} 마지막 선택 되돌리기</button>` : ''}</section>`, 'complete-screen');
  }
  function held() {
    const list = files.filter(f => model.decisions[f.id] === 'hold');
    return shell(`${header(true)}<section class="held-screen"><div class="eyebrow">아직 고민되는 파일은 여기에</div><h1>지금 바로<br><em>결정하지 않아도 돼요.</em></h1><p>아직 고민되는 파일을 모아 뒀어요. 준비되면 다시 살펴보세요.</p><div class="held-files">${list.length ? list.map(f => `<div class="held-file">${icon('file')}<div><strong>${escape(f.name)}</strong><span>${labels[f.category]} · ${formatSize(f.sizeMB)}</span></div></div>`).join('') : `<div class="empty-held">${icon('folder')}<strong>보류한 파일이 없어요.</strong><span>나중에 결정할 파일이 여기에 모여요.</span></div>`}</div>${list.length ? '<button class="primary-button" data-do="review-held">보류한 파일 다시 보기</button>' : ''}<button class="text-button" data-do="home">책상으로 돌아가기</button></section>`, 'held-view');
  }
  function render() {
    document.documentElement.classList.toggle('modal-open', Boolean(modal));
    app.innerHTML = view === 'review' ? review() : view === 'held' ? held() : home();
    if (modal) renderModal();
    if (view === 'review' && !modal) document.querySelector('#file-card')?.focus({ preventScroll: true });
  }
  function announce(message) {
    const el = document.querySelector('#toast'); if (!el) return;
    clearTimeout(toastTimer); el.textContent = message; el.classList.add('visible');
    toastTimer = setTimeout(() => el.classList.remove('visible'), 1900);
  }
  function setBusy(value) {
    busy = value;
    document.querySelectorAll('[data-decision], [data-do="undo"], [data-do="throw"], [data-do="crumple"]').forEach(b => b.disabled = value);
  }
  function openFolder(id, heldReview = false) {
    if (busy) return;
    audio.unlock(); activeFolder = id; model.open(id, heldReview); stage = 'review'; iceHistory = []; tickAt = performance.now();
    if (!model.queue.length) { announce('이미 정리한 폴더예요. 처음부터 체험하려면 설정에서 초기화해 주세요.'); return; }
    setBusy(true);
    const el = document.querySelector(`[data-folder="${id}"]`);
    el?.classList.add('selected-folder');
    audio.paper();
    animationTimer = setTimeout(() => {
      busy = false; view = 'review'; render();
      if (game) audio.start();
    }, reduced || heldReview ? 0 : 550);
  }
  function finishDecision(action) {
    if (!model.current) { busy = false; return; }
    if (climate) {
      const gained = action === 'delete' ? ice.rescue() : false;
      iceHistory.push(gained);
      if (action === 'delete') { iceEvent = gained ? 'restore' : ''; iceEventAt = performance.now(); audio.restore(); }
    }
    const file = model.decide(action); if (!file) { busy = false; return; }
    save(); stage = 'review'; busy = false; render();
    if (model.done) {
      audio.stop();
      if (game) { audio.applause(); confetti(42); }
      document.querySelector('h1')?.focus({ preventScroll: true });
    } else if (game && action === 'delete' && model.combo >= 2) {
      announce(`${model.combo}연속 콤보 · 경험치 +100 · ${model.combo >= 5 ? '멈출 수 없어요!' : '멋진 한 방!'}`); confetti(16);
    } else announce(action === 'delete' ? '파일을 삭제했어요' : action === 'keep' ? '폴더에 보관했어요' : '나중에 결정하도록 보류했어요');
  }
  function decide(action, horizontal = 0) {
    if (busy || view !== 'review' || stage !== 'review' || model.done) return;
    audio.unlock();
    if (game && action === 'delete') { crumple(); return; }
    setBusy(true); audio.paper();
    const card = document.querySelector('.paper');
    card?.classList.add(action === 'hold' && horizontal < 0 ? 'file-hold-left' : `file-${action}`);
    animationTimer = setTimeout(() => finishDecision(action), reduced ? 0 : 340);
  }
  async function crumple() {
    if (busy || stage !== 'review') return;
    setBusy(true); stage = 'crumpling'; audio.crumple(); audio.vibrate(12);
    const desk = document.querySelector('.sorting-desk'), card = document.querySelector('.paper'), bin = document.querySelector('#trash-bin');
    const deskRect = desk.getBoundingClientRect(), cardRect = card.getBoundingClientRect(), binRect = bin.getBoundingClientRect();
    const x = Math.max(55, Math.min(deskRect.width - 55, cardRect.left + cardRect.width / 2 - deskRect.left));
    const y = Math.max(85, Math.min(deskRect.height - 110, cardRect.top + cardRect.height / 2 - deskRect.top));
    const from = getComputedStyle(card).transform;
    card.style.transformOrigin = '50% 50%';
    card.classList.add('instant-crumple');
    if (!reduced) await card.animate([
      {transform: from === 'none' ? 'scale(1)' : from, borderRadius:'8px', filter:'contrast(1)'},
      {offset:.45, transform:`${from === 'none' ? '' : from} scale(.48,.62) rotate(-12deg)`,borderRadius:'25%',filter:'contrast(1.25)'},
      {transform:`${from === 'none' ? '' : from} scale(.05) rotate(38deg)`,borderRadius:'45%',filter:'contrast(1.5)',opacity:.2}
    ],{duration:150,easing:'cubic-bezier(.3,0,.8,.4)',fill:'forwards'}).finished;
    card.style.visibility = 'hidden';
    const ball = document.createElement('div');
    ball.className = 'paper-ball flight-ball'; ball.setAttribute('aria-hidden','true'); ball.innerHTML = '<i></i><i></i><i></i><i></i>';
    ball.style.left = `${x - 40}px`; ball.style.top = `${y - 40}px`; desk.append(ball);
    const shadow = document.createElement('div'); shadow.className = 'flight-shadow'; shadow.style.left = `${x - 35}px`; shadow.style.top = `${deskRect.height - 23}px`; desk.append(shadow);
    const dx = binRect.left + binRect.width / 2 - deskRect.left - x;
    const dy = binRect.top + 13 - deskRect.top - y;
    await throwBall(ball, shadow, dx, dy);
  }
  async function throwBall(ball, shadow, dx, dy) {
    audio.whoosh();
    if (!reduced) {
      shadow.animate([{transform:'scale(1)',opacity:.12},{offset:.45,transform:`translateX(${dx*.45}px) scale(.45)`,opacity:.06},{transform:`translateX(${dx}px) scale(.2)`,opacity:0}],{duration:510,fill:'forwards'});
      await ball.animate([
        {transform:'scale(.6) rotate(-20deg)',offset:0},
        {transform:'translate(-12px, 10px) scale(1.02) rotate(-45deg)',offset:.08},
        {transform:`translate(${dx*.42}px,${dy*.15-155}px) scale(1.1) rotate(165deg)`,offset:.43},
        {transform:`translate(${dx*.88}px,${dy*.55-38}px) scale(.66) rotate(385deg)`,offset:.78},
        {transform:`translate(${dx}px,${dy}px) scale(.2) rotate(520deg)`,opacity:.3,offset:1}
      ],{duration:510,easing:'linear',fill:'forwards'}).finished;
    }
    audio.impact(model.combo + 1);
    finishDecision('delete');
    document.querySelector('.game.review-screen')?.classList.add('toss-impact');
    const newBin = document.querySelector('#trash-bin');
    if (newBin) {
      newBin.classList.add('bin-hit');
      const burst = document.createElement('div'); burst.className = 'toss-burst';
      burst.innerHTML = `<span>쏙!</span>${'<i></i>'.repeat(8)}`;
      newBin.append(burst); setTimeout(() => burst.remove(),650);
    }
  }
  function confetti(count) {
    if (reduced) return;
    const host = document.querySelector('#effects'); if (!host) return;
    host.innerHTML = Array.from({ length: count }, (_, i) => `<i class="confetti" style="--x:${8 + Math.random() * 84}%;--delay:${Math.random() * .3}s;--rotate:${Math.random() * 720}deg;--color:${['#e8b955', '#8faab7', '#f09a80', '#bac59a'][i % 4]}"></i>`).join('');
    setTimeout(() => { if (host.isConnected) host.innerHTML = ''; }, 2200);
  }
  function goHome() {
    if (busy) return;
    audio.stop(); view = 'home'; stage = 'review'; model.held = false; activeFolder = null; render();
  }
  function undo() {
    if (busy || !model.undo()) return;
    if (climate) { ice.undoRescue(iceHistory.pop()); iceEvent = ''; }
    view = 'review'; stage = 'review'; save(); audio.paper(); if (game) audio.start(); render(); announce('마지막 선택을 되돌렸어요');
  }
  function soundControls() {
    return `<div class="setting-row"><div>${icon('sound')}<span><strong>소리</strong><small>실제로 녹음한 종이 넘김·구김 소리</small></span></div><button class="switch ${audio.prefs.sound ? 'on' : ''}" role="switch" aria-checked="${audio.prefs.sound}" aria-label="소리" data-do="sound"><i></i></button></div><div class="volume-control"><label for="sound-volume">소리 크기 <output id="volume-value" for="sound-volume">${Math.round(audio.prefs.volume * 100)}%</output></label><input id="sound-volume" data-volume type="range" min="0" max="100" step="5" value="${Math.round(audio.prefs.volume * 100)}" aria-label="소리 크기"></div>${game ? `<div class="setting-row"><div>${icon('sound')}<span><strong>배경 리듬</strong><small>종이 소리 뒤에 작게 흐르는 잔잔한 리듬</small></span></div><button class="switch ${audio.prefs.music ? 'on' : ''}" role="switch" aria-checked="${audio.prefs.music}" aria-label="배경 리듬" data-do="music"><i></i></button></div>` : ''}<div class="sound-check"><div class="sound-test-buttons"><button class="sound-test" data-do="test-sound" ${audio.prefs.sound ? '' : 'disabled'}>종이 넘김 듣기</button><button class="sound-test" data-do="test-crumple" ${audio.prefs.sound ? '' : 'disabled'}>종이 구김 듣기</button></div><small>작은 소리로 시작해요. 기기의 음량에 맞게 조절해 주세요.</small></div>`;
  }
  function tutorialMarkup() {
    return `<div class="tutorial-kicker">세 버전 모두 같은 조작</div><h2 id="tutorial-title">어느 방향으로 밀까요?</h2><p class="tutorial-intro">파일을 살펴보고, 원하는 방향으로 쓱 밀어 주세요.</p><div class="tutorial-map" aria-hidden="true"><span class="map-keep">↑ 보관</span><span class="map-hold-left">← 보류</span><div class="tutorial-paper">${icon('file')}<i></i><i></i></div><span class="map-hold-right">보류 →</span><span class="map-delete">↓ 삭제</span></div><div class="tutorial-directions"><div class="tutorial-direction tutorial-keep"><b>↑</b><span><strong>위로 밀면 보관</strong><small>필요한 파일은 폴더에 남겨요.</small></span></div><div class="tutorial-direction tutorial-hold"><b>↔</b><span><strong>좌우로 밀면 보류</strong><small>고민되는 파일은 나중에 결정해요.</small></span></div><div class="tutorial-direction tutorial-delete"><b>↓</b><span><strong>아래로 밀면 삭제</strong><small>${game ? '종이를 구겨 휴지통으로 쏙 던져요.' : '더는 필요 없는 파일을 정리해요.'}</small></span></div></div><p class="tutorial-note">잘못 골라도 ‘되돌리기’로 취소할 수 있어요.</p><button class="primary-button" data-do="finish-tutorial">알겠어요, 시작할게요</button><small class="tutorial-footer">설정에서 조작 안내를 다시 볼 수 있어요.</small>`;
  }
  function closeModal() {
    if (modal === 'tutorial') {
      tutorialSeen = true;
      try { localStorage.setItem(tutorialKey, 'seen'); } catch {}
      audio.unlock();
    }
    modal = ''; render();
    if (game && view === 'review' && !model.done) audio.start();
  }
  function renderModal() {
    document.documentElement.classList.add('modal-open');
    document.querySelector('.modal-backdrop')?.remove();
    const hapticState = audio.hapticSupport();
    const markup = modal === 'tutorial' ? tutorialMarkup() : modal === 'impact' ? `<div class="modal-icon">${icon('leaf')}</div><h2>클라우드에도 실제 공간이 필요해요.</h2><p>데이터센터에는 서버와 저장 장치, 냉각 설비가 있어요. 이를 가동하려면 전기가 필요하고, 전기를 생산하는 과정에서 온실가스가 배출될 수 있어요.</p><p>불필요한 사본도 저장 자원을 차지해요. 다만 파일 하나를 지웠을 때 줄어드는 탄소량을 일정한 수치로 환산할 수는 없어요.</p><div class="info-box">북극곰과 빙하는 환경 영향을 표현한 게임 연출이에요. 정리하는 동안 20초마다 빙하 한 조각이 떨어지고, 예시 파일 하나를 삭제하면 한 조각이 돌아와요. 화면을 나가거나 앱을 숨기거나 안내창을 열면 시간이 멈춰요. 실제 기후 변화를 계산한 결과는 아니에요.</div><a class="source-link" href="https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai" target="_blank" rel="noopener">국제에너지기구(IEA) 자료 보기</a><button class="primary-button" data-do="close-modal">알겠어요</button>` : modal === 'reset' ? `<h2>처음부터 다시 해 볼까요?</h2><p>현재 버전에서 선택한 파일 상태와 연속 기록이 모두 초기화돼요.</p><button class="primary-button" data-do="confirm-reset">현재 버전 초기화</button><button class="text-button" data-do="close-modal">진행 상황 유지</button>` : `<h2>나에게 맞게 설정해요.</h2>${soundControls()}<div class="setting-row haptics-setting"><div>${icon('phone')}<span><strong>진동 피드백</strong><small id="haptic-support-status">${hapticState.detail}</small></span></div><button class="switch ${hapticState.available && audio.prefs.haptics ? 'on' : ''}" role="switch" aria-checked="${hapticState.available && audio.prefs.haptics}" aria-label="진동 피드백" aria-describedby="haptic-support-status" ${hapticState.available ? '' : 'disabled'} data-do="haptics"><i></i></button></div><div class="haptic-check"><button class="haptic-test" data-do="test-haptics" ${hapticState.available && audio.prefs.haptics ? '' : 'disabled'}>진동 확인하기</button><p id="haptic-test-result" role="status" aria-live="polite"></p></div><div class="gesture-explainer"><span>${game ? '아래로 밀어 구겨 버리기' : '아래로 밀어 삭제'}</span><span>위로 밀어 보관</span><span>좌우로 밀어 보류</span></div>${game ? '<p class="settings-note">아래로 한 번 밀면 바로 구겨서 던져요. 추가로 누를 필요는 없어요. 연속으로 삭제하면 콤보가 쌓이고, 버릴 때마다 경험치 100을 받아요.</p>' : ''}<button class="tutorial-replay" data-do="tutorial">조작 방법 다시 보기</button><button class="reset-demo" data-do="reset">처음부터 다시 하기</button><a class="source-link" href="../index.html">다른 정리 방식 선택</a><div class="demo-note">예시 파일로 체험 · 진행 상황은 이 기기에 저장돼요</div>`;
    const host = document.createElement('div'); host.className = `modal-backdrop ${modal === 'tutorial' ? 'tutorial-backdrop' : ''}`;
    host.innerHTML = `<section class="modal ${modal === 'tutorial' ? 'tutorial-modal' : ''}" role="dialog" aria-modal="true" aria-label="${modal === 'tutorial' ? '조작 방법' : modal === 'settings' ? '설정' : modal === 'reset' ? '프로토타입 초기화' : '환경 영향 안내'}"><button class="modal-close icon-button" data-do="close-modal" aria-label="안내창 닫기">${icon('close')}</button>${markup}</section>`;
    app.append(host); app.querySelector('.phone').inert = true; host.querySelector('button')?.focus();
  }
  app.addEventListener('click', e => {
    if (suppressClick) return;
    const folder = e.target.closest('[data-folder]'); if (folder) { openFolder(folder.dataset.folder); return; }
    const decision = e.target.closest('[data-decision]'); if (decision) { decide(decision.dataset.decision); return; }
    
    const action = e.target.closest('[data-do]')?.dataset.do;
    if (!action) { if (e.target.classList.contains('modal-backdrop') && modal !== 'tutorial') closeModal(); return; }
    if (busy) return;
    switch (action) {
      case 'home': goHome(); break;
      case 'sound': audio.unlock(); audio.set('sound', !audio.prefs.sound); save(); if (modal) renderModal(); else render(); break;
      case 'music': audio.set('music', !audio.prefs.music); save(); renderModal(); break;
      case 'test-sound': audio.paper(); break;
      case 'test-crumple': audio.crumple(); break;
      case 'haptics': if (audio.hapticSupport().available) { audio.set('haptics', !audio.prefs.haptics); audio.vibrate(); save(); renderModal(); } break;
      case 'test-haptics': {
        const result = document.querySelector('#haptic-test-result');
        if (result) result.textContent = audio.testHaptics() ? '진동을 요청했어요. 실제로 느껴지는지 확인해 주세요.' : '현재 환경에서는 진동을 사용할 수 없어요.';
        break;
      }
      case 'settings': case 'impact': case 'reset': modal = action; if (modal === 'settings') audio.stop(); renderModal(); break;
      case 'close-modal': case 'finish-tutorial': closeModal(); break;
      case 'tutorial': audio.stop(); modal = 'tutorial'; renderModal(); break;
      case 'confirm-reset': audio.stop(); clearTimeout(animationTimer); model.reset(); ice.reset(); iceHistory = []; iceEvent = ''; modal = ''; view = 'home'; stage = 'review'; save(); render(); announce('책상이 새로워졌어요. 준비되면 시작해 보세요.'); break;
      case 'undo': undo(); break;
      case 'held': audio.stop(); view = 'held'; model.held = true; render(); break;
      case 'review-held': openFolder(null, true); break;

    }
  });
  function beginDrag(e) {
    if (busy || modal || view !== 'review') return;
    const target = stage === 'review' ? e.target.closest('#file-card') : null;
    if (!target || (e.pointerType === 'mouse' && e.button !== 0)) return;
    target.setPointerCapture(e.pointerId);
    drag = { target, x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
    target.classList.add('dragging');
  }
  app.addEventListener('pointerdown', beginDrag);
  app.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
    const scrunch = game && drag.dy > 0 && Math.abs(drag.dy) > Math.abs(drag.dx) ? Math.min(1, drag.dy / 200) : 0;
    drag.target.style.transform = `translate(${drag.dx}px, ${drag.dy * (scrunch ? .48 : 1)}px) rotate(${drag.dx / 18 + scrunch * 9}deg) scale(${1 - scrunch * .3},${1 - scrunch * .44})`;
    drag.target.style.borderRadius = scrunch ? `${scrunch * 30}%` : '';
    drag.target.classList.toggle('scrunch-preview', scrunch > .15);
    const action = swipeAction(drag.dx, drag.dy, 28);
    const stamp = document.querySelector('#swipe-stamp');
    stamp.textContent = game && action === 'delete' ? '구기기' : ({ delete: '삭제', keep: '보관', hold: '보류' }[action] || '');
    stamp.className = `swipe-stamp ${action ? `show stamp-${action}` : ''}`;
  });
  function endDrag(e, cancelled = false) {
    if (!drag) return;
    const d = drag; drag = null; d.target.classList.remove('dragging');
    if (d.target.hasPointerCapture(e.pointerId)) d.target.releasePointerCapture(e.pointerId);
    if (Math.abs(d.dx) + Math.abs(d.dy) > 12) { suppressClick = true; setTimeout(() => suppressClick = false, 80); }
    if (cancelled) { d.target.style.transform = ''; d.target.style.borderRadius = ''; d.target.classList.remove('scrunch-preview'); const stamp = document.querySelector('#swipe-stamp'); if (stamp) stamp.className = 'swipe-stamp'; return; }
    const action = swipeAction(d.dx, d.dy);
    if (game && action === 'delete') { decide('delete'); return; }
    d.target.style.transform = ''; d.target.style.borderRadius = ''; d.target.classList.remove('scrunch-preview');
    if (action) decide(action, d.dx);
    else { const stamp = document.querySelector('#swipe-stamp'); if (stamp) stamp.className = 'swipe-stamp'; }
  }
  app.addEventListener('pointerup', e => endDrag(e));
  app.addEventListener('pointercancel', e => endDrag(e, true));
  document.addEventListener('keydown', e => {
    if (modal) {
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab') {
        const focusable = [...document.querySelectorAll('.modal button, .modal a, .modal input')].filter(el => !el.disabled);
        if (!focusable.length) return;
        if (e.shiftKey && document.activeElement === focusable[0]) { e.preventDefault(); focusable.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === focusable.at(-1)) { e.preventDefault(); focusable[0].focus(); }
      }
      return;
    }
    if (view !== 'review' || busy || model.done) return;
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key) && stage === 'review') {
      e.preventDefault(); decide({ ArrowLeft: 'hold', ArrowDown: 'delete', ArrowUp: 'keep', ArrowRight: 'hold' }[e.key], e.key === 'ArrowLeft' ? -1 : 1);
    } else if (e.key === 'Escape' && stage !== 'review') { stage = 'review'; render(); }
  });
  document.addEventListener('visibilitychange', () => { tickAt = performance.now(); });
  app.addEventListener('input', e => {
    if (!e.target.matches('[data-volume]')) return;
    audio.set('volume', Number(e.target.value) / 100); save();
    const output = document.querySelector('#volume-value');
    if (output) output.textContent = `${Math.round(audio.prefs.volume * 100)}%`;
  });
  app.addEventListener('dragstart', e => { if (e.target.closest('#file-card,.office,.polar-scene')) e.preventDefault(); });
  window.addEventListener('pagehide', () => audio.stop());
  render();
})();
