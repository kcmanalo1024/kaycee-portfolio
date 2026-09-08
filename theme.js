(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('keysi-theme');
  root.dataset.theme = saved || 'dark';
  const tubalandStyle = document.createElement('style');
  tubalandStyle.textContent = `
    html[data-theme="light"] .tb-page{--tb-bg:#f5f2eb!important;--tb-panel:#fcfaf5!important;--tb-panel2:#eeece5!important;--tb-text:#20231f!important;--tb-muted:#5c5f57!important;--tb-soft:#6a6d64!important;--tb-line:#d8d4ca!important;--tb-lime:#8dad36!important;--tb-blue:#5969c9!important;background:radial-gradient(800px 520px at 82% -10%,rgba(141,173,54,.16),transparent 65%),radial-gradient(700px 500px at -15% 35%,rgba(89,105,201,.13),transparent 65%),#f5f2eb!important;color:#20231f!important}
    html[data-theme="light"] .tb-page .tb-header,html[data-theme="light"] .tb-page .tb-footer,html[data-theme="light"] .tb-page .tb-hero{background:transparent!important;color:#20231f!important}
    html[data-theme="light"] .tb-page .tb-back{color:#30332d!important;border-color:#cbc7bc!important;background:#faf8f2!important}
    html[data-theme="light"] .tb-page .tb-hero-description,html[data-theme="light"] .tb-page .tb-copy,html[data-theme="light"] .tb-page .tb-intro,html[data-theme="light"] .tb-page .tb-feature p,html[data-theme="light"] .tb-page .tb-learning-card p,html[data-theme="light"] .tb-page .tb-manual p{color:#595d55!important}
    html[data-theme="light"] .tb-page .tb-hero-details,html[data-theme="light"] .tb-page .tb-overview-card,html[data-theme="light"] .tb-page .tb-proto-row,html[data-theme="light"] .tb-page .tb-proto-card,html[data-theme="light"] .tb-page .tb-tech-item,html[data-theme="light"] .tb-page .tb-feature,html[data-theme="light"] .tb-page .tb-learning-card{background:#fcfaf5!important;border-color:#d8d4ca!important;box-shadow:0 12px 28px rgba(46,43,36,.09)!important}
    html[data-theme="light"] .tb-page .tb-detail-value,html[data-theme="light"] .tb-page .tb-stat strong,html[data-theme="light"] .tb-page .tb-heading,html[data-theme="light"] .tb-page .tb-proto-meta strong{color:#242720!important}
    html[data-theme="light"] .tb-page .tb-feature-media,html[data-theme="light"] .tb-page .tb-proto-media,html[data-theme="light"] .tb-page .tb-ba-clean .tb-proto-media{background:linear-gradient(145deg,#ece9e2,#e2dfd7)!important}
    html[data-theme="light"] .tb-page .tb-proto-meta,html[data-theme="light"] .tb-page .tb-ba-clean .tb-proto-meta{background:#f8f5ef!important;border-color:#d8d4ca!important}
    html[data-theme="light"] .tb-page .tb-process{background:#d8d4ca!important;border-color:#d8d4ca!important}html[data-theme="light"] .tb-page .tb-process-item{background:#fcfaf5!important}
    html[data-theme="light"] .tb-page .tb-manual{background:radial-gradient(circle at 85% 20%,rgba(141,173,54,.16),transparent 38%),#fcfaf5!important;border-color:#b6c77e!important}
  `;
  document.head.append(tubalandStyle);
  const icon = () => root.dataset.theme === 'light' ? '☀' : '☾';
  const label = () => root.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
  function makeToggle() {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'theme-toggle';
    button.textContent = icon(); button.setAttribute('aria-label', label()); button.title = label();
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('keysi-theme', root.dataset.theme);
      document.querySelectorAll('.theme-toggle').forEach((toggle) => { toggle.textContent = icon(); toggle.setAttribute('aria-label', label()); toggle.title = label(); });
    });
    return button;
  }
  function addToggle() {
    const nav = document.getElementById('site-header')?.querySelector('.nav-wrap, .tb-nav');
    if (!nav || nav.querySelector('.theme-toggle')) return;
    const back = nav.querySelector('.nav-cta, .tb-back');
    if (back) { const controls = document.createElement('div'); controls.className = 'case-controls'; back.before(controls); controls.append(back, makeToggle()); }
    else (nav.querySelector('.nav-right') || nav).append(makeToggle());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addToggle, { once: true });
  else addToggle();
})();
