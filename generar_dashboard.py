#!/usr/bin/env python3
"""
generar_dashboard.py - 611 Logistica Dashboard Operativo
Lee: venta_actual.xlsx, movimientos.xlsx (opcional), cartones.xlsx (opcional), Registro_de_Rechazos.xlsx (opcional)
"""
import pandas as pd, json, os, sys, math
from datetime import datetime

print("=" * 60)
print("611 Logistica - Generador Dashboard Operativo")
print("=" * 60)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Detect all month subfolders (e.g. "junio 2026", "julio 2026")
# and set CURRENT_DIR to the most recent one
def _get_month_dirs():
    dirs = []
    try:
        for d in os.listdir(DATA_DIR):
            full = os.path.join(DATA_DIR, d)
            if os.path.isdir(full):
                dirs.append((d, full))
    except: pass
    # Sort by name (month year format sorts chronologically if consistent)
    MES_ORD = {'enero':1,'febrero':2,'marzo':3,'abril':4,'mayo':5,'junio':6,
               'julio':7,'agosto':8,'septiembre':9,'octubre':10,'noviembre':11,'diciembre':12}
    def _sort_key(item):
        parts = item[0].lower().split()
        mes = MES_ORD.get(parts[0], 0) if parts else 0
        anio = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else 0
        return (anio, mes)
    dirs.sort(key=_sort_key)
    return dirs

MONTH_DIRS = _get_month_dirs()
# If no subfolders, fall back to DATA_DIR itself
CURRENT_DIR = MONTH_DIRS[-1][1] if MONTH_DIRS else DATA_DIR
CURRENT_PERIOD = MONTH_DIRS[-1][0] if MONTH_DIRS else ''
print(f"Períodos encontrados: {[d[0] for d in MONTH_DIRS]}")
print(f"Procesando: {CURRENT_PERIOD}")

def si(v,d=0):
    try: return d if (v is None or (isinstance(v,float) and math.isnan(v))) else int(v)
    except: return d

def sf(v,d=0.0):
    try: return d if (v is None or (isinstance(v,float) and math.isnan(v))) else float(v)
    except: return d

def find(name, search_dir=None):
    sd = search_dir or CURRENT_DIR
    try:
        for f in os.listdir(sd):
            if f.lower() == name.lower():
                return os.path.join(sd, f)
        kw = name.lower().split(".")[0]
        for f in sorted(os.listdir(sd)):
            if f.endswith(".xlsx") and kw in f.lower():
                return os.path.join(sd, f)
    except: pass
    return None

def make_chunks(var_name, data, chunk=8000):
    if isinstance(data, dict):
        stmts = [f'var {var_name}={{}};']
        buf, bsize = {}, 0
        for k,v in data.items():
            vj = json.dumps(v, ensure_ascii=True, separators=(',',':'))
            if bsize+len(vj)>chunk and buf:
                stmts.append(f'Object.assign({var_name},{json.dumps(buf,ensure_ascii=True,separators=(",",":"))});')
                buf, bsize = {}, 0
            buf[k]=v; bsize+=len(vj)
        if buf:
            stmts.append(f'Object.assign({var_name},{json.dumps(buf,ensure_ascii=True,separators=(",",":"))});')
    elif isinstance(data, list):
        stmts = [f'var {var_name}=[];']
        buf, bsize = [], 0
        for item in data:
            ij = json.dumps(item, ensure_ascii=True, separators=(',',':'))
            if bsize+len(ij)>chunk and buf:
                stmts.append(f'{var_name}={var_name}.concat({json.dumps(buf,ensure_ascii=True,separators=(",",":"))});')
                buf, bsize = [], 0
            buf.append(item); bsize+=len(ij)
        if buf:
            stmts.append(f'{var_name}={var_name}.concat({json.dumps(buf,ensure_ascii=True,separators=(",",":"))});')
    else:
        stmts = [f'var {var_name}={json.dumps(data,ensure_ascii=True,separators=(",",":"))};']
    return '\n'.join(stmts)

TERCEROS_LIST = [
    'CECILIA GONZALEZ','BELEN AGUSTIN','LUIS GUIRAO','EZEQUIEL JUNCOS',
    'RODRIGO ROMANO','MAURO IRIARTE','PABLO CANELO','GUSTAVO NIETO',
    'LEONARDO GUEVARA','DUILIO PALLOTTI','TALAVERA ADRIAN','ALLENDE ALEJANDRO JAVIER'
]

LOC_MAP_COM = {
    'VILLA CARLOS PAZ':'CARLOS PAZ','LA CUMBRE':'LA CUMBRE + LOS COCOS',
    'LOS COCOS':'LA CUMBRE + LOS COCOS','BIALET MASSE':'BAILET MASSE',
    'VILLA CIUDAD DE AMERICA':'VILLA CIUDAD AMERICA',
    'VILLA CIUDAD PQUE LOS REARTES':'POTRERO + REARTES',
    'LOS REARTES':'POTRERO + REARTES','COLONIA TIROLESA':'TIROLESA',
    'SANTA ROSA DE CALAMUCHITA':'SANTA ROSA','VILLA YACANTO':'YACANTO',
    'VILLA DEL TOTORAL':'TOTORAL','HUERTA GRANDE':'PUNILLA',
    'SANTA MARIA DE PUNILLA':'PUNILLA','PARQUE SIQUIMAN':'SIQUIMIAN',
    'MENDIOLAZA':'UNQUILLO','VILLA ALLENDE':'UNQUILLO',
    'LA CALERA':'CORDOBA','CALERA CENTRAL':'CORDOBA',
    'MALVINAS ARGENTINAS':'MALVINAS','VILLA BUSTOS':'PUNILLA',
    'MAYU SUMAJ':'PUNILLA','VILLA AMANCAY':'PUNILLA','CUESTA BLANCA':'PUNILLA',
    'SAN ANTONIO DE ARREDONDO':'CARLOS PAZ','VILLA SANTA CRUZ DEL LAGO':'CARLOS PAZ',
    'VILLA RIO YCHO CRUZ':'CARLOS PAZ','CASA GRANDE':'ALTA GRACIA',
    'JOSE DE LA QUINTANA':'ALTA GRACIA','LA SERRANITA':'ALTA GRACIA',
    'VILLA CAEIRO':'ALTA GRACIA','VILLA LA BOLSA':'ALTA GRACIA',
    'VILLA ESQUIU':'ALTA GRACIA','SAN IGNACIO':'ALTA GRACIA',
    'POTRERO DE GARAY':'POTRERO + REARTES','VILLA DEL LAGO':'CARLOS PAZ',
    'CHARBONIER':'RIO CEBALLOS','SALDAN':'UNQUILLO','YOCSINA':'UNQUILLO',
    'SAN ROQUE':'CARLOS PAZ','COMUNA SAN ROQUE':'CARLOS PAZ',
    'SEBASTIAN ELCANO':'JESUS MARIA','SINSACATE':'JESUS MARIA',
    'SAN NICOLAS':'COLONIA CAROYA','SAN JOSE DE LA DORMIDA':'DEAN FUNES',
    'VILLA DE SOTO':'DEAN FUNES','QUILINO':'DEAN FUNES',
    'RAYO CORTADO':'DEAN FUNES','PUNTA DEL AGUA':'DEAN FUNES',
    'CORIMAYO':'DEAN FUNES','EL MANZANO':'MINA CLAVERO',
    'EL PUEBLITO':'MINA CLAVERO','VILLA BERNA':'VILLA GENERAL BELGRANO',
    'GENERAL PAZ':'JUAREZ CELMAN','LAS PE\u00d1AS':'JESUS MARIA',
    'LOS MOLINOS':'ALTA GRACIA','CABALANGO':'PUNILLA','JOVITA':'VILLA DE MARIA',
    'AGUA DE ORO':'AGUA DE ORO','VILLA PARQUE SANTA ANA':'VILLA PARQUE SANTA ANA',
    'FALDA DEL CARMEN':'FALDA DEL CARMEN','VILLA SANTA MARIA':'VILLA SANTA MARIA',
}

MOTIVO_MAP = {
    1.0:'Cerrado', 2.0:'No hizo pedido', 3.0:'Sin Dinero', 4.0:'Lluvia',
    5.0:'Error Adm./Refacturación', 6.0:'Error de Preventa', 7.0:'Error de Chofer',
    8.0:'Mal armado', 9.0:'No se cargó producto', 10.0:'Horario de Entrega',
    11.0:'Sin Envase', 12.0:'Retiró de Depósito', 13.0:'Zona peligrosa',
    14.0:'No se entregó en fecha', 15.0:'No alcanzó el tiempo', 16.0:'Dirección incorrecta',
    17.0:'No está el dueño', 18.0:'Envases deteriorados', 25.0:'Sin Stock',
    99.0:'Dev. x Trámites internos', 10000.0:'Error Armado: Dif. unidades',
    10001.0:'Error Armado: Código cambiado', 10002.0:'Error Armado: Producto roto',
}
PEPSICO = 'Pepsico de Argentina SRL'
MOLINOS = 'MOLINOS RIO DE LA PLATA SA'
SOFTYS  = 'SOFTYS ARGENTINA SA'

