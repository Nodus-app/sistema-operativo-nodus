
// ============================================================
// AGREGAR ESTE CODIGO AL APPS SCRIPT EXISTENTE
// Ir a: script.google.com -> abrir el proyecto -> pegar esto
// al final de la funcion doGet()
// ============================================================

// En la funcion doGet(e), agregar este case:
// case 'getRechazos': return getRechazosData();

function getRechazosData() {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID); // usa el mismo ID del script actual
    var sheet = ss.getSheetByName('Rechazos Calle');
    if (!sheet) {
      return buildResponse([]);
    }
    var data  = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows    = data.slice(1);
    
    var rechazos = rows
      .filter(function(r) { return r[0]; }) // que tengan ID
      .map(function(r) {
        return {
          id:                r[0]  || '',
          fecha:             r[1]  || '',
          hora:              r[2]  || '',
          tipo:              r[3]  || '',
          chofer:            r[4]  || '',
          cliente:           r[5]  || '',
          vendedor:          r[6]  || '',
          motivo:            r[7]  || '',
          observacion:       r[8]  || '',
          foto:              r[9]  || '',
          respuesta_vendedor:r[10] || '',
          fecha_respuesta:   r[11] || ''
        };
      });
    
    return buildResponse(rechazos);
  } catch(e) {
    return buildResponse({error: e.toString()});
  }
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// IMPORTANTE: despues de pegar el codigo, hacer:
// 1. Implementar -> Nueva implementacion
// 2. Tipo: Aplicacion web
// 3. Ejecutar como: Yo
// 4. Quién tiene acceso: Cualquier usuario
// 5. Implementar -> copiar la nueva URL y reemplazar CH_SHEETS en index.html
