/**
 * @jest-environment jsdom
 */

// import userEvent from '@testing-library/user-event'

const app = require('../app')

test('Get phase type when not an event', () => {
  // When passing just a string, get that string back
  expect(app.getPhaseTypeFromEventTarget('abc')).toStrictEqual(['abc', 'inline'])
})

test('Update analysis end date when triggered from an event', () => {
  document.body.innerHTML =
        '<small class="text-body-secondary" id="analysisDurationValue">4 weeks</small>' +
        '<input type="range" class="form-range" id="analysisDuration" name="analysisDuration" min="1" value="99">' +
        '<input type="date" class="form-control" id="analysisStartDate" name="analysisStartDate" aria-label="Analysis Start Date" aria-describedby="basic-addon-asd" value="2024-01-23">' +
        '<input type="date" class="form-control" id="analysisEndDate" name="analysisEndDate" aria-label="Analysis End Date" aria-describedby="basic-addon-aed" value="2024-02-13">'
  app.getUI()

  // Testing when triggered from an event
  app.ui.startDateInput.analysis.addEventListener('input', app.updateEndDate)

  app.setEndDate = jest.fn()
  app.updateVisItemDate = jest.fn()

  const event = new Event('input')
  app.ui.startDateInput.analysis.dispatchEvent(event)

  expect(app.setEndDate).toBeCalledTimes(1)
  expect(app.setEndDate).toBeCalledWith(
    app.ui.startDateInput.analysis,
    app.ui.durationInput.analysis,
    app.ui.endDateInput.analysis
  )
  expect(app.updateVisItemDate).toBeCalledTimes(2)
  expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
    1,
    'analysisPhase',
    '2024-01-23',
    'startPhase'
  )
  expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
    2,
    'analysisPhase',
    '2024-02-13',
    'end'
  )

  expect(app.ui.durationValue.analysis.textContent).toBe('99 weeks')
})

test('Update build end date when triggered inline as a function', () => {
  document.body.innerHTML =
        '<small class="text-body-secondary" id="buildDurationValue">4 weeks</small>' +
        '<input type="range" class="form-range" id="buildDuration" name="buildDuration" min="1" value="99">' +
        '<input type="date" class="form-control" id="buildStartDate" name="buildStartDate" aria-label="build Start Date" aria-describedby="basic-addon-asd" value="2024-01-23">' +
        '<input type="date" class="form-control" id="buildEndDate" name="buildEndDate" aria-label="build End Date" aria-describedby="basic-addon-aed" value="2024-02-13">'
  app.getUI()

  app.setEndDate = jest.fn()
  app.updateVisItemDate = jest.fn()

  // Testing when ran directly
  app.updateEndDate('build')

  expect(app.setEndDate).toBeCalledTimes(1)
  expect(app.setEndDate).toBeCalledWith(
    app.ui.startDateInput.build,
    app.ui.durationInput.build,
    app.ui.endDateInput.build
  )
  expect(app.updateVisItemDate).toBeCalledTimes(2)
  expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
    1,
    'buildPhase',
    '2024-01-23',
    'startPhase'
  )
  expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
    2,
    'buildPhase',
    '2024-02-13',
    'end'
  )
})

test('Update upgrade end date when triggered from an event', () => {
  document.body.innerHTML =
        '<small class="text-body-secondary">Upgrade Duration: <span id="upgradeDurationValue">14 weeks</span></small>' +
        '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-01-23">' +
        '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate" value="2024-03-23">' +
        '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" value="70">'
  app.getUI()

  // Testing when triggered from an event
  app.ui.startDateInput.upgrade.addEventListener('input', app.updateEndDate)

  app.setEndDate = jest.fn()
  app.setDefaultDates = jest.fn()

  const event = new Event('input')
  app.ui.startDateInput.upgrade.dispatchEvent(event)

  expect(app.setEndDate).toBeCalledTimes(1)
  expect(app.setEndDate).toBeCalledWith(
    app.ui.startDateInput.upgrade,
    app.ui.durationInput.upgrade,
    app.ui.endDateInput.upgrade
  )
  expect(app.setDefaultDates).toHaveBeenCalledWith(false)

  expect(app.ui.durationValue.upgrade.textContent).toBe('70 weeks')
})
