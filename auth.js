// \u2500\u2500 TIPO CHOFER FILTER
function getActiveTipos(){
  var tipos=[];
  ['propio','backup','tercero'].forEach(function(t){
    var el=document.getElementById('ftipo-'+t);
    if(el&&el.checked)tipos.push(t);
  });
  return tipos.length?tipos:['propio','backup','tercero'];
}
function chMatchTipo(ch){
  var tipos=getActiveTipos();
  var t=(window.D_CH_TIPOS&&D_CH_TIPOS[ch])||'tercero';
  return tipos.indexOf(t)>=0;
}
function onTipoChange(){
  INITED={};
  var secs=document.querySelectorAll('.sec.on');
  secs.forEach(function(s){var id=s.id.replace('sec-','');initTab(id);});
}

// \u2500\u2500 HELPERS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function F(n){return Number(n||0).toLocaleString('es-AR',{maximumFractionDigits:0});}
function P(n){return (Number(n||0)*100).toFixed(1)+'%';}
function P2(n){return (Number(n||0)*100).toFixed(2)+'%';}
function KPI(v,l,col){return '<div class="kpi"><div class="kpi-v" style="color:'+col+'">'+v+'</div><div class="kpi-l">'+l+'</div></div>';}
function BD(cls,txt){return '<span class="'+cls+'">'+txt+'</span>';}
function PR(pct,col,max){
  var w=Math.min(100,(pct||0)*100/(max||1)*100);
  return '<div class="pw"><div class="pb"><div class="pf" style="width:'+w+'%;background:'+col+'"></div></div></div>';
}
function fmtFecha(s){
  if(!s) return '';
  if(s.indexOf('-')===4) return s.split('-').reverse().join('/');
  return s;
}

// \u2500\u2500 LOGIN \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var USERS={'sup':{'pass':'sup611','name':'Supervisor'}};
function doLogin(){
  var u=(document.getElementById('lu').value||'').trim().toLowerCase();
  var p=(document.getElementById('lp').value||'').trim();
  var usr=USERS[u];
  if(usr && p===usr.pass){
    document.getElementById('login-overlay').style.display='none';
    document.getElementById('app').style.display='block';
    initApp();
  } else {
    document.getElementById('lerr').style.display='block';
  }
}
function doLogout(){
  document.getElementById('app').style.display='none';
  document.getElementById('login-overlay').style.display='flex';
  document.getElementById('lu').value='';
  document.getElementById('lp').value='';
}

// \u2500\u2500 TABS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var INITED={};
function goTab(id,btn){
  document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('on');});
  document.querySelectorAll('.sec').forEach(function(s){s.classList.remove('on');});
  if(btn) btn.classList.add('on');
  var sec=document.getElementById('sec-'+id);
  if(sec) sec.classList.add('on');
  if(!INITED[id]){INITED[id]=true; initTab(id);}
}
function initTab(id){
  if(id==='cartones') initCart();
  else if(id==='rechazos') initRej();
  else if(id==='deposito') initDep();
  else if(id==='ventas') initVentas();
  else if(id==='ruta') initRuta();
  else if(id==='comisiones') initComisiones();
}
function initApp(){
  document.getElementById('hdr-periodo').textContent=D_PERIODO||'';
  INITED={};
  initTab('cartones');
}

// \u2500\u2500 CARTONES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function initCart(){
  var semMap={};
  D_CART.forEach(function(r){
    var k='Sem '+r.semana;
    if(!semMap[k]){semMap[k]={min:r.fecha,max:r.fecha};}
    if(r.fecha<semMap[k].min)semMap[k].min=r.fecha;
    if(r.fecha>semMap[k].max)semMap[k].max=r.fecha;
  });
  var semSel=document.getElementById('cart-sem');
  semSel.innerHTML='<option value="">Todas las semanas</option>'+
    Object.keys(semMap).sort().map(function(k){
      var r=semMap[k];
      return '<option value="'+k+'">'+k+' ('+fmtFecha(r.min)+' - '+fmtFecha(r.max)+')</option>';
    }).join('');
  var chs=[...new Set(D_CART.map(function(r){return r.chofer;}))].sort();
  var chSel=document.getElementById('cart-ch');
  chSel.innerHTML='<option value="">Todos</option>'+chs.map(function(c){return '<option>'+c+'</option>';}).join('');
  document.getElementById('cart-note').textContent='Cartones '+D_PERIODO;
  renderCart();
}
function renderCart(){
  var vista=document.getElementById('cart-vista').value;
  var ch=document.getElementById('cart-ch').value;
  var sem=document.getElementById('cart-sem').value;
  var semNum=sem?parseInt(sem.replace('Sem ','')):0;
  var rows=D_CART.filter(function(r){
    if(!chMatchTipo(r.chofer))return false;
    if(ch&&r.chofer!==ch)return false;
    if(semNum&&r.semana!==semNum)return false;
    return true;
  });
  var agg={};
  rows.forEach(function(r){
    var key=vista==='mes'?r.chofer:vista==='sem'?(r.chofer+'|'+r.semana):(r.chofer+'|'+r.fecha);
    if(!agg[key])agg[key]={chofer:r.chofer,fecha:r.fecha,semana:r.semana,bs:0,bi:0};
    agg[key].bs+=r.b_sal; agg[key].bi+=r.b_ing;
  });
  var tot_bs=0,tot_bi=0;
  var tbl=Object.values(agg).sort(function(a,b){return a.chofer.localeCompare(b.chofer)||(a.fecha<b.fecha?-1:1);}).map(function(r){
    tot_bs+=r.bs; tot_bi+=r.bi;
    var pct=r.bs>0?r.bi/r.bs:0;
    var est=pct>=0.9?BD('bg','Bien'):pct>=0.7?BD('by','Regular'):BD('br','Bajo');
    var label=vista==='dia'?fmtFecha(r.fecha):vista==='sem'?'Sem '+r.semana:'';
    return '<tr><td><strong>'+r.chofer+'</strong></td><td>'+label+'</td><td>'+r.semana+'</td>'+
      '<td style="text-align:right">'+r.bs+'</td><td style="text-align:right">'+r.bi+'</td>'+
      '<td>'+PR(pct,'#69f0ae',1)+' '+P(pct)+'</td><td>'+est+'</td></tr>';
  }).join('');
  document.getElementById('cart-tbody').innerHTML=tbl||'<tr><td colspan="7" class="empty">Sin datos de cartones</td></tr>';
  var pctT=tot_bs>0?tot_bi/tot_bs:0;
  document.getElementById('cart-kpis').innerHTML=
    KPI(tot_bs,'B.E. Salida','#a0c8e8')+
    KPI(tot_bi,'B.E. Retorno','#a0c8e8')+
    KPI(P(pctT),'% Retorno',pctT>=0.9?'#69f0ae':pctT>=0.7?'#ffab40':'#ff5252');
}

// \u2500\u2500 RECHAZOS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function initRej(){
  var pSel=document.getElementById('rej-prov-f');
  if(pSel){
    pSel.innerHTML='<option value="">Todos los proveedores</option>'+
      D_PROV.map(function(p){return '<option value="'+p.prov+'">'+p.prov+'</option>';}).join('');
    pSel.onchange=renderRejAll;
  }
  var chSel=document.getElementById('rej-ch-f');
  if(chSel&&chSel.options.length<=1){
    D_CHS.forEach(function(c){chSel.innerHTML+='<option value="'+c+'">'+c+'</option>';});
  }
  renderRejAll();
}

