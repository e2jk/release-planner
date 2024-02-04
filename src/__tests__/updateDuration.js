/**
 * @jest-environment jsdom
 */

const app = require('../app')

test('Update phase duration when triggered from an event', () => {
  document.body.innerHTML =
        '<small class="text-body-secondary" id="analysisDurationValue">4 weeks</small>' +
        '<input type="range" class="form-range" id="analysisDuration" name="analysisDuration" min="1">' +
        '<input type="date" class="form-control" id="analysisStartDate" name="analysisStartDate" aria-label="Analysis Start Date" aria-describedby="basic-addon-asd" value="2024-01-23">' +
        '<input type="date" class="form-control" id="analysisEndDate" name="analysisEndDate" aria-label="Analysis End Date" aria-describedby="basic-addon-aed" value="2024-02-23">'
  app.getUI()

  // Testing when triggered from an event
  app.ui.endDateInput.analysis.addEventListener('input', app.updateDuration)

  app.updateVisItemDate = jest.fn()
  app.generateTextualRepresentations = jest.fn()

  const event = new Event('input')
  app.ui.endDateInput.analysis.dispatchEvent(event)

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
    '2024-02-23',
    'end'
  )

  expect(app.ui.durationInput.analysis.value).toBe('4')
  expect(app.ui.durationValue.analysis.textContent).toBe('4 weeks')
  expect(app.generateTextualRepresentations).toBeCalled()
})

test('Update upgrade duration when triggered from an event', () => {
  document.body.innerHTML =
        '<small class="text-body-secondary">Upgrade Duration: <span id="upgradeDurationValue">14 weeks</span></small>' +
        '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-01-23">' +
        '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate" value="2024-03-23">' +
        '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration">'
  app.getUI()

  // Testing when triggered from an event
  app.ui.endDateInput.upgrade.addEventListener('input', app.updateDuration)

  app.setDefaultDates = jest.fn()
  app.generateTextualRepresentations = jest.fn()

  const event = new Event('input')
  app.ui.endDateInput.upgrade.dispatchEvent(event)

  expect(app.setDefaultDates).toBeCalledWith(false)

  expect(app.ui.durationInput.upgrade.value).toBe('9')
  expect(app.ui.durationValue.upgrade.textContent).toBe('9 weeks')
  expect(app.generateTextualRepresentations).toBeCalled()
})
