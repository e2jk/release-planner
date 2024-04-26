/**
 * @jest-environment jsdom
 */

const app = require('../app')

test('Export the data to an Excel file', () => {
  document.body.innerHTML =
      '<select class="form-select" id="versionName" name="versionName">' +
      '<option value="2023-05">May 2023</option>' +
      '<option value="2023-08" selected>August 2023</option>' +
      '<option value="2023-11">November 2023</option>' +
      '</select>' +
      '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-02-04">' +
      '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate" value="2024-10-01">'
  app.getUI()

  app.getExportDataArray = jest.fn()
  app.formatWorksheet = jest.fn()
  app.getVersionName = jest.fn()

  app.exportToExcel()

  expect(app.getExportDataArray).toHaveBeenCalled()
  expect(app.formatWorksheet).toHaveBeenCalled()
  expect(app.getVersionName).toHaveBeenCalled()
})