CHOFER_MAP = {
    'AVALOS GOMEZ RODRIGO SEBASTIAN': 'RODRIGO AVALOS',
    'BELEN EMILIANO AGUSTIN':         'BELEN AGUSTIN',
    'CANELO PABLO FERNANDO':          'PABLO CANELO',
    'CARO MAXIMILIANO ALBERTO':       'MAXIMILANO  CARO',
    'GONZALEZ CECILIA GUADALUPE':     'CECILIA GONZALEZ',
    'GUEVARA ENRIQUE LEONARDO':       'LEONARDO GUEVARA',
    'GUZMAN DIEGO NORBERTO':          'GUZMAN DIEGO',
    'JUAREZ LUIS ENRIQUE':            'LUIS JUAREZ',
    'LUJAN LUCAS':                    'LUCAS LUJAN',
    'MARTINEZ PEREZ JORGE LEANDRO':   'MARTINEZ LEANDRO',
    'MOLINA JORGE GABRIEL':           'JORGE MOLINA',
    'OYOLA GASTON AGUSTIN':           'GASTON OYOLA',
    'PALLOTI DUILIO':                 'DUILIO PALLOTTI',
    'RAFAELLI DIEGO DANIEL':          'DIEGO RAFAELLI',
    'RICAPA PAREDES JOSE ANTONIO':    'JOSE RICAPA',
    'ROMANO RODRIGO ERNESTO':         'RODRIGO ROMANO',
    'SUAREZ TOBIAS EMIR':             'SUAREZ EMIR',
    'TALAVERA ADRIAN ISMAEL':         'TALAVERA ADRIAN',
}

# Clasificacion de choferes
CHOFER_TIPO = {
    'GUZMAN DIEGO':          'propio',
    'MAXIMILANO  CARO':      'propio',
    'JOSE RICAPA':           'propio',
    'RODRIGO AVALOS':        'propio',
    'GASTON OYOLA':          'propio',
    'LUCAS LUJAN':           'propio',
    'LUIS JUAREZ':           'propio',
    'JORGE MOLINA':          'propio',
    'DIEGO RAFAELLI':        'propio',
    'SUAREZ EMIR':           'propio',
    'MARTINEZ LEANDRO':      'propio',
    'CECILIA GONZALEZ':      'tercero',
    'BELEN AGUSTIN':         'tercero',
    'LUIS GUIRAO':           'tercero',
    'EZEQUIEL JUNCOS':       'tercero',
    'RODRIGO ROMANO':        'tercero',
    'MAURO IRIARTE':         'tercero',
    'PABLO CANELO':          'tercero',
    'GUSTAVO NIETO':         'tercero',
    'LEONARDO GUEVARA':      'tercero',
    'DUILIO PALLOTTI':       'tercero',
    'MARTIN ROMANO':         'tercero',
    'TALAVERA ADRIAN':       'tercero',
    'ALLENDE ALEJANDRO JAVIER':       'backup',
    'MENDIZABAL FRANCO WENCESLAO':    'backup',
    'BARRIONUEVO SERGIO':             'backup',
    'CHOF A PRUEBA':                  'tercero',
    'CHOF A PRUE 1':                  'tercero',
}

print("\nLeyendo archivos...")

# ── VENTA ACTUAL ──────────────────────────────────────────────────────────────
vc_path = find("venta_actual.xlsx")
if not vc_path:
    print("ERROR: no se encontro venta_actual.xlsx"); sys.exit(1)

vc = pd.read_excel(vc_path)
vc['Importe']    = pd.to_numeric(vc['Importe'],   errors='coerce').fillna(0)
vc['Cantidad']   = pd.to_numeric(vc['Cantidad'],  errors='coerce').fillna(0)
vc['tipo_venta'] = vc['tipo_venta'].fillna('Venta') if 'tipo_venta' in vc.columns else 'Venta'
vc['chofer']     = vc['chofer'].fillna('Sin chofer').str.strip() if 'chofer' in vc.columns else 'Sin chofer'
vc['proveedor']  = vc['proveedor'].fillna('Sin proveedor').str.strip() if 'proveedor' in vc.columns else 'Sin proveedor'
vc['motivodev']  = pd.to_numeric(vc.get('motivodev'), errors='coerce')
vc['Fecha']      = pd.to_datetime(vc['Fecha'], errors='coerce')
vc['fecha_str']  = vc['Fecha'].dt.strftime('%Y-%m-%d')
vc['reparto']    = pd.to_numeric(vc.get('reparto'),  errors='coerce')
vc['camion']     = pd.to_numeric(vc.get('camion'),   errors='coerce').fillna(0)
if 'Comprobante'  not in vc.columns: vc['Comprobante']  = ''
if 'Razon_Social' not in vc.columns: vc['Razon_Social'] = ''
if 'localidad'    not in vc.columns: vc['localidad']    = ''
if 'Direccion'    not in vc.columns: vc['Direccion']    = ''
if 'cod_ven'      not in vc.columns: vc['cod_ven']      = ''
if 'cantxcap'     not in vc.columns: vc['cantxcap']     = 0

# Importe neto = neto (col M) x cantidad (col F)
if 'neto' in vc.columns:
    vc['neto']         = pd.to_numeric(vc['neto'], errors='coerce').fillna(0)
    vc['importe_neto']  = vc['Importe']                 # con signo original
    vc['importe_efect'] = vc['neto'] * vc['Cantidad']  # signed para efectividad
else:
    vc['importe_neto']  = vc['Importe']
    vc['importe_efect'] = vc['Importe']

vc['chofer_up'] = vc['chofer'].str.strip().str.upper()

mes  = int(vc['Fecha'].dt.month.mode()[0])
anio = int(vc['Fecha'].dt.year.mode()[0])
MESES = {1:'Enero',2:'Febrero',3:'Marzo',4:'Abril',5:'Mayo',6:'Junio',
         7:'Julio',8:'Agosto',9:'Septiembre',10:'Octubre',11:'Noviembre',12:'Diciembre'}
PERIODO = f"{MESES.get(mes,'?')} {anio}"
print(f"  Venta actual: {len(vc):,} filas  Periodo: {PERIODO}")

# ── RECHAZOS ──────────────────────────────────────────────────────────────────
dev = vc[vc['tipo_venta']=='Devolucion'].copy()
dev['motivo_desc'] = dev['motivodev'].map(MOTIVO_MAP).fillna('Otro')

comp_cls = vc.groupby('Comprobante')['tipo_venta'].apply(list).reset_index()
comp_cls['all_dev']   = comp_cls['tipo_venta'].apply(lambda ts: all(t=='Devolucion' for t in ts))
comp_cls['has_venta'] = comp_cls['tipo_venta'].apply(lambda ts: 'Venta' in ts)
rej_comps = set(comp_cls[comp_cls['all_dev']]['Comprobante'])

venta_tot   = float(vc[vc['tipo_venta']=='Venta']['Importe'].sum())
all_dev_imp = float(vc[vc['tipo_venta']=='Devolucion']['Importe'].abs().sum())
cam_tot     = float(vc[vc['tipo_venta']=='Cambio']['Importe'].abs().sum())
venta_neta  = venta_tot - all_dev_imp - cam_tot

# Efectividad global: cliente+reparto+proveedor, signed neto precio*cant, excl Cantidad=0
vc_e = vc[vc['Cantidad'] != 0]
cli_rep_prov  = vc_e.groupby(['Cliente','reparto','proveedor'])['importe_efect'].sum()
padron_global = len(cli_rep_prov)
no_e_global   = int((cli_rep_prov <= 0).sum())
fac_global    = padron_global - no_e_global

# Costo de mercaderia vendida (Importe ventas) para % inventario
costo_venta = venta_tot  # Ventas brutas como base para CMV %

rej_kpis = {
    'imp_venta':   round(venta_neta,0),
    'imp_dev':     round(all_dev_imp,0),
    'pct_rechazo': round(abs(all_dev_imp)/venta_tot,4) if venta_tot else 0,
    'cam_imp':     round(abs(cam_tot),0),
    'cam_pct':     round(abs(cam_tot)/venta_tot,4) if venta_tot else 0,
    'fac': fac_global, 'no_e': no_e_global,
    'efect': round(fac_global/padron_global,4) if padron_global else 0
}

bm = dev.groupby('motivo_desc').agg(lineas=('Importe','count'),uds=('Cantidad','sum'),isum=('Importe','sum')).reset_index()
bm['isum'] = bm['isum'].abs()
by_motivo = [{'motivo':r['motivo_desc'],'lineas':int(r['lineas']),'uds':int(abs(r['uds'])),'imp':round(float(r['isum']),0)}
             for _,r in bm.sort_values('isum',ascending=False).iterrows()]

# Motivo por proveedor
motivo_prov = {}
for p in sorted(vc['proveedor'].dropna().str.strip().unique()):
    dev_p = vc[(vc['tipo_venta']=='Devolucion') & (vc['proveedor'].str.strip()==p)].copy()
    dev_p['motivo_desc'] = dev_p['motivodev'].map(MOTIVO_MAP).fillna('Otro')
    bmp = dev_p.groupby('motivo_desc').agg(lineas=('Importe','count'),uds=('Cantidad','sum'),isum=('Importe','sum')).reset_index()
    bmp['isum'] = bmp['isum'].abs()
    motivo_prov[str(p)] = [{'motivo':r['motivo_desc'],'lineas':int(r['lineas']),'uds':int(abs(r['uds'])),'imp':round(float(r['isum']),0)}
                            for _,r in bmp.sort_values('isum',ascending=False).iterrows() if r['isum']>0]