function renderRejAll(){
  var selProv=(document.getElementById('rej-prov-f')||{}).value||'';
  var selCh=(document.getElementById('rej-ch-f')||{}).value||'';
  var pm=selProv?D_PROV.filter(function(p){return p.prov===selProv;}):D_PROV;
  var vT=pm.reduce(function(s,p){return s+p.venta;},0);
  var rT=pm.reduce(function(s,p){return s+p.rec;},0);
  var fT=pm.reduce(function(s,p){return s+p.fac;},0);
  var nT=pm.reduce(function(s,p){return s+p.no_e;},0);
  var eT=fT>0?fT/(fT+nT):0;
  var tonTotal=(pm.reduce(function(s,p){return s+(p.kg||0);},0)/1000).toFixed(1);

  document.getElementById('rej-kpis').innerHTML=
    KPI('$'+F(vT),'Venta Neta','#69f0ae')+
    KPI(tonTotal+' tn','Toneladas','#00e5cc')+
    KPI('$'+F(rT),'Rechazo ($)','#ff5252')+
    KPI(P2(vT>0?rT/vT:0),'% Rechazo',(vT>0&&rT/vT>.03)?'#ff5252':'#ffab40')+
    KPI(String(fT),'Pedidos Facturados','#a0c8e8')+
    KPI(String(nT),'No Entregados',nT>0?'#ff5252':'#69f0ae')+
    KPI(P(eT),'Efectividad',eT<0.95?'#ff5252':'#69f0ae')+
    KPI(String(D_REINC.length),'Reincidentes','#ffab40');

  document.getElementById('rej-prov-tb').innerHTML=pm.length?
    pm.sort(function(a,b){return b.venta-a.venta;}).map(function(p){
      return '<tr><td><strong>'+p.prov+'</strong></td>'+
        '<td style="text-align:right">$'+F(p.venta)+'</td>'+
        '<td style="text-align:right;color:#ff5252">$'+F(p.rec)+'</td>'+
        '<td>'+PR(p.rec_pct,'#ff5252',0.05)+' '+P2(p.rec_pct)+'</td>'+
        '<td style="text-align:right;color:#ffab40">$'+F(p.cam)+'</td>'+
        '<td>'+P2(p.cam_pct)+'</td>'+
        '<td style="text-align:right">'+p.fac+'</td>'+
        '<td style="text-align:right;color:'+(p.no_e>0?'#ff5252':'#69f0ae')+'">'+p.no_e+'</td>'+
        '<td>'+P(p.efect)+'</td></tr>';
    }).join(''):'<tr><td colspan="9" class="empty">Sin datos</td></tr>';

  var mData=(selProv && window.D_MOTIVO_PROV && D_MOTIVO_PROV[selProv])?D_MOTIVO_PROV[selProv]:D_MOTIVO;
  var totImp=mData.reduce(function(s,m){return s+m.imp;},0);
  document.getElementById('rej-mot-tb').innerHTML=mData.length?
    mData.map(function(m,idx){
      var pct=totImp>0?m.imp/totImp:0;
      var colors=['#ff5252','#f97316','#f59e0b','#84cc16','#22d3ee','#4d9fff','#e879f9','#fb7185','#4db6ac'];
      var col=colors[idx%colors.length];
      var barW=Math.round(pct*100);
      return '<tr>'+
        '<td><div style="display:flex;align-items:center;gap:8px">'+
          '<div style="width:10px;height:10px;border-radius:50%;background:'+col+';flex-shrink:0"></div>'+
          '<strong>'+m.motivo+'</strong></div></td>'+
        '<td style="text-align:right;color:#ff5252;font-weight:700">$'+F(m.imp)+'</td>'+
        '<td style="text-align:right">'+F(m.uds)+' uds</td>'+
        '<td><div style="display:flex;align-items:center;gap:6px">'+
          '<div style="background:#0d2020;border-radius:4px;height:8px;width:100px;overflow:hidden">'+
            '<div style="height:100%;border-radius:4px;background:'+col+';width:'+barW+'%"></div>'+
          '</div>'+
          '<span style="font-size:.78rem;color:#4db6ac;min-width:35px">'+P(pct)+'</span>'+
        '</div></td></tr>';
    }).join(''):'<tr><td colspan="4" class="empty">Sin datos</td></tr>';

  // Rechazos por chofer con vista dia/semana/mes
  var vistaRej=(document.getElementById('rej-vista-ch')||{}).value||'mes';
  var chData=[];
  if(vistaRej==='mes'){
    Object.keys(D_CHPROV).forEach(function(ch){
      if(!chMatchTipo(ch))return;
      if(!selCh||ch===selCh){
        var cpList=(D_CHPROV[ch]||[]).filter(function(m){return !selProv||m.prov===selProv;});
        if(!cpList.length)return;
        var vv=0,rr=0,ff=0,nn=0;
        cpList.forEach(function(m){vv+=m.venta;rr+=m.rec;ff+=m.fac;nn+=m.no_e;});
        if(vv>0)chData.push({lbl:ch,vv:vv,rr:rr,ff:ff,nn:nn,pRec:vv>0?rr/vv:0,ef:ff>0?ff/(ff+nn):0});
      }
    });
  } else {
    var dAgg={};
    D_ROUTES.forEach(function(r){
      if(selCh&&r.ch!==selCh)return;
      var lbl=vistaRej==='sem'?('Sem '+getSemana(r.f)+' \u2014 '+r.ch):(fmtFecha(r.f)+' \u2014 '+r.ch);
      if(!dAgg[lbl])dAgg[lbl]={lbl:lbl,vv:0,rr:0,ff:r.n,nn:r.rej};
      dAgg[lbl].vv+=r.tot; dAgg[lbl].ff+=r.n; dAgg[lbl].nn+=r.rej;
    });
    Object.values(dAgg).forEach(function(r){
      r.pRec=0; r.rr=0; r.ef=r.ff>0?r.ff/(r.ff+r.nn):0;
      chData.push(r);
    });
    chData.sort(function(a,b){return a.lbl.localeCompare(b.lbl);});
  }
  if(!vistaRej||vistaRej==='mes') chData.sort(function(a,b){return b.rr-a.rr;});
  document.getElementById('rej-ch-tb').innerHTML=chData.length?
    chData.map(function(c){
      return '<tr><td><strong>'+c.lbl+'</strong></td>'+
        '<td style="text-align:right">$'+F(c.vv)+'</td>'+
        '<td style="text-align:right;color:#ff5252">$'+F(c.rr)+'</td>'+
        '<td>'+PR(c.pRec,'#ff5252',0.05)+' '+P2(c.pRec)+'</td>'+
        '<td>'+P(c.ef)+'</td></tr>';
    }).join(''):'<tr><td colspan="5" class="empty">Sin datos</td></tr>';

  var reinc=D_REINC.filter(function(r){
    if(selCh && r.choferes.indexOf(selCh)<0) return false;
    if(selProv && !(r.provs||[]).some(function(p){return p.prov===selProv;})) return false;
    return true;
  });
  document.getElementById('rej-reinc-tb').innerHTML=reinc.length?
    reinc.map(function(r,i){
      var provs=(r.provs||[]).map(function(p){
        return '<div style="font-size:.72rem;color:#4db6ac">'+p.prov.split(' ')[0]+': $'+F(p.imp)+'</div>';
      }).join('');
      return '<tr><td>'+(i+1)+'</td>'+
        '<td><strong>'+r.razon+'</strong></td>'+
        '<td style="color:#546e6e">'+r.loc+'</td>'+
        '<td style="text-align:right;color:#ff5252;font-weight:700">'+r.n+'</td>'+
        '<td style="text-align:right">$'+F(r.imp)+'</td>'+
        '<td>'+provs+'</td>'+
        '<td style="font-size:.75rem;color:#4db6ac">'+(r.vendedor||'-')+'</td>'+
        '<td style="font-size:.75rem;color:#4db6ac">'+r.choferes+'</td>'+
        '<td style="font-size:.73rem;color:#546e6e">'+r.fechas+'</td></tr>';
    }).join(''):'<tr><td colspan="8" class="empty">Sin reincidentes</td></tr>';
}

function rejTab(id,btn){
  document.querySelectorAll('.rtab').forEach(function(t){t.classList.remove('on');});
  document.querySelectorAll('.rp').forEach(function(p){p.style.display='none';});
  if(btn) btn.classList.add('on');
  var el=document.getElementById('rp-'+id);
  if(el) el.style.display='block';
  if(id==='conc') initConciliacion();
}

