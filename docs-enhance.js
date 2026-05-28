(function () {
  const KEY = 'flotaPG_docs_checklist_v1';
  const unidades = [
    {
      id: 'EXX568',
      nombre: 'EXX568',
      detalle: 'Rusbel Algarra - RFF, bascula y planta',
      docs: ['SOAT', 'Tecnomecanica', 'Seguro', 'Tarjeta propiedad', 'Licencia Rusbel']
    },
    {
      id: 'SXY206',
      nombre: 'SXY206',
      detalle: 'Edgar Tinjaca - personal y encomiendas',
      docs: ['SOAT', 'Tecnomecanica', 'Licencia Edgar', 'Permiso interno', 'Seguro pasajeros']
    }
  ];

  let filtro = 'todos';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (e) { return {}; }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function daysUntil(dateText) {
    if (!dateText) return null;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const date = new Date(dateText + 'T00:00:00');
    return Math.ceil((date - todayDate) / 86400000);
  }

  function statusFor(dateText) {
    const days = daysUntil(dateText);
    if (days === null) return { id: 'pendiente', label: 'Pendiente', cls: 'pending' };
    if (days < 0) return { id: 'vencido', label: 'Vencido', cls: 'bad' };
    if (days <= 30) return { id: 'critico', label: days + ' dias', cls: 'warn' };
    return { id: 'vigente', label: days + ' dias', cls: 'ok' };
  }

  function addStyles() {
    if (document.getElementById('pg-docs-style')) return;
    const st = document.createElement('style');
    st.id = 'pg-docs-style';
    st.textContent = `
.docs-shell{background:#fff;border:1px solid var(--border);border-radius:16px;padding:14px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.docs-title{font-size:15px;font-weight:900;color:var(--g);margin-bottom:4px}
.docs-sub{font-size:12px;color:var(--muted);line-height:1.35;margin-bottom:12px}
.docs-unit{border:1.5px solid var(--border);border-radius:14px;padding:12px;margin-bottom:12px;background:#fff}
.docs-unit-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start;margin-bottom:10px}
.docs-unit-name{font-size:15px;font-weight:900;color:var(--text)}
.docs-unit-detail{font-size:11px;color:var(--muted);margin-top:2px}
.docs-badge{border-radius:999px;padding:5px 9px;font-size:10px;font-weight:900;background:var(--gl);color:var(--g);white-space:nowrap}
.doc-row{display:grid;grid-template-columns:24px 1fr;gap:8px;padding:10px 0;border-top:1px solid var(--border)}
.doc-row:first-of-type{border-top:none}
.doc-check{width:20px;height:20px;margin-top:3px;accent-color:#2D6A4F}
.doc-main{min-width:0}
.doc-name-line{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:6px}
.doc-name{font-size:13px;font-weight:800;color:var(--text)}
.doc-status{border-radius:999px;padding:4px 8px;font-size:10px;font-weight:900;white-space:nowrap}
.doc-status.ok{background:var(--okl);color:var(--ok)}
.doc-status.warn{background:var(--aml);color:var(--am)}
.doc-status.bad{background:var(--redl);color:var(--red)}
.doc-status.pending{background:var(--bg);color:var(--muted)}
.doc-date{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:10px 11px;font-size:14px;font-family:Inter,sans-serif;background:#fff}
.docs-help{background:var(--aml);border:1.5px solid var(--am);border-radius:12px;padding:12px;font-size:12px;color:var(--am);font-weight:700;line-height:1.4;margin-bottom:12px}
.docs-summary{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px}
.docs-summary>div{background:var(--bg);border-radius:10px;padding:10px;text-align:center}
.docs-summary strong{display:block;font-size:18px;font-weight:900;color:var(--g)}
.docs-summary span{font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase}
`;
    document.head.appendChild(st);
  }

  function tuneHomeButton() {
    const home = document.getElementById('home-scr');
    if (!home) return;
    const btn = Array.from(home.querySelectorAll('.btn-menu')).find(b => b.textContent.includes('Documentos'));
    if (!btn || btn.dataset.docsTuned) return;
    btn.dataset.docsTuned = '1';
    const title = btn.querySelector('strong');
    const detail = btn.querySelector('span:last-child');
    if (title) title.textContent = 'Checklist documentos';
    if (detail) detail.textContent = 'Marcar y poner fecha de vencimiento';
  }

  function collectStats(data) {
    let ok = 0, warn = 0, bad = 0, pending = 0;
    unidades.forEach(u => u.docs.forEach(doc => {
      const item = data[u.id]?.[doc] || {};
      const st = statusFor(item.fecha);
      if (!item.activo || st.id === 'pendiente') pending++;
      else if (st.id === 'vencido') bad++;
      else if (st.id === 'critico') warn++;
      else ok++;
    }));
    return { ok, warn, bad, pending };
  }

  function render() {
    const page = document.getElementById('pg-docs');
    if (!page || !page.classList.contains('active')) return;

    const h1 = page.querySelector('.hdr h1');
    const p = page.querySelector('.hdr p');
    if (h1) h1.textContent = 'Checklist documentos';
    if (p) p.textContent = 'Marca cada documento y registra vencimiento';

    const scr = page.querySelector('.scr');
    if (!scr) return;

    const data = load();
    const stats = collectStats(data);

    scr.innerHTML = `
      <div class="docs-shell">
        <div class="docs-title">Control documental para salir a operacion</div>
        <div class="docs-sub">Marca el documento cuando lo tengas revisado y registra su fecha de vencimiento. La app calcula automaticamente vigentes, criticos y vencidos.</div>
        <div class="docs-summary">
          <div><strong>${stats.ok}</strong><span>Vigentes</span></div>
          <div><strong>${stats.warn}</strong><span>Criticos</span></div>
          <div><strong>${stats.bad}</strong><span>Vencidos</span></div>
        </div>
      </div>
      <div class="tab-bar">
        <button class="tab-btn ${filtro === 'todos' ? 'on' : ''}" data-doc-filter="todos">Todos</button>
        <button class="tab-btn ${filtro === 'vencido' ? 'on' : ''}" data-doc-filter="vencido">Vencidos</button>
        <button class="tab-btn ${filtro === 'critico' ? 'on' : ''}" data-doc-filter="critico">Criticos</button>
        <button class="tab-btn ${filtro === 'vigente' ? 'on' : ''}" data-doc-filter="vigente">Vigentes</button>
      </div>
      <div class="docs-help">Prioridad: SOAT, tecnomecanica, licencia del conductor y seguros. Si faltan menos de 30 dias, se marca como critico.</div>
      <div id="docs-checklist"></div>
    `;

    scr.querySelectorAll('[data-doc-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filtro = btn.dataset.docFilter;
        render();
      });
    });

    const list = scr.querySelector('#docs-checklist');
    list.innerHTML = unidades.map(u => renderUnit(u, data)).join('');
    list.querySelectorAll('[data-doc-input]').forEach(input => {
      input.addEventListener('change', onChange);
    });
  }

  function renderUnit(unit, data) {
    const rows = unit.docs.map(doc => {
      const item = data[unit.id]?.[doc] || {};
      const st = statusFor(item.fecha);
      const visible = filtro === 'todos' || st.id === filtro;
      if (!visible) return '';
      return `
        <div class="doc-row">
          <input class="doc-check" type="checkbox" ${item.activo ? 'checked' : ''} data-doc-input data-unit="${unit.id}" data-doc="${doc}" data-field="activo">
          <div class="doc-main">
            <div class="doc-name-line">
              <div class="doc-name">${doc}</div>
              <span class="doc-status ${st.cls}">${st.label}</span>
            </div>
            <input class="doc-date" type="date" value="${item.fecha || ''}" data-doc-input data-unit="${unit.id}" data-doc="${doc}" data-field="fecha">
          </div>
        </div>`;
    }).join('');
    return `
      <div class="docs-unit">
        <div class="docs-unit-head">
          <div><div class="docs-unit-name">${unit.nombre}</div><div class="docs-unit-detail">${unit.detalle}</div></div>
          <span class="docs-badge">${unit.docs.length} docs</span>
        </div>
        ${rows || '<div class="empty" style="padding:14px">Sin documentos en este filtro</div>'}
      </div>`;
  }

  function onChange(e) {
    const el = e.currentTarget;
    const data = load();
    data[el.dataset.unit] = data[el.dataset.unit] || {};
    data[el.dataset.unit][el.dataset.doc] = data[el.dataset.unit][el.dataset.doc] || {};
    data[el.dataset.unit][el.dataset.doc][el.dataset.field] = el.dataset.field === 'activo' ? el.checked : el.value;
    save(data);
    render();
  }

  function run() {
    addStyles();
    tuneHomeButton();
    render();
  }

  run();
  if (window.goPage && !window.goPage.__docsWrapped) {
    const originalGoPage = window.goPage;
    window.goPage = function () {
      const result = originalGoPage.apply(this, arguments);
      setTimeout(run, 50);
      return result;
    };
    window.goPage.__docsWrapped = true;
  }
})();
