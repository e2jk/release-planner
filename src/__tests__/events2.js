/**
 * @jest-environment jsdom
 */

const app = require('../app')

test("updateEnvironmentDate when an environment's upgrade date is changed", () => {
  document.body.innerHTML =
        '<input type="date" class="form-control" id="POCUpgradeDate" name="POCUpgradeDate" aria-label="POC Upgrade Date" aria-describedby="basic-addon-udPOC" value="2024-01-24">'
  app.getUI()
  // Testing when triggered from an event
  document.getElementById('POCUpgradeDate').addEventListener('input', app.updateEnvironmentDate)

  app.updateVisItemDate = jest.fn()

  const event = new Event('input')
  document.getElementById('POCUpgradeDate').dispatchEvent(event)

  expect(app.updateVisItemDate).toHaveBeenCalledWith(
    'envPOC',
    '2024-01-24',
    'startPoint'
  )
})

test('updateSUDeliveryDate when an SU dDelivery date is changed', () => {
  document.body.innerHTML =
        '<input type="date" class="form-control" id="AllFixSUDeliveryDate" name="AllFixSUDeliveryDate" aria-label="All Fix SUs Delivery Date" aria-describedby="basic-addon-SUAllFix" value="2024-01-24">'
  app.getUI()
  // Testing when triggered from an event
  document.getElementById('AllFixSUDeliveryDate').addEventListener('input', app.updateSUDeliveryDate)

  app.updateVisItemDate = jest.fn()

  const event = new Event('input')
  document.getElementById('AllFixSUDeliveryDate').dispatchEvent(event)

  expect(app.updateVisItemDate).toHaveBeenCalledWith(
    'suAllFixSU',
    '2024-01-24',
    'startPoint'
  )
})

test('updateVersionName when triggered from an event', () => {
  document.body.innerHTML =
        '<select class="form-select" id="versionName" name="versionName">' +
        '<option value="2023-02">February 2023</option>' +
        '<option value="2023-05">May 2023</option>' +
        '<option value="2023-08">August 2023</option>' +
        '<option value="2023-11">November 2023</option>' +
        '<option value="2024-02">February 2024</option>' +
        '<option value="2024-05" selected>May 2024</option>' +
        '<option value="2024-08">August 2024</option>' +
        '<option value="2024-11">November 2024</option>' +
        '<option value="2025-02">February 2025</option>' +
        '<option value="2025-05">May 2025</option>' +
        '<option value="2025-08">August 2025</option>' +
        '<option value="2025-11">November 2025</option>' +
        '</select>'
  app.getUI()
  // Testing when triggered from an event
  app.ui.versionNameSelect.addEventListener('input', app.updateVersionName)

  app.updateVisItemContent = jest.fn()
  app.updateVisGroupContent = jest.fn()

  const event = new Event('input')
  app.ui.versionNameSelect.dispatchEvent(event)

  expect(app.updateVisItemContent).toHaveBeenCalledWith(
    'upgradePeriod',
    'Upgrade to May 2024'
  )
  expect(app.updateVisGroupContent).toHaveBeenCalledWith(
    'upgrade',
    'May 2024'
  )
})
