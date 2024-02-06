/**
 * @jest-environment jsdom
 */

const app = require('../app')

test('UI events get triggered as expected', () => {
  document.body.innerHTML =
    '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="upgradeTypeToggle">Classical upgrade</button>' +
    '<li><a class="dropdown-item active" href="#" id="upgradeTypeClassical">Classical</a></li>' +
    '<li><a class="dropdown-item" href="#" id="upgradeTypeExpedited">Expedited</a></li>' +
    '<ul class="dropdown-menu">' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">1 week</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">2 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">6 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem active" href="#">7 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">8 weeks</a></li>' +
    '<select class="form-select" id="versionName" name="versionName">' +
    '<option value="2023-02">February 2023</option>' +
    '<option value="2023-05">May 2023</option>' +
    '<option value="2023-08">August 2023</option>' +
    '<option value="2023-11">November 2023</option>' +
    '<option value="2024-02">February 2024</option>' +
    '<option value="2024-05">May 2024</option>' +
    '<option value="2024-08">August 2024</option>' +
    '<option value="2024-11">November 2024</option>' +
    '<option value="2025-02">February 2025</option>' +
    '<option value="2025-05">May 2025</option>' +
    '<option value="2025-08">August 2025</option>' +
    '<option value="2025-11">November 2025</option>' +
    '</select>' +
    '<select class="form-select" id="numVersions" name="numVersions">' +
    '<option value="1">1 version</option>' +
    '<option value="2" selected>2 versions</option>' +
    '<option value="3">3 versions</option>' +
    '<option value="4">4 versions</option>' +
    '</select>' +
    '<small class="text-body-secondary">Upgrade Duration: <span id="upgradeDurationValue">14 weeks</span></small>' +
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="XX">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration">' +
    '<small class="text-body-secondary" id="analysisDurationValue">4 weeks</small>' +
    '<input type="range" class="form-range" id="analysisDuration" name="analysisDuration" min="1">' +
    '<input type="date" class="form-control" id="analysisStartDate" name="analysisStartDate" aria-label="Analysis Start Date" aria-describedby="basic-addon-asd">' +
    '<input type="date" class="form-control" id="analysisEndDate" name="analysisEndDate" aria-label="Analysis End Date" aria-describedby="basic-addon-aed">' +
    '<small class="text-body-secondary" id="buildDurationValue">4 weeks</small>' +
    '<input type="range" class="form-range" id="buildDuration" name="buildDuration" min="1">' +
    '<input type="date" class="form-control" id="buildStartDate" name="buildStartDate" aria-label="Build Start Date" aria-describedby="basic-addon-bsd">' +
    '<input type="date" class="form-control" id="buildEndDate" name="buildEndDate" aria-label="Build End Date" aria-describedby="basic-addon-bed">' +
    '<small class="text-body-secondary" id="testingDurationValue">4 weeks</small>' +
    '<input type="range" class="form-range" id="testingDuration" name="testingDuration" min="1">' +
    '<input type="date" class="form-control" id="testingStartDate" name="testingStartDate" aria-label="Testing Start Date" aria-describedby="basic-addon-tesd">' +
    '<input type="date" class="form-control" id="testingEndDate" name="testingEndDate" aria-label="Testing End Date" aria-describedby="basic-addon-teed">' +
    '<small class="text-body-secondary" id="trainingDurationValue">4 weeks</small>' +
    '<input type="range" class="form-range" id="trainingDuration" name="trainingDuration" min="1">' +
    '<input type="date" class="form-control" id="trainingStartDate" name="trainingStartDate" aria-label="Training Start Date" aria-describedby="basic-addon-trsd">' +
    '<input type="date" class="form-control" id="trainingEndDate" name="trainingEndDate" aria-label="Training End Date" aria-describedby="basic-addon-tred">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckREL" aria-label="Checkbox to include REL upgrade" checked>' +
    '<input type="date" class="form-control" id="RELUpgradeDate" name="RELUpgradeDate" aria-label="REL Upgrade Date" aria-describedby="basic-addon-udREL">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPOC" aria-label="Checkbox to include POC upgrade" checked>' +
    '<input type="date" class="form-control" id="POCUpgradeDate" name="POCUpgradeDate" aria-label="POC Upgrade Date" aria-describedby="basic-addon-udPOC">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckTST" aria-label="Checkbox to include TST upgrade" checked>' +
    '<input type="date" class="form-control" id="TSTUpgradeDate" name="TSTUpgradeDate" aria-label="TST Upgrade Date" aria-describedby="basic-addon-udTST">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPLY" aria-label="Checkbox to include PLY upgrade" checked>' +
    '<input type="date" class="form-control" id="PLYUpgradeDate" name="PLYUpgradeDate" aria-label="PLY Upgrade Date" aria-describedby="basic-addon-udPLY">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckMST" aria-label="Checkbox to include MST upgrade" checked>' +
    '<input type="date" class="form-control" id="MSTUpgradeDate" name="MSTUpgradeDate" aria-label="MST Upgrade Date" aria-describedby="basic-addon-udMST">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckACE" aria-label="Checkbox to include ACE upgrade" checked>' +
    '<input type="date" class="form-control" id="ACEUpgradeDate" name="ACEUpgradeDate" aria-label="ACE Upgrade Date" aria-describedby="basic-addon-udACE">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckSUP" aria-label="Checkbox to include SUP upgrade" checked>' +
    '<input type="date" class="form-control" id="SUPUpgradeDate" name="SUPUpgradeDate" aria-label="SUP Upgrade Date" aria-describedby="basic-addon-udSUP">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPRD" aria-label="Checkbox to include PRD upgrade" checked>' +
    '<input type="date" class="form-control" id="PRDUpgradeDate" name="PRDUpgradeDate" aria-label="PRD Upgrade Date" aria-describedby="basic-addon-udPRD">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckInitialSU" aria-label="Checkbox to include Initial SU delivery" checked>&nbsp;' +
    '<input type="date" class="form-control" id="InitialSUDeliveryDate" name="InitialSUDeliveryDate" aria-label="Initial SU Delivery Date" aria-describedby="basic-addon-SUInitial">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckAllFixSU" aria-label="Checkbox to include All Fix SUs delivery" checked>&nbsp;' +
    '<input type="date" class="form-control" id="AllFixSUDeliveryDate" name="AllFixSUDeliveryDate" aria-label="All Fix SUs Delivery Date" aria-describedby="basic-addon-SUAllFix">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPreUpgradeCriticalSU" aria-label="Checkbox to include Pre-Upgrade Critical SU delivery" checked>&nbsp;' +
    '<input type="date" class="form-control" id="PreUpgradeCriticalSUDeliveryDate" name="PreUpgradeCriticalSUDeliveryDate" aria-label="Pre-Upgrade Critical SU Delivery Date" aria-describedby="basic-addon-SUPreUpgradeCritical">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPostUpgradeSU" aria-label="Checkbox to include Post-Upgrade SU delivery" checked>&nbsp;' +
    '<input type="date" class="form-control" id="PostUpgradeSUDeliveryDate" name="PostUpgradeSUDeliveryDate" aria-label="Post-Upgrade SU Delivery Date" aria-describedby="basic-addon-SUPostUpgrade">' +
    '<div id="visualization" class="mt-3"></div>'
  app.getUI()
  app.ui.upgradeType.classical.addEventListener = jest.fn()
  app.ui.upgradeType.expedited.addEventListener = jest.fn()
  app.ui.numVersionsSelect.addEventListener = jest.fn()
  for (let i = 0; i < app.ui.perVersionDurationToggleItems.length; i++) {
    app.ui.perVersionDurationToggleItems[i].addEventListener = jest.fn()
  }
  app.ui.durationInput.upgrade.addEventListener = jest.fn()
  app.ui.startDateInput.upgrade.addEventListener = jest.fn()
  app.ui.endDateInput.upgrade.addEventListener = jest.fn()
  for (let i = 0; i < app.phases.length; i++) {
    app.ui.durationInput[app.phases[i]].addEventListener = jest.fn()
    app.ui.startDateInput[app.phases[i]].addEventListener = jest.fn()
    app.ui.endDateInput[app.phases[i]].addEventListener = jest.fn()
  }
  app.ui.versionNameSelect.addEventListener = jest.fn()
  for (let i = 0; i < app.environments.length; i++) {
    app.ui.upgradeDateInput[app.environments[i]].addEventListener = jest.fn()
    app.ui.envCheck[app.environments[i]].addEventListener = jest.fn()
  }
  Object.keys(app.suDeliveries).forEach(function (key) {
    app.ui.deliveryDateInput[key].addEventListener = jest.fn()
    app.ui.deliveryCheck[key].addEventListener = jest.fn()
  }, app.suDeliveries)

  app.setupEventListeners()

  expect(Object.keys(app.ui).length).toStrictEqual(20)
  expect(app.ui.upgradeType.classical.addEventListener).toBeCalledWith('click', expect.any(Function))
  expect(app.ui.upgradeType.expedited.addEventListener).toBeCalledWith('click', expect.any(Function))
  expect(app.ui.numVersionsSelect.addEventListener).toBeCalledWith('change', expect.any(Function))
  for (let i = 0; i < app.ui.perVersionDurationToggleItems.length; i++) {
    expect(app.ui.perVersionDurationToggleItems[i].addEventListener).toBeCalledWith('click', expect.any(Function))
  }
  expect(app.ui.startDateInput.upgrade.addEventListener).toBeCalledWith('input', expect.any(Function))
  expect(app.ui.endDateInput.upgrade.addEventListener).toBeCalledWith('input', expect.any(Function))
  for (let i = 0; i < app.phases.length; i++) {
    expect(app.ui.durationInput[app.phases[i]].addEventListener).toBeCalledWith('input', expect.any(Function))
    expect(app.ui.startDateInput[app.phases[i]].addEventListener).toBeCalledWith('input', expect.any(Function))
    expect(app.ui.endDateInput[app.phases[i]].addEventListener).toBeCalledWith('input', expect.any(Function))
  }
  expect(app.ui.versionNameSelect.addEventListener).toBeCalledWith('input', expect.any(Function))
  for (let i = 0; i < app.environments.length; i++) {
    expect(app.ui.upgradeDateInput[app.environments[i]].addEventListener).toBeCalledWith('input', expect.any(Function))
  }
  Object.keys(app.suDeliveries).forEach(function (key) {
    expect(app.ui.deliveryDateInput[key].addEventListener).toBeCalledWith('input', expect.any(Function))
    expect(app.ui.deliveryCheck[key].addEventListener).toBeCalledWith('input', expect.any(Function))
  }, app.suDeliveries)
})

