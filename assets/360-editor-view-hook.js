(() => {
  'use strict';

  const originalCreateObjectURL = URL.createObjectURL.bind(URL);
  if (!URL.createObjectURL.__lavaPatched) {
    const wrappedCreateObjectURL = blob => {
      const url = originalCreateObjectURL(blob);
      const stack = new Error().stack || '';
      const isDownloadOnly = /downloadBlob/.test(stack);
      if (blob instanceof Blob && blob.type.startsWith('image/') && !isDownloadOnly) {
        window.__lava360LatestImageUrl = url;
        window.__lava360ViewerConfig = Object.assign({}, window.__lava360ViewerConfig || {}, { panorama: url });
        window.dispatchEvent(new CustomEvent('lava360:imagesource', { detail: { url, type: blob.type, size: blob.size } }));
      }
      return url;
    };
    wrappedCreateObjectURL.__lavaPatched = true;
    wrappedCreateObjectURL.__lavaOriginal = originalCreateObjectURL;
    URL.createObjectURL = wrappedCreateObjectURL;
  }

  const pannellum = window.pannellum;
  if (!pannellum || typeof pannellum.viewer !== 'function' || pannellum.viewer.__lavaPatched) return;
  const originalViewer = pannellum.viewer;
  const wrappedViewer = function wrappedViewer(container, config) {
    const viewer = originalViewer.call(this, container, config);
    window.__lava360Viewer = viewer;
    window.__lava360ViewerConfig = config || {};
    if (config?.panorama) window.__lava360LatestImageUrl = config.panorama;
    window.dispatchEvent(new CustomEvent('lava360:viewerready', { detail: { viewer, config: config || {} } }));
    return viewer;
  };
  wrappedViewer.__lavaPatched = true;
  wrappedViewer.__lavaOriginal = originalViewer;
  pannellum.viewer = wrappedViewer;
})();
