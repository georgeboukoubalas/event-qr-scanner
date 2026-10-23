// --- UPDATED CAPACITY: ~100 rows per block to safely fit 95 people ---
const SESSION_RANGES = {
  "1st Check in":  { start: 2,   end: 100 },
  "1st Check out": { start: 110, end: 210 },
  "2nd Check in":  { start: 220, end: 320 },
  "2nd Check out": { start: 330, end: 430 },
  "3rd Check in":  { start: 440, end: 540 },
  "3rd Check out": { start: 550, end: 650 },
  "4th Check in":  { start: 660, end: 760 },
  "4th Check out": { start: 770, end: 870 }
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(10000); 
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Server busy, try again" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    const ss = SpreadsheetApp.getActive();
    const data = JSON.parse(e.postData.contents);
    
    const targetSheetName = data.day; 
    const dataSheet = ss.getSheetByName(targetSheetName);
    
    if (!dataSheet) {
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Sheet '" + targetSheetName + "' not found!" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheetTimeZone = ss.getSpreadsheetTimeZone();
    const exactTime = Utilities.formatDate(new Date(), sheetTimeZone, "dd/MM/yyyy, HH:mm:ss");
    
    let targetRow = -1;
    let scanOrder = 1;
    
    if (SESSION_RANGES[data.session]) {
      const bounds = SESSION_RANGES[data.session];
      
      const maxPhysicalRows = dataSheet.getMaxRows();
      if (bounds.end > maxPhysicalRows) {
        dataSheet.insertRowsAfter(maxPhysicalRows, (bounds.end - maxPhysicalRows) + 5);
      }
      
      const numRows = bounds.end - bounds.start + 1;
      const columnValues = dataSheet.getRange(bounds.start, 1, numRows, 1).getValues();
      
      let emptyRelativeIndex = -1;
      for (let i = 0; i < columnValues.length; i++) {
        if (columnValues[i][0] === "" || columnValues[i][0] === null) {
          emptyRelativeIndex = i;
          break;
        }
      }
      
      if (emptyRelativeIndex === -1) {
         return ContentService.createTextOutput(JSON.stringify({ 
           "status": "error", 
           "message": "CAPACITY REACHED: The section for " + data.session + " is full!" 
         })).setMimeType(ContentService.MimeType.JSON);
      }
      
      targetRow = bounds.start + emptyRelativeIndex;
      scanOrder = emptyRelativeIndex + 1; 
      
      dataSheet.getRange(targetRow, 1, 1, 4).setValues([[ exactTime, scanOrder, data.session, data.qr_data ]]);
      
    } else {
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Unknown session type." })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "order": scanOrder, "row": targetRow })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Backend Error: " + error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
