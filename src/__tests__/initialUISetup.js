/**
 * @jest-environment jsdom
 */

const app = require('../app')

test('UI is properly configured initially', () => {
  document.body.innerHTML =
    '<select class="form-select" id="versionName" name="versionName"></select>' +
    '<select class="form-select" id="numVersions" name="numVersions">' +
    '<option value="1">1 version</option>' +
    '<option value="2">2 versions</option>' +
    '<option value="3">3 versions</option>' +
    '<option value="4">4 versions</option>' +
    '</select>' +
    '<small class="text-body-secondary">Upgrade Duration: <span id="upgradeDurationValue">AAA weeks</span></small>' +
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="XX">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration">'

  app.getUI()

  expect(app.ui.versionNameSelect.options.length).toBe(0)
  expect(app.ui.numVersionsSelect.value).not.toBe('2')
  expect(app.ui.durationInput.upgrade.value).not.toBe('14')

  // Mock the nested function
  app.setDefaultDates = jest.fn()
  app.updateVersionName = jest.fn()

  app.initialUISetup()

  expect(app.ui.versionNameSelect.options.length).toBe(12)
  expect(app.ui.numVersionsSelect.value).toBe('2')
  expect(app.ui.durationInput.upgrade.value).toBe('14')
  expect(app.setDefaultDates).toHaveBeenCalled()
  expect(app.updateVersionName).toHaveBeenCalled()
})

test('Determine the next upgrade version', () => {
  // January is month 0
  expect(app.getClosestNextUpgradeVersion(2024, 0)).toBe('2024-02')
  expect(app.getClosestNextUpgradeVersion(2024, 1)).toBe('2024-05')
  expect(app.getClosestNextUpgradeVersion(2024, 2)).toBe('2024-05')
  expect(app.getClosestNextUpgradeVersion(2024, 3)).toBe('2024-05')
  expect(app.getClosestNextUpgradeVersion(2024, 4)).toBe('2024-08')
  expect(app.getClosestNextUpgradeVersion(2024, 5)).toBe('2024-08')
  expect(app.getClosestNextUpgradeVersion(2024, 6)).toBe('2024-08')
  expect(app.getClosestNextUpgradeVersion(2024, 7)).toBe('2024-11')
  expect(app.getClosestNextUpgradeVersion(2024, 8)).toBe('2024-11')
  expect(app.getClosestNextUpgradeVersion(2024, 9)).toBe('2024-11')
  expect(app.getClosestNextUpgradeVersion(2024, 10)).toBe('2025-02')
  expect(app.getClosestNextUpgradeVersion(2024, 11)).toBe('2025-02')
})

test('Determine Monday in 4 weeks', () => {
  expect(app.getMondayIn4Weeks(new Date('2024-01-22'))).toBe('2024-02-12')
  expect(app.getMondayIn4Weeks(new Date('2024-01-23'))).toBe('2024-02-19')
  expect(app.getMondayIn4Weeks(new Date('2024-01-24'))).toBe('2024-02-19')
  expect(app.getMondayIn4Weeks(new Date('2024-01-25'))).toBe('2024-02-19')
  expect(app.getMondayIn4Weeks(new Date('2024-01-26'))).toBe('2024-02-19')
  expect(app.getMondayIn4Weeks(new Date('2024-01-27'))).toBe('2024-02-19')
  expect(app.getMondayIn4Weeks(new Date('2024-01-28'))).toBe('2024-02-19')
  expect(app.getMondayIn4Weeks(new Date('2024-01-29'))).toBe('2024-02-19')
  expect(app.getMondayIn4Weeks(new Date('2024-01-30'))).toBe('2024-02-26')
})
