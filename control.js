(function () {
  const camiones = [
    { placa: 'EXX568', conductor: 'Rusbel Algarra', uso: 'RFF y apoyo agricola', color: 'var(--g)' }
  ];

  const acciones = {
    EXX568: [
      ['rff-bascula', 'RFF a bascula', 'En labor', 'Transporte de RFF a bascula', 'Bascula'],
      ['cargando-rff', 'Cargando RFF', 'Cargando', 'Recoleccion de RFF', 'Lote'],
      ['rff-planta', 'RFF a planta', 'En labor', 'Transporte de RFF a planta', 'Planta'],
      ['disponible', 'Disponible', 'Disponible', 'Disponible en plantacion', 'Patio'],
      ['taller', 'Taller', 'En mantenimiento', 'Taller / mantenimiento', 'Taller'],
      ['varado', 'Varado', 'Varado', 'Novedad operativa', 'Plantacion']
    ]
  };

  const vias = ['Buena', 'Humeda', 'Barrosa', 'Restringida', 'Intransitable'];

  function c(placa) {
    return camiones.find(x => x.placa === placa) || camiones[0];
  }

  function turnoActual() {
    const h = new Date().getHours();
    if (h < 12) return 'Manana';
    if (h < 17) return 'Tarde';
    return 'Extra';
  }

  function ultimoControl(placa, hoy) {
    const f = today();
    return records.find(r => r.tipo === 'control' && r.placa === placa && (!hoy || r.fecha === f)) || null;
  }

  function addStyles() {
    if (document.getElementById('pg-control-style')) return;
    const st = document.createElement('style');
    st.id = 'pg-control-style';
    st.textContent = `
.brand-home{background:#123C2B!important;padding:16px 16px 14px!important;box-shadow:0 6px 18px rgba(18,60,43,.18)!important}
.brand-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand-left{display:flex;gap:12px;align-items:flex-start;min-width:0}
.brand-mark{width:54px;height:54px;border-radius:12px;background:#EDBF61;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(255,255,255,.16);flex:0 0 auto}
.brand-logo{width:100%;height:100%;display:block;object-fit:contain}
.brand-name{font-size:18px;font-weight:900;color:#fff;line-height:1.05;letter-spacing:.1px}
.brand-sub{font-size:11px;color:#DDEFE4;margin-top:4px;font-weight:700}
.brand-user{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}
.brand-pill{background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:5px 8px;color:#fff;font-size:10px;font-weight:800}
.brand-logout{background:rgba(255,255,255,.12)!important;border:1px solid rgba(255,255,255,.18)!important;color:#fff!important;border-radius:9px!important;padding:7px 9px!important;flex:0 0 auto}
.brand-strip{height:4px;background:linear-gradient(90deg,#F4C430 0 34%,#2D6A4F 34% 68%,#E05A00 68% 100%);border-radius:999px;margin-top:12px}
.login-brand-card{box-shadow:0 16px 40px rgba(18,60,43,.16);border:1px solid #DDE8E1!important}
.login-logo{width:230px;max-width:92%;height:auto;border-radius:16px;display:block;margin:0 auto 16px;box-shadow:0 8px 18px rgba(18,60,43,.18);background:#EDBF61}
.truck-control{border:1.5px solid var(--border);border-radius:var(--r);padding:14px;margin-bottom:12px;background:#fff}
.truck-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:12px}
.truck-title{font-size:16px;font-weight:800}
.truck-sub{font-size:12px;color:var(--muted);margin-top:2px}
.status-pill{display:inline-block;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:800;background:var(--gl);color:var(--g)}
.control-mini{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.control-mini>div{background:var(--bg);border-radius:10px;padding:10px}
.control-mini strong{display:block;font-size:18px;font-weight:900;color:var(--g)}
.control-mini span{font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.4px}
.control-alert{background:var(--aml);border:1.5px solid var(--am);border-radius:10px;padding:10px;font-size:12px;color:var(--am);font-weight:700;margin-bottom:12px}
.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.quick-btn{border:2px solid var(--border);border-radius:12px;background:#fff;padding:12px 8px;font-family:Inter,sans-serif;font-size:13px;font-weight:800;color:var(--text);cursor:pointer;text-align:center;min-height:70px}
.quick-btn small{display:block;font-size:10px;color:var(--muted);margin-top:4px}
.quick-btn.on{border-color:#0F766E;background:#E0F2F1;color:#0F766E}
.auto-line{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.auto-line span{background:var(--bg);border-radius:999px;padding:6px 9px;font-size:11px;font-weight:700;color:var(--muted)}
.optional-panel{display:none;border-top:1px solid var(--border);padding-top:12px;margin-top:4px}
@media(max-width:420px){.brand-name{font-size:16px}.brand-mark{width:50px;height:50px}.quick-grid{grid-template-columns:1fr}.control-mini{grid-template-columns:1fr 1fr}}
`;
    document.head.appendChild(st);
  }

  function addBranding() {
    const hdr = document.querySelector('#pg-home .hdr');
    if (hdr && !hdr.dataset.brandEnhanced) {
      hdr.dataset.brandEnhanced = '1';
      hdr.classList.add('brand-home');
      hdr.innerHTML = `
        <div class="brand-top">
          <div class="brand-left">
            <div class="brand-mark"><img class="brand-logo" src="./logo-mark.svg?v=20260528-7" alt="Palma Grande"></div>
            <div>
              <div class="brand-name">PALMAGRANDE S.A.S</div>
              <div class="brand-sub">Control operativo de flota</div>
            </div>
          </div>
          <button onclick="doLogout()" class="brand-logout" style="font-size:12px;font-weight:800;cursor:pointer;font-family:Inter,sans-serif">Salir</button>
        </div>
        <div class="brand-user">
          <span class="brand-pill" id="brand-user-pill">Usuario activo</span>
          <span class="brand-pill">${today()}</span>
          <span class="brand-pill">Plantacion</span>
        </div>
        <div class="brand-strip"></div>`;
    }
    const loginCard = document.querySelector('#login-screen > div');
    if (loginCard && !loginCard.dataset.brandEnhanced) {
      loginCard.dataset.brandEnhanced = '1';
      loginCard.classList.add('login-brand-card');
      const icon = loginCard.querySelector('div[style*="font-size:48px"]');
      if (icon) icon.outerHTML = '<img class="login-logo" src="./logo.svg?v=20260528-7" alt="Palma Grande">';
      const title = loginCard.querySelector('h1');
      const sub = loginCard.querySelector('p');
      if (title) title.textContent = 'Palma Grande';
      if (sub) sub.textContent = 'Control de flota y operacion';
    }
  }

  function refreshBrandUser() {
    const pill = document.getElementById('brand-user-pill');
    if (pill) pill.textContent = currentUser && currentUser.nombre ? currentUser.nombre : 'Usuario activo';
  }

  function addHomeButton() {
    if (document.getElementById('btn-control-plantacion')) return;
    const home = document.getElementById('home-scr');
    if (!home) return;
    const btn = document.createElement('button');
    btn.id = 'btn-control-plantacion';
    btn.className = 'btn-menu';
    btn.onclick = () => { goPage('pg-control'); loadControl(); };
    btn.innerHTML = '<span class="ico">CP</span><div><strong>Control plantacion</strong><span>RFF y estado del camion</span></div>';
    const before = Array.from(home.querySelectorAll('.btn-menu')).find(b => b.textContent.includes('Mantenimiento'));
    home.insertBefore(btn, before || document.getElementById('home-alertas'));
    const panel = document.createElement('div');
    panel.id = 'home-control';
    home.insertBefore(panel, document.getElementById('home-alertas'));
  }

  function addControlPage() {
    if (document.getElementById('pg-control')) return;
    const page = document.createElement('div');
    page.id = 'pg-control';
    page.className = 'page';
    page.innerHTML = `
      <div class="hdr" style="background:#0F766E">
        <div style="display:flex;align-items:center;gap:12px">
          <button onclick="goHome()" class="btn-sec" style="border-radius:8px;padding:7px 12px;font-size:14px;font-weight:600;width:auto">Inicio</button>
          <div><h1>Control plantacion</h1><p>Registro rapido para palma de aceite</p></div>
        </div>
      </div>
      <div class="scr">
        <div id="control-camiones"></div>
        <button class="btn btn-sec" onclick="goHome()">Volver</button>
      </div>`;
    const hist = document.getElementById('pg-hist');
    if (hist) hist.parentNode.insertBefore(page, hist);
  }

  function resumenTexto(r) {
    if (!r) return 'Pendiente de registrar';
    return [r.labor, r.frente, r.lote, r.via ? 'Via ' + r.via : '', r.toneladas ? r.toneladas + ' t' : '', r.viajes ? r.viajes + ' viajes' : ''].filter(Boolean).join(' - ');
  }

  window.loadHomeControl = function () {
    const box = document.getElementById('home-control');
    if (!box) return;
    const hoy = camiones.map(x => ({ ...x, control: ultimoControl(x.placa, true) }));
    const rff = hoy.filter(x => (x.control && x.control.labor || '').includes('RFF'));
    const viajes = rff.reduce((s, x) => s + (+x.control.viajes || 0), 0);
    const ton = rff.reduce((s, x) => s + (+x.control.toneladas || 0), 0);
    const cam = hoy[0];
    const ctrl = cam.control;
    const estado = ctrl ? ctrl.estado : 'Sin control hoy';
    const bg = ctrl ? (ctrl.estado === 'Varado' ? 'var(--redl)' : ctrl.estado === 'Disponible' ? 'var(--okl)' : 'var(--gl)') : '#F9FAFB';
    box.innerHTML = `
      <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.6px;text-transform:uppercase;margin:12px 0 8px">Control de hoy</div>
      <div class="control-mini">
        <div><strong>${viajes || '-'}</strong><span>Viajes RFF</span></div>
        <div><strong>${ton ? ton.toFixed(1) : '-'}</strong><span>Toneladas aprox.</span></div>
      </div>
      <div style="margin-bottom:12px">
        <div style="background:${bg};border:1.5px solid ${cam.color};border-radius:10px;padding:10px">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
            <div style="font-size:13px;font-weight:800;color:${cam.color}">${cam.placa}</div>
            <div style="font-size:10px;font-weight:800;color:${cam.color}">${estado}</div>
          </div>
          <div style="font-size:11px;color:${cam.color};margin-top:4px">${resumenTexto(ctrl)}</div>
        </div>
      </div>`;
  };

  window.loadControl = function () {
    const cont = document.getElementById('control-camiones');
    if (!cont) return;
    cont.innerHTML = camiones.map(x => {
      const lastKm = getLastKm(x.placa);
      const last = ultimoControl(x.placa);
      const turno = turnoActual();
      return `<div class="truck-control">
        <div class="truck-head">
          <div>
            <div class="truck-title" style="color:${x.color}">${x.placa}</div>
            <div class="truck-sub">${x.conductor} - ${x.uso}</div>
          </div>
          <span class="status-pill">${last ? last.estado : 'Sin estado'}</span>
        </div>
        ${last ? `<div style="background:var(--bg);border-radius:10px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--muted)">Ultimo: <strong style="color:var(--text)">${last.fecha} ${last.hora}</strong> - ${resumenTexto(last)}</div>` : ''}
        <div class="control-alert">Toca la labor actual y guarda. Los detalles son opcionales para el conductor.</div>
        <div class="auto-line"><span>${today()}</span><span>${nowt()}</span><span>${turno}</span><span>${lastKm ? 'Km ' + lastKm.toLocaleString() : 'Km pendiente'}</span></div>
        <input type="hidden" id="ctrl-${x.placa}-estado">
        <input type="hidden" id="ctrl-${x.placa}-labor">
        <input type="hidden" id="ctrl-${x.placa}-destino">
        <input type="hidden" id="ctrl-${x.placa}-turno" value="${turno}">
        <input type="hidden" id="ctrl-${x.placa}-km-ini" value="${lastKm || ''}">
        <div class="quick-grid">
          ${acciones[x.placa].map(a => `<button class="quick-btn" id="ctrl-${x.placa}-${a[0]}" onclick="selectQuickControl('${x.placa}','${a[0]}')" type="button">${a[1]}<small>${a[2]}</small></button>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div class="field"><label>Viajes RFF</label><input type="number" inputmode="numeric" id="ctrl-${x.placa}-viajes" placeholder="0"></div>
          <div class="field"><label>Toneladas aprox.</label><input type="number" inputmode="decimal" id="ctrl-${x.placa}-ton" placeholder="0"></div>
        </div>
        <button class="btn btn-sec" onclick="toggleControlDetails('${x.placa}')" type="button">Detalles opcionales</button>
        <div class="optional-panel" id="ctrl-${x.placa}-details">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div class="field"><label>Frente / sector</label><input type="text" id="ctrl-${x.placa}-frente" placeholder="Frente norte"></div>
            <div class="field"><label>Lote / bloque</label><input type="text" id="ctrl-${x.placa}-lote" placeholder="Lote 12"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div class="field"><label>Via</label><select id="ctrl-${x.placa}-via"><option value="">No aplica</option>${vias.map(v => `<option>${v}</option>`).join('')}</select></div>
            <div class="field"><label>Km cierre</label><input type="number" inputmode="numeric" id="ctrl-${x.placa}-km-fin" placeholder="Km final"></div>
          </div>
          <div class="field"><label>Guia / tiquete</label><input type="text" id="ctrl-${x.placa}-ticket" placeholder="Numero si aplica"></div>
          <div class="field"><label>Observaciones</label><textarea id="ctrl-${x.placa}-obs" rows="2" placeholder="Novedades de operacion"></textarea></div>
        </div>
        <button class="btn" id="ctrl-${x.placa}-save" onclick="saveControl('${x.placa}')" disabled style="background:#D1D5DB">Seleccione una labor</button>
      </div>`;
    }).join('');
  };

  window.selectQuickControl = function (placa, id) {
    const a = acciones[placa].find(x => x[0] === id);
    if (!a) return;
    document.querySelectorAll(`[id^="ctrl-${placa}-"].quick-btn`).forEach(b => b.classList.remove('on'));
    const btn = document.getElementById(`ctrl-${placa}-${id}`);
    if (btn) btn.classList.add('on');
    document.getElementById(`ctrl-${placa}-estado`).value = a[2];
    document.getElementById(`ctrl-${placa}-labor`).value = a[3];
    document.getElementById(`ctrl-${placa}-destino`).value = a[4];
    updateControlBtn(placa);
  };

  window.toggleControlDetails = function (placa) {
    const panel = document.getElementById(`ctrl-${placa}-details`);
    if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  };

  window.updateControlBtn = function (placa) {
    const ok = val(`ctrl-${placa}-estado`) && val(`ctrl-${placa}-labor`);
    const btn = document.getElementById(`ctrl-${placa}-save`);
    if (!btn) return;
    btn.disabled = !ok;
    btn.style.background = ok ? '#0F766E' : '#D1D5DB';
    btn.textContent = ok ? 'Guardar control' : 'Seleccione una labor';
  };

  window.saveControl = async function (placa) {
    if (sending) return;
    if (!val(`ctrl-${placa}-estado`) || !val(`ctrl-${placa}-labor`)) return;
    sending = true;
    const truck = c(placa);
    const btn = document.getElementById(`ctrl-${placa}-save`);
    if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }
    const kmIni = val(`ctrl-${placa}-km-ini`);
    const kmFin = val(`ctrl-${placa}-km-fin`);
    const rec = {
      tipo: 'control',
      fecha: today(),
      hora: nowt(),
      placa,
      conductor: truck.conductor,
      estado: val(`ctrl-${placa}-estado`),
      labor: val(`ctrl-${placa}-labor`),
      destino: val(`ctrl-${placa}-destino`),
      turno: val(`ctrl-${placa}-turno`),
      frente: val(`ctrl-${placa}-frente`),
      lote: val(`ctrl-${placa}-lote`),
      via: val(`ctrl-${placa}-via`),
      kmIni,
      km: kmFin || kmIni,
      viajes: val(`ctrl-${placa}-viajes`),
      toneladas: val(`ctrl-${placa}-ton`),
      ticket: val(`ctrl-${placa}-ticket`),
      obs: val(`ctrl-${placa}-obs`)
    };
    records.unshift(rec);
    await dbSet(STORE, records);
    sendToSheets(rec);
    sending = false;
    document.getElementById('ok-ico').textContent = 'OK';
    document.getElementById('ok-title').textContent = 'Control registrado';
    document.getElementById('ok-msg').textContent = placa + ' - ' + rec.estado + ' - ' + rec.labor;
    goPage('pg-ok');
  };

  const oldLoadHome = window.loadHome;
  window.loadHome = function () {
    addBranding();
    refreshBrandUser();
    oldLoadHome();
    loadHomeControl();
  };

  const oldDoLogin = window.doLogin;
  window.doLogin = function () {
    oldDoLogin();
    addBranding();
    refreshBrandUser();
  };

  const oldResumen = window.loadResumen;
  window.loadResumen = function () {
    oldResumen();
    const res = document.getElementById('res-content');
    if (!res) return;
    const hoy = camiones.map(x => ({ ...x, control: ultimoControl(x.placa, true) }));
    const rff = hoy.filter(x => (x.control && x.control.labor || '').includes('RFF'));
    const viajes = rff.reduce((s, x) => s + (+x.control.viajes || 0), 0);
    const ton = rff.reduce((s, x) => s + (+x.control.toneladas || 0), 0);
    const varados = hoy.filter(x => x.control && x.control.estado === 'Varado').length;
    res.insertAdjacentHTML('afterbegin', `<div class="card">
      <div class="sec">Control plantacion de hoy</div>
      <div class="control-mini">
        <div><strong>${viajes || '-'}</strong><span>Viajes RFF</span></div>
        <div><strong>${ton ? ton.toFixed(1) : '-'}</strong><span>Toneladas RFF</span></div>
        <div><strong>${hoy.filter(x => x.control).length}/1</strong><span>Reportados</span></div>
        <div><strong>${varados || '0'}</strong><span>Varados</span></div>
      </div>
      ${hoy.map(x => `<div style="background:var(--bg);border-radius:10px;padding:12px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;gap:10px">
          <div style="font-size:13px;font-weight:800;color:${x.color}">${x.placa}</div>
          <div style="font-size:11px;font-weight:800;color:${x.control ? 'var(--g)' : 'var(--muted)'}">${x.control ? x.control.estado : 'Sin control'}</div>
        </div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">${resumenTexto(x.control)}</div>
      </div>`).join('')}
    </div>`);
  };

  addStyles();
  addBranding();
  addHomeButton();
  addControlPage();
})();