test('Exclude an environment from the planning', () => {
  document.body.innerHTML =
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPLY" aria-label="Checkbox to include PLY upgrade" checked>' +
    '<input type="date" class="form-control" id="PLYUpgradeDate" name="PLYUpgradeDate" aria-label="PLY Upgrade Date" aria-describedby="basic-addon-udPLY">'
  app.getUI()

  expect(app.ui.envCheck.PLY.checked).toBe(true)
  expect(app.ui.upgradeDateInput.PLY.disabled).toBe(false)
  expect(app.items.get('envPLY')).toStrictEqual({ id: 'envPLY', content: 'PLY', group: 'environments', type: 'point' })

  app.generateTextualRepresentations = jest.fn()

  // Testing when triggered from an event
  app.ui.envCheck.PLY.addEventListener('input', app.includeEnvOrSUDelivery)

  app.ui.envCheck.PLY.click()

  expect(app.ui.envCheck.PLY.checked).toBe(false)
  expect(app.ui.upgradeDateInput.PLY.disabled).toBe(true)
  expect(app.items.get('envPLY')).toBe(null)
  expect(app.generateTextualRepresentations).toBeCalled()
})

test('Include an environment in the planning', () => {
  document.body.innerHTML =
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPLY" aria-label="Checkbox to include PLY upgrade">' +
    '<input type="date" class="form-control" id="PLYUpgradeDate" name="PLYUpgradeDate" aria-label="PLY Upgrade Date" aria-describedby="basic-addon-udPLY" value="2024-01-27" disabled>'
  app.getUI()

  expect(app.ui.envCheck.PLY.checked).toBe(false)
  expect(app.ui.upgradeDateInput.PLY.disabled).toBe(true)
  expect(app.items.get('envPLY')).toBe(null)

  app.generateTextualRepresentations = jest.fn()

  // Testing when triggered from an event
  app.ui.envCheck.PLY.addEventListener('input', app.includeEnvOrSUDelivery)

  app.ui.envCheck.PLY.click()

  expect(app.ui.envCheck.PLY.checked).toBe(true)
  expect(app.ui.upgradeDateInput.PLY.disabled).toBe(false)
  expect(app.items.get('envPLY')).toStrictEqual({ id: 'envPLY', content: 'PLY', group: 'environments', type: 'point', start: new Date('2024-01-27').setHours(8, 0, 0, 0) })
  expect(app.generateTextualRepresentations).toBeCalled()
})