// \u2500\u2500 DEPOSITO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderDep(){initDep();}
function initDep(){
  var dep=D_DEP;
  var hasDep=dep.faltante.length||dep.sobrante.length||dep.roturas.length||dep.consumo.length||dep.vencido.length;
  // Populate proveedor filter
  var provSel=document.getElementById('dep-prov-f');
  if(provSel && provSel.options.length<=1){
    var allRows=dep.faltante.concat(dep.sobrante,dep.roturas,dep.consumo,dep.vencido);
    var provs=[...new Set(allRows.map(function(r){return r.prov;}))].sort().filter(Boolean);
    provs.forEach(function(p){provSel.innerHTML+='<option value="'+p+'">'+p+'</option>';});
  }
  // Compensaciones table
  var comps=dep.compensaciones||[];
  var compEl=document.getElementById('dep-comp-tb');
  if(compEl){
    compEl.innerHTML=comps.length?comps.map(function(c){
      var neto=c.tot_f+c.tot_s;
      return '<tr>'+
        '<td style="color:#ff5252">'+c.falt+'</td>'+
        '<td style="text-align:right;color:#ff5252">'+c.u_f+' uds / $'+F(Math.abs(c.tot_f))+'</td>'+
        '<td style="color:#00e5cc">'+c.sobr+'</td>'+
        '<td style="text-align:right;color:#00e5cc">'+c.u_s+' uds / $'+F(c.tot_s)+'</td>'+
        '<td style="text-align:right;color:'+(neto<0?'#ff5252':'#69f0ae')+'">$'+F(neto)+'</td></tr>';
    }).join(''):'<tr><td colspan="5" class="empty">Sin compensaciones detectadas</td></tr>';
  }
  var noteEl=document.getElementById('dep-note');
  if(!hasDep){
    if(noteEl) noteEl.textContent='Diferencias de Inventario \u2014 subi movimientos.xlsx para ver datos';
    return;
  }
  if(noteEl) noteEl.textContent='Diferencias de Inventario \u2014 '+D_PERIODO;
  var totFalt=dep.faltante.reduce(function(s,r){return s+r.tot;},0);
  var totSobr=dep.sobrante.reduce(function(s,r){return s+r.tot;},0);
  var totRot =dep.roturas.reduce(function(s,r){return s+r.tot;},0);
  var totCons=dep.consumo.reduce(function(s,r){return s+r.tot;},0);
  var totVenc=dep.vencido.reduce(function(s,r){return s+r.tot;},0);
  document.getElementById('dep-kpis').innerHTML=
    KPI('$'+F(totFalt-totSobr),'Merma Neta',(totFalt-totSobr)>0?'#ff5252':'#69f0ae')+
    KPI('$'+F(totRot),'Roturas',totRot>0?'#ff5252':'#4db6ac')+
    KPI('$'+F(totCons),'Consumo Interno',totCons>0?'#ffab40':'#4db6ac')+
    KPI('$'+F(totVenc),'Vencido',totVenc>0?'#ff5252':'#4db6ac');
  var selDepProv=(document.getElementById('dep-prov-f')||{}).value||'';
  function filterDep(rows){
    return selDepProv?rows.filter(function(r){return r.prov===selDepProv;}):rows;
  }
  function renderDepTb(id,rows){
    var el=document.getElementById(id);
    if(!el) return;
    var filtered=filterDep(rows);
    el.innerHTML=filtered.length?filtered.map(function(r){
      return '<tr><td>'+r.desc+'</td><td style="color:#546e6e">'+r.prov+'</td>'+
        '<td style="text-align:right">'+r.u+'</td>'+
        '<td style="text-align:right">$'+F(r.cu)+'</td>'+
        '<td style="text-align:right;color:#ff5252">$'+F(r.tot)+'</td>'+
        '<td style="font-size:.72rem;color:#546e6e">'+(r.fecha||'')+'</td></tr>';
    }).join(''):'<tr><td colspan="6" class="empty">Sin movimientos</td></tr>';
  }
  // Recalculate KPIs with filter
  var fFalt=filterDep(dep.faltante),fSobr=filterDep(dep.sobrante);
  var fRot=filterDep(dep.roturas),fCons=filterDep(dep.consumo),fVenc=filterDep(dep.vencido);
  var tFalt=fFalt.reduce(function(s,r){return s+r.tot;},0);
  var tSobr=fSobr.reduce(function(s,r){return s+r.tot;},0);
  var tRot =fRot.reduce(function(s,r){return s+r.tot;},0);
  var tCons=fCons.reduce(function(s,r){return s+r.tot;},0);
  var tVenc=fVenc.reduce(function(s,r){return s+r.tot;},0);
  // CMV base de calculo
  var cmvBase=selDepProv?
    (D_PROV.find(function(p){return p.prov===selDepProv;})||{}).venta||0 :
    (D_DEP.kpis&&D_DEP.kpis.cmv?D_DEP.kpis.cmv:D_KPIS.imp_venta||0);
  function pctCMV(v){return cmvBase>0?(' ('+((v/cmvBase)*100).toFixed(2)+'% CMV)'):''}
  document.getElementById('dep-kpis').innerHTML=
    KPI('$'+F(cmvBase),'CMV (Base c\u00e1lculo)','#4db6ac')+
    KPI('$'+F(tFalt-tSobr)+pctCMV(Math.abs(tFalt-tSobr)),'Merma Neta',(tFalt-tSobr)>0?'#ff5252':'#69f0ae')+
    KPI('$'+F(tRot)+pctCMV(tRot),'Roturas',tRot>0?'#ff5252':'#4db6ac')+
    KPI('$'+F(tCons)+pctCMV(tCons),'Consumo Interno',tCons>0?'#ffab40':'#4db6ac')+
    KPI('$'+F(tVenc)+pctCMV(tVenc),'Vencido',tVenc>0?'#ff5252':'#4db6ac');
  renderDepTb('dep-falt-tb',dep.faltante);
  renderDepTb('dep-sobr-tb',dep.sobrante);
  renderDepTb('dep-rot-tb', dep.roturas);
  renderDepTb('dep-cons-tb',dep.consumo);
  renderDepTb('dep-venc-tb',dep.vencido);
}

// \u2500\u2500 VENTAS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function initVentas(){
  var pSel=document.getElementById('ven-prov');
  var cSel=document.getElementById('ven-ch');
  D_PROVS.forEach(function(p){pSel.innerHTML+='<option value="'+p+'">'+p+'</option>';});
  D_CHS.forEach(function(c){cSel.innerHTML+='<option value="'+c+'">'+c+'</option>';});
  renderVentas();
}
function renderVentas(){
  var selProv=document.getElementById('ven-prov').value;
  var selCh  =document.getElementById('ven-ch').value;
  var vista  =(document.getElementById('ven-vista')||{}).value||'mes';
  var pm=D_PROV.filter(function(p){return !selProv||p.prov===selProv;});
  var vT=pm.reduce(function(s,p){return s+p.venta;},0);
  var rT=pm.reduce(function(s,p){return s+p.rec;},0);
  var fT=pm.reduce(function(s,p){return s+p.fac;},0);
  var nT=pm.reduce(function(s,p){return s+p.no_e;},0);
  var eT=fT>0?fT/(fT+nT):0;
  document.getElementById('ven-kpis').innerHTML=
    KPI('$'+F(vT),'Venta Neta','#69f0ae')+
    KPI('$'+F(rT),'Rechazo ($)','#ff5252')+
    KPI(P2(vT>0?rT/vT:0),'% Rechazo',(vT>0&&rT/vT>.03)?'#ff5252':'#ffab40')+
    KPI(String(fT),'Pedidos Facturados','#a0c8e8')+
    KPI(String(nT),'No Entregados',nT>0?'#ff5252':'#69f0ae')+
    KPI(P(eT),'Efectividad',eT<0.95?'#ff5252':'#69f0ae');
  document.getElementById('ven-prov-tb').innerHTML=pm.length?
    pm.sort(function(a,b){return b.venta-a.venta;}).map(function(p){
      return '<tr><td><strong>'+p.prov+'</strong></td>'+
        '<td style="text-align:right">$'+F(p.venta)+'</td>'+
        '<td style="text-align:right;color:#ff5252">$'+F(p.rec)+'</td>'+
        '<td>'+P2(p.rec_pct)+'</td>'+
        '<td>'+P(p.efect)+'</td></tr>';
    }).join(''):'<tr><td colspan="5" class="empty">Sin datos</td></tr>';
  var chRows=[];
  if(vista==='mes'){
    Object.keys(D_CHPROV).forEach(function(ch){
      if(selCh&&ch!==selCh)return;
      if(!chMatchTipo(ch))return;
      var cpList=(D_CHPROV[ch]||[]).filter(function(m){return !selProv||m.prov===selProv;});
      if(!cpList.length)return;
      var vv=0,rr=0,ff=0,nn=0;
      cpList.forEach(function(m){vv+=m.venta;rr+=m.rec;ff+=m.fac;nn+=m.no_e;});
      chRows.push({lbl:ch,vv:vv,rr:rr,ff:ff,nn:nn,ef:ff>0?ff/(ff+nn):0,pRec:vv>0?rr/vv:0});
    });
  } else {
    var diaAgg={};
    D_ROUTES.forEach(function(r){
      if(selCh&&r.ch!==selCh)return;
      var key=vista==='sem'?('Sem '+getSemana(r.f)+' '+r.ch):(fmtFecha(r.f)+' '+r.ch);
      if(!diaAgg[key])diaAgg[key]={lbl:key,vv:0,rr:0,ff:0,nn:0};
      diaAgg[key].vv+=r.tot; diaAgg[key].nn+=r.rej; diaAgg[key].ff+=r.n;
    });
    Object.values(diaAgg).forEach(function(r){
      r.ef=r.ff>0?r.ff/(r.ff+r.nn):0; r.pRec=0; r.rr=0;
      chRows.push(r);
    });
    chRows.sort(function(a,b){return a.lbl.localeCompare(b.lbl);});
  }
  document.getElementById('ven-ch-tb').innerHTML=chRows.length?
    chRows.map(function(r){
      return '<tr><td><strong>'+r.lbl+'</strong></td>'+
        '<td style="text-align:right">$'+F(r.vv)+'</td>'+
        '<td style="text-align:right;color:#ff5252">$'+F(r.rr)+'</td>'+
        '<td>'+P2(r.pRec)+'</td>'+
        '<td>'+P(r.ef)+'</td></tr>';
    }).join(''):'<tr><td colspan="5" class="empty">Sin datos</td></tr>';
}
function getSemana(dateStr){
  if(!dateStr)return 0;
  var d=new Date(dateStr); var jan1=new Date(d.getFullYear(),0,1);
  return Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7);
}

