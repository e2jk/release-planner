/**
 * @jest-environment jsdom
 */

const app = require('../app')

test('Change upgrade type from Classical to Expedited', () => {
  document.body.innerHTML =
    '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="upgradeTypeToggle">Classical upgrade</button>' +
    '<li><a class="dropdown-item active" href="#" id="upgradeTypeClassical">Classical</a></li>' +
    '<li><a class="dropdown-item" href="#" id="upgradeTypeExpedited">Expedited</a></li>' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration">' +
    '<div class="row row-gap-3" id="phasesSection"></div>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckInitialSU" aria-label="Checkbox to include Initial SU delivery">&nbsp;' +
    '<input type="date" class="form-control" id="InitialSUDeliveryDate" name="InitialSUDeliveryDate" aria-label="Initial SU Delivery Date" aria-describedby="basic-addon-SUInitial">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckAllFixSU" aria-label="Checkbox to include All Fix SUs delivery" checked>&nbsp;' +
    '<input type="date" class="form-control" id="AllFixSUDeliveryDate" name="AllFixSUDeliveryDate" aria-label="All Fix SUs Delivery Date" aria-describedby="basic-addon-SUAllFix">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPreUpgradeCriticalSU" aria-label="Checkbox to include Pre-Upgrade Critical SU delivery" checked>&nbsp;' +
    '<input type="date" class="form-control" id="PreUpgradeCriticalSUDeliveryDate" name="PreUpgradeCriticalSUDeliveryDate" aria-label="Pre-Upgrade Critical SU Delivery Date" aria-describedby="basic-addon-SUPreUpgradeCritical">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPostUpgradeSU" aria-label="Checkbox to include Post-Upgrade SU delivery" checked>&nbsp;' +
    '<input type="date" class="form-control" id="PostUpgradeSUDeliveryDate" name="PostUpgradeSUDeliveryDate" aria-label="Post-Upgrade SU Delivery Date" aria-describedby="basic-addon-SUPostUpgrade">'
  app.getUI()

  expect(app.upgradeType).toStrictEqual({ current: 'Classical', value: 'Classical' })
  expect(app.ui.upgradeTypeToggle.innerHTML).toBe('Classical upgrade')
  expect(app.ui.upgradeType.classical.classList.contains('active')).toBe(true)
  expect(app.ui.upgradeType.expedited.classList.contains('active')).toBe(false)
  expect(app.ui.phasesSection.classList.contains('collapse')).toBe(false)
  expect(app.groups.get('phases')).toStrictEqual({ content: 'Phases', id: 'phases' })
  expect(app.ui.deliveryCheck.InitialSU.checked).toBe(false)
  expect(app.ui.deliveryCheck.AllFixSU.checked).toBe(true)
  expect(app.ui.deliveryCheck.PreUpgradeCriticalSU.checked).toBe(true)
  expect(app.ui.deliveryCheck.PostUpgradeSU.checked).toBe(true)

  // Testing when triggered from an event
  app.ui.upgradeType.expedited.addEventListener('click', app.changeUpgradeType)

  app.setDefaultDates = jest.fn()

  const event = new Event('click')
  app.ui.upgradeType.expedited.dispatchEvent(event)

  expect(app.upgradeType).toStrictEqual({ current: 'Expedited', value: 'Expedited' })
  expect(app.ui.upgradeTypeToggle.innerHTML).toBe('Expedited upgrade')
  expect(app.ui.upgradeType.classical.classList.contains('active')).toBe(false)
  expect(app.ui.upgradeType.expedited.classList.contains('active')).toBe(true)
  expect(app.ui.phasesSection.classList.contains('collapse')).toBe(true)
  expect(app.groups.get('phases')).toBe(null)
  expect(app.ui.durationInput.upgrade.min).toBe('1')
  expect(app.ui.durationInput.upgrade.max).toBe('4')
  expect(app.ui.durationInput.upgrade.value).toBe('2')
  expect(app.ui.deliveryCheck.InitialSU.checked).toBe(true)
  expect(app.ui.deliveryCheck.AllFixSU.checked).toBe(false)
  expect(app.ui.deliveryCheck.PreUpgradeCriticalSU.checked).toBe(false)
  expect(app.ui.deliveryCheck.PostUpgradeSU.checked).toBe(false)

  expect(app.setDefaultDates).toHaveBeenCalledWith(false)
})