bc = vc[vc['tipo_venta']=='Devolucion'].groupby('chofer').agg(n=('Comprobante','nunique'),imp=('Importe','sum')).reset_index()
bc['imp'] = bc['imp'].abs()
tot_ch = comp_cls.merge(vc[['Comprobante','chofer']].drop_duplicates(),on='Comprobante',how='left')
tot_ch = tot_ch[tot_ch['has_venta']].groupby('chofer').size().reset_index(name='total')
bc = bc.merge(tot_ch,on='chofer',how='left').fillna({'total':0})
bc['pct'] = bc.apply(lambda r: round(r['n']/(r['n']+r['total']),4) if (r['n']+r['total'])>0 else 0, axis=1)
by_chofer = [{'ch':r['chofer'],'n':int(r['n']),'tot':int(r['total']),'imp':round(float(abs(r['imp'])),0),'pct':float(r['pct'])}
             for _,r in bc.sort_values('n',ascending=False).iterrows()]

def prov_met(df_p):
    if df_p.empty: return None
    # Efectividad: cliente+reparto, signed neto precio*cant, excl Cantidad=0
    df_e = df_p[df_p['Cantidad'] != 0]
    cli_rep = df_e.groupby(['Cliente','reparto'])['importe_efect'].sum()
    padron = len(cli_rep); no_e = int((cli_rep <= 0).sum()); f = padron - no_e
    v=float(df_p[df_p['tipo_venta']=='Venta']['Importe'].sum())
    r=float(df_p[df_p['tipo_venta']=='Devolucion']['Importe'].abs().sum())
    c=float(df_p[df_p['tipo_venta']=='Cambio']['Importe'].abs().sum())
    kg=float(pd.to_numeric(df_p[df_p['tipo_venta']=='Venta']['cantxcap'],errors='coerce').fillna(0).clip(0,5000).sum()) if 'cantxcap' in df_p.columns else 0.0
    return {'venta':round(v,0),'rec':round(abs(r),0),'cam':round(abs(c),0),
            'rec_pct':round(abs(r)/v,4) if v else 0,'cam_pct':round(abs(c)/v,4) if v else 0,
            'fac':f,'no_e':no_e,'efect':round(f/padron,4) if padron else 0,'kg':round(kg,1)}

prov_metrics_list = []
chofer_prov_map   = {}
for p in sorted(vc['proveedor'].dropna().str.strip().unique()):
    m = prov_met(vc[vc['proveedor'].str.strip()==p])
    if m and m['venta']>0: prov_metrics_list.append({'prov':str(p),**m})
for ch, df_ch in vc.groupby('chofer'):
    chofer_prov_map[str(ch).strip()] = []
    for p, df_cp in df_ch.groupby('proveedor'):
        m = prov_met(df_cp.reset_index(drop=True))
        if m and m['venta']>0: chofer_prov_map[str(ch).strip()].append({'prov':str(p).strip(),**m})

# ── DETALLE CLIENTES RECHAZADOS POR CHOFER ────────────────────────────────────
# Para cada chofer: lista de clientes con devoluciones, ordenada por importe desc
# Incluye: cliente, razon_social, direccion, importe, motivo, proveedor
app_clientes = set()  # populated after app_path is defined below

ch_det_map = {}  # built after conciliacion
app_ges_keys = set()  # built after conciliacion

print(f"  Rechazos: {len(rej_comps)} comp. rechazados, {len(by_motivo)} motivos")

# ── RUTAS ─────────────────────────────────────────────────────────────────────
route_index = []; client_map = {}
for rep_id, grp in vc.groupby('reparto'):
    if pd.isna(rep_id): continue
    ch   = str(grp['chofer'].iloc[0]).strip()
    fec  = grp['fecha_str'].iloc[0]
    cam  = si(grp['camion'].iloc[0])
    vgrp = grp[grp['tipo_venta']=='Venta']
    tot  = float(vgrp['Importe'].sum())
    pep  = float(vgrp[vgrp['proveedor']==PEPSICO]['Importe'].sum())
    mol  = float(vgrp[vgrp['proveedor']==MOLINOS]['Importe'].sum())
    sof  = float(vgrp[vgrp['proveedor']==SOFTYS]['Importe'].sum())
    oth  = tot - pep - mol - sof
    kg_tot = float(pd.to_numeric(vgrp['cantxcap'],errors='coerce').fillna(0).clip(0,5000).sum())
    # Rechazo total: cliente sin venta en este reparto
    # Rechazo total: unique (cliente+proveedor) con neto signed <= 0, excl cant=0
    grp_e = grp[grp['Cantidad'] != 0]
    cli_prov_neto = grp_e.groupby(['Cliente','proveedor'])['importe_efect'].sum()
    rej = int((cli_prov_neto <= 0).sum())
    clientes = []
    for cli_id, cg in grp.groupby('Cliente'):
        tipos = list(cg['tipo_venta'].fillna('Venta'))
        # Rechazo total: neto signed (excl cant=0) <= 0 para este proveedor en reparto
        cg_e = cg[cg['Cantidad'] != 0]
        neto_signed = float(cg_e['importe_efect'].sum())
        rt = neto_signed <= 0
        dv = 'Devolucion' in tipos and not rt
        cm2= 'Cambio' in tipos
        imp = int(cg[cg['tipo_venta']=='Venta']['Importe'].sum())
        cnt = int(cg[cg['tipo_venta']=='Venta']['Cantidad'].sum())
        raz = str(cg['Razon_Social'].iloc[0] or '')[:40]
        dir2= str(cg['Direccion'].iloc[0] or '')[:40]
        loc = str(cg['localidad'].iloc[0] or '')[:22]
        cmp = str(cg['Comprobante'].iloc[0] or '')
        fl  = 1 if rt else(2 if dv else(3 if cm2 else 0))
        clientes.append([si(cli_id),raz,dir2,loc,cmp,imp,cnt,fl])
    ch_tipo = CHOFER_TIPO.get(ch.strip().upper(), CHOFER_TIPO.get(ch.strip(), 'tercero'))
    route_index.append({'rep':si(rep_id),'ch':ch,'f':str(fec),'cam':cam,
        'n':len(clientes),'tot':round(tot,0),'rej':rej,'kg':round(kg_tot,1),
        'pep':round(pep,0),'mol':round(mol,0),'sof':round(sof,0),'oth':round(oth,0),
        'tipo':ch_tipo})
    client_map[str(si(rep_id))]=clientes
route_index.sort(key=lambda x:(x['f'],x['ch']))
print(f"  Rutas: {len(route_index)} repartos")

venta_list=[]
for ch, df_ch in vc.groupby('chofer'):
    bol=df_ch.groupby('Comprobante')['tipo_venta'].apply(list).reset_index()
    bol['ne']=bol['tipo_venta'].apply(lambda ts:all(t=='Devolucion' for t in ts))
    e=int((~bol['ne']).sum()); ne=int(bol['ne'].sum())
    dev_ch=df_ch[df_ch['tipo_venta']=='Devolucion']
    rp=dev_ch.groupby('proveedor').agg(n=('importe_neto','count'),imp=('importe_neto','sum')).reset_index()
    cam_ch=df_ch[df_ch['tipo_venta']=='Cambio']
    ip=cam_ch.groupby('proveedor').agg(n=('importe_neto','count'),imp=('importe_neto','sum')).reset_index()
    ven_ch=df_ch[df_ch['tipo_venta']=='Venta']
    vp=ven_ch.groupby('proveedor').agg(imp=('Importe','sum')).reset_index()
    # Pepsico specific metrics
    pep_ch = df_ch[df_ch['proveedor'].str.strip()==PEPSICO]
    pep_bol = pep_ch.groupby('Comprobante')['tipo_venta'].apply(list).reset_index()
    pep_bol['ne'] = pep_bol['tipo_venta'].apply(lambda ts: all(t=='Devolucion' for t in ts))
    pep_e  = int((~pep_bol['ne']).sum())
    pep_ne = int(pep_bol['ne'].sum())
    pep_vta = float(pep_ch[pep_ch['tipo_venta']=='Venta']['Importe'].sum())
    pep_dev = float(abs(pep_ch[pep_ch['tipo_venta']=='Devolucion']['Importe'].sum()))
    pep_cam = float(abs(pep_ch[pep_ch['tipo_venta']=='Cambio']['Importe'].sum()))
    venta_list.append({'ch':str(ch),'e':e,'ne':ne,
        'rp':{r['proveedor']:{'n':int(r['n']),'imp':round(float(abs(r['imp'])),0)} for _,r in rp.iterrows()},
        'ip':{r['proveedor']:{'n':int(r['n']),'imp':round(float(abs(r['imp'])),0)} for _,r in ip.iterrows()},
        'vp':{r['proveedor']:round(float(r['imp']),0) for _,r in vp.iterrows()},
        'pep':{'vta':round(pep_vta,0),'dev':round(pep_dev,0),'cam':round(pep_cam,0),
               'e':pep_e,'ne':pep_ne,
               'pct_dev':round(pep_dev/pep_vta*100,2) if pep_vta else 0,
               'pct_cam':round(pep_cam/pep_vta*100,2) if pep_vta else 0,
               'efect':round(pep_e/(pep_e+pep_ne)*100,1) if (pep_e+pep_ne) else 0}})