// \u2500\u2500 HOJA DE RUTA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var fRoutes=[], selRep=null;
function initRuta(){
  var fechas=[...new Set(D_ROUTES.map(function(r){return r.f;}))].sort();
  var cams  =[...new Set(D_ROUTES.map(function(r){return r.cam;}))].sort(function(a,b){return a-b;});
  var fSel=document.getElementById('ruta-fecha');
  var cSel=document.getElementById('ruta-cam');
  var chSel=document.getElementById('ruta-ch');
  fechas.forEach(function(f){fSel.innerHTML+='<option value="'+f+'">'+fmtFecha(f)+'</option>';});
  D_CHS.forEach(function(c){chSel.innerHTML+='<option value="'+c+'">'+c+'</option>';});
  cams.forEach(function(c){cSel.innerHTML+='<option value="'+c+'">Cam '+c+'</option>';});
  filtRuta();
}
function filtRuta(){
  var fFec=document.getElementById('ruta-fecha').value;
  var fCh =document.getElementById('ruta-ch').value;
  var fCam=document.getElementById('ruta-cam').value;
  var fQ  =(document.getElementById('ruta-q').value||'').toLowerCase();
  fRoutes=D_ROUTES.filter(function(r){
    if(fFec&&r.f!==fFec)return false;
    if(fCh&&r.ch!==fCh)return false;
    if(fCam&&String(r.cam)!==String(fCam))return false;
    if(!chMatchTipo(r.ch))return false;
    if(fQ){
      var cls=D_CLI[String(r.rep)]||[];
      return cls.some(function(c){return c[1].toLowerCase().includes(fQ)||c[2].toLowerCase().includes(fQ);});
    }
    return true;
  });
  renderSB();
  if(selRep&&fRoutes.find(function(r){return r.rep===selRep;}))selR(selRep);
  else{selRep=null;document.getElementById('rdet').innerHTML='<div style="color:#475569;padding:20px">Seleccion\u00e1 un reparto</div>';}
}
function renderSB(){
  var el=document.getElementById('rsl');
  if(!fRoutes.length){el.innerHTML='<div class="empty">Sin repartos.</div>';return;}
  var tot=0; fRoutes.forEach(function(r){tot+=r.tot;});
  el.innerHTML='<div style="font-size:.75rem;color:#546e6e;padding:4px 0 8px">'+fRoutes.length+' repartos \u2014 $'+F(tot)+'</div>'+
  fRoutes.map(function(r){
    var on=selRep===r.rep;
    var cls2=D_CLI[String(r.rep)]||[];
    var rejCount=cls2.filter(function(c){return c[7]===1;}).length;
    var rejTag=rejCount?'<span style="color:#ff5252">\u26a0 '+rejCount+' rej total</span>':'';
    var totProv=r.pep+r.mol+r.sof+r.oth||1;
    var bar='<div class="provbar">'+
      (r.pep?'<div style="flex:'+(r.pep/totProv)+';background:#009688"></div>':'')+
      (r.mol?'<div style="flex:'+(r.mol/totProv)+';background:#8b5cf6"></div>':'')+
      (r.sof?'<div style="flex:'+(r.sof/totProv)+';background:#00cc66"></div>':'')+
      (r.oth?'<div style="flex:'+(r.oth/totProv)+';background:#475569"></div>':'')+
    '</div>';
    return '<div class="ri'+(on?' on':'"')+'" onclick="selR('+r.rep+')">'+
      '<div class="ri-top"><span class="ri-ch">'+r.ch+'</span><span class="ri-rep">N\u00b0 '+r.rep+'</span></div>'+
      '<div class="ri-meta">'+
        '<span>\ud83d\udcc5 '+fmtFecha(r.f)+'</span>'+
        '<span>\u26f8 Cam '+r.cam+'</span>'+
        '<span>\ud83d\udc65 '+r.n+' cli</span>'+
        (r.kg?'<span>'+r.kg.toFixed(1)+' kg</span>':'')+
        rejTag+
      '</div>'+
      '<div style="font-size:.9rem;font-weight:800;color:#00e5cc;margin-top:4px">$'+F(r.tot)+'</div>'+
      bar+'</div>';
  }).join('');
}
function selR(rep){
  selRep=rep;
  renderSB();
  var r=D_ROUTES.find(function(x){return x.rep===rep;});
  var cls=D_CLI[String(rep)]||[];
  if(!r){document.getElementById('rdet').innerHTML='<div class="empty">Sin datos</div>';return;}
  var totProv=r.pep+r.mol+r.sof+r.oth||1;
  var fmap={0:{bd:'bg',lbl:'Entregado'},1:{bd:'br',lbl:'Rech. Total'},2:{bd:'by',lbl:'Rech. Parcial'},3:{bd:'bp',lbl:'Cambio'}};
  var html='<div style="margin-bottom:12px">'+
    '<div style="font-weight:800;font-size:1rem;margin-bottom:4px">Reparto N\u00b0 '+r.rep+' \u2014 '+r.ch+'</div>'+
    '<div style="font-size:.78rem;color:#4db6ac">\ud83d\udcc5 '+fmtFecha(r.f)+' &nbsp; \u26f8 Cami\u00f3n '+r.cam+'</div>'+
    '<div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">'+
      '<div class="kpi" style="min-width:80px"><div class="kpi-v" style="color:#00e5cc">'+cls.filter(function(c){return c[7]===0;}).length+'</div><div class="kpi-l">Entregados</div></div>'+
      '<div class="kpi" style="min-width:80px"><div class="kpi-v" style="color:#ff5252">'+cls.filter(function(c){return c[7]===1;}).length+'</div><div class="kpi-l">Rej. Total</div></div>'+
      '<div class="kpi" style="min-width:80px"><div class="kpi-v" style="color:#ffab40">'+cls.filter(function(c){return c[7]===2;}).length+'</div><div class="kpi-l">Rej. Parcial</div></div>'+
      '<div class="kpi" style="min-width:80px"><div class="kpi-v" style="color:#818cf8">'+cls.filter(function(c){return c[7]===3;}).length+'</div><div class="kpi-l">Cambios</div></div>'+
      '<div class="kpi" style="min-width:80px"><div class="kpi-v">'+cls.length+'</div><div class="kpi-l">Total</div></div>'+
      '<div class="kpi" style="min-width:100px"><div class="kpi-v" style="color:#e0f2f1">$'+F(r.tot)+'</div><div class="kpi-l">Total $</div></div>'+
      (r.kg?'<div class="kpi" style="min-width:80px"><div class="kpi-v" style="color:#546e6e">'+r.kg.toFixed(1)+'</div><div class="kpi-l">Kg</div></div>':'')+
    '</div>'+
    '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">'+
      (r.pep?'<div class="kpi" style="min-width:90px;border-color:#3b82f6"><div class="kpi-v" style="color:#3b82f6;font-size:1rem">$'+F(r.pep)+'</div><div class="kpi-l">Pepsico</div></div>':'')+
      (r.mol?'<div class="kpi" style="min-width:90px;border-color:#8b5cf6"><div class="kpi-v" style="color:#8b5cf6;font-size:1rem">$'+F(r.mol)+'</div><div class="kpi-l">Molinos</div></div>':'')+
      (r.sof?'<div class="kpi" style="min-width:90px;border-color:#10b981"><div class="kpi-v" style="color:#10b981;font-size:1rem">$'+F(r.sof)+'</div><div class="kpi-l">Softys</div></div>':'')+
      (r.oth?'<div class="kpi" style="min-width:90px;border-color:#475569"><div class="kpi-v" style="color:#4db6ac;font-size:1rem">$'+F(r.oth)+'</div><div class="kpi-l">Otros</div></div>':'')+
    '</div>'+
    '<div class="provbar" style="height:8px;margin-top:8px;border-radius:4px">'+
      (r.pep?'<div style="flex:'+(r.pep/totProv)+';background:#009688"></div>':'')+
      (r.mol?'<div style="flex:'+(r.mol/totProv)+';background:#8b5cf6"></div>':'')+
      (r.sof?'<div style="flex:'+(r.sof/totProv)+';background:#00cc66"></div>':'')+
      (r.oth?'<div style="flex:'+(r.oth/totProv)+';background:#475569"></div>':'')+
    '</div>'+
    '</div>';
  html+=cls.map(function(c){
    var fm=fmap[c[7]]||fmap[0];
    return '<div class="cli-row">'+
      '<div><div class="cli-name">'+c[1]+' <span style="font-size:.72rem;color:#546e6e">#'+c[0]+'</span></div>'+
      '<div class="cli-addr">'+c[2]+(c[3]?' \u2014 '+c[3]:'')+'</div>'+
      '<div class="cli-meta">'+BD(fm.bd,fm.lbl)+(c[4]?'<span style="font-size:.72rem;color:#546e6e">'+c[4]+'</span>':'')+'</div>'+
      '</div>'+
      '<div class="cli-right">'+
        (c[5]?'<div style="font-weight:700">$'+F(c[5])+'</div>':'')+
        (c[6]?'<div style="font-size:.75rem;color:#4db6ac">'+c[6]+' uds</div>':'')+
      '</div></div>';
  }).join('');
  document.getElementById('rdet').innerHTML=html;
}

// \u2500\u2500 CONCILIACION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var pwaRows=[];
function initConciliacion(){
  var cont=document.getElementById('conc-content');
  var load=document.getElementById('conc-loading');
  if(!cont)return;
  load.style.display='none'; cont.style.display='block';
  pwaRows=window.D_APP||[];
  renderConciliacion();
}
function loadPWA(){initConciliacion();}

