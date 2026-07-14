(() => {
  'use strict';
  const pannellum = window.pannellum;
  if (!pannellum || typeof pannellum.viewer !== 'function' || pannellum.viewer.__lavaPatched) return;
  const originalViewer = pannellum.viewer;
  const wrapped = function wrappedViewer(container, config) {
    const viewer = originalViewer.call(this, container, config);
    window.__lava360Viewer = viewer;
    window.__lava360ViewerConfig = config || {};
    window.dispatchEvent(new CustomEvent('lava360:viewerready', { detail: { viewer, config: config || {} } }));
    return viewer;
  };
  wrapped.__lavaPatched = true;
  wrapped.__lavaOriginal = originalViewer;
  pannellum.viewer = wrapped;
})();