# ── REINCIDENTES ──────────────────────────────────────────────────────────────
comp_cls2 = vc.groupby('Comprobante')['tipo_venta'].apply(list).reset_index()
comp_cls2['all_dev'] = comp_cls2['tipo_venta'].apply(lambda ts: all(t=='Devolucion' for t in ts))
rej_comps2 = set(comp_cls2[comp_cls2['all_dev']]['Comprobante'])
rej_cli = (vc[vc['Comprobante'].isin(rej_comps2)]
           .groupby('Cliente')
           .agg(n=('Comprobante','nunique'),
                razon=('Razon_Social','first'),
                loc=('localidad','first'),
                imp=('Importe','sum'),
                vendedor=('cod_ven','first'),
                choferes=('chofer', lambda x: ', '.join(sorted(set(str(v) for v in x))[:3])),
                fechas=('fecha_str', lambda x: ', '.join(sorted(set(str(v) for v in x))[:5])))
           .reset_index())
# Proveedores con mayor rechazo por cliente
rej_prov_cli = (vc[vc['Comprobante'].isin(rej_comps2)]
                .groupby(['Cliente','proveedor'])['importe_neto'].sum().abs()
                .reset_index().sort_values('importe_neto',ascending=False))
prov_por_cli = {}
for cli, grp in rej_prov_cli.groupby('Cliente'):
    prov_por_cli[int(cli)] = [{'prov':str(r['proveedor']),'imp':round(float(r['importe_neto']),0)}
                               for _,r in grp.head(3).iterrows()]

reinc_list = [{'cid':int(r['Cliente']),'razon':str(r['razon'])[:35],
               'loc':str(r['loc'])[:22] if r['loc'] else '',
               'n':int(r['n']),'imp':round(float(abs(r['imp'])),0),
               'vendedor':str(int(r['vendedor'])) if pd.notna(r.get('vendedor')) and r.get('vendedor') != '' else '-',
               'choferes':str(r['choferes'])[:40],'fechas':str(r['fechas']),
               'provs': prov_por_cli.get(int(r['Cliente']),[]) }
              for _,r in rej_cli[rej_cli['n']>1].sort_values('n',ascending=False).head(50).iterrows()]

# ── CARTONES ──────────────────────────────────────────────────────────────────
cart_records = []
cart_path = find("cartones.xlsx")
if cart_path:
    try:
        cart = pd.read_excel(cart_path)
        if 'FechaSalidaCamion' in cart.columns:
            cart['FechaSalidaCamion'] = pd.to_datetime(cart['FechaSalidaCamion'])
            cart['fecha_str'] = cart['FechaSalidaCamion'].dt.strftime('%Y-%m-%d')
            cart['semana']    = cart['FechaSalidaCamion'].dt.isocalendar().week.astype(int)
            for _,r in cart.iterrows():
                bs=si(r.get('cajasret',0)); bi=si(r.get('cajasretdev',0))
                cart_records.append({'chofer':str(r.get('razon_social','')).strip(),
                    'fecha':str(r['fecha_str']),'semana':int(r['semana']),
                    'b_sal':bs,'b_ing':bi,'retorno':round(bi/bs,4) if bs>0 else 0})
        print(f"  Cartones: {len(cart_records)} registros")
    except Exception as e:
        print(f"  Cartones: error {e}")
else:
    print("  Cartones: no encontrado (opcional)")

# ── APP RECHAZOS + CONCILIACION ───────────────────────────────────────────────
app_records = []
conc_data   = {'app_ges':[],'app_only':[],'ges_only':[],'kpis':{},'rank_ch':[],'rank_vend':[]}
app_path = find("Registro_de_Rechazos.xlsx")
# Build app_clientes set for ch_det_map cross-reference
if app_path:
    try:
        _app_tmp = pd.read_excel(app_path)
        def _cli_str(v):
            try: return str(int(float(v)))
            except: return str(v).strip()
        _app_tmp['_clistr'] = _app_tmp['CLIENTE'].apply(_cli_str)
        app_clientes = set(_app_tmp['_clistr'].unique())
    except: pass
if app_path:
    try:
        app = pd.read_excel(app_path)
        app['Fecha']      = pd.to_datetime(app['Fecha'], errors='coerce')
        app['fecha_str']  = app['Fecha'].dt.strftime('%Y-%m-%d')
        app['chofer_norm']= app['Chofer'].str.strip().str.upper()
        app['chofer_ges'] = app['chofer_norm'].map(CHOFER_MAP).fillna(app['chofer_norm'])
        for _,r in app.iterrows():
            app_records.append({
                'id':      str(r.get('ID','')),
                'fecha':   str(r['fecha_str']),
                'chofer':  str(r['chofer_ges']),
                'cliente': str(r.get('CLIENTE','')) if pd.notna(r.get('CLIENTE')) else '',
                'vendedor':str(r.get('Vendedor','')),
                'motivo':  str(r.get('Motivo','')),
                'obs':     str(r.get('Observacion','')) if pd.notna(r.get('Observacion')) else '',
                'foto':    str(r.get('Foto','')) if pd.notna(r.get('Foto')) else '',
                'resp':    str(r.get('Respuesta Vendedor','')) if pd.notna(r.get('Respuesta Vendedor')) else '',
                'estado':  str(r.get('Estado','')),
            })
        print(f"  App rechazos: {len(app_records)} registros")

        from datetime import timedelta as _td

        def add_biz_days(d, days):
            added = 0
            while added < days:
                d += _td(days=1)
                if d.weekday() != 6:  # skip sunday
                    added += 1
            return d

        # ── Armar mapa GESCOM: clave = (cliente, fecha) → acumula imp, razon, chofer, vendedor
        ges_dev = vc[vc['tipo_venta']=='Devolucion'].copy()
        ges_map = {}  # (cliente, fecha_date) → dict
        for _, r in ges_dev.iterrows():
            if not pd.notna(r['Fecha']): continue
            cli = str(r['Cliente']).strip()
            fec = r['Fecha'].date()
            key = (cli, fec)
            if key not in ges_map:
                ges_map[key] = {
                    'imp': 0, 'razon': str(r.get('Razon_Social','')).strip()[:40],
                    'chofer': str(r['chofer']).strip(), 'fecha': str(r['fecha_str']),
                    'vendedor': str(r.get('vendedor','')).strip(),
                }
            ges_map[key]['imp'] += abs(float(r['Importe']))

        # Índice GESCOM por cliente para búsqueda rápida
        ges_por_cliente = {}
        for (cli, fec), g in ges_map.items():
            if cli not in ges_por_cliente:
                ges_por_cliente[cli] = []
            ges_por_cliente[cli].append((fec, (cli, fec)))

        # ── Armar mapa APP: clave = (cliente, fecha_app) → agrupa registros del mismo día
        app_valid = app[app['CLIENTE'].notna() & (app['CLIENTE'].astype(str).str.strip()!='')].copy()
        app_valid['cliente_str'] = app_valid['CLIENTE'].astype(str).str.strip()

        app_map = {}
        for _, row in app_valid.iterrows():
            cli = str(row['cliente_str'])
            fec = row['Fecha'].date() if pd.notna(row['Fecha']) else None
            if not fec: continue
            key = (cli, fec)
            if key not in app_map:
                app_map[key] = {
                    'cliente': cli, 'fecha': str(fec),
                    'choferes': set(), 'vendedores': set(), 'motivos': set(),
                    'resps': [], 'estados': set(), 'n': 0,
                }
            r = app_map[key]
            r['n'] += 1
            r['choferes'].add(str(row['chofer_ges']))
            r['vendedores'].add(str(row.get('Vendedor','')))
            r['motivos'].add(str(row.get('Motivo','')))
            resp = str(row.get('Respuesta Vendedor','')) if pd.notna(row.get('Respuesta Vendedor')) else ''
            r['resps'].append(resp)
            r['estados'].add(str(row.get('Estado','')))

        # ── Conciliación: Fecha App dentro de ventana [Fecha GESCOM, Fecha GESCOM +2 días hábiles]
        matched_ges_keys = set()

        for (cli, fec_app), a in app_map.items():
            chofer   = ' / '.join(x for x in a['choferes'] if x)
            vendedor = ' / '.join(x for x in a['vendedores'] if x)
            motivo   = ' / '.join(x for x in a['motivos'] if x)
            resp     = ' / '.join(x for x in a['resps'] if x)
            tiene_resp = any(x.strip() for x in a['resps'])
            rec = {
                'cliente': cli, 'fecha': str(fec_app),
                'chofer': chofer, 'vendedor': vendedor,
                'motivo': motivo, 'resp': resp,
                'estado': ' / '.join(x for x in a['estados'] if x),
                'razon': '',
            }

            # Buscar en GESCOM: fecha_app dentro de [fecha_ges-1biz, fecha_ges+2biz]
            found_key = None
            for (fec_ges, gkey) in sorted(ges_por_cliente.get(cli, []), key=lambda x: x[0]):
                if gkey in matched_ges_keys: continue
                limite_sup = add_biz_days(fec_ges, 2)
                limite_inf = fec_ges - _td(days=2)  # -1 dia habil aprox
                if limite_inf <= fec_app <= limite_sup:
                    found_key = gkey
                    break

            if found_key:
                matched_ges_keys.add(found_key)
                g = ges_map[found_key]
                conc_data['app_ges'].append({
                    **rec, 'imp': round(g['imp'], 0),
                    'razon': g['razon'], 'fecha_ges': g['fecha'],
                    'tiene_resp': tiene_resp,
                })
            else:
                conc_data['app_only'].append({**rec, 'imp': 0, 'fecha_ges': '', 'tiene_resp': tiene_resp})

        for gkey, g in ges_map.items():
            if gkey not in matched_ges_keys:
                conc_data['ges_only'].append({
                    'cliente': gkey[0], 'fecha': g['fecha'], 'fecha_ges': g['fecha'],
                    'razon': g['razon'], 'chofer': g['chofer'],
                    'vendedor': g['vendedor'], 'imp': round(g['imp'], 0),
                    'resp': '', 'motivo': '', 'estado': 'NO INFORMADO EN APP',
                })

        # ── Rankings
        # Ranking choferes: GESCOM sin App, por cantidad desc
        ch_rank = {}
        for r in conc_data['ges_only']:
            ch = r['chofer']
            if ch not in ch_rank:
                ch_rank[ch] = {'chofer': ch, 'tipo': CHOFER_TIPO.get(ch.strip(), 'tercero'), 'n': 0, 'imp': 0}
            ch_rank[ch]['n'] += 1
            ch_rank[ch]['imp'] += r['imp']
        conc_data['rank_ch'] = sorted(ch_rank.values(), key=lambda x: -x['n'])

        # Ranking vendedores: de app_ges (rechazos recibidos), con/sin respuesta
        vend_rank = {}
        for r in conc_data['app_ges'] + conc_data['app_only']:
            vend = r.get('vendedor','') or 'Sin dato'
            if vend not in vend_rank:
                vend_rank[vend] = {'vendedor': vend, 'total': 0, 'con_resp': 0, 'sin_resp': 0}
            vend_rank[vend]['total'] += 1
            if r.get('tiene_resp'):
                vend_rank[vend]['con_resp'] += 1
            else:
                vend_rank[vend]['sin_resp'] += 1
        for v in vend_rank.values():
            v['pct_sin_resp'] = round(v['sin_resp'] / v['total'] * 100, 1) if v['total'] else 0
        conc_data['rank_vend'] = sorted(vend_rank.values(), key=lambda x: -x['sin_resp'])

        with_resp  = sum(1 for r in conc_data['app_ges'] if r.get('tiene_resp'))
        sin_resp   = sum(1 for r in conc_data['app_ges'] if not r.get('tiene_resp'))
        total_app  = len(app_map)
        pct_saved  = round(len(conc_data['app_only']) / total_app * 100, 1) if total_app else 0
        conc_data['kpis'] = {
            'app_ges':       len(conc_data['app_ges']),
            'app_only':      len(conc_data['app_only']),
            'ges_only':      len(conc_data['ges_only']),
            'imp_app_ges':   round(sum(r['imp'] for r in conc_data['app_ges']), 0),
            'imp_ges_only':  round(sum(r['imp'] for r in conc_data['ges_only']), 0),
            'with_resp': with_resp, 'sin_resp': sin_resp,
            'pct_saved': pct_saved, 'total_app': total_app,
        }
        print(f"  Conciliacion: {len(conc_data['app_ges'])} app+ges, {len(conc_data['app_only'])} solo app, {len(conc_data['ges_only'])} solo ges")

        # Build app_ges_keys and ch_det_map after conciliacion
        for r in conc_data.get('app_ges', []):
            try: app_ges_keys.add(str(int(float(r['cliente']))))
            except: app_ges_keys.add(str(r['cliente']).strip())
        dev_df = vc[vc['tipo_venta']=='Devolucion'].copy()
        dev_df['cli_str'] = dev_df['Cliente'].apply(lambda v: str(int(float(v))) if pd.notna(v) else '')
        for ch, df_ch in dev_df.groupby('chofer'):
            det = []
            for (cli, prov), g in df_ch.groupby(['cli_str', 'proveedor']):
                imp = float(abs(g['Importe'].sum()))
                if imp == 0: continue
                razon = str(g['Razon_Social'].iloc[0]).strip() if 'Razon_Social' in g.columns else ''
                direc = str(g['Direccion'].iloc[0]).strip() if 'Direccion' in g.columns else ''
                motivo_val = g['motivodev'].iloc[0] if 'motivodev' in g.columns and pd.notna(g['motivodev'].iloc[0]) else None
                motivo = MOTIVO_MAP.get(float(motivo_val), str(motivo_val) if motivo_val else '')[:30] if motivo_val is not None else ''
                det.append({
                    'cli': cli, 'razon': razon[:40], 'dir': direc[:40],
                    'prov': str(prov).strip()[:30], 'imp': round(imp, 0),
                    'motivo': motivo[:30], 'app': 1 if cli in app_ges_keys else 0
                })
            det.sort(key=lambda x: -x['imp'])
            if det: ch_det_map[str(ch).strip()] = det
    except Exception as e:
        import traceback; traceback.print_exc()
        print(f"  App rechazos: error {e}")