function renderConciliacion(){
  var k=window.D_CONC?D_CONC.kpis:{};
  var appGes =window.D_CONC?D_CONC.app_ges:[];
  var appOnly=window.D_CONC?D_CONC.app_only:[];
  var gesOnly=window.D_CONC?D_CONC.ges_only:[];

  // KPIs
  document.getElementById('conc-kpis').innerHTML=
    KPI(String(k.total_app||0),'Rechazos informados en App','#a0c8e8')+
    KPI(String(k.app_ges||0)+' / $'+F(k.imp_app_ges||0),'\ud83d\udd34 App+Gescom (gestion\u00f3 y se perdi\u00f3)','#ff5252')+
    KPI(String(k.app_only||0),'\ud83d\udfe2 App sin Gescom (se salv\u00f3)','#69f0ae')+
    KPI(String(k.ges_only||0)+' / $'+F(k.imp_ges_only||0),'\u26ab Gescom sin App (sin gesti\u00f3n)','#2a5a7a')+
    KPI(String(k.with_resp||0),'Vendedores con respuesta','#00e5cc')+
    KPI(String(k.sin_resp||0),'Vendedores sin respuesta','#ffab40')+
    KPI((k.pct_saved||0)+'%','% Gestiones salvadas','#69f0ae');

  // Ranking choferes: GESCOM sin App (pre-calculado en Python)
  var rankCh=window.D_CONC?(D_CONC.rank_ch||[]):[];
  document.getElementById('conc-rank-ch').innerHTML=rankCh.length?
    rankCh.map(function(r,i){
      var urg=r.n>5?BD('br','Urgente'):r.n>2?BD('by','Atenci\u00f3n'):BD('bp','Revisar');
      var tipo=r.tipo==='propio'?'Propio':r.tipo==='backup'?'Backup':'Tercero';
      return '<tr><td>'+(i+1)+'</td><td><strong>'+(r.chofer||r.ch||'')+'</strong></td>'+
        '<td style="text-align:center;color:#4db6ac;font-size:.78rem">'+tipo+'</td>'+
        '<td style="text-align:right;color:#ff5252">'+r.n+'</td>'+
        '<td style="text-align:right">$'+F(r.imp)+'</td>'+
        '<td>'+urg+'</td></tr>';
    }).join(''):'<tr><td colspan="6" class="empty">Sin datos</td></tr>';

  // Ranking vendedores (pre-calculado en Python)
  var rankV=window.D_CONC?(D_CONC.rank_vend||[]):[];
  document.getElementById('conc-rank-vend').innerHTML=rankV.length?
    rankV.map(function(r,i){
      var pctSin=r.pct_sin_resp||0;
      var col=pctSin>70?'#ff5252':pctSin>40?'#ffab40':'#69f0ae';
      return '<tr><td>'+(i+1)+'</td><td><strong>'+(r.vendedor||r.v||'')+'</strong></td>'+
        '<td style="text-align:right">'+r.total+'</td>'+
        '<td style="text-align:right;color:#00e5cc">'+(r.con_resp||0)+'</td>'+
        '<td style="text-align:right;color:#ff5252">'+r.sin_resp+'</td>'+
        '<td><span style="color:'+col+';font-weight:700">'+pctSin+'%</span></td></tr>';
    }).join(''):'<tr><td colspan="6" class="empty">Sin datos</td></tr>';

  // Filter
  var fCh  = (document.getElementById('conc-f-ch')||{}).value||'';
  var fFec = (document.getElementById('conc-f-fecha')||{}).value||'';
  var fOrd = (document.getElementById('conc-f-ord')||{}).value||'fecha';
  var fTipo= (document.getElementById('conc-f-tipo')||{}).value||'';
  var fVend= (document.getElementById('conc-f-vend')||{}).value||'';

  var allRows=appGes.map(function(r){return {type:'ag',data:r};})
                    .concat(appOnly.map(function(r){return {type:'ao',data:r};})).concat(gesOnly.map(function(r){return {type:'go',data:r};}));
  allRows=allRows.filter(function(x){
    var r=x.data;
    if(fCh  && r.chofer!==fCh)    return false;
    if(fFec && r.fecha!==fFec)    return false;
    if(fTipo&& x.type!==fTipo)    return false;
    if(fVend&& r.vendedor!==fVend) return false;
    return true;
  });
  allRows.sort(function(a,b){
    var ra=a.data,rb=b.data;
    if(fOrd==='imp')return (rb.imp||0)-(ra.imp||0);
    if(fOrd==='chofer')return ra.chofer.localeCompare(rb.chofer);
    return ra.fecha<rb.fecha?-1:ra.fecha>rb.fecha?1:0;
  });

  // Populate filter selects (siempre repoblar)
  var allData=appGes.concat(appOnly).concat(gesOnly);
  var chSel=document.getElementById('conc-f-ch');
  var fSel =document.getElementById('conc-f-fecha');
  var vSel =document.getElementById('conc-f-vend');
  if(chSel){
    var sv=chSel.value;
    chSel.innerHTML='<option value="">Todos</option>';
    [...new Set(allData.map(function(r){return r.chofer||'';}).filter(Boolean))].sort()
      .forEach(function(c){chSel.innerHTML+='<option value="'+c+'"'+(c===sv?' selected':'')+'>'+c+'</option>';});
  }
  if(fSel){
    var sf=fSel.value;
    fSel.innerHTML='<option value="">Todas</option>';
    [...new Set(allData.map(function(r){return r.fecha||'';}).filter(Boolean))].sort()
      .forEach(function(f){fSel.innerHTML+='<option value="'+f+'"'+(f===sf?' selected':'')+'>'+fmtFecha(f)+'</option>';});
  }
  if(vSel){
    var svv=vSel.value;
    vSel.innerHTML='<option value="">Todos vendedores</option>';
    [...new Set(allData.map(function(r){return r.vendedor||'';}).filter(Boolean))].sort()
      .forEach(function(v){vSel.innerHTML+='<option value="'+v+'"'+(v===svv?' selected':'')+'>'+v+'</option>';});
  }
  document.getElementById('conc-tbody').innerHTML=allRows.length?
    allRows.map(function(x){
      var r=x.data; var isGO=x.type==='go'; var isAO=x.type==='ao';
      var tipo=isGO?'<span style="background:#333;color:#aaa;padding:2px 8px;border-radius:4px;font-size:.75rem">GESCOM sin App</span>':isAO?'<span style="background:#00695c30;color:#00e5cc;padding:2px 8px;border-radius:4px;font-size:.75rem">App sin GESCOM</span>':'<span style="background:#4a1a2a;color:#ff6b8a;padding:2px 8px;border-radius:4px;font-size:.75rem">App+GESCOM</span>';
      var est=isGO?'-':r.tiene_resp?BD('bg','Con respuesta'):BD('by','Sin respuesta');
      var fechaApp=r.fecha?fmtFecha(r.fecha):'-';
      var fechaGes=isAO?'-':(r.fecha_ges?((r.fecha_ges!==r.fecha)?'<span style="color:#ffab40">'+fmtFecha(r.fecha_ges)+'</span>':fmtFecha(r.fecha_ges)):fmtFecha(r.fecha));
      return '<tr>'+
        '<td>'+fechaApp+'</td>'+
        '<td>'+fechaGes+'</td>'+
        '<td><strong>'+r.chofer+'</strong></td>'+
        '<td style="font-size:.75rem"><span style="color:#4db6ac;font-weight:700;margin-right:6px">'+(r.cliente||'')+'</span>'+(r.razon||r.clientes||'')+'</td>'+
        '<td>'+tipo+'</td>'+
        '<td>'+est+'</td>'+
        '<td style="font-size:.75rem;color:#4db6ac">'+(r.resp||'-')+'</td>'+
        '<td style="text-align:right;color:#ff5252">'+(r.imp?'$'+F(r.imp):'-')+'</td></tr>';
    }).join(''):'<tr><td colspan="7" class="empty">Sin datos</td></tr>';

  // Plan de accion
  // Tabla detalle clientes sin respuesta (app_ges sin resp + app_only sin resp)
  var sinRespRows = appGes.concat(appOnly).filter(function(r){ return !r.tiene_resp; });
  // Apply same filters
  if(fCh)   sinRespRows = sinRespRows.filter(function(r){ return r.chofer===fCh; });
  if(fFec)  sinRespRows = sinRespRows.filter(function(r){ return r.fecha===fFec; });
  if(fVend) sinRespRows = sinRespRows.filter(function(r){ return r.vendedor===fVend; });
  sinRespRows.sort(function(a,b){ return a.fecha<b.fecha?-1:a.fecha>b.fecha?1:0; });
  var SR=document.getElementById('conc-sin-resp-tbody');
  if(SR) SR.innerHTML=sinRespRows.length?
    sinRespRows.map(function(r,i){
      var bg=i%2===0?'#0d2020':'#0a1515';
      return '<tr style="background:'+bg+'">'
        +'<td>'+fmtFecha(r.fecha)+'</td>'
        +'<td><strong>'+r.chofer+'</strong></td>'
        +'<td style="color:#4db6ac;font-weight:700">'+(r.cliente||'')+'</td>'
        +'<td style="font-size:.78rem">'+(r.razon||'')+'</td>'
        +'<td style="font-size:.78rem;color:#ffab40">'+(r.vendedor||'-')+'</td>'
        +'<td style="font-size:.78rem">'+(r.motivo||'-')+'</td>'
        +'<td style="font-size:.75rem;color:#4db6ac">'+(r.estado||'-')+'</td>'
        +'</tr>';
    }).join(''):'<tr><td colspan="7" class="empty">Sin clientes sin respuesta</td></tr>';

  document.getElementById('plan-tbody').innerHTML=rankCh.length?
    rankCh.map(function(r,i){
      var urg=r.n>5?BD('br','Urgente'):r.n>2?BD('by','Atenci\u00f3n'):BD('bp','Revisar');
      return '<tr><td>'+(i+1)+'</td><td><strong>'+(r.chofer||r.ch||'')+'</strong></td>'+
        '<td style="text-align:right;color:#ff5252">'+r.n+'</td>'+
        '<td style="text-align:right">$'+F(r.imp)+'</td>'+
        '<td>'+urg+'</td>'+
        '<td style="font-size:.75rem;color:#4db6ac">'+r.n+' rechazo'+(r.n>1?'s':'')+' sin documentar</td></tr>';
    }).join(''):'<tr><td colspan="6" class="empty">Sin alertas</td></tr>';
}