test('Exclude an SU delivery from the planning', () => {
  document.body.innerHTML =
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPreUpgradeCriticalSU" aria-label="Checkbox to include Pre-Upgrade Critical SU delivery" checked>&nbsp;' +
    '<input type="date" class="form-control" id="PreUpgradeCriticalSUDeliveryDate" name="PreUpgradeCriticalSUDeliveryDate" aria-label="Pre-Upgrade Critical SU Delivery Date" aria-describedby="basic-addon-SUPreUpgradeCritical">'
  app.getUI()

  expect(app.ui.deliveryCheck.PreUpgradeCriticalSU.checked).toBe(true)
  expect(app.ui.deliveryDateInput.PreUpgradeCriticalSU.disabled).toBe(false)
  expect(app.items.get('suPreUpgradeCriticalSU')).toStrictEqual({ id: 'suPreUpgradeCriticalSU', content: 'Pre-Upgrade Critical', group: 'su', type: 'point' })

  app.generateTextualRepresentations = jest.fn()

  // Testing when triggered from an event
  app.ui.deliveryCheck.PreUpgradeCriticalSU.addEventListener('input', app.includeEnvOrSUDelivery)

  app.ui.deliveryCheck.PreUpgradeCriticalSU.click()

  expect(app.ui.deliveryCheck.PreUpgradeCriticalSU.checked).toBe(false)
  expect(app.ui.deliveryDateInput.PreUpgradeCriticalSU.disabled).toBe(true)
  expect(app.items.get('suPreUpgradeCriticalSU')).toBe(null)
  expect(app.generateTextualRepresentations).toBeCalled()
})

