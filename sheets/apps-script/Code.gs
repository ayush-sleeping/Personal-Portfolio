/**
 * Contact-form write path for the portfolio.
 *
 * Deployed as a Web App (Execute as: Me, Who has access: Anyone) from the
 * `portfolio-cms` spreadsheet. Appends one row per submission to the
 * `contact_submissions` tab.
 *
 * Script Properties required (Project Settings -> Script Properties):
 *   SHEET_ID  - the portfolio-cms spreadsheet id
 *   TOKEN     - shared string, must match SHARED_TOKEN in contactform.js
 *
 * Note on the token: the site is a public static repo, so this is friction
 * against drive-by bots, not authentication. Real auth is not possible here.
 */

var SHEET_NAME = 'contact_submissions';
var HEADERS = ['Date', 'Name', 'Email', 'Subject', 'Message', 'UserAgent', 'Page', 'Token'];

function doPost(e) {
  var props = PropertiesService.getScriptProperties();

  if (!e || !e.parameter) {
    return _json({ ok: false, reason: 'no-params' });
  }
  if (e.parameter.token !== props.getProperty('TOKEN')) {
    return _json({ ok: false, reason: 'forbidden' });
  }
  // Honeypot: a real visitor never sees this field, bots fill it in.
  if (e.parameter.honey) {
    return _json({ ok: true }); // lie to the bot rather than signal detection
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return _json({ ok: false, reason: 'busy' });
  }

  try {
    var ss = SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      _clip(e.parameter.name, 200),
      _clip(e.parameter.email, 200),
      _clip(e.parameter.subject, 300),
      _clip(e.parameter.message, 5000),
      _clip(e.parameter.userAgent, 500),
      _clip(e.parameter.page, 300),
      'ok',
    ]);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, reason: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check. Deliberately returns no sheet data — this endpoint is public.
 */
function doGet() {
  return _json({ ok: true, service: 'portfolio-contact' });
}

function _clip(value, max) {
  var s = value === undefined || value === null ? '' : String(value);
  return s.length > max ? s.slice(0, max) : s;
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