else:
    print("  App rechazos: no encontrado (opcional)")

# ── DEPOSITO ──────────────────────────────────────────────────────────────────
dep_data = {'faltante':[],'sobrante':[],'roturas':[],'consumo':[],'vencido':[],'kpis':{},'compensaciones':[]}
mov_path = find("movimientos.xlsx")
if mov_path:
    try:
        mov = pd.read_excel(mov_path)
        art_prov = dict(zip(vc['Art'].dropna().astype(int), vc['proveedor'])) if 'Art' in vc.columns else {}
        def get_prov(code):
            try: return art_prov.get(int(code),'Sin proveedor')
            except: return 'Sin proveedor'
        fecha_col = next((c for c in ['stockmov_fecha','fecha','Fecha'] if c in mov.columns), None)
        periodo_label = ''
        if fecha_col:
            fechas = pd.to_datetime(mov[fecha_col], errors='coerce').dropna()
            if len(fechas): periodo_label = f"{fechas.min().strftime('%d/%m')}-{fechas.max().strftime('%d/%m/%Y')}"
        def mov_rows(df_m):
            rows=[]
            for _,r in df_m.iterrows():
                u=abs(sf(r.get('stockmov_cantidad',r.get('cantidad',0))))
                cu=sf(r.get('costo',0))
                pv=get_prov(r.get('articulo_codigo',r.get('codigo',0)))
                tot=round(u*cu,2)
                pct=round(tot/costo_venta*100,4) if costo_venta else 0
                rows.append({'desc':str(r.get('descripcion',''))[:50],'prov':pv,
                              'u':int(u),'cu':round(cu,2),'tot':tot,'pct':pct,'fecha':periodo_label})
            return rows
        tipo_col = 'stockmov_tipo' if 'stockmov_tipo' in mov.columns else 'tipo'
        dep_col  = 'deposito_nombre' if 'deposito_nombre' in mov.columns else None
        tra = mov[mov[tipo_col]=='TRA'].copy() if dep_col else pd.DataFrame()
        if dep_col and len(tra):
            rot  = tra[tra[dep_col].astype(str).str.lower().str.contains('roturas deposito', na=False)]
            cons = tra[tra[dep_col].astype(str).str.lower().str.contains('consumo', na=False)]
            venc = tra[tra[dep_col].astype(str).str.lower().str.contains('vencido', na=False)]
            dep_data['roturas'] = mov_rows(rot)
            dep_data['consumo'] = mov_rows(cons)
            dep_data['vencido'] = mov_rows(venc)
        # Merma: MAN + CON neteados por articulo
        merma_tipos = [t for t in ['MAN','CON'] if t in mov[tipo_col].values]
        if merma_tipos:
            mer = mov[mov[tipo_col].isin(merma_tipos)].copy()
            mer['prov'] = mer['articulo_codigo'].apply(get_prov) if 'articulo_codigo' in mer.columns else 'Sin proveedor'
            mer_net = mer.groupby(['descripcion','prov']).agg(
                neto=('stockmov_cantidad','sum'), cu=('costo','first')).reset_index()
            mer_net = mer_net[mer_net['cu']>0].copy()
            mer_net['tot'] = mer_net['neto'] * mer_net['cu']
            con_neg = mer_net[mer_net['neto']<0].copy(); con_neg['u'] = con_neg['neto'].abs()
            con_pos = mer_net[mer_net['neto']>0].copy(); con_pos['u'] = con_pos['neto']
            dep_data['faltante']=[{'desc':str(r['descripcion'])[:50],'prov':str(r['prov']),
                'u':int(r['u']),'cu':round(float(r['cu']),2),'tot':round(float(r['u']*r['cu']),2),
                'fecha':periodo_label,'pct':round(float(r['u']*r['cu'])/costo_venta*100,4) if costo_venta else 0}
                for _,r in con_neg.sort_values('tot').iterrows()]
            dep_data['sobrante']=[{'desc':str(r['descripcion'])[:50],'prov':str(r['prov']),
                'u':int(r['u']),'cu':round(float(r['cu']),2),'tot':round(float(r['u']*r['cu']),2),
                'fecha':periodo_label,'pct':round(float(r['u']*r['cu'])/costo_venta*100,4) if costo_venta else 0}
                for _,r in con_pos.sort_values('tot',ascending=False).iterrows()]
            # Compensaciones: faltantes que tienen sobrante del mismo tipo de producto
            comp_list = []
            for _,fneg in con_neg.iterrows():
                words_f = set(str(fneg['descripcion']).lower().split()[:2])
                for _,fpos in con_pos.iterrows():
                    words_p = set(str(fpos['descripcion']).lower().split()[:2])
                    if len(words_f & words_p) >= 2:
                        comp_list.append({
                            'falt': str(fneg['descripcion'])[:40],
                            'sobr': str(fpos['descripcion'])[:40],
                            'u_f': int(abs(fneg['neto'])), 'u_s': int(fpos['neto']),
                            'tot_f': round(float(fneg['tot']),0),
                            'tot_s': round(float(fpos['tot']),0)
                        })
            # Deduplicate
            seen = set()
            comp_dedup = []
            for c in comp_list:
                k = c['falt']+'|'+c['sobr']
                if k not in seen:
                    seen.add(k); comp_dedup.append(c)
            dep_data['compensaciones'] = comp_dedup[:30]
        tot_rot=sum(r['tot'] for r in dep_data['roturas'])
        tot_cons=sum(r['tot'] for r in dep_data['consumo'])
        tot_venc=sum(r['tot'] for r in dep_data['vencido'])
        tot_falt=sum(r['tot'] for r in dep_data['faltante'])
        tot_sobr=sum(r['tot'] for r in dep_data['sobrante'])
        dep_data['kpis']={
            'cmv':      round(costo_venta,0),
            'pct_rot':  round(tot_rot/costo_venta*100,4) if costo_venta else 0,
            'pct_cons': round(tot_cons/costo_venta*100,4) if costo_venta else 0,
            'pct_venc': round(tot_venc/costo_venta*100,4) if costo_venta else 0,
            'pct_merma':round((tot_falt-tot_sobr)/costo_venta*100,4) if costo_venta else 0,
            'tot_rot':  round(tot_rot,0),
            'tot_cons': round(tot_cons,0),
            'tot_venc': round(tot_venc,0),
            'tot_falt': round(tot_falt,0),
            'tot_sobr': round(tot_sobr,0),
        }
        print(f"  Deposito: {len(dep_data['faltante'])} falt, {len(dep_data['sobrante'])} sobr, {len(dep_data['roturas'])} rot, {len(dep_data['consumo'])} cons, {len(dep_data['vencido'])} venc")
    except Exception as e:
        print(f"  Deposito: error {e}")
