/* Anniversary V-fold card: vanilla JS, runs directly by double-clicking index.html. */
(() => {
  'use strict';
  const config = window.CARD_CONFIG || {};
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const body = document.body;
  const origami = $('#origami');
  const music = $('#backgroundMusic');
  const video = $('#memoryVideo');
  const headline = $('#stageHeadline');
  const description = $('#stageDescription');
  const progressText = $('#progressText');
  const openButton = $('#openNextBtn');
  const buttonText = $('#openBtnText');
  const cinema = $('#cinema');
  const finale = $('#finale');
  const playVideoButton = $('#playVideoBtn');
  const videoError = $('#videoError');
  const toast = $('#toast');
  let stage = 0;
  let readingTimer = null;
  let cinemaTimer = null;
  let volumeTimer = null;
  let toastTimer = null;
  let audioWantsToPlay = false;
  let musicMuted = false;
  let usingDemoMusic = false;
  let usingDemoVideo = false;
  let videoObjectUrl = null;
  let ringsFrameId = null;

  // Reproducible positions: make the same celestial sky on every replay.
  function scatterStars(container, count, seed) {
    let randSeed = seed >>> 0;
    function nextRand() { randSeed = (1664525 * randSeed + 1013904223) >>> 0; return randSeed / 4294967296; }
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const star = document.createElement('i');
      star.className = 'star-dot';
      const size = 1.0 + nextRand() * (i % 15 === 0 ? 3.2 : 1.7);
      star.style.cssText = `left:${(nextRand()*100).toFixed(2)}%;top:${(nextRand()*100).toFixed(2)}%;width:${size.toFixed(2)}px;height:${size.toFixed(2)}px;animation-delay:${(-nextRand()*6).toFixed(2)}s;animation-duration:${(2.2+nextRand()*4).toFixed(2)}s;`;
      frag.append(star);
    }
    container.append(frag);
  }

  // Original images are fetched from Wikimedia Commons; local image copies take priority.
  function loadRealArtwork() {
    const art = config.artwork || {};
    $$('img[data-art]').forEach(img => {
      const item = art[img.dataset.art];
      if (!item) return;
      const liveUrl = (window.CARD_ART_URLS || {})[img.dataset.art];
      img.addEventListener('error', () => {
        if (img.dataset.remoteAttempted === '1') { img.style.opacity = '0'; return; }
        img.dataset.remoteAttempted = '1';
        if (liveUrl) img.src = liveUrl;
      });
      img.src = item.local;
      img.loading = img.closest('.background-art') ? 'eager' : 'lazy';
      img.decoding = 'async';
    });
  }

  function fillMessage() {
    $('#letterTitle').textContent = config.letterTitle || 'My love';
    const holder = $('#letterText');
    holder.textContent = '';
    (config.letterParagraphs || []).forEach(line => {
      const paragraph = document.createElement('p');
      paragraph.textContent = line;
      holder.append(paragraph);
    });
    $('#letterSignature').textContent = config.signature || 'With love ♡';
    $('#finalTitle').textContent = config.finalTitle || 'Happy anniversary';
    const finalMessage = $('#finalMessage');
    finalMessage.textContent = '';
    finalMessage.append(document.createTextNode(config.finalLineOne || 'I love you, my wife'));
    finalMessage.append(document.createElement('br'));
    const emphasizedName = document.createElement('em');
    emphasizedName.textContent = config.finalName || 'Le Ha Khanh Binh';
    finalMessage.append(emphasizedName);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
  }

  function setMusicSource(path) {
    music.src = path;
    music.load();
  }

  function setupMusic() {
    music.loop = true;
    music.preload = 'auto';
    music.volume = Math.max(0, Math.min(1, config.musicVolume ?? 0.56));
    music.addEventListener('error', () => {
      if (usingDemoMusic) {
        showToast('Không tìm thấy nhạc. Bạn có thể thêm file MP3 vào assets/audio/.');
        return;
      }
      usingDemoMusic = true;
      setMusicSource(config.musicDemoFile || 'assets/audio/pastel-waltz-demo.mp3');
      if (audioWantsToPlay && !musicMuted) startMusic();
    });
    // The user-provided song is preferred. The included original piano/harp demo is fallback.
    setMusicSource(config.musicFile || 'assets/audio/ngai-ngung-khong-the-cat-loi-remix.mp3');
  }

  function startMusic() {
    if (musicMuted || !audioWantsToPlay) return;
    const promise = music.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        // Some browsers require a fresh gesture for local audio; the sound toggle can retry.
        $('#soundText').textContent = 'Chạm để bật nhạc';
      });
    }
    $('#soundText').textContent = usingDemoMusic ? 'Nhạc nền mẫu' : 'Nhạc kỷ niệm';
  }

  function setupVideo() {
    video.preload = 'auto';
    video.playsInline = true;
    video.addEventListener('ended', showFinale);
    video.addEventListener('error', () => {
      if (!usingDemoVideo) {
        usingDemoVideo = true;
        video.src = config.videoDemoFile || 'assets/video/demo-memory.mp4';
        video.load();
      } else {
        videoError.hidden = false;
        playVideoButton.hidden = true;
      }
    });
    video.addEventListener('playing', () => {
      videoError.hidden = true;
      playVideoButton.hidden = true;
    });
    video.src = config.videoFile || 'assets/video/our-story.mp4';
    video.load();
  }

  function stepUi() {
    body.dataset.phase = String(stage);
    const texts = [
      { title: 'Một chiếc thư nhỏ gửi người thương', detail: 'Ba lần chạm để từng nếp gấp mở ra...', button: 'Mở nếp gấp thứ nhất' },
      { title: 'The first unfolding', detail: 'Cánh giấy bên trái và bên phải đã hé mở.', button: 'Mở nếp gấp thứ hai' },
      { title: 'Love, written in the stars', detail: 'Những góc giấy đã bung như một vì sao nhỏ.', button: 'Mở trái tim ở giữa' },
      { title: 'From my heart to yours', detail: 'Đọc lá thư của anh nhé... ♥', button: 'Đang đọc lời nhắn...' }
    ];
    const item = texts[stage];
    headline.textContent = item.title;
    description.textContent = item.detail;
    buttonText.textContent = item.button;
    openButton.disabled = stage >= 3;
    progressText.textContent = `${stage} / 3 nếp gấp`;
    $$('.progress-dot').forEach((dot, i) => dot.classList.toggle('active', i < stage));
    origami.setAttribute('aria-label', `Thiệp origami. Đã mở ${stage} trên 3 nếp gấp`);
    if (stage === 3) origami.setAttribute('tabindex', '-1');
    else origami.setAttribute('tabindex', '0');
  }

  function advanceFold() {
    if (stage >= 3 || body.dataset.screen !== 'card') return;
    stage += 1;
    if (stage === 1) {
      audioWantsToPlay = true;
      startMusic(); // Called synchronously inside the first user click (autoplay policy).
    }
    stepUi();
    if (stage === 3) {
      // Give the folding/letter pop-up ~1.25s, then exactly 5s reading time by default.
      const foldDuration = window.__CARD_FAST_TEST__ ? 150 : 1250;
      const readingDuration = window.__CARD_FAST_TEST__ ? 300 : Math.max(1000, Number(config.readDurationMs) || 5000);
      readingTimer = setTimeout(() => {
        readingTimer = setTimeout(() => showCinema(), readingDuration);
      }, foldDuration);
    }
  }

  function fadeOutMusic() {
    clearInterval(volumeTimer);
    const originalVolume = music.volume;
    const started = performance.now();
    volumeTimer = setInterval(() => {
      const fade = Math.min(1, (performance.now() - started) / 850);
      music.volume = Math.max(0, originalVolume * (1 - fade));
      if (fade >= 1) {
        clearInterval(volumeTimer);
        music.pause();
        music.volume = Math.max(0, Math.min(1, config.musicVolume ?? 0.56));
        audioWantsToPlay = false;
      }
    }, 35);
  }

  function showCinema() {
    if (body.dataset.screen !== 'card') return;
    fadeOutMusic();
    body.dataset.screen = 'video';
    cinema.classList.add('is-visible');
    cinema.setAttribute('aria-hidden', 'false');
    // Delay is the visual zoom from the very center of the opened paper.
    cinemaTimer = setTimeout(async () => {
      if (body.dataset.screen !== 'video') return;
      if (!video.src) { videoError.hidden = false; return; }
      try {
        await video.play();
      } catch (_) {
        playVideoButton.hidden = false;
        showToast('Trình duyệt đang chặn autoplay: nhấn Phát video.');
      }
    }, window.__CARD_FAST_TEST__ ? 100 : 650);
  }

  function showFinale() {
    if (body.dataset.screen === 'final') return;
    clearTimeout(cinemaTimer);
    video.pause();
    music.pause();
    body.dataset.screen = 'final';
    finale.classList.add('is-visible');
    finale.setAttribute('aria-hidden', 'false');
    cinema.classList.remove('is-visible');
    cinema.setAttribute('aria-hidden', 'true');
    requestAnimationFrame(startRings);
  }

  function resetExperience() {
    clearTimeout(readingTimer);
    clearTimeout(cinemaTimer);
    clearInterval(volumeTimer);
    stopRings();
    video.pause();
    try { video.currentTime = 0; } catch (_) { /* no metadata loaded */ }
    music.pause();
    try { music.currentTime = 0; } catch (_) {}
    music.volume = Math.max(0, Math.min(1, config.musicVolume ?? 0.56));
    audioWantsToPlay = false;
    stage = 0;
    body.dataset.screen = 'card';
    cinema.classList.remove('is-visible');
    finale.classList.remove('is-visible');
    cinema.setAttribute('aria-hidden', 'true');
    finale.setAttribute('aria-hidden', 'true');
    playVideoButton.hidden = true;
    videoError.hidden = true;
    stepUi();
    $('#letterText').scrollTop = 0;
  }

  function handleFileChoice(file) {
    if (!file) return;
    if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    videoObjectUrl = URL.createObjectURL(file);
    usingDemoVideo = false;
    video.pause();
    video.src = videoObjectUrl;
    videoError.hidden = true;
    video.load();
    if (body.dataset.screen === 'video') {
      video.play().catch(() => { playVideoButton.hidden = false; });
    }
    showToast(`Đã chọn video: ${file.name}`);
  }

  // Torus renderer, built in Canvas 2D with a rotating 3D mesh: no AI-generated ring photo,
  // no external CDN, and no claim that this is a photographed/authentic Piaget product.
  const ringCanvas = $('#ringsCanvas');
  const ringCtx = ringCanvas.getContext('2d', { alpha: true });
  let ringStart = null;
  let ringPrev = -1;

  function rotate3(p, ax, ay, az) {
    let [x, y, z] = p;
    let c=Math.cos(ax), s=Math.sin(ax);
    [y,z]=[y*c-z*s,y*s+z*c];
    c=Math.cos(ay);s=Math.sin(ay);
    [x,z]=[x*c+z*s,-x*s+z*c];
    c=Math.cos(az);s=Math.sin(az);
    [x,y]=[x*c-y*s,x*s+y*c];
    return [x,y,z];
  }
  const norm = ([x,y,z]) => {
    let l=Math.hypot(x,y,z)||1;
    return [x/l,y/l,z/l];
  };
  function project(point, ox, oy, scale=1) {
    const [x,y,z] = point;
    const f = 540/(540-z);
    return [ox + x * f * scale, oy + y*f*scale, z];
  }
  function addRingPatches(patches, opt, t) {
    const N = 86, M=15, R=88, tube=13.1;
    const ax=opt.ax + .22*Math.sin(t*.65+opt.phase), ay=opt.ay + t*.73*opt.spin, az=opt.az + t*.11*opt.spin;
    function vertex(theta,phi) {
      const c=Math.cos(theta),s=Math.sin(theta),ct=Math.cos(phi),st=Math.sin(phi);
      const pos=rotate3([(R+tube*ct)*c,(R+tube*ct)*s,tube*st],ax,ay,az);
      const normal=norm(rotate3([ct*c,ct*s,st],ax,ay,az));
      return { pos, normal, point:project(pos,opt.cx,opt.cy,.96) };
    }
    const vertices=[];
    for(let i=0;i<=N;i++){
      const row=[];
      for(let j=0;j<=M;j++)row.push(vertex(i/N*Math.PI*2,j/M*Math.PI*2));
      vertices.push(row);
    }
    for(let i=0;i<N;i++) for(let j=0;j<M;j++){
      const a=vertices[i][j],b=vertices[i+1][j],c=vertices[i+1][j+1],d=vertices[i][j+1];
      const nz=(a.normal[2]+b.normal[2]+c.normal[2]+d.normal[2])*.25;
      const nx=(a.normal[0]+b.normal[0]+c.normal[0]+d.normal[0])*.25;
      const ny=(a.normal[1]+b.normal[1]+c.normal[1]+d.normal[1])*.25;
      const diffuse=Math.max(0,(-.35*nx-.57*ny+.77*nz));
      const spec=Math.pow(Math.max(0,(-.37*nx-.65*ny+.70*nz)),15);
      const shimmer=Math.pow(Math.max(0,nz),5);
      const brightness=Math.round(Math.max(52,Math.min(240,88+110*diffuse+65*spec+34*shimmer)));
      const violet=Math.round(brightness*.97);
      const blue=Math.min(255,brightness+11);
      const color=`rgb(${brightness},${violet},${blue})`;
      const depth=(a.pos[2]+b.pos[2]+c.pos[2]+d.pos[2])/4;
      patches.push({depth,points:[a.point,b.point,c.point,d.point],color,edge:spec>.5?'rgba(255,255,255,.32)':null});
    }
    // Diamant dust on one band — individually moving with the ring surface.
    if(opt.diamonds){
      for(let n=0;n<10;n++) {
        const theta=(n/10)*Math.PI*2;
        const pos=rotate3([R*Math.cos(theta),R*Math.sin(theta),tube+1.6],ax,ay,az);
        const p=project(pos,opt.cx,opt.cy,.96);
        patches.push({gem:true,depth:pos[2]+2,x:p[0],y:p[1],size:1.9+Math.max(0,pos[2])/95*2.1});
      }
    }
  }
  function renderRings(now) {
    if (body.dataset.screen !== 'final') { ringsFrameId = null; return; }
    if (ringStart === null) ringStart = now;
    const t=(now-ringStart)/1000;
    ringCtx.clearRect(0,0,660,360);
    // Halo and small stars surrounding the ring silhouettes.
    const glow=ringCtx.createRadialGradient(332,184,20,332,184,203);
    glow.addColorStop(0,'rgba(127,64,184,0.17)');glow.addColorStop(.57,'rgba(91,46,126,.07)');glow.addColorStop(1,'rgba(0,0,0,0)');
    ringCtx.fillStyle=glow;ringCtx.fillRect(0,0,660,360);
    const patches=[];
    addRingPatches(patches,{cx:277,cy:173,ax:1.08,ay:.24,az:-.27,phase:0,spin:1,diamonds:false},t);
    addRingPatches(patches,{cx:386,cy:171,ax:1.29,ay:-.39,az:.21,phase:1.6,spin:-1,diamonds:true},t);
    patches.sort((a,b)=>a.depth-b.depth);
    for(const patch of patches){
      if(patch.gem){
        ringCtx.save();ringCtx.shadowColor='#e9dcff';ringCtx.shadowBlur=patch.size*3;
        ringCtx.fillStyle='#fcfaff';ringCtx.translate(patch.x,patch.y);ringCtx.rotate(Math.PI/4);
        ringCtx.fillRect(-patch.size/2,-patch.size/2,patch.size,patch.size);
        ringCtx.restore();
        continue;
      }
      ringCtx.beginPath();
      ringCtx.moveTo(patch.points[0][0],patch.points[0][1]);
      for(let q=1;q<4;q++)ringCtx.lineTo(patch.points[q][0],patch.points[q][1]);
      ringCtx.closePath();ringCtx.fillStyle=patch.color;ringCtx.fill();
      if(patch.edge){ringCtx.strokeStyle=patch.edge;ringCtx.lineWidth=.35;ringCtx.stroke();}
    }
    for(let i=0;i<5;i++){
      const x=250+Math.cos(i*2.9+t*.22)*148,y=170+Math.sin(i*3.3+t*.29)*82;
      const pulse=.36+.4*Math.sin(t*2.1+i);
      ringCtx.save();ringCtx.translate(x,y);ringCtx.rotate(Math.PI/4);
      ringCtx.shadowBlur=15;ringCtx.shadowColor='#b973e7';ringCtx.fillStyle=`rgba(221,190,255,${pulse})`;
      ringCtx.fillRect(-1.1,-1.1,2.2,2.2);ringCtx.restore();
    }
    ringsFrameId=requestAnimationFrame(renderRings);
  }
  function startRings(now) {
    if (!ringCtx) return;
    if (ringsFrameId !== null) cancelAnimationFrame(ringsFrameId);
    ringStart=null;ringPrev=-1;
    ringsFrameId=requestAnimationFrame(renderRings);
  }
  function stopRings() {
    if(ringsFrameId!==null)cancelAnimationFrame(ringsFrameId);
    ringsFrameId=null;ringStart=null;
  }

  origami.addEventListener('click', advanceFold);
  origami.addEventListener('keydown', event => {
    if ((event.key==='Enter'||event.key===' ') && stage<3) { event.preventDefault(); advanceFold(); }
  });
  openButton.addEventListener('click', advanceFold);
  $('#soundToggle').addEventListener('click', () => {
    musicMuted=!musicMuted;
    $('#soundToggle').classList.toggle('is-muted',musicMuted);
    $('#soundIcon').textContent=musicMuted?'♪̸':'♫';
    if(musicMuted)music.pause();
    else if(stage>0 && body.dataset.screen==='card') {audioWantsToPlay=true;startMusic();}
    $('#soundText').textContent=musicMuted?'Tắt nhạc':'Bật nhạc';
  });
  $('#chooseVideoBtn').addEventListener('click', () => $('#videoFileInput').click());
  $('#replaceVideoBtn').addEventListener('click', () => $('#videoFileInput').click());
  $('#videoFileInput').addEventListener('change', event => handleFileChoice(event.target.files?.[0]));
  playVideoButton.addEventListener('click', () => video.play().catch(() => showToast('Hãy bật âm lượng và thử lại.')));
  $('#skipVideoBtn').addEventListener('click', showFinale);
  $('#restartBtn').addEventListener('click', resetExperience);

  scatterStars($('#stars'),75,52714);
  scatterStars($('#finalStars'),95,104882);
  fillMessage();
  loadRealArtwork();
  setupMusic();
  setupVideo();
  stepUi();
  // Automated browser QA only; not shown to card viewers.
  window.__anniversaryCardState = () => ({stage,screen:body.dataset.screen,musicMuted,usingDemoMusic,usingDemoVideo,videoSource:video.currentSrc});
})();
