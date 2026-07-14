(() => {
  'use strict';

  const VERSION = '20260714-free-mosaic1';
  const MAX_EDITOR_WIDTH = 1800;
  const shapes = [];
  const history = [];
  const future = [];
  const state = {
    tool: 'select',
    effect: 'pixelate',
    strength: 22,
    brushSize: 70,
    selectedId: null,
    drawing: null,
    dragging: null,
    source: '',
    filename: 'lava360-mosaic.jpg'
  };

  let image = null;
  let modal = null;
  let canvas = null;
  let ctx = null;
  let workCanvas = null;
  let workCtx = null;
  let effectCanvas = null;
  let effectCtx = null;
  let maskCanvas = null;
  let maskCtx = null;
  let lastPointer = null;

  const uid = () => `mask-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const clone = value => JSON.parse(JSON.stringify(value));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

  function toast(message, isError = false) {
    let el = document.querySelector('.lava360-local-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'lava360-local-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.toggle('is-error', !!isError);
    el.classList.add('is-show');
    clearTimeout(el.__timer);
    el.__timer = setTimeout(() => el.classList.remove('is-show'), isError ? 4800 : 3000);
  }

  function pushHistory() {
    history.push(clone(shapes));
    if (history.length > 40) history.shift();
    future.length = 0;
    refreshButtons();
  }

  function restore(list) {
    shapes.splice(0, shapes.length, ...clone(list));
    if (!shapes.some(item => item.id === state.selectedId)) state.selectedId = null;
    render();
    refreshButtons();
  }

  function undo() {
    if (!history.length) return;
    future.push(clone(shapes));
    restore(history.pop());
  }

  function redo() {
    if (!future.length) return;
    history.push(clone(shapes));
    restore(future.pop());
  }

  function injectStyles() {
    if (document.querySelector(`style[data-lava360-mosaic="${VERSION}"]`)) return;
    const style = document.createElement('style');
    style.dataset.lava360Mosaic = VERSION;
    style.textContent = `
      .lava360-mosaic-launch{margin:0 0 26px;padding:18px 20px;border:1px solid color-mix(in srgb,var(--line,#334155) 70%,transparent);border-radius:18px;background:linear-gradient(135deg,color-mix(in srgb,var(--surface-2,#172033) 96%,transparent),color-mix(in srgb,var(--surface,#111827) 94%,#22d3ee 3%));color:var(--text,#f8fafc);display:flex;align-items:center;justify-content:space-between;gap:18px}
      .lava360-mosaic-launch h3{margin:0 0 5px;font-size:1.08rem}.lava360-mosaic-launch p{margin:0;color:var(--muted,#94a3b8);line-height:1.55;font-size:.88rem}.lava360-mosaic-launch button{flex:0 0 auto;min-height:44px;padding:10px 16px;border:0;border-radius:12px;background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#04111d;font:900 .88rem/1 Inter,'Noto Sans KR',sans-serif;cursor:pointer}
      .lava360-mask-modal{position:fixed;inset:0;z-index:11000;display:none;background:rgba(2,6,23,.82);backdrop-filter:blur(9px);padding:12px}.lava360-mask-modal.is-open{display:grid;place-items:center}
      .lava360-mask-shell{width:min(1480px,100%);height:min(920px,calc(100vh - 24px));display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;border:1px solid rgba(148,163,184,.24);border-radius:22px;background:#08111f;color:#f8fafc;box-shadow:0 34px 110px rgba(0,0,0,.5)}
      .lava360-mask-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 18px;border-bottom:1px solid rgba(148,163,184,.16);background:rgba(8,17,31,.96)}.lava360-mask-head h2{margin:0;font-size:1.1rem}.lava360-mask-head p{margin:3px 0 0;color:#94a3b8;font-size:.8rem}.lava360-mask-head button{width:42px;height:42px;border:0;border-radius:12px;background:#172033;color:#fff;font-size:1.2rem;cursor:pointer}
      .lava360-mask-body{min-height:0;display:grid;grid-template-columns:260px minmax(0,1fr) 250px}.lava360-mask-panel{min-height:0;overflow:auto;padding:15px;border-right:1px solid rgba(148,163,184,.13);background:#0b1424}.lava360-mask-panel.right{border-right:0;border-left:1px solid rgba(148,163,184,.13)}
      .lava360-mask-group+.lava360-mask-group{margin-top:18px}.lava360-mask-group h3{margin:0 0 9px;color:#cbd5e1;font-size:.77rem;letter-spacing:.04em}.lava360-mask-tools{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lava360-mask-btn{min-height:42px;padding:9px 10px;border:1px solid #334155;border-radius:11px;background:#111d30;color:#e2e8f0;font:800 .82rem/1.2 Inter,'Noto Sans KR',sans-serif;cursor:pointer}.lava360-mask-btn:hover,.lava360-mask-btn.is-active{border-color:#22d3ee;background:rgba(34,211,238,.12);color:#a5f3fc}.lava360-mask-btn.danger{border-color:rgba(248,113,113,.42);color:#fecaca}.lava360-mask-btn:disabled{opacity:.42;cursor:not-allowed}
      .lava360-mask-field{display:grid;gap:7px;margin-top:11px}.lava360-mask-field label{display:flex;justify-content:space-between;gap:8px;color:#94a3b8;font-size:.76rem;font-weight:800}.lava360-mask-field input[type=range]{width:100%;accent-color:#22d3ee}.lava360-mask-field select{width:100%;min-height:41px;border:1px solid #334155;border-radius:10px;background:#111d30;color:#f8fafc;padding:8px 10px;font:inherit}
      .lava360-mask-stage{min-width:0;min-height:0;position:relative;display:grid;place-items:center;overflow:auto;padding:20px;background:repeating-conic-gradient(#0d1728 0 25%,#101d31 0 50%) 50%/28px 28px}.lava360-mask-stage canvas{display:block;max-width:100%;max-height:100%;box-shadow:0 18px 70px rgba(0,0,0,.5);touch-action:none;cursor:crosshair}.lava360-mask-stage canvas[data-tool=select]{cursor:default}.lava360-mask-empty{max-width:420px;text-align:center;color:#94a3b8;line-height:1.7}.lava360-mask-empty strong{display:block;margin-bottom:6px;color:#f8fafc;font-size:1.05rem}
      .lava360-mask-list{display:grid;gap:7px}.lava360-mask-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;align-items:center;padding:9px;border:1px solid #26364e;border-radius:10px;background:#101b2c}.lava360-mask-item.is-selected{border-color:#22d3ee;background:rgba(34,211,238,.09)}.lava360-mask-item button{border:0;background:transparent;color:#e2e8f0;text-align:left;font:800 .78rem/1.3 inherit;cursor:pointer}.lava360-mask-item .remove{width:30px;height:30px;text-align:center;color:#fca5a5}.lava360-mask-help{margin-top:10px;color:#7f8ea3;font-size:.73rem;line-height:1.55}
      .lava360-mask-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 16px;border-top:1px solid rgba(148,163,184,.16);background:#0b1424}.lava360-mask-foot .meta{color:#94a3b8;font-size:.78rem}.lava360-mask-actions{display:flex;gap:9px}.lava360-mask-actions button{min-height:43px;padding:10px 15px;border:1px solid #334155;border-radius:11px;background:#111d30;color:#f8fafc;font:900 .84rem/1 inherit;cursor:pointer}.lava360-mask-actions button.primary{border-color:transparent;background:linear-gradient(135deg,#22d3ee,#3b82f6);color:#04111d}
      @media(max-width:960px){.lava360-mask-body{grid-template-columns:210px minmax(0,1fr)}.lava360-mask-panel.right{display:none}}
      @media(max-width:700px){.lava360-mosaic-launch{display:grid}.lava360-mosaic-launch button{width:100%}.lava360-mask-modal{padding:0}.lava360-mask-shell{height:100dvh;border-radius:0;border:0}.lava360-mask-head{padding:11px 12px}.lava360-mask-head p{display:none}.lava360-mask-body{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}.lava360-mask-panel{display:flex;gap:8px;overflow-x:auto;padding:9px;border-right:0;border-bottom:1px solid rgba(148,163,184,.13)}.lava360-mask-group{min-width:max-content;margin:0!important}.lava360-mask-group h3,.lava360-mask-field,.lava360-mask-help{display:none}.lava360-mask-tools{display:flex}.lava360-mask-stage{padding:8px}.lava360-mask-foot{padding:9px;display:grid}.lava360-mask-foot .meta{display:none}.lava360-mask-actions{display:grid;grid-template-columns:1fr 1fr}.lava360-mask-actions button.primary{grid-column:1/-1}}
    `;
    document.head.appendChild(style);
  }

  function findImageInput() {
    return [...document.querySelectorAll('input[type=file]')].find(input => !input.disabled && (!input.accept || /image/i.test(input.accept))) || null;
  }

  function rememberInput(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'file' || !input.files?.length) return;
    const file = [...input.files].find(item => item.type.startsWith('image/'));
    if (!file) return;
    state.filename = file.name.replace(/\.[^.]+$/, '') + '-mosaic.jpg';
    loadSource(URL.createObjectURL(file));
  }

  async function resolveSource() {
    if (image) return image;
    const input = findImageInput();
    const file = input?.files?.[0];
    if (file?.type?.startsWith('image/')) {
      state.filename = file.name.replace(/\.[^.]+$/, '') + '-mosaic.jpg';
      return loadSource(URL.createObjectURL(file));
    }
    const source = window.__lava360ViewerConfig?.panorama;
    if (typeof source === 'string' && source) return loadSource(source);
    throw new Error('모자이크를 편집할 360 이미지를 먼저 불러와 주세요.');
  }

  function loadSource(src) {
    state.source = src;
    image = null;
    return new Promise((resolve, reject) => {
      const next = new Image();
      next.decoding = 'async';
      next.crossOrigin = 'anonymous';
      next.onload = () => { image = next; setupCanvas(); resolve(next); };
      next.onerror = () => reject(new Error('360 이미지를 모자이크 편집기에 불러오지 못했습니다.'));
      next.src = src;
    });
  }

  function createLauncher() {
    if (document.querySelector('.lava360-mosaic-launch')) return;
    const mount = document.querySelector('.lava360-output-tools') || document.querySelector('#editor .container') || document.querySelector('#main');
    if (!mount) return;
    const section = document.createElement('section');
    section.className = 'lava360-mosaic-launch';
    section.innerHTML = `<div><h3>자유 모자이크 · 개인정보 가리기</h3><p>중앙 고정 방식이 아니라 사진 위를 직접 드래그해 얼굴, 번호판, 반사된 개인정보를 원하는 모양으로 가릴 수 있습니다.</p></div><button type="button" data-open-free-mosaic>자유 모자이크 편집</button>`;
    if (mount.classList.contains('lava360-output-tools')) mount.insertAdjacentElement('afterend', section); else mount.appendChild(section);
    section.querySelector('button').addEventListener('click', openEditor);
  }

  function createModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'lava360-mask-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '자유 모자이크 편집기');
    modal.innerHTML = `
      <div class="lava360-mask-shell">
        <header class="lava360-mask-head"><div><h2>자유 모자이크 편집</h2><p>도형을 드래그하거나 브러시로 칠한 뒤 선택 도구로 이동·크기 조절하세요.</p></div><button type="button" data-close-mask aria-label="닫기">×</button></header>
        <div class="lava360-mask-body">
          <aside class="lava360-mask-panel">
            <section class="lava360-mask-group"><h3>도구</h3><div class="lava360-mask-tools">
              <button class="lava360-mask-btn is-active" data-mask-tool="select">선택·이동</button><button class="lava360-mask-btn" data-mask-tool="rect">사각형</button>
              <button class="lava360-mask-btn" data-mask-tool="ellipse">원형</button><button class="lava360-mask-btn" data-mask-tool="brush">브러시</button>
            </div></section>
            <section class="lava360-mask-group"><h3>효과</h3><div class="lava360-mask-field"><select data-mask-effect><option value="pixelate">픽셀 모자이크</option><option value="blur">블러</option><option value="solid">단색 가림</option></select></div><div class="lava360-mask-field"><label>강도 <output data-strength-value>22</output></label><input type="range" min="4" max="60" step="1" value="22" data-mask-strength></div><div class="lava360-mask-field"><label>브러시 크기 <output data-brush-value>70</output></label><input type="range" min="15" max="240" step="1" value="70" data-mask-brush></div></section>
            <section class="lava360-mask-group"><h3>편집</h3><div class="lava360-mask-tools"><button class="lava360-mask-btn" data-mask-action="undo">실행 취소</button><button class="lava360-mask-btn" data-mask-action="redo">다시 실행</button><button class="lava360-mask-btn" data-mask-action="duplicate">복제</button><button class="lava360-mask-btn danger" data-mask-action="delete">삭제</button></div><div class="lava360-mask-help">선택한 영역의 모서리 핸들을 드래그하면 크기를 조절할 수 있습니다. Delete 키로 삭제, Ctrl/Cmd+Z로 실행 취소가 가능합니다.</div></section>
          </aside>
          <main class="lava360-mask-stage"><div class="lava360-mask-empty"><strong>360 이미지를 불러오는 중입니다.</strong>이미지를 불러온 뒤 원하는 영역을 직접 지정할 수 있습니다.</div></main>
          <aside class="lava360-mask-panel right"><section class="lava360-mask-group"><h3>모자이크 영역</h3><div class="lava360-mask-list"></div><div class="lava360-mask-help">각 영역은 독립적으로 이동·크기 조절·삭제할 수 있습니다. 여러 개인정보를 한 번에 가려도 됩니다.</div></section></aside>
        </div>
        <footer class="lava360-mask-foot"><div class="meta" data-mask-meta>영역 0개</div><div class="lava360-mask-actions"><button type="button" data-mask-action="clear">전체 삭제</button><button type="button" data-mask-action="download">이미지만 저장</button><button type="button" class="primary" data-mask-action="apply">360 편집기에 적용</button></div></footer>
      </div>`;
    document.body.appendChild(modal);
    bindModal();
  }

  async function openEditor() {
    createModal();
    modal.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    try {
      await resolveSource();
      setupCanvas();
      render();
    } catch (error) {
      modal.querySelector('.lava360-mask-empty').innerHTML = `<strong>이미지가 필요합니다.</strong>${error.message}`;
      toast(error.message, true);
    }
  }

  function closeEditor() {
    modal?.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }

  function setupCanvas() {
    if (!modal || !image) return;
    const stage = modal.querySelector('.lava360-mask-stage');
    stage.innerHTML = '';
    canvas = document.createElement('canvas');
    const scale = Math.min(1, MAX_EDITOR_WIDTH / image.naturalWidth);
    canvas.width = Math.max(2, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.dataset.tool = state.tool;
    ctx = canvas.getContext('2d');
    stage.appendChild(canvas);
    bindCanvas();
    render();
  }

  function bindModal() {
    modal.querySelector('[data-close-mask]').addEventListener('click', closeEditor);
    modal.addEventListener('click', event => { if (event.target === modal) closeEditor(); });
    modal.querySelectorAll('[data-mask-tool]').forEach(button => button.addEventListener('click', () => setTool(button.dataset.maskTool)));
    modal.querySelector('[data-mask-effect]').addEventListener('change', event => { state.effect = event.target.value; applySelectionStyle(); });
    modal.querySelector('[data-mask-strength]').addEventListener('input', event => { state.strength = Number(event.target.value); modal.querySelector('[data-strength-value]').textContent = state.strength; applySelectionStyle(false); });
    modal.querySelector('[data-mask-strength]').addEventListener('change', () => applySelectionStyle(true));
    modal.querySelector('[data-mask-brush]').addEventListener('input', event => { state.brushSize = Number(event.target.value); modal.querySelector('[data-brush-value]').textContent = state.brushSize; });
    modal.querySelectorAll('[data-mask-action]').forEach(button => button.addEventListener('click', () => handleAction(button.dataset.maskAction)));
    document.addEventListener('keydown', event => {
      if (!modal?.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeEditor();
      if ((event.key === 'Delete' || event.key === 'Backspace') && !/INPUT|SELECT/.test(document.activeElement?.tagName || '')) { event.preventDefault(); deleteSelected(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); redo(); }
    });
  }

  function setTool(tool) {
    state.tool = tool;
    if (canvas) canvas.dataset.tool = tool;
    modal.querySelectorAll('[data-mask-tool]').forEach(button => button.classList.toggle('is-active', button.dataset.maskTool === tool));
  }

  function applySelectionStyle(commit = true) {
    const selected = shapes.find(item => item.id === state.selectedId);
    if (!selected) return;
    if (commit) pushHistory();
    selected.effect = state.effect;
    selected.strength = state.strength;
    render();
  }

  function bindCanvas() {
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointercancel', pointerUp);
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((event.clientY - rect.top) / rect.height, 0, 1)
    };
  }

  function pointerDown(event) {
    if (!image) return;
    canvas.setPointerCapture?.(event.pointerId);
    const point = pointFromEvent(event);
    lastPointer = point;
    if (state.tool === 'rect' || state.tool === 'ellipse') {
      pushHistory();
      const shape = { id: uid(), type: state.tool, x: point.x, y: point.y, w: 0, h: 0, effect: state.effect, strength: state.strength };
      shapes.push(shape); state.selectedId = shape.id; state.drawing = shape;
    } else if (state.tool === 'brush') {
      pushHistory();
      const shape = { id: uid(), type: 'brush', points: [point], radius: state.brushSize / canvas.width, effect: state.effect, strength: state.strength };
      shapes.push(shape); state.selectedId = shape.id; state.drawing = shape;
    } else {
      const hit = hitTest(point);
      state.selectedId = hit?.shape?.id || null;
      if (hit) {
        pushHistory();
        state.dragging = { id: hit.shape.id, mode: hit.handle ? 'resize' : 'move', handle: hit.handle, start: point, original: clone(hit.shape) };
      }
    }
    render();
  }

  function pointerMove(event) {
    if (!lastPointer) return;
    const point = pointFromEvent(event);
    if (state.drawing) {
      if (state.drawing.type === 'brush') state.drawing.points.push(point);
      else {
        state.drawing.x = Math.min(lastPointer.x, point.x);
        state.drawing.y = Math.min(lastPointer.y, point.y);
        state.drawing.w = Math.abs(point.x - lastPointer.x);
        state.drawing.h = Math.abs(point.y - lastPointer.y);
      }
      render();
      return;
    }
    if (!state.dragging) return;
    const shape = shapes.find(item => item.id === state.dragging.id);
    if (!shape) return;
    const dx = point.x - state.dragging.start.x;
    const dy = point.y - state.dragging.start.y;
    if (state.dragging.mode === 'move') moveShape(shape, state.dragging.original, dx, dy);
    else resizeShape(shape, state.dragging.original, state.dragging.handle, dx, dy);
    render();
  }

  function pointerUp() {
    if (state.drawing && state.drawing.type !== 'brush' && (state.drawing.w < .004 || state.drawing.h < .004)) shapes.splice(shapes.indexOf(state.drawing), 1);
    state.drawing = null;
    state.dragging = null;
    lastPointer = null;
    render();
  }

  function boundsOf(shape) {
    if (shape.type !== 'brush') return { x: shape.x, y: shape.y, w: shape.w, h: shape.h };
    const xs = shape.points.map(p => p.x), ys = shape.points.map(p => p.y), r = shape.radius || .02;
    const x1 = Math.min(...xs) - r, x2 = Math.max(...xs) + r, y1 = Math.min(...ys) - r, y2 = Math.max(...ys) + r;
    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }

  function handles(shape) {
    const b = boundsOf(shape);
    return [
      { key: 'nw', x: b.x, y: b.y }, { key: 'ne', x: b.x + b.w, y: b.y },
      { key: 'sw', x: b.x, y: b.y + b.h }, { key: 'se', x: b.x + b.w, y: b.y + b.h }
    ];
  }

  function hitTest(point) {
    const tolerance = 12 / Math.max(canvas.width, canvas.height);
    for (let index = shapes.length - 1; index >= 0; index--) {
      const shape = shapes[index];
      if (shape.id === state.selectedId && shape.type !== 'brush') {
        const handle = handles(shape).find(item => Math.hypot(point.x - item.x, point.y - item.y) <= tolerance);
        if (handle) return { shape, handle: handle.key };
      }
      if (contains(shape, point)) return { shape, handle: null };
    }
    return null;
  }

  function contains(shape, point) {
    if (shape.type === 'rect') return point.x >= shape.x && point.x <= shape.x + shape.w && point.y >= shape.y && point.y <= shape.y + shape.h;
    if (shape.type === 'ellipse') {
      const rx = shape.w / 2 || .001, ry = shape.h / 2 || .001;
      const cx = shape.x + rx, cy = shape.y + ry;
      return ((point.x - cx) ** 2) / (rx ** 2) + ((point.y - cy) ** 2) / (ry ** 2) <= 1;
    }
    const radius = (shape.radius || .02) * 1.3;
    return shape.points.some(p => Math.hypot(point.x - p.x, point.y - p.y) <= radius);
  }

  function moveShape(shape, original, dx, dy) {
    if (shape.type === 'brush') {
      const b = boundsOf(original);
      dx = clamp(dx, -b.x, 1 - (b.x + b.w)); dy = clamp(dy, -b.y, 1 - (b.y + b.h));
      shape.points = original.points.map(point => ({ x: point.x + dx, y: point.y + dy }));
    } else {
      shape.x = clamp(original.x + dx, 0, 1 - original.w);
      shape.y = clamp(original.y + dy, 0, 1 - original.h);
    }
  }

  function resizeShape(shape, original, handle, dx, dy) {
    if (shape.type === 'brush') return;
    let x1 = original.x, y1 = original.y, x2 = original.x + original.w, y2 = original.y + original.h;
    if (handle.includes('w')) x1 += dx; else x2 += dx;
    if (handle.includes('n')) y1 += dy; else y2 += dy;
    x1 = clamp(x1, 0, 1); x2 = clamp(x2, 0, 1); y1 = clamp(y1, 0, 1); y2 = clamp(y2, 0, 1);
    shape.x = Math.min(x1, x2); shape.y = Math.min(y1, y2); shape.w = Math.max(.003, Math.abs(x2 - x1)); shape.h = Math.max(.003, Math.abs(y2 - y1));
  }

  function render() {
    if (!ctx || !image) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => renderEffect(ctx, canvas, image, shape));
    shapes.forEach(shape => drawOutline(shape));
    refreshList();
    refreshButtons();
  }

  function shapePath(target, shape, width, height) {
    target.beginPath();
    if (shape.type === 'rect') target.rect(shape.x * width, shape.y * height, shape.w * width, shape.h * height);
    else if (shape.type === 'ellipse') target.ellipse((shape.x + shape.w / 2) * width, (shape.y + shape.h / 2) * height, Math.max(1, shape.w * width / 2), Math.max(1, shape.h * height / 2), 0, 0, Math.PI * 2);
    else {
      const points = shape.points || [];
      if (!points.length) return;
      target.moveTo(points[0].x * width, points[0].y * height);
      points.slice(1).forEach(point => target.lineTo(point.x * width, point.y * height));
    }
  }

  function renderEffect(target, targetCanvas, source, shape) {
    const width = targetCanvas.width, height = targetCanvas.height;
    if (!effectCanvas) { effectCanvas = document.createElement('canvas'); effectCtx = effectCanvas.getContext('2d'); }
    if (!maskCanvas) { maskCanvas = document.createElement('canvas'); maskCtx = maskCanvas.getContext('2d'); }
    effectCanvas.width = maskCanvas.width = width;
    effectCanvas.height = maskCanvas.height = height;
    effectCtx.clearRect(0, 0, width, height);
    maskCtx.clearRect(0, 0, width, height);

    if (shape.effect === 'solid') {
      effectCtx.fillStyle = '#111827';
      effectCtx.fillRect(0, 0, width, height);
    } else if (shape.effect === 'blur') {
      effectCtx.filter = `blur(${Math.max(2, Number(shape.strength) || 12)}px)`;
      effectCtx.drawImage(source, 0, 0, width, height);
      effectCtx.filter = 'none';
    } else {
      const factor = Math.max(3, Number(shape.strength) || 16);
      const sw = Math.max(1, Math.round(width / factor)), sh = Math.max(1, Math.round(height / factor));
      if (!workCanvas) { workCanvas = document.createElement('canvas'); workCtx = workCanvas.getContext('2d'); }
      workCanvas.width = sw; workCanvas.height = sh;
      workCtx.imageSmoothingEnabled = true;
      workCtx.clearRect(0, 0, sw, sh);
      workCtx.drawImage(source, 0, 0, sw, sh);
      effectCtx.imageSmoothingEnabled = false;
      effectCtx.drawImage(workCanvas, 0, 0, sw, sh, 0, 0, width, height);
      effectCtx.imageSmoothingEnabled = true;
    }

    maskCtx.fillStyle = '#fff';
    maskCtx.strokeStyle = '#fff';
    if (shape.type === 'brush') {
      const points = shape.points || [];
      if (!points.length) return;
      maskCtx.beginPath();
      maskCtx.lineCap = 'round';
      maskCtx.lineJoin = 'round';
      maskCtx.lineWidth = Math.max(2, (shape.radius || .02) * width * 2);
      maskCtx.moveTo(points[0].x * width, points[0].y * height);
      points.slice(1).forEach(point => maskCtx.lineTo(point.x * width, point.y * height));
      if (points.length === 1) {
        maskCtx.beginPath();
        maskCtx.arc(points[0].x * width, points[0].y * height, Math.max(1, (shape.radius || .02) * width), 0, Math.PI * 2);
        maskCtx.fill();
      } else maskCtx.stroke();
    } else {
      shapePath(maskCtx, shape, width, height);
      maskCtx.fill();
    }

    effectCtx.globalCompositeOperation = 'destination-in';
    effectCtx.drawImage(maskCanvas, 0, 0);
    effectCtx.globalCompositeOperation = 'source-over';
    target.drawImage(effectCanvas, 0, 0);
  }

  function drawOutline(shape) {
    const selected = shape.id === state.selectedId;
    ctx.save();
    shapePath(ctx, shape, canvas.width, canvas.height);
    ctx.strokeStyle = selected ? '#22d3ee' : 'rgba(255,255,255,.8)';
    ctx.lineWidth = selected ? 3 : 1.4;
    ctx.setLineDash(selected ? [] : [7, 5]);
    if (shape.type === 'brush') { ctx.lineWidth = Math.max(2, (shape.radius || .02) * canvas.width * 2); ctx.globalAlpha = .45; }
    ctx.stroke();
    if (selected && shape.type !== 'brush') {
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      handles(shape).forEach(handle => { ctx.fillStyle = '#08111f'; ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(handle.x * canvas.width - 6, handle.y * canvas.height - 6, 12, 12); ctx.fill(); ctx.stroke(); });
    }
    ctx.restore();
  }

  function refreshList() {
    if (!modal) return;
    const list = modal.querySelector('.lava360-mask-list');
    list.innerHTML = shapes.map((shape, index) => `<div class="lava360-mask-item ${shape.id === state.selectedId ? 'is-selected' : ''}"><button type="button" data-select-mask="${shape.id}">${index + 1}. ${labelFor(shape)}</button><button type="button" class="remove" data-remove-mask="${shape.id}" aria-label="삭제">×</button></div>`).join('') || '<div class="lava360-mask-help">아직 지정한 영역이 없습니다.</div>';
    list.querySelectorAll('[data-select-mask]').forEach(button => button.addEventListener('click', () => { state.selectedId = button.dataset.selectMask; setTool('select'); syncSelectionControls(); render(); }));
    list.querySelectorAll('[data-remove-mask]').forEach(button => button.addEventListener('click', () => { pushHistory(); const index = shapes.findIndex(item => item.id === button.dataset.removeMask); if (index >= 0) shapes.splice(index, 1); if (state.selectedId === button.dataset.removeMask) state.selectedId = null; render(); }));
    modal.querySelector('[data-mask-meta]').textContent = `영역 ${shapes.length}개 · 선택 ${state.selectedId ? '1개' : '없음'}`;
  }

  function labelFor(shape) {
    const type = shape.type === 'rect' ? '사각형' : shape.type === 'ellipse' ? '원형' : '브러시';
    const effect = shape.effect === 'blur' ? '블러' : shape.effect === 'solid' ? '단색' : '픽셀';
    return `${type} · ${effect}`;
  }

  function syncSelectionControls() {
    const selected = shapes.find(item => item.id === state.selectedId);
    if (!selected || !modal) return;
    state.effect = selected.effect || 'pixelate'; state.strength = selected.strength || 22;
    modal.querySelector('[data-mask-effect]').value = state.effect;
    modal.querySelector('[data-mask-strength]').value = state.strength;
    modal.querySelector('[data-strength-value]').textContent = state.strength;
  }

  function refreshButtons() {
    if (!modal) return;
    const selected = !!state.selectedId;
    const byAction = action => modal.querySelector(`[data-mask-action="${action}"]`);
    byAction('undo').disabled = !history.length; byAction('redo').disabled = !future.length; byAction('delete').disabled = !selected; byAction('duplicate').disabled = !selected; byAction('clear').disabled = !shapes.length;
  }

  function deleteSelected() {
    const index = shapes.findIndex(item => item.id === state.selectedId);
    if (index < 0) return;
    pushHistory(); shapes.splice(index, 1); state.selectedId = null; render();
  }

  function duplicateSelected() {
    const selected = shapes.find(item => item.id === state.selectedId);
    if (!selected) return;
    pushHistory(); const copy = clone(selected); copy.id = uid();
    if (copy.type === 'brush') copy.points = copy.points.map(point => ({ x: clamp(point.x + .025, 0, 1), y: clamp(point.y + .025, 0, 1) }));
    else { copy.x = clamp(copy.x + .025, 0, 1 - copy.w); copy.y = clamp(copy.y + .025, 0, 1 - copy.h); }
    shapes.push(copy); state.selectedId = copy.id; render();
  }

  async function handleAction(action) {
    if (action === 'undo') undo();
    else if (action === 'redo') redo();
    else if (action === 'delete') deleteSelected();
    else if (action === 'duplicate') duplicateSelected();
    else if (action === 'clear') { if (shapes.length) { pushHistory(); shapes.length = 0; state.selectedId = null; render(); } }
    else if (action === 'download') await output(false);
    else if (action === 'apply') await output(true);
  }

  async function output(apply) {
    if (!image) return toast('이미지를 먼저 불러와 주세요.', true);
    if (!shapes.length) return toast('모자이크 영역을 하나 이상 지정해 주세요.', true);
    const button = modal.querySelector(`[data-mask-action="${apply ? 'apply' : 'download'}"]`);
    const original = button.textContent;
    try {
      button.disabled = true; button.textContent = '고해상도 처리 중…';
      const out = document.createElement('canvas'); out.width = image.naturalWidth; out.height = image.naturalHeight;
      const outCtx = out.getContext('2d'); outCtx.drawImage(image, 0, 0, out.width, out.height);
      shapes.forEach(shape => renderEffect(outCtx, out, image, shape));
      const blob = await new Promise((resolve, reject) => out.toBlob(value => value ? resolve(value) : reject(new Error('모자이크 이미지를 만들지 못했습니다.')), 'image/jpeg', .94));
      if (!apply) { downloadBlob(blob, state.filename); toast('모자이크가 적용된 360 이미지를 저장했습니다.'); return; }
      const file = new File([blob], state.filename, { type: 'image/jpeg', lastModified: Date.now() });
      const input = findImageInput();
      if (input && typeof DataTransfer !== 'undefined') {
        const transfer = new DataTransfer(); transfer.items.add(file); input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        const url = URL.createObjectURL(blob); window.dispatchEvent(new CustomEvent('lava360:mosaicsource', { detail: { url, file } }));
      }
      closeEditor();
      toast('자유 모자이크를 360 편집기에 적용했습니다. 기존 보정과 2D·360 저장에 이어서 사용할 수 있습니다.');
    } catch (error) { toast(error.message || '모자이크 처리에 실패했습니다.', true); }
    finally { button.disabled = false; button.textContent = original; }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.style.display = 'none'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function interceptLegacyButtons() {
    document.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || button.closest('.lava360-mask-modal') || button.matches('[data-open-free-mosaic]')) return;
      const text = (button.textContent || '').replace(/\s+/g, ' ').trim();
      if (/^(자유 )?모자이크 편집$|개인정보 모자이크 편집|모자이크 영역 추가/.test(text)) {
        event.preventDefault(); event.stopImmediatePropagation(); openEditor();
      }
    }, true);
  }

  injectStyles();
  createModal();
  createLauncher();
  interceptLegacyButtons();
  document.addEventListener('change', rememberInput, true);
  const observer = new MutationObserver(createLauncher);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();