else:
    print("  Movimientos: no encontrado (opcional)")

# ── COMISIONES TERCEROS ───────────────────────────────────────────────────────
# Lógica: por reparto. Se toma el % MÁS ALTO de todas las localidades del
# reparto y se aplica sobre el neto total del reparto (venta - dev - cambios).
# Excepciones fijas: TALAVERA ADRIAN 3%, vendedor 30 → 4%, vendedor 31 → 4%.
com_data = {'resumen': [], 'repartos': [], 'periodo': PERIODO}
com_path = find("comisiones.xlsx")
if com_path:
    try:
        com_tbl = pd.read_excel(com_path, header=0)
        # Use columns E-F (index 4,5) which have the updated rates
        tbl = com_tbl.iloc[:, [4, 5]].copy()
        tbl.columns = ['LOCALIDAD', 'PCT']
        tbl = tbl.dropna(subset=['LOCALIDAD'])
        tbl['LOCALIDAD'] = tbl['LOCALIDAD'].astype(str).str.strip().str.upper()
        tbl = tbl[tbl['PCT'].notna() & (tbl['LOCALIDAD'] != 'LOCALIDAD') & (tbl['LOCALIDAD'] != 'NAN')]
        loc_pct = dict(zip(tbl['LOCALIDAD'], tbl['PCT'].astype(float)))

        def _pct_por_loc(loc_raw, chofer, cod_ven):
            # Reglas fijas por chofer/vendedor
            if str(chofer).strip() == 'TALAVERA ADRIAN': return 0.05
            try:
                cod = int(cod_ven)
                if cod == 30: return 0.04
                if cod == 31: return 0.04
            except: pass
            # Por localidad
            loc = str(loc_raw).strip().upper() if loc_raw and str(loc_raw) != 'nan' else ''
            if 'DESPE' in loc and ('ADERO' in loc or '\u00d1' in loc): return 0.055
            if 'MALAGUE' in loc: return 0.050
            if 'U PORA' in loc: return 0.060
            std = LOC_MAP_COM.get(loc, loc)
            return loc_pct.get(std, None)

        vc_ter = vc[vc['chofer'].str.strip().isin(TERCEROS_LIST)].copy()
        vc_ter['_signo'] = vc_ter['tipo_venta'].map({'Venta':1,'Devolucion':-1,'Cambio':-1}).fillna(1)
        vc_ter['_imp_neto'] = vc_ter['Importe'] * vc_ter['_signo']

        repartos_com = []
        for (rep_id, chofer), g in vc_ter.groupby(['reparto','chofer']):
            if pd.isna(rep_id): continue
            vta  = float(g[g['tipo_venta']=='Venta']['Importe'].sum())
            dev  = float(g[g['tipo_venta']=='Devolucion']['Importe'].sum())
            cam  = float(g[g['tipo_venta']=='Cambio']['Importe'].sum())
            neto = vta + dev + cam  # dev y cam ya son negativos en Importe
            # Pct máximo de las localidades del reparto
            cod_ven = g['cod_ven'].iloc[0]
            pcts_map = {loc: _pct_por_loc(loc, chofer, cod_ven)
                        for loc in g['localidad'].dropna().unique()}
            pcts_map = {k: v for k, v in pcts_map.items() if v is not None}
            pct_max = max(pcts_map.values()) if pcts_map else 0.0
            comision = round(neto * pct_max)
            # Solo mostrar la localidad que determinó el % máximo
            loc_max = max(pcts_map, key=pcts_map.get) if pcts_map else ''
            locs = str(loc_max).strip()
            fecha = str(g['fecha_str'].iloc[0]) if 'fecha_str' in g.columns else ''
            repartos_com.append({
                'rep':     int(rep_id),
                'chofer':  str(chofer).strip(),
                'fecha':   fecha,
                'localidades': locs,
                'pct':     round(pct_max * 100, 1),
                'venta_bruta': round(vta),
                'devoluciones': round(dev),
                'cambios': round(cam),
                'neto':    round(neto),
                'comision': comision,
            })

        # Resumen por chofer
        resumen_map = {}
        for r in repartos_com:
            ch = r['chofer']
            if ch not in resumen_map:
                resumen_map[ch] = {'chofer':ch,'venta_bruta':0,'devoluciones':0,'cambios':0,'neto':0,'comision':0,'repartos':0}
            resumen_map[ch]['venta_bruta']  += r['venta_bruta']
            resumen_map[ch]['devoluciones'] += r['devoluciones']
            resumen_map[ch]['cambios']      += r['cambios']
            resumen_map[ch]['neto']         += r['neto']
            resumen_map[ch]['comision']     += r['comision']
            resumen_map[ch]['repartos']     += 1

        for ch in resumen_map:
            n = resumen_map[ch]['neto']
            c = resumen_map[ch]['comision']
            resumen_map[ch]['pct_efectivo'] = round(c/n*100, 2) if n else 0

        com_data['resumen']  = sorted(resumen_map.values(), key=lambda x: -x['comision'])
        com_data['repartos'] = sorted(repartos_com, key=lambda x: (x['chofer'], x['fecha']))
        print(f"  Comisiones: {len(com_data['resumen'])} choferes, {len(com_data['repartos'])} repartos")

        # ── COMISION RETIRADA (comision_chofer.xlsx) ──────────────────────────
        NOMBRE_COM_MAP = {
            'JUNCOS LUIS EZEQUIEL':       'EZEQUIEL JUNCOS',
            'BELEN EMILIANO AGUSTIN':     'BELEN AGUSTIN',
            'GONZALEZ CECILIA GUADALUPE': 'CECILIA GONZALEZ',
            'GUIRAO LUIS ANTONIO':        'LUIS GUIRAO',
            'ROMANO RODRIGO ERNESTO':     'RODRIGO ROMANO',
            'IRIARTE MAURO ALEJANDRO':    'MAURO IRIARTE',
            'CANELO PABLO FERNANDO':      'PABLO CANELO',
            'NIETO GUSTAVO ATILIO':       'GUSTAVO NIETO',
            'GUEVARA ENRIQUE LEONARDO':   'LEONARDO GUEVARA',
            'PALLOTI DUILIO':             'DUILIO PALLOTTI',
            'ADRIAN ISMAEL TALAVERA':     'TALAVERA ADRIAN',
            'ALLENDE ALEJANDRO JAVIER':   'ALLENDE ALEJANDRO JAVIER',
        }
        ret_path = find("comision_chofer.xlsx")
        if ret_path:
            try:
                ret_df = pd.read_excel(ret_path)
                ret_df['chofer_norm'] = ret_df['razon_social'].map(NOMBRE_COM_MAP)
                ret_df['fecha_str']   = pd.to_datetime(ret_df['compra_fecha'], errors='coerce').dt.strftime('%Y-%m-%d')
                # Total retirado por chofer
                ret_tot = ret_df.groupby('chofer_norm')['neto'].sum().to_dict()
                # Detalle por chofer+reparto (match exacto)
                ret_det_rep = {}
                for _, row in ret_df[ret_df['chofer_norm'].notna()].iterrows():
                    ch_n = row['chofer_norm']
                    rep  = row['reparto']
                    if pd.isna(rep): continue
                    rep_key = str(int(float(rep)))
                    if ch_n not in ret_det_rep:
                        ret_det_rep[ch_n] = {}
                    ret_det_rep[ch_n][rep_key] = round(float(row['neto']), 0)
                # Enrich resumen
                for r in com_data['resumen']:
                    ch = r['chofer']
                    retirado = round(float(ret_tot.get(ch, 0)), 0)
                    r['retirado']   = retirado
                    r['diferencia'] = round(r['comision'] - retirado, 0)
                # Enrich repartos with withdrawal by reparto number
                for r in com_data['repartos']:
                    ch  = r['chofer']
                    rep = str(int(r.get('rep', 0))) if r.get('rep') else ''
                    r['retirado_dia'] = ret_det_rep.get(ch, {}).get(rep, 0)
                com_data['ret_det'] = {ch: list(v.items()) for ch, v in ret_det_rep.items()}
                print(f"  Comisiones retiradas: {len(ret_tot)} choferes")
            except Exception as e:
                print(f"  Comisiones retiradas: error {e}")
    except Exception as e:
        print(f"  Comisiones: error {e}")