// \u2500\u2500 DESCARGA EXCEL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// Requiere SheetJS: <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
function dlXLS(rows, headers, filename) {
  var ws = XLSX.utils.aoa_to_sheet([headers].concat(rows));
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  XLSX.writeFile(wb, filename + '.xlsx');
}

function dlConciliacion() {
  if (!window.D_CONC) return;
  var rows = D_CONC.app_ges.concat(D_CONC.ges_only).map(function(r) {
    return [r.fecha, r.chofer, r.cliente||'', r.razon||'', r.motivo||'', r.resp||'', r.estado||'', r.imp||0];
  });
  dlXLS(rows, ['Fecha','Chofer','Nro Cliente','Raz\u00f3n Social','Motivo','Respuesta','Estado','Importe'], 'conciliacion');
}

function dlCartones() {
  if (!window.D_CART) return;
  var rows = D_CART.semanas.flatMap(function(s) {
    return s.choferes.map(function(c) {
      return [s.semana, c.chofer, c.salida, c.retorno, c.pct];
    });
  });
  dlXLS(rows, ['Semana','Chofer','B.E. Salida','B.E. Retorno','% Retorno'], 'cartones');
}

function dlDeposito() {
  if (!window.D_DEP) return;
  var rows = (D_DEP.faltante||[]).concat(D_DEP.sobrante||[], D_DEP.roturas||[], D_DEP.consumo||[], D_DEP.vencido||[]).map(function(r) {
    return [r.tipo||'', r.fecha||'', r.proveedor||'', r.producto||'', r.cantidad||0, r.costo||0, r.importe||0];
  });
  dlXLS(rows, ['Tipo','Fecha','Proveedor','Producto','Cantidad','Costo','Importe'], 'deposito');
}

function dlVentas() {
  if (!window.D_VENTA) return;
  var rows = (D_VENTA.choferes||[]).map(function(c) {
    return [c.chofer, c.pedidos||0, c.entregados||0, c.rechazos||0, c.invendibles||0, c.neto||0];
  });
  dlXLS(rows, ['Chofer','Pedidos','Entregados','Rechazos','Invendibles','Neto'], 'ventas');
}

function dlComisiones() {
  if (!window.D_COM) return;
  var rows = D_COM.repartos.map(function(r) {
    return [r.chofer, r.rep, r.fecha, r.localidades, r.pct+'%', r.venta_bruta, r.devoluciones, r.cambios, r.neto, r.comision];
  });
  dlXLS(rows, ['Chofer','Reparto','Fecha','Localidades','% Aplicado','Venta Bruta','Devoluciones','Cambios','Neto','Comisi\u00f3n'], 'comisiones');
}

function dlSinRespuesta() {
  if (!window.D_CONC) return;
  var appGes = D_CONC.app_ges||[];
  var appOnly = D_CONC.app_only||[];
  var fCh = (document.getElementById('conc-f-ch')||{}).value||'';
  var fFec = (document.getElementById('conc-f-fecha')||{}).value||'';
  var rows = appGes.concat(appOnly).filter(function(r){
    if(r.tiene_resp) return false;
    if(fCh && r.chofer!==fCh) return false;
    if(fFec && r.fecha!==fFec) return false;
    return true;
  }).map(function(r){
    return [r.fecha||'', r.chofer||'', r.cliente||'', r.razon||'', r.vendedor||'', r.motivo||'', r.estado||''];
  });
  dlXLS(rows, ['Fecha','Chofer','Cliente','Razón Social','Vendedor','Motivo','Estado'], 'clientes_sin_respuesta');
}

function dlRuta() {
  if (!window.D_ROUTES) return;
  var fCh  = (document.getElementById('ruta-ch')||{}).value||'';
  var fFec = (document.getElementById('ruta-fecha')||{}).value||'';
  var rows = D_ROUTES.filter(function(r){
    if(fCh && r.ch!==fCh) return false;
    if(fFec && r.f!==fFec) return false;
    return true;
  }).map(function(r) {
    return [r.rep||'', r.ch||'', r.f||'', r.n||0, r.tot||0, r.rej||0, r.kg||0, r.pep||0, r.mol||0];
  });
  dlXLS(rows, ['Reparto','Chofer','Fecha','Clientes','Total $','Rechazos','KG','Pepsico $','Molinos $'], 'hoja_de_ruta');
}

// \u2500\u2500 DESCARGA EXCEL \u2014 RECHAZOS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function dlRejProv() {
  if (!window.D_PROV) return;
  var rows = D_PROV.map(function(p) {
    return [p.prov, p.venta, p.rec, p.rec_pct ? (p.rec_pct*100).toFixed(2)+'%' : '', p.cam, p.cam_pct ? (p.cam_pct*100).toFixed(2)+'%' : '', p.fac, p.no_e, p.efect ? (p.efect*100).toFixed(1)+'%' : ''];
  });
  dlXLS(rows, ['Proveedor','Venta ($)','Rechazo ($)','% Rechazo','Cambio ($)','% Cambio','Fac.','No Ent.','Efectividad'], 'rechazos_por_proveedor');
}

function dlRejMotivo() {
  var selProv = (document.getElementById('rej-prov-f')||{}).value||'';
  var mData = (selProv && window.D_MOTIVO_PROV && D_MOTIVO_PROV[selProv]) ? D_MOTIVO_PROV[selProv] : (window.D_MOTIVO||[]);
  var rows = mData.map(function(m) {
    return [m.motivo, m.imp, m.uds];
  });
  dlXLS(rows, ['Motivo','Importe ($)','Unidades'], 'rechazos_por_motivo' + (selProv ? '_'+selProv.replace(/ /g,'_') : ''));
}

function dlRejChofer() {
  if (!window.D_CHPROV) return;
  var selProv = (document.getElementById('rej-prov-f')||{}).value||'';
  var rows = [];
  Object.keys(D_CHPROV).forEach(function(ch) {
    var cpList = (D_CHPROV[ch]||[]).filter(function(m){ return !selProv || m.prov===selProv; });
    if (!cpList.length) return;
    var vv=0,rr=0,ff=0,nn=0;
    cpList.forEach(function(m){vv+=m.venta;rr+=m.rec;ff+=m.fac;nn+=m.no_e;});
    rows.push([ch, vv, rr, vv>0?(rr/vv*100).toFixed(2)+'%':'', ff>0?(ff/(ff+nn)*100).toFixed(1)+'%':'']);
  });
  rows.sort(function(a,b){ return (parseFloat(b[2])||0)-(parseFloat(a[2])||0); });
  dlXLS(rows, ['Chofer','Venta ($)','Rechazo ($)','% Rechazo','Efectividad'], 'rechazos_por_chofer');
}

function dlRejReinc() {
  if (!window.D_REINC) return;
  var rows = D_REINC.map(function(r) {
    return [r.razon, r.loc||'', r.n, r.imp, r.vendedor||'', r.choferes||'', r.fechas||''];
  });
  dlXLS(rows, ['Raz\u00f3n Social','Localidad','Cant. Rechazos','Importe ($)','Vendedor','Choferes','Fechas'], 'reincidentes');
}