test('Include an SU delivery in the planning', () => {
  document.body.innerHTML =
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPreUpgradeCriticalSU" aria-label="Checkbox to include Pre-Upgrade Critical SU delivery">&nbsp;' +
    '<input type="date" class="form-control" id="PreUpgradeCriticalSUDeliveryDate" name="PreUpgradeCriticalSUDeliveryDate" aria-label="Pre-Upgrade Critical SU Delivery Date" aria-describedby="basic-addon-SUPreUpgradeCritical" value="2024-01-28" disabled>'
  app.getUI()

  expect(app.ui.deliveryCheck.PreUpgradeCriticalSU.checked).toBe(false)
  expect(app.ui.deliveryDateInput.PreUpgradeCriticalSU.disabled).toBe(true)
  expect(app.items.get('suPreUpgradeCriticalSU')).toBe(null)

  app.generateTextualRepresentations = jest.fn()

  // Testing when triggered from an event
  app.ui.deliveryCheck.PreUpgradeCriticalSU.addEventListener('input', app.includeEnvOrSUDelivery)

  app.ui.deliveryCheck.PreUpgradeCriticalSU.click()

  expect(app.ui.deliveryCheck.PreUpgradeCriticalSU.checked).toBe(true)
  expect(app.ui.deliveryDateInput.PreUpgradeCriticalSU.disabled).toBe(false)
  expect(app.items.get('suPreUpgradeCriticalSU')).toStrictEqual({ id: 'suPreUpgradeCriticalSU', content: 'Pre-Upgrade Critical', group: 'su', type: 'point', start: new Date('2024-01-28').setHours(8, 0, 0, 0) })
  expect(app.generateTextualRepresentations).toBeCalled()
})