else:
    print("  Comisiones: comisiones.xlsx no encontrado (opcional)")

# ── SERIALIZAR ────────────────────────────────────────────────────────────────
print("\nSerializando...")
print(f"  Reincidentes: {len(reinc_list)}")

conc_js = 'var D_CONC=' + json.dumps(conc_data, ensure_ascii=True, separators=(',',':')) + ';'

DATA_JS = '\n'.join([
    make_chunks('D_KPIS',   rej_kpis),
    make_chunks('D_MOTIVO', by_motivo),
    make_chunks('D_MOTIVO_PROV', motivo_prov),
    make_chunks('D_CHOFER', by_chofer),
    make_chunks('D_PROV',   prov_metrics_list),
    make_chunks('D_CHPROV', chofer_prov_map),
    make_chunks('D_CH_DET', ch_det_map),
    make_chunks('D_VENTA',  venta_list),
    make_chunks('D_ROUTES', route_index),
    make_chunks('D_CLI',    client_map),
    f"var D_PERIODO={json.dumps(PERIODO)};",
    f"var D_PROVS={json.dumps(sorted(vc['proveedor'].dropna().str.strip().unique().tolist()),ensure_ascii=True,separators=(',',':'))};",
    f"var D_CHS={json.dumps(sorted(vc['chofer'].dropna().str.strip().unique().tolist()),ensure_ascii=True,separators=(',',':'))};",
    f"var D_CH_TIPOS={json.dumps({ch:CHOFER_TIPO.get(ch.strip(),CHOFER_TIPO.get(ch,'tercero')) for ch in vc['chofer'].dropna().str.strip().unique()},ensure_ascii=True,separators=(',',':'))};",
    make_chunks('D_CART',   cart_records),
    make_chunks('D_APP',    app_records),
    conc_js,
    f"var D_DEP={json.dumps(dep_data,ensure_ascii=True,separators=(',',':'))};",
    f"var D_REINC={json.dumps(reinc_list,ensure_ascii=True,separators=(',',':'))};",
    f"var D_COM={json.dumps(com_data,ensure_ascii=True,separators=(',',':'))};",
])

# ── HISTORIAL MULTI-MES (datos completos por mes) ────────────────────────────
def _procesar_mes(dir_path, label):
    """Procesa un mes completo y retorna todos los datos necesarios para el dashboard."""
    import importlib, sys
    try:
        vp = find("venta_actual.xlsx", dir_path)
        if not vp: return None
        print(f"  Procesando historial: {label}...")
        v = pd.read_excel(vp)
        v['tipo_venta'] = v.get('tipo_venta', pd.Series(['Venta']*len(v))).fillna('Venta')
        v['Importe']    = pd.to_numeric(v.get('Importe', 0), errors='coerce').fillna(0)
        v['chofer']     = v.get('chofer', pd.Series(['']*len(v))).fillna('').astype(str).str.strip()
        v['proveedor']  = v.get('proveedor', pd.Series(['']*len(v))).fillna('').astype(str).str.strip()
        v['localidad']  = v.get('localidad', pd.Series(['']*len(v))).fillna('').astype(str).str.strip()
        v['Fecha']      = pd.to_datetime(v.get('Fecha', pd.NaT), errors='coerce')
        v['fecha_str']  = v['Fecha'].dt.strftime('%Y-%m-%d')
        v['importe_neto'] = v['Importe']
        v['reparto']    = pd.to_numeric(v.get('reparto', pd.Series([None]*len(v))), errors='coerce')
        v['Razon_Social'] = v.get('Razon_Social', pd.Series(['']*len(v))).fillna('').astype(str)
        v['Direccion']  = v.get('Direccion', pd.Series(['']*len(v))).fillna('').astype(str)
        v['Cliente']    = v.get('Cliente', pd.Series(['']*len(v)))
        v['motivodev']  = pd.to_numeric(v.get('motivodev', pd.Series([None]*len(v))), errors='coerce')
        v['cod_ven']    = v.get('cod_ven', pd.Series([None]*len(v)))
        v['Comprobante']= v.get('Comprobante', pd.Series(['']*len(v)))

        # KPIs globales
        vta  = float(v[v['tipo_venta']=='Venta']['Importe'].sum())
        dev  = float(abs(v[v['tipo_venta']=='Devolucion']['Importe'].sum()))
        cam  = float(abs(v[v['tipo_venta']=='Cambio']['Importe'].sum()))
        neto = vta - dev - cam
        bol  = v.groupby('Comprobante')['tipo_venta'].apply(list)
        e_tot= int((bol.apply(lambda ts: any(t=='Venta' for t in ts))).sum())
        ne_tot=int((bol.apply(lambda ts: all(t=='Devolucion' for t in ts))).sum())
        efect= round(e_tot/(e_tot+ne_tot)*100,1) if (e_tot+ne_tot)>0 else 0
        fechas= v['Fecha'].dropna()
        periodo= f"{fechas.min().strftime('%d/%m')}-{fechas.max().strftime('%d/%m/%Y')}" if len(fechas) else label

        rej_kpis_h = {
            'venta_neta': round(neto,0), 'venta_bruta': round(vta,0),
            'rechazo_imp': round(dev,0), 'cambio_imp': round(cam,0),
            'pct_rechazo': round(dev/vta*100,2) if vta else 0,
            'efectividad': efect, 'entregados': e_tot, 'no_entregados': ne_tot,
        }

        # Proveedores
        def prov_met_h(df):
            vv=float(df[df['tipo_venta']=='Venta']['Importe'].sum())
            rr=float(abs(df[df['tipo_venta']=='Devolucion']['Importe'].sum()))
            cc=float(abs(df[df['tipo_venta']=='Cambio']['Importe'].sum()))
            bol2=df.groupby('Comprobante')['tipo_venta'].apply(list)
            ee=int((bol2.apply(lambda ts:any(t=='Venta'for t in ts))).sum())
            ne2=int((bol2.apply(lambda ts:all(t=='Devolucion'for t in ts))).sum())
            return {'venta':round(vv,0),'rechazo':round(rr,0),'cambio':round(cc,0),
                    'pct_rec':round(rr/vv*100,2)if vv else 0,
                    'fac':ee,'no_e':ne2,
                    'efect':round(ee/(ee+ne2)*100,1)if(ee+ne2)else 0}

        prov_h=[]
        for p,gp in v.groupby('proveedor'):
            if not p: continue
            m=prov_met_h(gp)
            if m['venta']>0: prov_h.append({'prov':str(p),**m})
        prov_h.sort(key=lambda x:-x['venta'])

        # Venta por chofer
        venta_h=[]
        for ch,df_ch in v.groupby('chofer'):
            if not ch: continue
            bol3=df_ch.groupby('Comprobante')['tipo_venta'].apply(list)
            e3=int((bol3.apply(lambda ts:any(t=='Venta'for t in ts))).sum())
            ne3=int((bol3.apply(lambda ts:all(t=='Devolucion'for t in ts))).sum())
            dev3=df_ch[df_ch['tipo_venta']=='Devolucion']
            rp3={r['proveedor']:{'n':int(r['n']),'imp':round(float(abs(r['imp'])),0)}
                 for _,r in dev3.groupby('proveedor').agg(n=('importe_neto','count'),imp=('importe_neto','sum')).reset_index().iterrows()}
            ip3={r['proveedor']:{'n':int(r['n']),'imp':round(float(abs(r['imp'])),0)}
                 for _,r in df_ch[df_ch['tipo_venta']=='Cambio'].groupby('proveedor').agg(n=('importe_neto','count'),imp=('importe_neto','sum')).reset_index().iterrows()}
            pep3=df_ch[df_ch['proveedor']==PEPSICO]
            pep_vta3=float(pep3[pep3['tipo_venta']=='Venta']['Importe'].sum())
            pep_dev3=float(abs(pep3[pep3['tipo_venta']=='Devolucion']['Importe'].sum()))
            pep_cam3=float(abs(pep3[pep3['tipo_venta']=='Cambio']['Importe'].sum()))
            vp3={}
            for pr,g3 in df_ch[df_ch['tipo_venta']=='Venta'].groupby('proveedor'):
                vp3[pr]=round(float(g3['Importe'].sum()),0)
            venta_h.append({'ch':str(ch),'e':e3,'ne':ne3,'rp':rp3,'ip':ip3,'vp':vp3,
                'pep':{'vta':round(pep_vta3,0),'dev':round(pep_dev3,0),'cam':round(pep_cam3,0),
                       'e':0,'ne':0,'pct_dev':round(pep_dev3/pep_vta3*100,2)if pep_vta3 else 0,
                       'pct_cam':round(pep_cam3/pep_vta3*100,2)if pep_vta3 else 0,'efect':0}})

        # Cartones
        cart_h=[]
        cp=find("cartones.xlsx",dir_path)
        if cp:
            ct=pd.read_excel(cp)
            for _,r in ct.iterrows():
                bs=si(r.get('cajasret',0)); bi=si(r.get('cajasretdev',0))
                ch_c=str(r.get('razon_social','')).strip()
                if ch_c: cart_h.append({'chofer':ch_c,'b_sal':bs,'b_ing':bi,
                    'retorno':round(bi/bs*100,1)if bs else 0})

        # Rechazos motivo
        dev_all=v[v['tipo_venta']=='Devolucion']
        motivo_h=[]
        for mot,gm in dev_all.groupby('motivodev'):
            if pd.isna(mot): continue
            motivo_h.append({'mot':MOTIVO_MAP.get(float(mot),'?'),'n':len(gm),
                'imp':round(float(abs(gm['Importe'].sum())),0)})

        return {
            'label': label, 'periodo': periodo,
            'kpis': rej_kpis_h,
            'prov': prov_h,
            'venta': venta_h,
            'cart': cart_h,
            'motivo': motivo_h,
            'chs': sorted(v['chofer'].dropna().unique().tolist()),
            'provs': sorted(v['proveedor'].dropna().unique().tolist()),
        }
    except Exception as ex:
        import traceback; traceback.print_exc()
        print(f"  Historial {label}: error {ex}")
        return None

