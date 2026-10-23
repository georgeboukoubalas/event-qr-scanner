function onOpen() {
  const UI = SpreadsheetApp.getUi();
  UI.createMenu('⚙️ Custom Automations')
    .addItem('Find Attends For User', 'findAttendsForUser')
    .addToUi();
}

function findAttendsForUser() {
  const UI = SpreadsheetApp.getUi();
  
  const promptResponse = UI.prompt(
    'Find Attendances',
    'Enter the exact attendee name or QR code string to search for:',
    UI.ButtonSet.OK_CANCEL
  );
  
  if (promptResponse.getSelectedButton() === UI.Button.OK) {
    const searchString = promptResponse.getResponseText().trim().toLowerCase();
    
    if (searchString === "") {
      UI.alert('Error', 'You must enter a name to search.', UI.ButtonSet.OK);
      return;
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    
    let totalAttends = 0;
    let validSheetsCount = 0; // We will count how many "Day" sheets exist
    
    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];
      const sheetName = sheet.getName();
      
      if (sheetName === "lefts") {
        continue; 
      }
      
      // Every time it checks a valid sheet, increase the count
      validSheetsCount++;
      
      const lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        const columnDValues = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
        for (let j = 0; j < columnDValues.length; j++) {
          const cellValue = columnDValues[j][0].toString().trim().toLowerCase();
          if (cellValue === searchString) {
            totalAttends++;
          }
        }
      }
    }
    
    // --- CERTIFICATE ELIGIBILITY MATH ---
    // 1. Dynamically count how many sessions exist in the SESSION_RANGES map
    const totalSessionsPerDay = Object.keys(SESSION_RANGES).length;
    
    // 2. Calculate the total possible scans (e.g., 8 sessions * 3 days = 24 total)
    const totalPossibleScans = totalSessionsPerDay * validSheetsCount;
    
    // 3. Find the 2/3 threshold
    const requiredAttends = (totalPossibleScans * 2) / 3;
    
    // 4. Determine status
    let certificateStatus = "";
    if (totalAttends > requiredAttends) {
        certificateStatus = "✅ ELIGIBLE for Certificate";
    } else {
        certificateStatus = "❌ NOT ELIGIBLE";
    }
    
    // 5. Fire the detailed final popup
    UI.alert(
      'Search Complete',
      'The attendee "' + promptResponse.getResponseText() + '" has been scanned ' + totalAttends + ' time(s).\n\n' +
      '--- Certificate Check ---\n' +
      'Total Possible Scans: ' + totalPossibleScans + '\n' +
      'Threshold (> 2/3): Needs more than ' + requiredAttends.toFixed(1) + ' scans.\n\n' +
      'STATUS: ' + certificateStatus,
      UI.ButtonSet.OK
    );
  }
}
