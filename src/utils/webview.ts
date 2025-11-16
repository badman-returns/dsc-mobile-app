export const INJECTED_JAVASCRIPT = `
  (function() {
    const meta = document.querySelector('meta[name="viewport"]') || document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    if (!meta.parentNode) {
      document.head.appendChild(meta);
    }
    
    true;
  })();
`;

export const createViewportMeta = () => INJECTED_JAVASCRIPT;