hist_data = {}
for (lbl, dpath) in MONTH_DIRS:
    d = _procesar_mes(dpath, lbl)
    if d: hist_data[lbl] = d

hist_labels = [d[0] for d in MONTH_DIRS]
hist_js = f"var D_HIST={json.dumps(hist_data,ensure_ascii=True,separators=(',',':'))};"
hist_labels_js = f"var D_HIST_LABELS={json.dumps(hist_labels,ensure_ascii=True,separators=(',',':'))};"
DATA_JS = DATA_JS + '\n' + hist_js + '\n' + hist_labels_js

# ── INYECTAR ──────────────────────────────────────────────────────────────────
dash_path = os.path.join(BASE_DIR, 'dashboard_operativo.html')
if not os.path.exists(dash_path):
    print(f"ERROR: dashboard_operativo.html no encontrado"); sys.exit(1)

with open(dash_path,'r',encoding='utf-8') as f: html = f.read()

ds = html.find('<!-- DATA_START -->')
de = html.find('<!-- DATA_END -->')
if ds > 0 and de > 0:
    sc_open  = html.rfind('<script>', 0, ds)
    sc_close = html.find('</script>', de) + len('</script>')
    new_block = '<script><!-- DATA_START -->\n' + DATA_JS + '\n<!-- DATA_END --></script>'
    html = html[:sc_open] + new_block + html[sc_close:]
    print(f"  Datos inyectados via marcadores: {len(DATA_JS)//1024}KB")
else:
    auth_tag = html.find('<script src="auth.js">')
    if auth_tag > 0:
        new_block = '<script><!-- DATA_START -->\n' + DATA_JS + '\n<!-- DATA_END --></script>\n'
        html = html[:auth_tag] + new_block + html[auth_tag:]
        print(f"  Datos inyectados antes de auth.js: {len(DATA_JS)//1024}KB")
    else:
        body_end = html.rfind('</body>')
        html = html[:body_end] + '\n<script><!-- DATA_START -->\n' + DATA_JS + '\n<!-- DATA_END --></script>\n' + html[body_end:]
        print(f"  Datos inyectados antes de </body>: {len(DATA_JS)//1024}KB")

# ── INYECTAR SheetJS si no está ───────────────────────────────────────────────
SHEETJS = '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>'
if 'xlsx.full.min.js' not in html:
    html = html.replace('<script src="auth.js"></script>', SHEETJS + '\n<script src="auth.js"></script>')

# ── INYECTAR BOTONES EXCEL ────────────────────────────────────────────────────
BTN = lambda fn, label='&#11015; Excel': (
    f'<button onclick="{fn}()" style="background:#1a4731;color:#34d399;'
    f'border:1px solid #34d399;border-radius:6px;padding:3px 10px;'
    f'font-size:.76rem;cursor:pointer;margin-left:8px">{label}</button>'
)
BTNS = [
    # (texto a buscar, texto a reemplazar)
    ('<h3>Rechazo por Proveedor</h3>',
     f'<h3>Rechazo por Proveedor {BTN("dlRejProv")}</h3>'),
    ('<h3>Clientes Reincidentes</h3>',
     f'<h3>Clientes Reincidentes {BTN("dlRejReinc")}</h3>'),
    ('<h3>Retorno por Chofer</h3>',
     f'<h3>Retorno por Chofer {BTN("dlCartones")}</h3>'),
    ('&#128203; Detalle Conciliaci&#243;n',
     f'&#128203; Detalle Conciliaci&#243;n {BTN("dlConciliacion")}'),
    ('Diferencias de Inventario</div>',
     f'Diferencias de Inventario {BTN("dlDeposito")}</div>'),
    ('Resumen por Chofer</div>',
     f'Resumen por Chofer {BTN("dlComisiones")}</div>'),
]
# Por motivo y por chofer en rechazos — buscar por id de panel
html = html.replace(
    '<div id="rp-motivo"',
    f'<div id="rp-motivo" data-dl="motivo"'
).replace(
    '<div id="rp-chofer"',
    f'<div id="rp-chofer" data-dl="chofer"'
)
# Botones motivo y chofer — buscar h3 dentro de esos paneles
import re
html = re.sub(
    r'(<div id="rp-motivo"[^>]*>.*?<h3>)(Por Motivo)(</h3>)',
    lambda m: m.group(1) + 'Por Motivo ' + BTN('dlRejMotivo') + m.group(3),
    html, flags=re.DOTALL
)
html = re.sub(
    r'(<div id="rp-chofer"[^>]*>.*?<h3>)(Por Chofer)(</h3>)',
    lambda m: m.group(1) + 'Por Chofer ' + BTN('dlRejChofer') + m.group(3),
    html, flags=re.DOTALL
)
# Ventas — botón antes del primer fbar en sec-ventas
html = re.sub(
    r'(<div class="sec"[^>]*id="sec-ventas"[^>]*>)\s*(<div class="fbar")',
    lambda m: m.group(1) + f'\n    <div style="text-align:right;margin-bottom:6px">{BTN("dlVentas")}</div>\n    ' + m.group(2),
    html, count=1
)
# Ruta — botón en fbar
html = re.sub(
    r'(id="sec-ruta"[^>]*>.*?oninput="filtRuta\(\)"[^>]*>)',
    lambda m: m.group(1) + BTN('dlRuta') if 'dlRuta' not in m.group(0) else m.group(0),
    html, count=1, flags=re.DOTALL
)
for old, new in BTNS:
    if old in html and new not in html:
        html = html.replace(old, new, 1)

# Remove duplicate dlRuta buttons - keep only the last one
import re as _re2
def _dedup_ruta(html):
    pattern = r'(oninput="filtRuta\(\)"[^>]*>)((?:<button onclick="dlRuta\(\)"[^>]+>.*?</button>)+)'
    def replacer(m):
        return m.group(1) + '<button onclick="dlRuta()" style="background:#00695c30;color:#00e5cc;border:1px solid #00e5cc;border-radius:6px;padding:3px 10px;font-size:.76rem;cursor:pointer;margin-left:8px">&#11015; Excel</button>'
    return _re2.sub(pattern, replacer, html, flags=_re2.DOTALL)
html = _dedup_ruta(html)

btn_count = html.count('dlRej') + html.count('dlCart') + html.count('dlConc') + html.count('dlDep') + html.count('dlVent') + html.count('dlCom') + html.count('dlRuta')
print(f"  Botones Excel inyectados: {btn_count} referencias")

from datetime import timezone, timedelta as _tdtz
_tz_ar = timezone(_tdtz(hours=-3))
_now_ar = datetime.now(_tz_ar)
build_ts = str(int(_now_ar.timestamp()))
build_dt = _now_ar.strftime('%d/%m/%Y %H:%M')
html = html.replace('__BUILD_TS__', build_ts)
# Replace placeholder OR any previously hardcoded date
import re as _re
html = _re.sub(r'__BUILD_DT__|\d{2}/\d{2}/\d{4} \d{2}:\d{2}', build_dt, html)

with open(dash_path,'w',encoding='utf-8') as f: f.write(html)
print(f"\nDashboard: {os.path.getsize(dash_path)//1024}KB")
print(f"Completado: {_now_ar.strftime('%d/%m/%Y %H:%M')} (hora Argentina)")
print("=" * 60)
