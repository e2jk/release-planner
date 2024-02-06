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
  expect(app.ui.durationInput.upgrade.min).not.toBe('7')
  expect(app.ui.durationInput.upgrade.max).not.toBe('40')
  expect(app.ui.durationInput.upgrade.value).not.toBe('14')

  // Mock the nested function
  app.setDefaultDates = jest.fn()
  app.updateVersionName = jest.fn()

  app.initialUISetup()

  expect(app.ui.versionNameSelect.options.length).toBe(12)
  expect(app.ui.numVersionsSelect.value).toBe('2')
  expect(app.ui.durationInput.upgrade.min).toBe('4')
  expect(app.ui.durationInput.upgrade.max).toBe('40')
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

test('Determine the very next Monday', () => {
  // 2024-01-22 and 2024-01-29 are Mondays
  expect(app.getMondayNWeeksLater(new Date('2024-01-20'), 0)).toBe('2024-01-22')
  expect(app.getMondayNWeeksLater(new Date('2024-01-21'), 0)).toBe('2024-01-22')
  expect(app.getMondayNWeeksLater(new Date('2024-01-22'), 0)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-23'), 0)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-24'), 0)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-25'), 0)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-26'), 0)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-27'), 0)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-28'), 0)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-29'), 0)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-30'), 0)).toBe('2024-02-05')
})

test('Determine Monday 1 week later', () => {
  // 2024-01-22 and 2024-02-05 are Mondays
  expect(app.getMondayNWeeksLater(new Date('2024-01-20'), 1)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-21'), 1)).toBe('2024-01-29')
  expect(app.getMondayNWeeksLater(new Date('2024-01-22'), 1)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-23'), 1)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-24'), 1)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-25'), 1)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-26'), 1)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-27'), 1)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-28'), 1)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-29'), 1)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-30'), 1)).toBe('2024-02-12')
})

test('Determine Monday 2 weeks later', () => {
  // 2024-01-22 and 2024-02-05 are Mondays
  expect(app.getMondayNWeeksLater(new Date('2024-01-20'), 2)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-21'), 2)).toBe('2024-02-05')
  expect(app.getMondayNWeeksLater(new Date('2024-01-22'), 2)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-23'), 2)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-24'), 2)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-25'), 2)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-26'), 2)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-27'), 2)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-28'), 2)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-29'), 2)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-30'), 2)).toBe('2024-02-19')
})

test('Determine Monday 3 weeks later', () => {
  // 2024-01-22 and 2024-02-05 are Mondays
  expect(app.getMondayNWeeksLater(new Date('2024-01-20'), 3)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-21'), 3)).toBe('2024-02-12')
  expect(app.getMondayNWeeksLater(new Date('2024-01-22'), 3)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-23'), 3)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-24'), 3)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-25'), 3)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-26'), 3)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-27'), 3)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-28'), 3)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-29'), 3)).toBe('2024-02-26')
  expect(app.getMondayNWeeksLater(new Date('2024-01-30'), 3)).toBe('2024-02-26')
})

test('Determine Monday 4 weeks later', () => {
  // 2024-01-22 and 2024-02-05 are Mondays
  expect(app.getMondayNWeeksLater(new Date('2024-01-20'), 4)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-21'), 4)).toBe('2024-02-19')
  expect(app.getMondayNWeeksLater(new Date('2024-01-22'), 4)).toBe('2024-02-26')
  expect(app.getMondayNWeeksLater(new Date('2024-01-23'), 4)).toBe('2024-02-26')
  expect(app.getMondayNWeeksLater(new Date('2024-01-24'), 4)).toBe('2024-02-26')
  expect(app.getMondayNWeeksLater(new Date('2024-01-25'), 4)).toBe('2024-02-26')
  expect(app.getMondayNWeeksLater(new Date('2024-01-26'), 4)).toBe('2024-02-26')
  expect(app.getMondayNWeeksLater(new Date('2024-01-27'), 4)).toBe('2024-02-26')
  expect(app.getMondayNWeeksLater(new Date('2024-01-28'), 4)).toBe('2024-02-26')
  expect(app.getMondayNWeeksLater(new Date('2024-01-29'), 4)).toBe('2024-03-04')
  expect(app.getMondayNWeeksLater(new Date('2024-01-30'), 4)).toBe('2024-03-04')
})

test('Start date is in 3 weeks when upgrading to a version that is already released', () => {
  expect(app.determineUpgradeStartDate('2023-08', new Date('2024-12-06'))).toBe('2024-12-30')
  expect(app.determineUpgradeStartDate('2023-08', new Date('2024-01-27'))).toBe('2024-02-19')
  expect(app.determineUpgradeStartDate('2023-11', new Date('2024-01-27'))).toBe('2024-02-19')
  // On a Monday
  expect(app.determineUpgradeStartDate('2023-11', new Date('2024-01-29'))).toBe('2024-02-26')
})

test('Start date is one week after the release date when upgrading to a version that is not already released', () => {
  expect(app.determineUpgradeStartDate('2024-08', new Date('2024-01-27'))).toBe('2024-08-12')
  expect(app.determineUpgradeStartDate('2024-11', new Date('2024-01-27'))).toBe('2024-11-11')
})

test('Testing determineUpgradeStartDate without second parameter', () => {
  // Returns the Monday in 3 weeks
  expect(app.determineUpgradeStartDate('2023-11')).toBe(app.getMondayNWeeksLater(new Date(), 3))
})