test('Change upgrade type from Classical to Expedited', () => {
  document.body.innerHTML =
    '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="upgradeTypeToggle">Expedited upgrade</button>' +
    '<li><a class="dropdown-item" href="#" id="upgradeTypeClassical">Classical</a></li>' +
    '<li><a class="dropdown-item active" href="#" id="upgradeTypeExpedited">Expedited</a></li>' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration">' +
    '<div class="row row-gap-3 collapse" id="phasesSection"></div>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckInitialSU" aria-label="Checkbox to include Initial SU delivery">&nbsp;' +
    '<input type="date" class="form-control" id="InitialSUDeliveryDate" name="InitialSUDeliveryDate" aria-label="Initial SU Delivery Date" aria-describedby="basic-addon-SUInitial">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckAllFixSU" aria-label="Checkbox to include All Fix SUs delivery">&nbsp;' +
    '<input type="date" class="form-control" id="AllFixSUDeliveryDate" name="AllFixSUDeliveryDate" aria-label="All Fix SUs Delivery Date" aria-describedby="basic-addon-SUAllFix">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPreUpgradeCriticalSU" aria-label="Checkbox to include Pre-Upgrade Critical SU delivery">&nbsp;' +
    '<input type="date" class="form-control" id="PreUpgradeCriticalSUDeliveryDate" name="PreUpgradeCriticalSUDeliveryDate" aria-label="Pre-Upgrade Critical SU Delivery Date" aria-describedby="basic-addon-SUPreUpgradeCritical">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPostUpgradeSU" aria-label="Checkbox to include Post-Upgrade SU delivery">&nbsp;' +
    '<input type="date" class="form-control" id="PostUpgradeSUDeliveryDate" name="PostUpgradeSUDeliveryDate" aria-label="Post-Upgrade SU Delivery Date" aria-describedby="basic-addon-SUPostUpgrade">'
  app.getUI()

  expect(app.upgradeType).toStrictEqual({ current: 'Expedited', value: 'Expedited' })
  expect(app.ui.upgradeTypeToggle.innerHTML).toBe('Expedited upgrade')
  expect(app.ui.upgradeType.classical.classList.contains('active')).toBe(false)
  expect(app.ui.upgradeType.expedited.classList.contains('active')).toBe(true)
  expect(app.ui.phasesSection.classList.contains('collapse')).toBe(true)
  expect(app.groups.get('phases')).toBe(null)
  expect(app.ui.deliveryCheck.InitialSU.checked).toBe(false)
  expect(app.ui.deliveryCheck.AllFixSU.checked).toBe(false)
  expect(app.ui.deliveryCheck.PreUpgradeCriticalSU.checked).toBe(false)
  expect(app.ui.deliveryCheck.PostUpgradeSU.checked).toBe(false)

  // Testing when triggered from an event
  app.ui.upgradeType.classical.addEventListener('click', app.changeUpgradeType)

  app.setDefaultDates = jest.fn()

  const event = new Event('click')
  app.ui.upgradeType.classical.dispatchEvent(event)

  expect(app.upgradeType).toStrictEqual({ current: 'Classical', value: 'Classical' })
  expect(app.ui.upgradeTypeToggle.innerHTML).toBe('Classical upgrade')
  expect(app.ui.upgradeType.classical.classList.contains('active')).toBe(true)
  expect(app.ui.upgradeType.expedited.classList.contains('active')).toBe(false)
  expect(app.ui.phasesSection.classList.contains('collapse')).toBe(false)
  expect(app.groups.get('phases')).toStrictEqual({ content: 'Phases', id: 'phases' })
  expect(app.ui.durationInput.upgrade.min).toBe('7')
  expect(app.ui.durationInput.upgrade.max).toBe('40')
  expect(app.ui.durationInput.upgrade.value).toBe('14')
  expect(app.ui.deliveryCheck.InitialSU.checked).toBe(true)
  expect(app.ui.deliveryCheck.AllFixSU.checked).toBe(true)
  expect(app.ui.deliveryCheck.PreUpgradeCriticalSU.checked).toBe(true)
  expect(app.ui.deliveryCheck.PostUpgradeSU.checked).toBe(true)

  expect(app.setDefaultDates).toHaveBeenCalledWith(false)
})
