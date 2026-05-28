(function () {
  function addDocsStyles() {
    if (document.getElementById('pg-docs-style')) return;
    const st = document.createElement('style');
    st.id = 'pg-docs-style';
    st.textContent = `
.docs-ops{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:14px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.docs-ops-title{font-size:15px;font-weight:900;color:var(--g);margin-bottom:4px}
.docs-ops-sub{font-size:12px;color:var(--muted);line-height:1.35;margin-bottom:12px}
.docs-score{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px}
.docs-score>div{background:var(--bg);border-radius:10px;padding:10px;text-align:center}
.docs-score strong{display:block;font-size:18px;font-weight:900;color:var(--g)}
.docs-score span{font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase}
.doc-unit{border:1.5px solid var(--border);border-radius:12px;padding:12px;margin-bottom:10px;background:#fff}
.doc-unit-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:8px}
.doc-unit-name{font-size:14px;font-weight:900;color:var(--text)}
.doc-unit-use{font-size:11px;color:var(--muted);margin-top:2px}
.doc-chip-row{display:flex;flex-wrap:wrap;gap:6px}
.doc-chip{border-radius:999px;background:var(--bg);color:var(--muted);font-size:10px;font-weight:800;padding:6px 8px}
.doc-chip.required{background:var(--gl);color:var(--g)}
.doc-empty{background:var(--aml);border:1.5px solid var(--am);border-radius:12px;padding:12px;margin:10px 0 12px;color:var(--am)}
.doc-empty-title{font-size:13px;font-weight:900;margin-bottom:6px}
.doc-empty ul{margin:0;padding-left:17px;font-size:12px;line-height:1.45}
`;
    document.head.appendChild(st);
  }

  function tuneHomeButton() {
    const home = document.getElementById('home-scr');
    if (!home) return;
    const btn = Array.from(home.querySelectorAll('.btn-menu')).find(b => b.textContent.includes('Documentos'));
    if (!btn || btn.dataset.docsTuned) return;
    btn.dataset.docsTuned = '1';
    const strong = btn.querySelector('strong');
    const detail = btn.querySelector('span:last-child');
    if (strong) strong.textContent = 'Vencimientos y permisos';
    if (detail) detail.textContent = 'SOAT, tecnomecanica, licencias y seguros';
  }

  function enhanceDocsPage() {
    const page = document.getElementById('pg-docs');
    if (!page || !page.classList.contains('active')) return;

    const title = page.querySelector('.hdr h1');
    const subtitle = page.querySelector('.hdr p');
    if (title) title.textContent = 'Vencimientos y permisos';
    if (subtitle) subtitle.textContent = 'Habilitacion para operar en plantacion';

    const scr = page.querySelector('.scr');
    if (!scr || scr.querySelector('.docs-ops')) return;

    const empty = page.querySelector('#docs-list .empty');
    const total = empty ? '0' : String(Math.max(1, page.querySelectorAll('#docs-list .card,.doc-row,.item-row').length));
    const block = document.createElement('div');
    block.className = 'docs-ops';
    block.innerHTML = `
      <div class="docs-ops-title">Antes de mover un camion</div>
      <div class="docs-ops-sub">Esta pantalla debe responder si el vehiculo o el conductor estan habilitados para salir a campo, bascula, planta u oficina.</div>
      <div class="docs-score">
        <div><strong>${total}</strong><span>Registrados</span></div>
        <div><strong>0</strong><span>Vencidos</span></div>
        <div><strong>0</strong><span>Criticos</span></div>
      </div>
      <div class="doc-unit">
        <div class="doc-unit-head">
          <div><div class="doc-unit-name">EXX568</div><div class="doc-unit-use">Rusbel Algarra - RFF, bascula y planta</div></div>
          <span class="status-pill">Camion RFF</span>
        </div>
        <div class="doc-chip-row">
          <span class="doc-chip required">SOAT</span><span class="doc-chip required">Tecnomecanica</span><span class="doc-chip required">Seguro</span><span class="doc-chip">Tarjeta propiedad</span><span class="doc-chip">Licencia conductor</span>
        </div>
      </div>
      <div class="doc-unit">
        <div class="doc-unit-head">
          <div><div class="doc-unit-name">SXY206</div><div class="doc-unit-use">Edgar Tinjaca - personal y encomiendas</div></div>
          <span class="status-pill">Servicio interno</span>
        </div>
        <div class="doc-chip-row">
          <span class="doc-chip required">SOAT</span><span class="doc-chip required">Tecnomecanica</span><span class="doc-chip required">Licencia conductor</span><span class="doc-chip">Permiso interno</span><span class="doc-chip">Seguro pasajeros</span>
        </div>
      </div>`;
    scr.insertBefore(block, scr.firstChild);

    const list = page.querySelector('#docs-list');
    if (empty && list && !list.querySelector('.doc-empty')) {
      empty.style.display = 'none';
      const guidance = document.createElement('div');
      guidance.className = 'doc-empty';
      guidance.innerHTML = `
        <div class="doc-empty-title">Falta cargar la base documental</div>
        <ul>
          <li>Primero EXX568: SOAT, tecnomecanica, seguro y licencia de Rusbel.</li>
          <li>Luego SXY206: SOAT, tecnomecanica, licencia de Edgar y permiso para personal/encomiendas.</li>
          <li>Cuando falten menos de 30 dias, debe aparecer como prioridad operativa.</li>
        </ul>`;
      list.appendChild(guidance);
    }
  }

  function run() {
    addDocsStyles();
    tuneHomeButton();
    enhanceDocsPage();
  }

  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
})();
