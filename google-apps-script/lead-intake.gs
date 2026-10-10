/**
 * Mokha Designs - website lead intake.
 *
 * Lives inside the leads Google Sheet (Extensions > Apps Script) and is
 * deployed as a web app (Execute as: Me, Who has access: Anyone).
 * The website form POSTs JSON here; each submission becomes one row in the
 * "Website" tab. Columns A:X keep the old Supabase layout (by position).
 * Interiors Budget is found by its header name, wherever that column sits,
 * and is created after the last header if missing. Columns the team uses
 * for follow-ups (Follow Up Owner onwards) are never written.
 *
 * Source of truth for this file: google-apps-script/lead-intake.gs in the
 * rawcanvas-next-chapter repo. After editing, paste into the Apps Script
 * editor and use Deploy > Manage deployments > Edit > New version, so the
 * URL stays the same.
 */

// Columns A:X, by position: Name, Phone, Email, Property Location, Project
// Type, Property Type, Property Size, Property Status, Next Step, Consultation
// Date, Visitor Location, Device, Browser, Timestamp, Intent, Scope of Work,
// Finish Level, Storage Requirement, Upgrades, BHK Size, Entry Mode (legacy,
// blank), Estimate Low, Estimate High, Size Multiplier.
var BUDGET_HEADER = 'Interiors Budget';

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot: real visitors never see or fill this field.
    if (d.website) return json_({ success: true });

    if (!d.name || !d.phone || !d.propertyLocation || !d.projectType) {
      return json_({ success: false, error: 'Missing required fields' });
    }

    var nextStep = d.nextStep === 'consultation' ? 'Schedule a free consultation'
      : d.nextStep === 'direct-call' ? "I'll call you directly" : '';

    var row = [
      d.name, d.phone, d.email, d.propertyLocation, d.projectType, d.propertyType,
      d.propertySize, d.propertyStatus, nextStep, d.consultationDate,
      d.visitorLocation, d.deviceType, d.browser,
      Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy HH:mm:ss') + ' IST',
      d.intent || 'quick_estimate', d.scopeOfWork, d.finishLevel, d.storageRequirement,
      d.upgrades, d.bhkSize, '',
      d.estimateLow, d.estimateHigh, d.sizeMultiplier,
    ].map(clean_);

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = leadsSheet_();
      var budgetCol = budgetColumn_(sheet);
      while (row.length < budgetCol) row.push('');
      row[budgetCol - 1] = clean_(d.interiorsBudget);
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }
    return json_({ success: true });
  } catch (err) {
    console.error(err);
    return json_({ success: false, error: String(err) });
  }
}

// Health check: opening the web app URL in a browser shows {"ok":true}.
function doGet() {
  return json_({ ok: true });
}

// 1-based column of the Interiors Budget header; appended after the last
// header if it does not exist yet.
function budgetColumn_(sheet) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim() === BUDGET_HEADER) return i + 1;
  }
  var last = headers.length;
  while (last > 0 && String(headers[last - 1]).trim() === '') last--;
  sheet.getRange(1, last + 1).setValue(BUDGET_HEADER);
  return last + 1;
}

// Stringify, trim, cap length, and neutralise anything a spreadsheet would
// read as a formula (=, +, -, @), so a visitor cannot inject one.
function clean_(v) {
  if (v === null || v === undefined) return '';
  var s = String(v).trim().slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Leads go to the "Website" tab; falls back to the first tab if renamed.
function leadsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName('Website') || ss.getSheets()[0];
}