// ── DESCARGA DROPDOWN ─────────────────────────────────────────────────────────
function toggleDescarga() {
  var m = document.getElementById('conc-dl-menu');
  if (!m) return;
  m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
// Cerrar dropdown al clickear afuera
document.addEventListener('click', function(e) {
  var btn = e.target.closest && e.target.closest('[onclick="toggleDescarga()"]');
  var menu = document.getElementById('conc-dl-menu');
  if (menu && !btn && !menu.contains(e.target)) menu.style.display = 'none';
});

// ── PDF CONCILIACION ──────────────────────────────────────────────────────────
function dlConciliacionPDF() {
  if (!window.D_CONC) return;
  var fCh   = (document.getElementById('conc-f-ch')||{}).value||'';
  var fFec  = (document.getElementById('conc-f-fecha')||{}).value||'';
  var fTipo = (document.getElementById('conc-f-tipo')||{}).value||'';
  var fVend = (document.getElementById('conc-f-vend')||{}).value||'';
  var k = D_CONC.kpis||{};

  var appGes  = D_CONC.app_ges||[];
  var appOnly = D_CONC.app_only||[];
  var gesOnly = D_CONC.ges_only||[];

  function applyFilters(arr, type) {
    return arr.filter(function(r){
      if(fCh   && r.chofer!==fCh)    return false;
      if(fFec  && r.fecha!==fFec)    return false;
      if(fVend && r.vendedor!==fVend) return false;
      if(fTipo && type!==fTipo)      return false;
      return true;
    });
  }

  var ag = applyFilters(appGes, 'ag');
  var ao = applyFilters(appOnly, 'ao');
  var go = applyFilters(gesOnly, 'go');
  var allRows = ag.concat(ao).concat(go);
  allRows.sort(function(a,b){ return a.fecha<b.fecha?-1:a.fecha>b.fecha?1:0; });

  var filtroTexto = [];
  if(fCh)   filtroTexto.push('Chofer: '+fCh);
  if(fVend) filtroTexto.push('Vendedor: '+fVend);
  if(fFec)  filtroTexto.push('Fecha: '+fFec);
  if(fTipo) filtroTexto.push('Tipo: '+(fTipo==='ag'?'App+GESCOM':fTipo==='ao'?'App sin GESCOM':'GESCOM sin App'));
  var filtroStr = filtroTexto.length ? filtroTexto.join(' | ') : 'Sin filtros aplicados';

  var tVta  = ag.reduce(function(s,r){return s+(r.imp||0);},0) + go.reduce(function(s,r){return s+(r.imp||0);},0);
  var sinR  = ag.concat(ao).filter(function(r){return !r.tiene_resp;}).length;
  var pctSal= (ag.length+ao.length)>0?Math.round(ao.length/(ag.length+ao.length)*100):0;

  var typeLabel = function(r, type) {
    if(type==='go') return '<span style="color:#888">GESCOM sin App</span>';
    if(type==='ao') return '<span style="color:#00e5cc">App sin GESCOM</span>';
    return '<span style="color:#ff6b8a">App+GESCOM</span>';
  };

  var rowsHtml = allRows.map(function(r, type){
    var t = ag.indexOf(r)>=0?'ag':(ao.indexOf(r)>=0?'ao':'go');
    var tc = t==='go'?'#888':t==='ao'?'#00e5cc':'#ff6b8a';
    var tl = t==='go'?'GESCOM sin App':t==='ao'?'App sin GESCOM':'App+GESCOM';
    return '<tr style="border-bottom:1px solid #e5e7eb">'
      +'<td style="padding:5px 8px;font-size:11px">'+r.fecha+'</td>'
      +'<td style="padding:5px 8px;font-size:11px">'+r.chofer+'</td>'
      +'<td style="padding:5px 8px;font-size:11px;color:#1d4ed8;font-weight:600">'+(r.cliente||'')+'</td>'
      +'<td style="padding:5px 8px;font-size:11px">'+(r.razon||'')+'</td>'
      +'<td style="padding:5px 8px;font-size:11px;color:'+tc+'">'+tl+'</td>'
      +'<td style="padding:5px 8px;font-size:11px">'+(r.vendedor||'-')+'</td>'
      +'<td style="padding:5px 8px;font-size:11px">'+(r.resp||'-')+'</td>'
      +'<td style="padding:5px 8px;font-size:11px;text-align:right">'+(r.imp?'$'+Math.round(r.imp).toLocaleString('es-AR'):'')+'</td>'
      +'</tr>';
  }).join('');

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8">'
    +'<style>body{font-family:Arial,sans-serif;margin:0;padding:0;color:#111}'
    +'.header{background:linear-gradient(135deg,#0f172a,#1e3a5f);color:white;padding:28px 32px}'
    +'.header h1{margin:0;font-size:22px;font-weight:700}' 
    +'.header .sub{font-size:13px;color:#4db6ac;margin-top:4px}'
    +'.filtro{background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:8px 14px;margin:16px 24px;font-size:12px;color:#0369a1}'
    +'.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 24px}'
    +'.kpi{background:#f8fafc;border:1px solid #e0f2f1;border-radius:8px;padding:12px 16px}'
    +'.kpi .val{font-size:22px;font-weight:700;color:#0f172a}'
    +'.kpi .lbl{font-size:11px;color:#546e6e;margin-top:2px}'
    +'.kpi.red .val{color:#dc2626}.kpi.green .val{color:#16a34a}.kpi.blue .val{color:#2563eb}.kpi.orange .val{color:#d97706}'
    +'.section{margin:16px 24px}'
    +'.section h2{font-size:14px;font-weight:700;color:#0f172a;border-bottom:2px solid #009688;padding-bottom:6px;margin-bottom:10px}'
    +'table{width:100%;border-collapse:collapse;font-size:11px}'
    +'thead{background:#0f172a;color:white}'
    +'thead th{padding:7px 8px;text-align:left;font-weight:600}'
    +'tbody tr:nth-child(even){background:#f8fafc}'
    +'.footer{text-align:center;font-size:10px;color:#4db6ac;margin:20px;padding-top:12px;border-top:1px solid #e0f2f1}'
    +'@media print{body{-webkit-print-color-adjust:exact}}'
    +'</style></head><body>'
    +'<div class="header">'
    +'<h1>&#x1F4E6; 611 Log\u00edstica &mdash; Reporte de Conciliaci\u00f3n</h1>'
    +'<div class="sub">Generado: '+new Date().toLocaleString('es-AR')+' &nbsp;|&nbsp; Per\u00edodo: '+(D_CONC.periodo||'')+'</div>'
    +'</div>'
    +'<div class="filtro">&#128269; Filtros aplicados: <strong>'+filtroStr+'</strong></div>'
    +'<div class="kpis">'
    +'<div class="kpi blue"><div class="val">'+(ag.length+ao.length)+'</div><div class="lbl">Rechazos en App</div></div>'
    +'<div class="kpi red"><div class="val">'+ag.length+'</div><div class="lbl">App+GESCOM (se perdi\u00f3)</div></div>'
    +'<div class="kpi green"><div class="val">'+ao.length+'</div><div class="lbl">App sin GESCOM (salvado)</div></div>'
    +'<div class="kpi orange"><div class="val">'+pctSal+'%</div><div class="lbl">% Gestiones salvadas</div></div>'
    +'<div class="kpi"><div class="val">'+go.length+'</div><div class="lbl">GESCOM sin App</div></div>'
    +'<div class="kpi red"><div class="val">'+sinR+'</div><div class="lbl">Sin respuesta vendedor</div></div>'
    +'<div class="kpi"><div class="val">$'+Math.round(tVta).toLocaleString('es-AR')+'</div><div class="lbl">Importe total</div></div>'
    +'<div class="kpi"><div class="val">'+allRows.length+'</div><div class="lbl">Total registros</div></div>'
    +'</div>'
    +'<div class="section"><h2>&#128203; Detalle de Conciliaci\u00f3n</h2>'
    +'<table><thead><tr><th>Fecha App</th><th>Chofer</th><th>Cliente</th><th>Raz\u00f3n Social</th><th>Tipo</th><th>Vendedor</th><th>Respuesta</th><th>Importe</th></tr></thead>'
    +'<tbody>'+rowsHtml+'</tbody></table></div>'
    +'<div class="footer">Sistema Operativo 611 Log\u00edstica SA &mdash; Documento generado autom\u00e1ticamente</div>'
    +'</body></html>';

  var w = window.open('','_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(function(){ w.print(); }, 500);
}

// ── DESCARGAR RESUMEN POR CHOFER (un PDF por chofer) ─────────────────────────
function dlResumenChoferes() {
  var choferes = [];
  // Recolectar todos los choferes de los datos disponibles
  if (window.D_CART) {
    Object.values(D_CART).forEach(function(r){ if(r.chofer && choferes.indexOf(r.chofer)<0) choferes.push(r.chofer); });
  }
  if (!choferes.length && window.D_VENTA) {
    D_VENTA.forEach(function(r){ var ch=r.ch||r.chofer; if(ch && choferes.indexOf(ch)<0) choferes.push(ch); });
  }
  if (!choferes.length && window.D_CONC) {
    (D_CONC.app_ges||[]).concat(D_CONC.app_only||[]).concat(D_CONC.ges_only||[])
      .forEach(function(r){ if(r.chofer && choferes.indexOf(r.chofer)<0) choferes.push(r.chofer); });
  }
  if (!choferes.length) { alert('No hay datos de choferes disponibles'); return; }
  choferes.sort();
  var confirm_msg = 'Se van a generar ' + choferes.length + ' PDFs (uno por chofer).\n\nEl navegador puede pedir permiso para abrir múltiples ventanas.\n\n¿Continuar?';
  if (!window.confirm(confirm_msg)) return;
  choferes.forEach(function(ch, i) {
    setTimeout(function(){ _generarPDFChofer(ch); }, i * 800);
  });
}

function _generarPDFChofer(chofer) {
  var periodo = (window.D_CONC && D_CONC.periodo) || (window.D_COM && D_COM.periodo) || '';
  var tipo = (window.CHOFER_TIPOS && CHOFER_TIPOS[chofer]) || '';

  // ── CARTONES ──
  var cartSal=0, cartRet=0, cartPct=0;
  if (window.D_CART) {
    var rows = Object.values(D_CART).filter(function(r){ return r.chofer===chofer; });
    if (rows.length) {
      cartSal = rows.reduce(function(s,r){return s+(r.b_sal||0);},0);
      cartRet = rows.reduce(function(s,r){return s+(r.b_ing||0);},0);
      cartPct = cartSal>0 ? Math.round(cartRet/cartSal*100) : 0;
    }
  }

  // ── PEPSICO DATA ──
  var pepVenta=0, pepRej=0, pepRejPct='0.0', pepCam=0, pepCamPct='0.0';
  var pepFac=0, pepNoEnt=0, pepEfect='0.0';
  var efPepVenta=0, efPepRec=0, efPepPct='0.0';
  if (window.D_VENTA) {
    var vch = Object.values(D_VENTA).find(function(c){return c.ch===chofer||c.chofer===chofer;});
    if (vch) {
      // Datos Pepsico pre-calculados por chofer
      var pep = vch.pep || {};
      pepVenta = pep.vta||0;
      pepRej   = pep.dev||0;
      pepCam   = pep.cam||0;
      pepFac   = pep.e||0;
      pepNoEnt = pep.ne||0;
      pepEfect = String((pep.efect||0).toFixed(1));
      pepRejPct= String((pep.pct_dev||0).toFixed(1));
      pepCamPct= String((pep.pct_cam||0).toFixed(1));
      efPepVenta = pepVenta; efPepRec = pepRej; efPepPct = pepRejPct;
    }
  }

  // rechazos pepsico ya calculados en bloque anterior via vch.pep

  // ── CONCILIACION ──
  var concAG=[], concAO=[], concGO=[];
  if (window.D_CONC) {
    concAG = (D_CONC.app_ges||[]).filter(function(r){return r.chofer===chofer;});
    concAO = (D_CONC.app_only||[]).filter(function(r){return r.chofer===chofer;});
    concGO = (D_CONC.ges_only||[]).filter(function(r){return r.chofer===chofer;});
  }
  var concTotal = concAG.length + concAO.length + concGO.length;
  var pctSalv = (concAG.length+concAO.length)>0 ? Math.round(concAO.length/(concAG.length+concAO.length)*100) : 0;
  var sinResp = concAG.concat(concAO).filter(function(r){return !r.tiene_resp;}).length;

  var allConc = concAG.map(function(r){return {type:'ag',r:r};})
    .concat(concAO.map(function(r){return {type:'ao',r:r};}))
    .concat(concGO.map(function(r){return {type:'go',r:r};}));
  allConc.sort(function(a,b){return a.r.fecha<b.r.fecha?-1:1;});

  var KPI = function(val, lbl, col) {
    return '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px">'
      +'<div style="font-size:20px;font-weight:700;color:'+(col||'#0f172a')+'">'+val+'</div>'
      +'<div style="font-size:11px;color:#64748b;margin-top:2px">'+lbl+'</div></div>';
  };

  // rejRows removed - now using Pepsico-only metrics

  var typeCol = function(t){return t==='go'?'#888':t==='ao'?'#16a34a':'#dc2626';};
  var typeLbl = function(t){return t==='go'?'GESCOM sin App':t==='ao'?'App sin GESCOM':'App+GESCOM';};

  var concRows = allConc.map(function(x){
    return '<tr style="border-bottom:1px solid #e5e7eb">'
      +'<td style="padding:4px 6px;font-size:10px">'+x.r.fecha+'</td>'
      +'<td style="padding:4px 6px;font-size:10px;color:#1d4ed8;font-weight:600">'+(x.r.cliente||'')+'</td>'
      +'<td style="padding:4px 6px;font-size:10px">'+(x.r.razon||'')+'</td>'
      +'<td style="padding:4px 6px;font-size:10px;color:'+typeCol(x.type)+'">'+typeLbl(x.type)+'</td>'
      +'<td style="padding:4px 6px;font-size:10px;color:#64748b">'+(x.r.vendedor||'-')+'</td>'
      +'<td style="padding:4px 6px;font-size:10px">'+(x.r.resp||'-')+'</td>'
      +'<td style="padding:4px 6px;font-size:10px;text-align:right">'+(x.r.imp?'$'+Math.round(x.r.imp).toLocaleString('es-AR'):'')+'</td>'
      +'</tr>';
  }).join('');

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resumen '+chofer+'</title>'
    +'<style>body{font-family:Arial,sans-serif;margin:0;padding:0;color:#0f172a}'
    +'.hdr{background:#0f172a;color:white;padding:24px 28px}'
    +'.hdr h1{margin:0;font-size:20px;font-weight:700;color:#00e5cc}'
    +'.hdr .sub{font-size:12px;color:#94a3b8;margin-top:4px}'
    +'.sec{margin:16px 24px}'
    +'.sec h2{font-size:13px;font-weight:700;color:#0f172a;border-bottom:2px solid #00e5cc;padding-bottom:5px;margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em}'
    +'.kgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}'
    +'table{width:100%;border-collapse:collapse}'
    +'thead{background:#0f172a;color:white}'
    +'thead th{padding:6px 8px;text-align:left;font-size:11px;font-weight:600}'
    +'tbody tr:nth-child(even){background:#f8fafc}'
    +'.footer{text-align:center;font-size:10px;color:#94a3b8;margin:20px;padding-top:10px;border-top:1px solid #e2e8f0}'
    +'@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'
    +'</style></head><body>'
    +'<div class="hdr">'
    +'<h1>'+chofer+'</h1>'
    +'<div class="sub">Resumen Operativo &nbsp;|&nbsp; Per\xedodo: '+periodo+(tipo?' &nbsp;|&nbsp; '+tipo.charAt(0).toUpperCase()+tipo.slice(1):'')+'</div>'
    +'</div>'

    +'<div class="sec"><h2>&#x1F4E6; Retorno de Cartones</h2>'
    +'<div class="kgrid">'
    +KPI(cartSal,'B.E. Salida')
    +KPI(cartRet,'B.E. Retorno')
    +KPI(cartPct+'%','% Retorno', cartPct>=90?'#16a34a':cartPct>=70?'#d97706':'#dc2626')
    +'</div></div>'

    +'<div class="sec"><h2>&#x1F4CA; Pepsico &#x2014; Efectividad y Rechazos</h2>'
    +'<div class="kgrid" style="grid-template-columns:repeat(4,1fr)">'
    +KPI('$'+Math.round(pepVenta).toLocaleString('es-AR'),'Venta Pepsico','#1d4ed8')
    +KPI(String(pepFac),'Facturados','#16a34a')
    +KPI(String(pepNoEnt),'No Entregados','#dc2626')
    +KPI(pepEfect+'%','Efectividad', parseFloat(pepEfect)>=98?'#16a34a':parseFloat(pepEfect)>=95?'#d97706':'#dc2626')
    +'</div>'
    +'<div class="kgrid" style="grid-template-columns:repeat(4,1fr);margin-top:10px">'
    +KPI('$'+Math.round(pepRej).toLocaleString('es-AR'),'Rechazo $','#dc2626')
    +KPI(pepRejPct+'%','% Rechazo', parseFloat(pepRejPct)<=2?'#16a34a':parseFloat(pepRejPct)<=5?'#d97706':'#dc2626')
    +KPI('$'+Math.round(pepCam).toLocaleString('es-AR'),'Cambio $','#d97706')
    +KPI(pepCamPct+'%','% Cambio', parseFloat(pepCamPct)<=2?'#16a34a':parseFloat(pepCamPct)<=5?'#d97706':'#dc2626')
    +'</div></div>'

    // rechazos pepsico now merged into efectividad section above

    +'<div class="sec"><h2>&#x1F4F1; Conciliaci\xf3n App vs GESCOM</h2>'
    +'<div class="kgrid" style="grid-template-columns:repeat(4,1fr)">'
    +KPI(concAG.length+concAO.length,'Rechazos en App','#1d4ed8')
    +KPI(concAG.length,'App+GESCOM (perd\xedos)','#dc2626')
    +KPI(concAO.length,'App sin GESCOM (salvados)','#16a34a')
    +KPI(concGO.length,'GESCOM sin App','#64748b')
    +'</div>'
    +'<div class="kgrid" style="grid-template-columns:repeat(3,1fr);margin-top:10px">'
    +KPI(pctSalv+'%','% Gestiones salvadas', pctSalv>=60?'#16a34a':pctSalv>=40?'#d97706':'#dc2626')
    +KPI(sinResp,'Sin respuesta vendedor','#d97706')
    +KPI(concTotal,'Total registros')
    +'</div>'
    +(allConc.length?
      '<table style="margin-top:12px"><thead><tr>'
      +'<th>Fecha</th><th>Cliente</th><th>Raz\xf3n Social</th><th>Tipo</th><th>Vendedor</th><th>Respuesta</th><th style="text-align:right">Importe</th>'
      +'</tr></thead><tbody>'+concRows+'</tbody></table>'
      :'<p style="font-size:12px;color:#64748b">Sin registros de conciliaci\xf3n</p>')
    +'</div>'

    +'<div class="footer">Sistema Operativo 611 Log\xedstica SA &mdash; Generado: '+new Date().toLocaleString('es-AR',{timeZone:'America/Argentina/Cordoba'})+'</div>'
    +'</body></html>';

  var w = window.open('', '_blank');
  if (!w) { alert('El navegador bloqueó las ventanas emergentes. Por favor permitilas para este sitio.'); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(function(){ w.print(); }, 600);
}
