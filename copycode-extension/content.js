(function () {
  const BTN_ATTR = 'data-copycode-injected';
  const STYLE_ID = 'copycode-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      .copycode-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 11px;
        font-size: 11px;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 500;
        letter-spacing: 0.3px;
        color: rgba(255,255,255,0.85);
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 6px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.12s ease, background 0.12s ease, border-color 0.12s ease, transform 0.1s ease;
        line-height: 1.4;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        transform: translateY(-2px);
      }
      .cm-editor:hover .copycode-btn,
      .copycode-wrap:hover .copycode-btn,
      .copycode-btn:focus {
        opacity: 1;
        transform: translateY(0);
      }
      .copycode-btn:hover {
        background: rgba(255,255,255,0.14);
        border-color: rgba(255,255,255,0.22);
      }
      .copycode-btn:active {
        transform: scale(0.96);
      }
      .copycode-btn.copied {
        background: rgba(34,197,94,0.18) !important;
        border-color: rgba(34,197,94,0.4) !important;
        color: #4ade80 !important;
      }
      .copycode-btn svg {
        flex-shrink: 0;
        transition: transform 0.15s ease;
      }
      .copycode-btn.copied svg {
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(s);
  }

  const ICON_COPY = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const ICON_CHECK = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  function getCMText(editorEl) {
    try {
      const content = editorEl.querySelector('.cm-content');
      if (content && content.cmView && content.cmView.view) {
        return content.cmView.view.state.doc.toString();
      }
    } catch(e) {}
    return [...editorEl.querySelectorAll('.cm-line')].map(l => l.innerText).join('\n');
  }

  function getPreText(el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.copycode-btn').forEach(b => b.remove());
    const inner = clone.querySelector('code');
    return ((inner || clone).textContent || '').replace(/\n$/, '');
  }

  function isRealBlock(pre) {
    if (pre.closest('.cm-editor')) return false;
    const text = (pre.textContent || '').trim();
    if (!text) return false;
    const code = pre.querySelector('code');
    const hasLang = /(^|\s)(language|lang|hljs|shiki|prism)[-\w]*/i.test(
      pre.className + ' ' + (code ? code.className : '') + ' ' + (pre.dataset.language || '')
    );
    return text.includes('\n') || hasLang || text.length > 60;
  }

  function copyText(text, btn) {
    const finish = () => {
      btn.innerHTML = ICON_CHECK + 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = ICON_COPY + 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    };
    navigator.clipboard.writeText(text).then(finish).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      finish();
    });
  }

  function addBtn(el, type) {
    if (el.getAttribute(BTN_ATTR)) return;
    el.setAttribute(BTN_ATTR, '1');
    const pos = getComputedStyle(el).position;
    if (pos === 'static') el.style.position = 'relative';
    if (type !== 'codemirror') el.classList.add('copycode-wrap');

    const btn = document.createElement('button');
    btn.className = 'copycode-btn';
    btn.innerHTML = ICON_COPY + 'Copy';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const text = type === 'codemirror' ? getCMText(el) : getPreText(el);
      copyText(text, btn);
    });

    el.appendChild(btn);
  }

  function run() {
    injectStyles();
    document.querySelectorAll('.cm-editor').forEach(el => addBtn(el, 'codemirror'));
    document.querySelectorAll('pre').forEach(el => {
      if (isRealBlock(el)) addBtn(el, 'pre');
    });
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; run(); });
  };

  run();
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
