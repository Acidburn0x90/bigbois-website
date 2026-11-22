/**
 * Starlit Vault UI Controller (Charcoal Monotone Skeletal UI)
 * - Strictly zero .innerHTML usage (all DOM constructed via createElement + textContent)
 * - Zero persistent storage (no localStorage, sessionStorage, IndexedDB, or cookies)
 * - 15-minute inactivity auto-lock + instant lock hotkey ('l')
 */
(function () {
  'use strict';

  const AUTO_LOCK_SECONDS = 15 * 60;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  let vaultData = null;
  let activeWorkspace = 'flow';
  let activeProjectCategory = 'all';
  let activeTimelineHost = 'all';
  let selectedTopoNodeId = null;
  let failCount = 0;
  let unlockBlockedUntil = 0;
  let remainingSeconds = AUTO_LOCK_SECONDS;
  let timerHandle = null;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function svgEl(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        node.setAttribute(k, String(v));
      }
    }
    return node;
  }

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function isSafeHttpUrl(url) {
    return typeof url === 'string' && /^https?:\/\//i.test(url);
  }

  function createWindow(title, tagText) {
    const win = el('div', 'tile-window');
    const bar = el('div', 'tile-bar');
    bar.appendChild(el('span', '', title));
    if (tagText) {
      bar.appendChild(el('span', 'tile-tag', tagText));
    }
    const body = el('div', 'tile-body');
    win.appendChild(bar);
    win.appendChild(body);
    return { win, body };
  }

  function resetInactivityTimer() {
    remainingSeconds = AUTO_LOCK_SECONDS;
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const pill = document.getElementById('autoLockPill');
    if (!pill) return;
    const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const secs = String(remainingSeconds % 60).padStart(2, '0');
    pill.textContent = `AUTO-LOCK ${mins}:${secs}`;
  }

  function lockVault() {
    vaultData = null;
    if (timerHandle) {
      clearInterval(timerHandle);
      timerHandle = null;
    }
    const panels = ['flow', 'timeline', 'projects', 'commands', 'prefs', 'ideas'];
    for (const p of panels) {
      const sec = document.getElementById(`panel-${p}`);
      if (sec) clearNode(sec);
    }
    const metricsRow = document.getElementById('metricsRow');
    if (metricsRow) clearNode(metricsRow);

    document.getElementById('vaultApp').classList.add('hidden');
    document.getElementById('lockScreen').classList.remove('hidden');
    document.getElementById('autoLockPill').classList.add('hidden');
    document.getElementById('lockBtn').classList.add('hidden');

    const dot = document.getElementById('vaultDot');
    dot.classList.add('locked');
    document.getElementById('vaultStateText').textContent = 'AES-256-GCM LOCKED';
    document.getElementById('waybarHost').textContent = 'starlit-vault // locked';

    const pwInput = document.getElementById('passphraseInput');
    pwInput.value = '';
    document.getElementById('kdfStatus').textContent = 'Vault locked. Volatile memory wiped.';
    pwInput.focus();
  }

  function switchWorkspace(ws) {
    activeWorkspace = ws;
    const buttons = document.querySelectorAll('#wsGroup .ws-pill');
    buttons.forEach((b) => {
      if (b.dataset.ws === ws) b.classList.add('active');
      else b.classList.remove('active');
    });
    const panels = ['flow', 'timeline', 'projects', 'commands', 'prefs', 'ideas'];
    for (const p of panels) {
      const sec = document.getElementById(`panel-${p}`);
      if (!sec) continue;
      if (p === ws) sec.classList.remove('hidden');
      else sec.classList.add('hidden');
    }
    renderAll();
  }

  function renderMetrics() {
    const row = document.getElementById('metricsRow');
    clearNode(row);
    if (!vaultData) return;

    const counts = vaultData.meta?.counts || {};
    const items = [
      { label: 'Mesh Nodes', value: `${counts.nodes || 6} Active Endpoints` },
      { label: 'Synced Repositories', value: `${counts.projects || 0} Projects` },
      { label: 'CLI & Mobile Commands', value: `${counts.commands || 0} Shortcuts` },
      { label: 'Snapshot Timestamp', value: vaultData.meta?.built_at || 'Live' }
    ];
    for (const it of items) {
      const cell = el('div', 'metric-cell');
      cell.appendChild(el('div', 'metric-label', it.label));
      cell.appendChild(el('div', 'metric-value', it.value));
      row.appendChild(cell);
    }
  }

  function renderFlowSection(query) {
    const container = document.getElementById('panel-flow');
    clearNode(container);
    if (!vaultData) return;

    // 1. Interactive Topology SVG + Node Inspector
    const topoWin = createWindow(
      'topology // mesh-network.svg (click any node to inspect)',
      'TOPOLOGY FLOW'
    );
    const split = el('div', 'flow-split');
    const svgWrap = el('div', 'svg-canvas-wrap');
    const svg = svgEl('svg', { viewBox: '0 0 920 390', class: 'topo-svg' });

    const nodes = vaultData.topology?.nodes || [];
    const edges = vaultData.topology?.edges || [];
    const nodeById = {};
    for (const n of nodes) nodeById[n.id] = n;

    // Draw edges first
    for (const edge of edges) {
      const a = nodeById[edge.from];
      const b = nodeById[edge.to];
      if (!a || !b) continue;
      const line = svgEl('line', {
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        class: 'svg-edge'
      });
      svg.appendChild(line);

      const mx = Math.round((a.x + b.x) / 2);
      const my = Math.round((a.y + b.y) / 2) - 5;
      const lbl = svgEl('text', {
        x: mx,
        y: my,
        'text-anchor': 'middle',
        class: 'svg-edge-label'
      });
      lbl.textContent = edge.label;
      svg.appendChild(lbl);
    }

    // Draw nodes
    for (const n of nodes) {
      const g = svgEl('g', {
        class: `svg-node${n.id === (selectedTopoNodeId || nodes[0]?.id) ? ' active' : ''}`,
        transform: `translate(${n.x - 105}, ${n.y - 34})`
      });
      g.addEventListener('click', () => {
        selectedTopoNodeId = n.id;
        renderFlowSection(query);
      });

      g.appendChild(svgEl('rect', { width: 210, height: 68, rx: 3, ry: 3 }));
      g.appendChild(svgEl('circle', { cx: 14, cy: 18, r: 4, class: 'svg-node-dot' }));

      const t1 = svgEl('text', { x: 26, y: 22, class: 'svg-node-title' });
      t1.textContent = n.label;
      g.appendChild(t1);

      const t2 = svgEl('text', { x: 14, y: 40, class: 'svg-node-sub' });
      t2.textContent = n.ip;
      g.appendChild(t2);

      const t3 = svgEl('text', { x: 14, y: 56, class: 'svg-node-sub' });
      t3.textContent = n.role.slice(0, 32);
      g.appendChild(t3);

      svg.appendChild(g);
    }

    svgWrap.appendChild(svg);
    split.appendChild(svgWrap);

    // Inspector Panel
    const selected = nodeById[selectedTopoNodeId] || nodes[0];
    const insp = el('div', 'inspector-card');
    if (selected) {
      insp.appendChild(el('div', 'tile-tag', `nvim // inspector: ${selected.id}`));
      insp.appendChild(el('div', 'inspector-title', selected.label));
      insp.appendChild(el('div', 'inspector-sub', `${selected.ip} — ${selected.role}`));
      insp.appendChild(el('div', 'inspector-sub', selected.specs));

      const ul = el('ul', 'service-list');
      for (const srv of selected.services || []) {
        if (query && !srv.toLowerCase().includes(query) && !selected.label.toLowerCase().includes(query)) {
          continue;
        }
        ul.appendChild(el('li', '', srv));
      }
      insp.appendChild(ul);
    }
    split.appendChild(insp);
    topoWin.body.appendChild(split);
    container.appendChild(topoWin.win);

    // 2. Engineering & Agent Workflow Pipeline
    const wfWin = createWindow(
      'nexus // opencode-first-delegation-and-lifecycle-flow',
      'AGENT PIPELINE'
    );
    const wfGrid = el('div', 'workflow-grid');
    for (const wf of vaultData.workflows || []) {
      const hay = `${wf.title} ${wf.command} ${wf.actor} ${wf.detail}`.toLowerCase();
      if (query && !hay.includes(query)) continue;
      const card = el('div', 'wf-card');
      card.appendChild(el('div', 'wf-step', `STEP ${wf.step} // ${wf.actor}`));
      card.appendChild(el('div', 'wf-title', wf.title));
      card.appendChild(el('div', 'wf-cmd', wf.command));
      card.appendChild(el('div', 'wf-desc', wf.detail));
      wfGrid.appendChild(card);
    }
    wfWin.body.appendChild(wfGrid);
    container.appendChild(wfWin.win);
  }

  function renderTimelineSection(query) {
    const container = document.getElementById('panel-timeline');
    clearNode(container);
    if (!vaultData) return;

    const win = createWindow('journalctl // multi-host-change-history', 'TIMELINE');
    const seenHosts = new Set(['all']);
    for (const item of vaultData.timeline || []) {
      if (item.host) seenHosts.add(item.host);
    }
    const hosts = Array.from(seenHosts);
    const bar = el('div', 'filter-pills');
    bar.style.marginBottom = '12px';

    for (const h of hosts) {
      const btn = el('button', `filter-pill${activeTimelineHost === h ? ' active' : ''}`, h);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        activeTimelineHost = h;
        renderTimelineSection(query);
      });
      bar.appendChild(btn);
    }
    win.body.appendChild(bar);

    const list = el('div', 'timeline-list');
    for (const item of vaultData.timeline || []) {
      if (activeTimelineHost !== 'all' && item.host !== activeTimelineHost) continue;
      const hay = `${item.date} ${item.host} ${item.category} ${item.title} ${item.summary}`.toLowerCase();
      if (query && !hay.includes(query)) continue;

      const row = el('div', 'tl-item');
      const head = el('div', 'card-head');
      head.appendChild(el('div', 'card-title', item.title));
      head.appendChild(el('span', 'tile-tag', `${item.date} · ${item.host} · ${item.category}`));
      row.appendChild(head);
      row.appendChild(el('div', 'card-desc', item.summary));
      list.appendChild(row);
    }
    win.body.appendChild(list);
    container.appendChild(win.win);
  }

  function renderProjectsSection(query) {
    const container = document.getElementById('panel-projects');
    clearNode(container);
    if (!vaultData) return;

    const win = createWindow('nvim // ~/Documents/projects/* (complete workspace inventory)', 'PROJECTS');
    const cats = [
      'all',
      'infra',
      'ai-agents',
      'security-re',
      'games-mc',
      'systems-tools',
      'simulations-math',
      'hardware-3d'
    ];
    const bar = el('div', 'filter-pills');
    bar.style.marginBottom = '12px';

    for (const c of cats) {
      const btn = el('button', `filter-pill${activeProjectCategory === c ? ' active' : ''}`, c);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        activeProjectCategory = c;
        renderProjectsSection(query);
      });
      bar.appendChild(btn);
    }
    win.body.appendChild(bar);

    const grid = el('div', 'card-grid');
    for (const p of vaultData.projects || []) {
      if (activeProjectCategory !== 'all' && p.category !== activeProjectCategory) continue;
      const hay = `${p.title} ${p.category} ${p.summary} ${p.path}`.toLowerCase();
      if (query && !hay.includes(query)) continue;

      const card = el('div', 'item-card');
      const top = el('div', '');
      const head = el('div', 'card-head');
      head.appendChild(el('div', 'card-title', p.title));
      head.appendChild(el('span', 'tile-tag', p.category));
      top.appendChild(head);
      const desc = el('div', 'card-desc', p.summary);
      desc.style.marginTop = '6px';
      top.appendChild(desc);
      card.appendChild(top);

      const foot = el('div', 'card-foot');
      foot.appendChild(el('span', '', `${p.path} · ${p.updated}`));
      if (isSafeHttpUrl(p.repo)) {
        const a = el('a', 'card-link', 'GitHub ↗');
        a.href = p.repo;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        foot.appendChild(a);
      }
      card.appendChild(foot);
      grid.appendChild(card);
    }
    win.body.appendChild(grid);
    container.appendChild(win.win);
  }

  function renderCommandsSection(query) {
    const container = document.getElementById('panel-commands');
    clearNode(container);
    if (!vaultData) return;

    const grid = el('div', 'card-grid');
    for (const grp of vaultData.commands || []) {
      const win = createWindow(grp.group, grp.tag);
      const list = el('div', 'cmd-list');
      let count = 0;

      for (const it of grp.items || []) {
        const hay = `${it.cmd} ${it.desc} ${grp.group}`.toLowerCase();
        if (query && !hay.includes(query)) continue;
        count++;

        const row = el('div', 'cmd-row');
        const left = el('div', 'cmd-left');
        left.appendChild(el('div', 'cmd-code', it.cmd));
        left.appendChild(el('div', 'cmd-desc', it.desc));
        row.appendChild(left);

        const copyBtn = el('button', 'copy-btn', 'COPY');
        copyBtn.type = 'button';
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(it.cmd);
          copyBtn.textContent = 'COPIED';
          setTimeout(() => {
            copyBtn.textContent = 'COPY';
          }, 1200);
        });
        row.appendChild(copyBtn);
        list.appendChild(row);
      }

      if (count > 0) {
        win.body.appendChild(list);
        grid.appendChild(win.win);
      }
    }
    container.appendChild(grid);
  }

  function renderPrefsSection(query) {
    const container = document.getElementById('panel-prefs');
    clearNode(container);
    if (!vaultData) return;

    const grid = el('div', 'card-grid');
    for (const grp of vaultData.preferences || []) {
      const win = createWindow(grp.category, grp.tag);
      const ul = el('ul', 'service-list');
      let count = 0;
      for (const r of grp.rules || []) {
        const hay = `${grp.category} ${r}`.toLowerCase();
        if (query && !hay.includes(query)) continue;
        count++;
        ul.appendChild(el('li', '', r));
      }
      if (count > 0) {
        win.body.appendChild(ul);
        grid.appendChild(win.win);
      }
    }
    container.appendChild(grid);
  }

  function renderIdeasSection(query) {
    const container = document.getElementById('panel-ideas');
    clearNode(container);
    if (!vaultData) return;

    const win = createWindow('tasks // active-experiments-and-ideas-backlog', 'IDEAS & NEXT');
    const grid = el('div', 'card-grid');

    for (const idea of vaultData.ideas || []) {
      const hay = `${idea.title} ${idea.status} ${idea.category} ${idea.summary} ${idea.next_step}`.toLowerCase();
      if (query && !hay.includes(query)) continue;

      const card = el('div', 'item-card');
      const top = el('div', '');
      const head = el('div', 'card-head');
      head.appendChild(el('div', 'card-title', idea.title));
      head.appendChild(el('span', 'tile-tag', `${idea.status.toUpperCase()} · ${idea.category}`));
      top.appendChild(head);

      const desc = el('div', 'card-desc', idea.summary);
      desc.style.marginTop = '6px';
      top.appendChild(desc);
      card.appendChild(top);

      const foot = el('div', 'card-foot');
      foot.appendChild(el('span', '', `Next: ${idea.next_step}`));
      card.appendChild(foot);
      grid.appendChild(card);
    }

    win.body.appendChild(grid);
    container.appendChild(win.win);
  }

  function renderAll() {
    if (!vaultData) return;
    const query = (document.getElementById('globalSearch')?.value || '').trim().toLowerCase();
    renderMetrics();
    renderFlowSection(query);
    renderTimelineSection(query);
    renderProjectsSection(query);
    renderCommandsSection(query);
    renderPrefsSection(query);
    renderIdeasSection(query);
  }

  async function handleUnlock(e) {
    e.preventDefault();
    const now = Date.now();
    const errorBox = document.getElementById('errorBox');
    const statusEl = document.getElementById('kdfStatus');
    const unlockBtn = document.getElementById('unlockBtn');
    const pwInput = document.getElementById('passphraseInput');

    if (now < unlockBlockedUntil) {
      const waitSec = Math.ceil((unlockBlockedUntil - now) / 1000);
      errorBox.textContent = `Rate-limited backoff active — wait ${waitSec}s before retrying.`;
      errorBox.classList.remove('hidden');
      return;
    }

    const passphrase = pwInput.value.trim();
    pwInput.value = '';
    if (!passphrase) return;

    errorBox.classList.add('hidden');
    unlockBtn.disabled = true;

    try {
      statusEl.textContent = 'fetching encrypted envelope (vault.enc.json)...';
      const res = await fetch('./vault.enc.json', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load vault.enc.json');
      }
      const envelope = await res.json();
      const decrypted = await window.StarlitVaultCrypto.decryptVault(envelope, passphrase, (msg) => {
        statusEl.textContent = msg;
      });

      vaultData = decrypted;
      failCount = 0;

      document.getElementById('lockScreen').classList.add('hidden');
      document.getElementById('vaultApp').classList.remove('hidden');
      document.getElementById('autoLockPill').classList.remove('hidden');
      document.getElementById('lockBtn').classList.remove('hidden');

      const dot = document.getElementById('vaultDot');
      dot.classList.remove('locked');
      document.getElementById('vaultStateText').textContent = 'DECRYPTED (RAM)';
      document.getElementById('waybarHost').textContent = 'starlit-vault // unlocked';

      resetInactivityTimer();
      if (timerHandle) clearInterval(timerHandle);
      timerHandle = setInterval(() => {
        remainingSeconds--;
        if (remainingSeconds <= 0) {
          lockVault();
        } else {
          updateTimerDisplay();
        }
      }, 1000);

      renderAll();
    } catch (_err) {
      failCount++;
      const delayMs = Math.min(8000, Math.pow(2, failCount - 1) * 1000);
      unlockBlockedUntil = Date.now() + delayMs;
      statusEl.textContent = 'Decryption aborted.';
      errorBox.textContent = 'Decryption failed — invalid passphrase or tampered ciphertext.';
      errorBox.classList.remove('hidden');
    } finally {
      unlockBtn.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('unlockForm');
    form.addEventListener('submit', handleUnlock);

    const toggleBtn = document.getElementById('togglePwBtn');
    const pwInput = document.getElementById('passphraseInput');
    toggleBtn.addEventListener('click', () => {
      if (pwInput.type === 'password') {
        pwInput.type = 'text';
        toggleBtn.textContent = 'HIDE';
      } else {
        pwInput.type = 'password';
        toggleBtn.textContent = 'SHOW';
      }
    });

    document.getElementById('lockBtn').addEventListener('click', lockVault);

    document.querySelectorAll('#wsGroup .ws-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!vaultData) return;
        switchWorkspace(btn.dataset.ws);
      });
    });

    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', () => {
      resetInactivityTimer();
      renderAll();
    });

    ['mousemove', 'keydown', 'click', 'touchstart'].forEach((ev) => {
      document.addEventListener(
        ev,
        () => {
          if (vaultData) resetInactivityTimer();
        },
        { passive: true }
      );
    });

    document.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      const inInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');

      if (e.key === 'Escape') {
        if (inInput && active === searchInput) {
          searchInput.value = '';
          searchInput.blur();
          renderAll();
        }
        return;
      }

      if (inInput) return;

      if (e.key === '/' && vaultData) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (e.key === 'l' && vaultData) {
        e.preventDefault();
        lockVault();
      } else if (e.key === 'h') {
        e.preventDefault();
        window.location.href = '../index.html';
      } else if (vaultData && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        const map = {
          '1': 'flow',
          '2': 'timeline',
          '3': 'projects',
          '4': 'commands',
          '5': 'prefs',
          '6': 'ideas'
        };
        switchWorkspace(map[e.key]);
      }
    });
  });
})();
