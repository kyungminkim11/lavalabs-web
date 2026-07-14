(() => {
  'use strict';

  const VERSION = '20260714-view-export1';
  const STORAGE_KEY = 'lava360:view-export:v1';
  const state = Object.assign({
    frontYaw: 0,
    levelPitch: 0,
    levelRoll: 0,
    viewYaw: 0,
    viewPitch: 0,
    hfov: 70,
    ratio: '16:9',
    customW: 16,
    customH: 9,
    longEdge: 2048,
    format: 'jpeg',
    quality: 0.92,
    guide: true,
    source: '',
    sourceWidth: 0,
    sourceHeight: 0
  }, readSavedState());

  let currentViewer = null;
  let currentConfig = null;
  let sourceImage = null;
  let sourcePromise = null;
  let sourceObjectUrl = '';
  let panel = null;
  let modal = null;
  let guideLayer = null;
  let previewTimer = 0;

  function readSavedState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  function saveState() {
    try {
      const copy = Object.assign({}, state);
      delete copy.source;
      delete copy.sourceWidth;
      delete copy.sourceHeight;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    } catch (_) {}
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
  }

  function normalizeYaw(value) {
    let yaw = Number(value) || 0;
    while (yaw > 180) yaw -= 360;
    while (yaw < -180) yaw += 360;
    return Math.round(yaw * 10) / 10;
  }

  function formatAngle(value) {
    const n = Math.round((Number(value) || 0) * 10) / 10;
    return `${n > 0 ? '+' : ''}${n}°`;
  }

  function getViewer() {
    if (currentViewer && typeof currentViewer.getYaw === 'function') return currentViewer;
    return window.__lava360Viewer || null;
  }

  function patchPannellum() {
    const pannellum = window.pannellum;
    if (!pannellum || typeof pannellum.viewer !== 'function' || pannellum.viewer.__lavaPatched) return;
    const originalViewer = pannellum.viewer;
    const wrapped = function wrappedViewer(container, config) {
      const viewer = originalViewer.call(this, container, config);
      currentViewer = viewer;
      currentConfig = config || {};
      window.__lava360Viewer = viewer;
      window.__lava360ViewerConfig = currentConfig;
      rememberSource(currentConfig.panorama);
      queueMicrotask(() => {
        syncFromViewer(false);
        mountGuide();
        refreshUI();
      });
      window.dispatchEvent(new CustomEvent('lava360:viewerready', { detail: { viewer, config } }));
      return viewer;
    };
    wrapped.__lavaPatched = true;
    wrapped.__lavaOriginal = originalViewer;
    pannellum.viewer = wrapped;
  }

  function rememberSource(source) {
    if (!source) return;
    if (typeof source === 'string') {
      state.source = source;
      sourceImage = null;
      sourcePromise = null;
    }
  }

  function captureUploads() {
    document.addEventListener('change', event => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== 'file' || !input.files?.length) return;
      const file = [...input.files].find(item => item.type.startsWith('image/'));
      if (!file) return;
      if (sourceObjectUrl) URL.revokeObjectURL(sourceObjectUrl);
      sourceObjectUrl = URL.createObjectURL(file);
      rememberSource(sourceObjectUrl);
      loadSourceImage().then(() => {
        refreshUI();
        toast(`원본 ${state.sourceWidth}×${state.sourceHeight}px을 출력 모듈에 연결했습니다.`);
      }).catch(() => {});
    }, true);
  }

  async function loadSourceImage() {
    if (sourceImage) return sourceImage;
    if (sourcePromise) return sourcePromise;
    const src = state.source || currentConfig?.panorama || window.__lava360ViewerConfig?.panorama;
    if (!src || typeof src !== 'string') throw new Error('출력할 360 이미지 원본을 찾지 못했습니다. 이미지를 다시 불러와 주세요.');
    sourcePromise = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        sourceImage = image;
        state.sourceWidth = image.naturalWidth || image.width;
        state.sourceHeight = image.naturalHeight || image.height;
        resolve(image);
      };
      image.onerror = () => reject(new Error('편집 이미지를 출력 모듈에서 읽지 못했습니다. 파일을 다시 불러와 주세요.'));
      image.src = src;
    }).finally(() => {
      if (!sourceImage) sourcePromise = null;
    });
    return sourcePromise;
  }

  function syncFromViewer(showToast = true) {
    const viewer = getViewer();
    if (!viewer) {
      if (showToast) toast('360 이미지를 먼저 불러와 주세요.', true);
      return false;
    }
    state.viewYaw = normalizeYaw(viewer.getYaw?.() ?? state.viewYaw);
    state.viewPitch = clamp(viewer.getPitch?.() ?? state.viewPitch, -89, 89);
    state.hfov = clamp(viewer.getHfov?.() ?? state.hfov, 30, 120);
    saveState();
    refreshUI();
    if (showToast) toast('현재 360 시야의 방향과 줌을 2D 출력에 반영했습니다.');
    return true;
  }

  function setCurrentAsFront() {
    const viewer = getViewer();
    if (!viewer) return toast('360 이미지를 먼저 불러와 주세요.', true);
    state.frontYaw = normalizeYaw(viewer.getYaw?.() || 0);
    saveState();
    refreshUI();
    toast(`현재 방향을 정면 ${formatAngle(state.frontYaw)}으로 저장했습니다.`);
  }

  function goToFront() {
    const viewer = getViewer();
    if (!viewer) return toast('360 이미지를 먼저 불러와 주세요.', true);
    viewer.setYaw?.(state.frontYaw, 500);
    viewer.setPitch?.(0, 500);
    toast('설정한 정면 위치로 이동했습니다.');
  }

  function resetFront() {
    state.frontYaw = 0;
    saveState();
    refreshUI();
    toast('정면 기준을 원본 0°로 초기화했습니다.');
  }

  function injectStyles() {
    if (document.querySelector(`style[data-lava360-enhancement="${VERSION}"]`)) return;
    const style = document.createElement('style');
    style.dataset.lava360Enhancement = VERSION;
    style.textContent = `
      .lava360-output-tools{margin:20px 0 26px;padding:22px;border:1px solid color-mix(in srgb,var(--line,#334155) 76%,transparent);border-radius:22px;background:color-mix(in srgb,var(--surface,#111827) 94%,transparent);box-shadow:0 18px 50px rgba(0,0,0,.16);color:var(--text,#f8fafc)}
      .lava360-tools-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:18px}.lava360-tools-head h3{margin:4px 0 6px;font-size:clamp(1.18rem,2vw,1.5rem)}.lava360-tools-head p{margin:0;color:var(--muted,#94a3b8);line-height:1.65}.lava360-tools-kicker{font-size:.74rem;font-weight:900;letter-spacing:.12em;color:var(--accent,#67e8f9)}
      .lava360-status-chip{flex:0 0 auto;display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border-radius:999px;background:rgba(34,197,94,.12);color:#86efac;font-size:.78rem;font-weight:800}.lava360-status-chip.is-waiting{background:rgba(245,158,11,.12);color:#fcd34d}
      .lava360-tool-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.lava360-tool-card{min-width:0;padding:17px;border-radius:17px;background:color-mix(in srgb,var(--surface-2,#172033) 92%,transparent);border:1px solid color-mix(in srgb,var(--line,#334155) 65%,transparent)}.lava360-tool-card h4{margin:0 0 7px;font-size:1rem}.lava360-tool-card>p{margin:0 0 14px;color:var(--muted,#94a3b8);font-size:.86rem;line-height:1.55}
      .lava360-row{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.lava360-row+.lava360-row{margin-top:10px}.lava360-field{display:grid;gap:7px;min-width:0;flex:1}.lava360-field label{font-size:.77rem;font-weight:800;color:var(--muted,#94a3b8)}.lava360-field output{font-variant-numeric:tabular-nums;color:var(--text,#f8fafc)}
      .lava360-output-tools button,.lava360-output-tools select,.lava360-output-tools input{font:inherit}.lava360-output-tools button{min-height:42px;padding:10px 13px;border:1px solid color-mix(in srgb,var(--line,#475569) 82%,transparent);border-radius:11px;background:color-mix(in srgb,var(--surface,#111827) 86%,#fff 2%);color:var(--text,#f8fafc);font-weight:800;cursor:pointer}.lava360-output-tools button:hover{border-color:var(--accent,#67e8f9);transform:translateY(-1px)}.lava360-output-tools button.primary{border-color:transparent;background:linear-gradient(135deg,var(--accent,#22d3ee),#3b82f6);color:#06111f}.lava360-output-tools button.ghost{background:transparent}.lava360-output-tools button:disabled{opacity:.5;cursor:not-allowed;transform:none}
      .lava360-output-tools select,.lava360-output-tools input[type=number]{width:100%;min-height:42px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--line,#475569) 82%,transparent);border-radius:10px;background:var(--surface,#111827);color:var(--text,#f8fafc)}.lava360-output-tools input[type=range]{width:100%;accent-color:var(--accent,#22d3ee)}
      .lava360-angle{display:inline-flex;min-width:68px;justify-content:center;padding:8px 10px;border-radius:10px;background:rgba(56,189,248,.11);font-weight:900;font-variant-numeric:tabular-nums}.lava360-check{display:inline-flex;align-items:center;gap:8px;font-size:.82rem;font-weight:800}.lava360-check input{width:18px;height:18px;accent-color:var(--accent,#22d3ee)}
      .lava360-custom-ratio{display:none;grid-template-columns:1fr auto 1fr;align-items:center;gap:7px}.lava360-custom-ratio.is-visible{display:grid}.lava360-export-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.lava360-export-actions .wide{grid-column:1/-1}
      .lava360-guide-layer{position:absolute;inset:0;z-index:14;pointer-events:none;overflow:hidden;border-radius:inherit}.lava360-guide-layer[hidden]{display:none}.lava360-guide-horizon{position:absolute;left:-10%;top:50%;width:120%;height:1px;background:rgba(255,255,255,.88);box-shadow:0 0 0 1px rgba(0,0,0,.35),0 0 18px rgba(34,211,238,.45);transform-origin:center}.lava360-guide-horizon:before,.lava360-guide-horizon:after{content:"";position:absolute;top:-4px;width:1px;height:9px;background:inherit}.lava360-guide-horizon:before{left:33.333%}.lava360-guide-horizon:after{right:33.333%}.lava360-guide-center{position:absolute;left:50%;top:50%;width:18px;height:18px;transform:translate(-50%,-50%);border:1px solid rgba(255,255,255,.86);border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.35)}.lava360-guide-center:before,.lava360-guide-center:after{content:"";position:absolute;background:rgba(255,255,255,.9)}.lava360-guide-center:before{left:50%;top:-8px;width:1px;height:32px}.lava360-guide-center:after{left:-8px;top:50%;width:32px;height:1px}.lava360-front-badge{position:absolute;right:12px;top:12px;padding:7px 9px;border-radius:999px;background:rgba(2,6,23,.72);backdrop-filter:blur(8px);color:#fff;font:800 12px/1.2 Inter,sans-serif}
      .lava360-modal{position:fixed;inset:0;z-index:10050;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(2,6,23,.78);backdrop-filter:blur(8px)}.lava360-modal.is-open{display:flex}.lava360-modal-card{width:min(1080px,100%);max-height:calc(100vh - 36px);overflow:auto;border-radius:22px;border:1px solid rgba(148,163,184,.25);background:#0b1220;color:#f8fafc;box-shadow:0 30px 100px rgba(0,0,0,.45)}.lava360-modal-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:15px;padding:16px 18px;border-bottom:1px solid rgba(148,163,184,.18);background:rgba(11,18,32,.94);backdrop-filter:blur(10px)}.lava360-modal-head h3{margin:0}.lava360-modal-head button{width:42px;height:42px;border:0;border-radius:12px;background:#172033;color:#fff;font-size:1.2rem;cursor:pointer}.lava360-preview-wrap{display:grid;place-items:center;min-height:420px;padding:20px;background:repeating-conic-gradient(#111827 0 25%,#182235 0 50%) 50%/24px 24px}.lava360-preview-wrap canvas{display:block;max-width:100%;max-height:68vh;background:#000;box-shadow:0 18px 55px rgba(0,0,0,.38)}.lava360-modal-foot{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 18px;color:#94a3b8;font-size:.84rem}.lava360-modal-foot button{min-height:42px;padding:10px 15px;border:0;border-radius:11px;background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#04111d;font-weight:900;cursor:pointer}
      .lava360-local-toast{position:fixed;left:50%;bottom:max(24px,env(safe-area-inset-bottom));z-index:10100;max-width:min(92vw,620px);padding:12px 16px;border-radius:13px;background:rgba(15,23,42,.94);color:#f8fafc;box-shadow:0 15px 45px rgba(0,0,0,.35);font-weight:800;opacity:0;transform:translate(-50%,12px);pointer-events:none;transition:.22s}.lava360-local-toast.is-show{opacity:1;transform:translate(-50%,0)}.lava360-local-toast.is-error{background:rgba(127,29,29,.96)}
      @media(max-width:980px){.lava360-tool-grid{grid-template-columns:1fr 1fr}.lava360-tool-card:last-child{grid-column:1/-1}}
      @media(max-width:680px){.lava360-output-tools{margin:14px -4px 22px;padding:16px;border-radius:17px}.lava360-tools-head{display:grid}.lava360-status-chip{justify-self:start}.lava360-tool-grid{grid-template-columns:1fr}.lava360-tool-card:last-child{grid-column:auto}.lava360-export-actions{grid-template-columns:1fr}.lava360-export-actions .wide{grid-column:auto}.lava360-output-tools button{min-height:46px}.lava360-preview-wrap{min-height:300px;padding:10px}.lava360-modal{padding:8px}.lava360-modal-card{max-height:calc(100vh - 16px);border-radius:17px}}
    `;
    document.head.appendChild(style);
  }

  function createPanel() {
    if (panel || document.querySelector('.lava360-output-tools')) return;
    const mount = document.querySelector('#editor .container') || document.querySelector('#main .container') || document.querySelector('#main');
    if (!mount) return;
    panel = document.createElement('section');
    panel.className = 'lava360-output-tools';
    panel.setAttribute('aria-label', '360 시점 수평 및 2D 출력 도구');
    panel.innerHTML = `
      <div class="lava360-tools-head">
        <div><div class="lava360-tools-kicker">VIEW · LEVEL · EXPORT</div><h3>정면·수평 보정과 2D 이미지 출력</h3><p>현재 보고 있는 방향을 정확한 정면으로 지정하고, 기울어진 수평을 보정한 뒤 원하는 화면 비율의 일반 사진으로 저장합니다.</p></div>
        <span class="lava360-status-chip is-waiting" data-role="source-status">이미지 연결 대기</span>
      </div>
      <div class="lava360-tool-grid">
        <article class="lava360-tool-card">
          <h4>1. 정면 기준</h4><p>화면을 드래그해 원하는 방향을 중앙에 둔 뒤 정면으로 지정하세요. 설정값은 실제 360 내보내기에 반영됩니다.</p>
          <div class="lava360-row"><span class="lava360-angle" data-role="front-value">0°</span><button type="button" class="primary" data-action="set-front">현재 화면을 정면으로</button></div>
          <div class="lava360-row"><button type="button" data-action="go-front">정면 확인</button><button type="button" class="ghost" data-action="reset-front">0° 초기화</button></div>
        </article>
        <article class="lava360-tool-card">
          <h4>2. 기울기·수평 보정</h4><p>상하 기울기와 좌우 롤을 조절합니다. 가이드는 확인용이며 저장 이미지에는 표시되지 않습니다.</p>
          <div class="lava360-field"><label>상하 수평 <output data-role="pitch-value">0°</output></label><input type="range" min="-30" max="30" step="0.1" data-input="level-pitch"></div>
          <div class="lava360-field" style="margin-top:10px"><label>좌우 회전 <output data-role="roll-value">0°</output></label><input type="range" min="-30" max="30" step="0.1" data-input="level-roll"></div>
          <div class="lava360-row"><label class="lava360-check"><input type="checkbox" data-input="guide">수평 가이드 표시</label><button type="button" class="ghost" data-action="reset-level">수평 초기화</button></div>
        </article>
        <article class="lava360-tool-card">
          <h4>3. 현재 화면을 2D로 저장</h4><p>현재 방향과 줌을 가져온 뒤 SNS·블로그·상세페이지에 맞는 일반 사진으로 출력합니다.</p>
          <div class="lava360-row"><button type="button" data-action="sync-view">현재 시야 가져오기</button><span class="lava360-angle" data-role="view-value">0° / 70°</span></div>
          <div class="lava360-field" style="margin-top:10px"><label>줌·화각 <output data-role="hfov-value">70°</output></label><input type="range" min="30" max="120" step="1" data-input="hfov"></div>
          <div class="lava360-row" style="align-items:end">
            <div class="lava360-field"><label>출력 비율</label><select data-input="ratio"><option value="1:1">1:1 정사각형</option><option value="4:5">4:5 피드</option><option value="3:2">3:2 사진</option><option value="16:9">16:9 가로</option><option value="9:16">9:16 세로</option><option value="custom">직접 입력</option></select></div>
            <div class="lava360-field"><label>긴 변 해상도</label><select data-input="long-edge"><option value="1080">1080px</option><option value="1600">1600px</option><option value="2048">2048px</option><option value="3840">3840px</option></select></div>
          </div>
          <div class="lava360-custom-ratio" data-role="custom-ratio"><input type="number" min="1" max="100" data-input="custom-w" aria-label="가로 비율"><span>:</span><input type="number" min="1" max="100" data-input="custom-h" aria-label="세로 비율"></div>
          <div class="lava360-row" style="align-items:end;margin-top:10px">
            <div class="lava360-field"><label>파일 형식</label><select data-input="format"><option value="jpeg">JPEG</option><option value="png">PNG</option></select></div>
            <div class="lava360-field"><label>JPEG 품질</label><select data-input="quality"><option value="0.82">82%</option><option value="0.9">90%</option><option value="0.92">92%</option><option value="0.96">96%</option><option value="1">100%</option></select></div>
          </div>
          <div class="lava360-export-actions"><button type="button" data-action="preview-2d">2D 미리보기</button><button type="button" class="primary" data-action="save-2d">2D 이미지 저장</button><button type="button" class="wide" data-action="save-360">정면·수평 적용 360 JPEG 저장</button></div>
        </article>
      </div>`;
    const viewerContainer = document.querySelector('.pnlm-container');
    const preferred = viewerContainer?.closest('.editor-card,.editor-panel,.preview-panel,.workspace-panel');
    if (preferred && preferred.parentElement) preferred.parentElement.insertBefore(panel, preferred);
    else mount.appendChild(panel);
    bindPanel();
    refreshUI();
  }

  function bindPanel() {
    panel.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'set-front') setCurrentAsFront();
      if (action === 'go-front') goToFront();
      if (action === 'reset-front') resetFront();
      if (action === 'reset-level') {
        state.levelPitch = 0;
        state.levelRoll = 0;
        saveState();
        refreshUI();
        schedulePreview();
      }
      if (action === 'sync-view') syncFromViewer(true);
      if (action === 'preview-2d') openPreview();
      if (action === 'save-2d') export2D(button);
      if (action === 'save-360') export360(button);
    });
    panel.addEventListener('input', event => {
      const input = event.target.closest('[data-input]');
      if (!input) return;
      const key = input.dataset.input;
      if (key === 'level-pitch') state.levelPitch = clamp(input.value, -30, 30);
      if (key === 'level-roll') state.levelRoll = clamp(input.value, -30, 30);
      if (key === 'hfov') state.hfov = clamp(input.value, 30, 120);
      if (key === 'guide') state.guide = input.checked;
      if (key === 'ratio') state.ratio = input.value;
      if (key === 'custom-w') state.customW = clamp(input.value, 1, 100);
      if (key === 'custom-h') state.customH = clamp(input.value, 1, 100);
      if (key === 'long-edge') state.longEdge = Number(input.value);
      if (key === 'format') state.format = input.value;
      if (key === 'quality') state.quality = Number(input.value);
      saveState();
      refreshUI();
      schedulePreview();
    });
  }

  function refreshUI() {
    if (!panel) return;
    const setText = (role, text) => {
      const el = panel.querySelector(`[data-role="${role}"]`);
      if (el) el.textContent = text;
    };
    const setValue = (key, value) => {
      const el = panel.querySelector(`[data-input="${key}"]`);
      if (el && document.activeElement !== el) el.value = String(value);
    };
    setText('front-value', formatAngle(state.frontYaw));
    setText('pitch-value', formatAngle(state.levelPitch));
    setText('roll-value', formatAngle(state.levelRoll));
    setText('hfov-value', `${Math.round(state.hfov)}°`);
    setText('view-value', `${formatAngle(state.viewYaw)} / ${Math.round(state.hfov)}°`);
    setValue('level-pitch', state.levelPitch);
    setValue('level-roll', state.levelRoll);
    setValue('hfov', state.hfov);
    setValue('ratio', state.ratio);
    setValue('custom-w', state.customW);
    setValue('custom-h', state.customH);
    setValue('long-edge', state.longEdge);
    setValue('format', state.format);
    setValue('quality', state.quality);
    const guide = panel.querySelector('[data-input="guide"]');
    if (guide) guide.checked = !!state.guide;
    panel.querySelector('[data-role="custom-ratio"]')?.classList.toggle('is-visible', state.ratio === 'custom');
    const quality = panel.querySelector('[data-input="quality"]');
    if (quality) quality.disabled = state.format === 'png';
    const status = panel.querySelector('[data-role="source-status"]');
    if (status) {
      const ready = !!(state.source || currentConfig?.panorama || window.__lava360ViewerConfig?.panorama);
      status.classList.toggle('is-waiting', !ready);
      status.textContent = ready ? (state.sourceWidth ? `${state.sourceWidth}×${state.sourceHeight} 연결됨` : '360 이미지 연결됨') : '이미지 연결 대기';
    }
    updateGuide();
  }

  function mountGuide() {
    const container = document.querySelector('.pnlm-container');
    if (!container) return;
    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    if (guideLayer?.isConnected && guideLayer.parentElement === container) return;
    guideLayer?.remove();
    guideLayer = document.createElement('div');
    guideLayer.className = 'lava360-guide-layer';
    guideLayer.innerHTML = '<div class="lava360-guide-horizon"></div><div class="lava360-guide-center"></div><div class="lava360-front-badge"></div>';
    container.appendChild(guideLayer);
    updateGuide();
  }

  function updateGuide() {
    if (!guideLayer) return;
    guideLayer.hidden = !state.guide;
    const horizon = guideLayer.querySelector('.lava360-guide-horizon');
    if (horizon) {
      const vertical = clamp(state.levelPitch, -30, 30) * 0.85;
      horizon.style.top = `calc(50% + ${vertical}%)`;
      horizon.style.transform = `rotate(${-state.levelRoll}deg)`;
    }
    const badge = guideLayer.querySelector('.lava360-front-badge');
    if (badge) badge.textContent = `정면 ${formatAngle(state.frontYaw)}`;
  }

  function createModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'lava360-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '2D 이미지 미리보기');
    modal.innerHTML = `<div class="lava360-modal-card"><div class="lava360-modal-head"><h3>2D 이미지 미리보기</h3><button type="button" data-close aria-label="닫기">×</button></div><div class="lava360-preview-wrap"><canvas width="960" height="540"></canvas></div><div class="lava360-modal-foot"><span data-info>렌더링 준비 중</span><button type="button" data-save>이 화면 저장</button></div></div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('[data-close]')) closePreview();
      if (event.target.closest('[data-save]')) export2D(event.target.closest('[data-save]'));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal?.classList.contains('is-open')) closePreview();
    });
    return modal;
  }

  async function openPreview() {
    syncFromViewer(false);
    const dialog = createModal();
    dialog.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    await renderPreview();
  }

  function closePreview() {
    modal?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function schedulePreview() {
    if (!modal?.classList.contains('is-open')) return;
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => renderPreview(), 80);
  }

  function getRatio() {
    if (state.ratio === 'custom') return [clamp(state.customW, 1, 100), clamp(state.customH, 1, 100)];
    const parts = String(state.ratio).split(':').map(Number);
    return parts.length === 2 && parts.every(Number.isFinite) ? parts : [16, 9];
  }

  function getOutputSize(preview = false) {
    const [rw, rh] = getRatio();
    const long = preview ? 1200 : clamp(state.longEdge, 720, 7680);
    if (rw >= rh) return [Math.round(long), Math.max(1, Math.round(long * rh / rw))];
    return [Math.max(1, Math.round(long * rw / rh)), Math.round(long)];
  }

  async function renderPreview() {
    if (!modal) return;
    const canvas = modal.querySelector('canvas');
    const info = modal.querySelector('[data-info]');
    try {
      info.textContent = '고해상도 시야를 렌더링하고 있습니다.';
      const image = await loadSourceImage();
      const [width, height] = getOutputSize(true);
      renderPerspective(canvas, image, width, height);
      info.textContent = `${width}×${height} 미리보기 · 저장 시 ${getOutputSize(false).join('×')}px`;
      refreshUI();
    } catch (error) {
      info.textContent = error.message;
      toast(error.message, true);
    }
  }

  function createWebGLCanvas(canvas, width, height, fragmentSource) {
    canvas.width = width;
    canvas.height = height;
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, alpha: false });
    if (!gl) throw new Error('이 브라우저에서는 고해상도 360 출력(WebGL)을 사용할 수 없습니다.');
    const vertexSource = `attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=(a_position+1.0)*0.5;gl_Position=vec4(a_position,0.0,1.0);}`;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || '그래픽 셰이더 컴파일 실패');
      return shader;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || '그래픽 렌더러 연결 실패');
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    return { gl, program };
  }

  function bindTexture(gl, program, image) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0);
  }

  const shaderHelpers = `
    precision highp float;varying vec2 v_uv;uniform sampler2D u_texture;const float PI=3.141592653589793;
    mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,-s,0.,s,c);} 
    mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,s,0.,1.,0.,-s,0.,c);} 
    mat3 rotZ(float a){float c=cos(a),s=sin(a);return mat3(c,-s,0.,s,c,0.,0.,0.,1.);} 
    vec2 sphereUv(vec3 d){d=normalize(d);float lon=atan(d.x,d.z);float lat=asin(clamp(d.y,-1.,1.));return vec2(fract(lon/(2.*PI)+.5),clamp(.5-lat/PI,0.,1.));}
  `;

  function renderPerspective(canvas, image, width, height) {
    const fragment = `${shaderHelpers}
      uniform float u_yaw;uniform float u_pitch;uniform float u_hfov;uniform float u_levelPitch;uniform float u_levelRoll;uniform float u_aspect;
      void main(){vec2 p=v_uv*2.-1.;float tanH=tan(u_hfov*.5);vec3 ray=normalize(vec3(p.x*tanH,p.y*tanH/u_aspect,1.));ray=rotY(u_yaw)*rotX(u_pitch)*ray;ray=rotX(u_levelPitch)*rotZ(u_levelRoll)*ray;gl_FragColor=texture2D(u_texture,sphereUv(ray));}`;
    const { gl, program } = createWebGLCanvas(canvas, width, height, fragment);
    bindTexture(gl, program, image);
    const rad = Math.PI / 180;
    gl.uniform1f(gl.getUniformLocation(program, 'u_yaw'), state.viewYaw * rad);
    gl.uniform1f(gl.getUniformLocation(program, 'u_pitch'), state.viewPitch * rad);
    gl.uniform1f(gl.getUniformLocation(program, 'u_hfov'), state.hfov * rad);
    gl.uniform1f(gl.getUniformLocation(program, 'u_levelPitch'), state.levelPitch * rad);
    gl.uniform1f(gl.getUniformLocation(program, 'u_levelRoll'), state.levelRoll * rad);
    gl.uniform1f(gl.getUniformLocation(program, 'u_aspect'), width / height);
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function renderEquirectangular(canvas, image, width, height) {
    const fragment = `${shaderHelpers}
      uniform float u_front;uniform float u_levelPitch;uniform float u_levelRoll;
      void main(){float lon=(v_uv.x-.5)*2.*PI;float lat=(v_uv.y-.5)*PI;vec3 ray=vec3(sin(lon)*cos(lat),-sin(lat),cos(lon)*cos(lat));ray=rotY(u_front)*rotX(u_levelPitch)*rotZ(u_levelRoll)*ray;gl_FragColor=texture2D(u_texture,sphereUv(ray));}`;
    const { gl, program } = createWebGLCanvas(canvas, width, height, fragment);
    bindTexture(gl, program, image);
    const rad = Math.PI / 180;
    gl.uniform1f(gl.getUniformLocation(program, 'u_front'), state.frontYaw * rad);
    gl.uniform1f(gl.getUniformLocation(program, 'u_levelPitch'), state.levelPitch * rad);
    gl.uniform1f(gl.getUniformLocation(program, 'u_levelRoll'), state.levelRoll * rad);
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  async function export2D(button) {
    const originalText = button?.textContent;
    try {
      if (button) { button.disabled = true; button.textContent = '렌더링 중…'; }
      syncFromViewer(false);
      const image = await loadSourceImage();
      const [width, height] = getOutputSize(false);
      const canvas = document.createElement('canvas');
      renderPerspective(canvas, image, width, height);
      const mime = state.format === 'png' ? 'image/png' : 'image/jpeg';
      const blob = await canvasBlob(canvas, mime, state.quality);
      downloadBlob(blob, `lava360-view-${timestamp()}.${state.format === 'png' ? 'png' : 'jpg'}`);
      toast(`현재 시야를 ${width}×${height}px ${state.format.toUpperCase()}로 저장했습니다.`);
    } catch (error) {
      toast(error.message || '2D 이미지 저장에 실패했습니다.', true);
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText; }
    }
  }

  async function export360(button) {
    const originalText = button?.textContent;
    try {
      if (button) { button.disabled = true; button.textContent = '360 보정 렌더링 중…'; }
      const image = await loadSourceImage();
      let width = state.sourceWidth || image.naturalWidth;
      let height = state.sourceHeight || image.naturalHeight;
      if (Math.abs(width / height - 2) > 0.03) {
        width = Math.min(8192, Math.max(2048, width));
        height = Math.round(width / 2);
      }
      const maxTexture = getMaxTextureSize();
      if (width > maxTexture) { width = maxTexture - (maxTexture % 2); height = width / 2; }
      const canvas = document.createElement('canvas');
      renderEquirectangular(canvas, image, width, height);
      const jpeg = await canvasBlob(canvas, 'image/jpeg', state.quality);
      const gpano = await addGpanoXmp(jpeg, width, height);
      downloadBlob(gpano, `lava360-leveled-${timestamp()}.jpg`);
      toast(`정면·수평 보정을 적용한 ${width}×${height}px 360 JPEG를 저장했습니다.`);
    } catch (error) {
      toast(error.message || '360 이미지 저장에 실패했습니다.', true);
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText; }
    }
  }

  function getMaxTextureSize() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 4096;
  }

  function canvasBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('이미지 파일을 생성하지 못했습니다.')), type, quality));
  }

  async function addGpanoXmp(blob, width, height) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return blob;
    const xmp = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:GPano="http://ns.google.com/photos/1.0/panorama/" GPano:UsePanoramaViewer="True" GPano:ProjectionType="equirectangular" GPano:FullPanoWidthPixels="${width}" GPano:FullPanoHeightPixels="${height}" GPano:CroppedAreaImageWidthPixels="${width}" GPano:CroppedAreaImageHeightPixels="${height}" GPano:CroppedAreaLeftPixels="0" GPano:CroppedAreaTopPixels="0" GPano:PoseHeadingDegrees="0" GPano:PosePitchDegrees="0" GPano:PoseRollDegrees="0"/></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
    const header = new TextEncoder().encode('http://ns.adobe.com/xap/1.0/\0');
    const body = new TextEncoder().encode(xmp);
    const payloadLength = header.length + body.length;
    if (payloadLength + 2 > 65535) return blob;
    const segment = new Uint8Array(payloadLength + 4);
    segment[0] = 0xff; segment[1] = 0xe1;
    const length = payloadLength + 2;
    segment[2] = (length >> 8) & 0xff; segment[3] = length & 0xff;
    segment.set(header, 4); segment.set(body, 4 + header.length);
    const output = new Uint8Array(bytes.length + segment.length);
    output.set(bytes.slice(0, 2), 0);
    output.set(segment, 2);
    output.set(bytes.slice(2), 2 + segment.length);
    return new Blob([output], { type: 'image/jpeg' });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function timestamp() {
    const d = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  let toastTimer = 0;
  function toast(message, error = false) {
    let el = document.querySelector('.lava360-local-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'lava360-local-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.toggle('is-error', !!error);
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), error ? 5000 : 3200);
  }

  function interceptLegacyFrontControl() {
    document.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || button.closest('.lava360-output-tools')) return;
      const text = (button.textContent || '').replace(/\s+/g, ' ').trim();
      if (/현재.*정면|정면.*설정|정면으로 지정/.test(text)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setCurrentAsFront();
      }
    }, true);
  }

  function observeApp() {
    const observer = new MutationObserver(() => {
      createPanel();
      mountGuide();
      const config = window.__lava360ViewerConfig;
      if (config?.panorama && config.panorama !== currentConfig?.panorama) {
        currentConfig = config;
        rememberSource(config.panorama);
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  injectStyles();
  patchPannellum();
  captureUploads();
  interceptLegacyFrontControl();
  observeApp();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { createPanel(); mountGuide(); });
  else { createPanel(); mountGuide(); }
  window.__lava360ViewExport = { state, syncFromViewer, setCurrentAsFront, export2D, export360, version: VERSION };
})();
