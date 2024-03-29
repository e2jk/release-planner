/**
 * @jest-environment jsdom
 */

const app = require('../app')

describe('Test default variables', () => {
  test('The default upgrade type is Classical', () => {
    expect(app.upgradeType).toStrictEqual({ current: 'Classical', value: 'Classical' })
  })
  test('There are 4 default app.phases', () => {
    expect(app.phases).toHaveLength(4)
    expect(app.phases).toStrictEqual(['analysis', 'build', 'testing', 'training'])
  })

  test('There are 8 default app.environments', () => {
    expect(app.environments).toHaveLength(8)
    expect(app.environments).toStrictEqual(['REL', 'POC', 'TST', 'MST', 'ACE', 'PLY', 'SUP', 'PRD'])
  })

  test('There are 4 default SU Deliveries', () => {
    expect(Object.keys(app.suDeliveries).length).toStrictEqual(4)
    expect(app.suDeliveries).toHaveProperty('PreUpgradeCriticalSU', 'Pre-Upgrade Critical')
    expect(app.suDeliveries).toStrictEqual({
      InitialSU: 'Initial',
      AllFixSU: 'All Fix SUs',
      PreUpgradeCriticalSU: 'Pre-Upgrade Critical',
      PostUpgradeSU: 'Post-Upgrade'
    })
  })

  test('The default `ui` object is empty', () => {
    expect(Object.keys(app.ui).length).toStrictEqual(0)
    expect(app.ui).toStrictEqual({})
  })

  test('There are 5 default app.groups for the timeline', () => {
    expect(app.groups.length).toStrictEqual(5)
    expect(app.groups.getIds()).toStrictEqual(['upgrade', 'phases', 'environments', 'su', 'vacations'])
    expect(app.groups.get('upgrade')).toStrictEqual({
      id: 'upgrade',
      content: 'Upgrade',
      nestedGroups: [
        'phases',
        'environments',
        'su',
        'vacations'
      ]
    })
  })

  test('There are 17 default bars and points for the timeline', () => {
    expect(app.items.length).toStrictEqual(17)
    expect(app.items.getIds()).toStrictEqual([
      'upgradePeriod',
      'analysisPhase',
      'buildPhase',
      'testingPhase',
      'trainingPhase',
      'envREL',
      'envPOC',
      'envTST',
      'envMST',
      'envACE',
      'envPLY',
      'envSUP',
      'envPRD',
      'suInitialSU',
      'suAllFixSU',
      'suPreUpgradeCriticalSU',
      'suPostUpgradeSU'
    ])
    expect(app.items.get('buildPhase')).toStrictEqual({
      id: 'buildPhase',
      group: 'phases',
      content: 'Build'
    })
    expect(app.items.get('envPRD')).toStrictEqual({
      id: 'envPRD',
      group: 'environments',
      content: 'PRD',
      type: 'point'
    })
    expect(app.items.get('suPostUpgradeSU')).toStrictEqual({
      id: 'suPostUpgradeSU',
      group: 'su',
      content: 'Post-Upgrade',
      type: 'point'
    })
  })

  test('The default `app.timelineOptions` object is empty', () => {
    expect(Object.keys(app.timelineOptions).length).toStrictEqual(0)
    expect(app.timelineOptions).toStrictEqual({})
  })
})

describe('If the start date is on a', () => {
  test('Monday, Tuesday, Wednesday or Thursday, it remains the same day', () => {
    // Wednesday
    expect(app.setStartDate('2024-01-17')).toStrictEqual(new Date('2024-01-17'))
    // Thursday
    expect(app.setStartDate('2024-01-18')).toStrictEqual(new Date('2024-01-18'))
    // Monday
    expect(app.setStartDate('2024-01-22')).toStrictEqual(new Date('2024-01-22'))
    // Tuesday
    expect(app.setStartDate('2024-01-23')).toStrictEqual(new Date('2024-01-23'))
  })
  test('Friday, Saturday or Sunday, it moves up to the next Monday', () => {
    // Friday
    expect(app.setStartDate('2024-01-19')).toStrictEqual(new Date('2024-01-22'))
    // Saturday
    expect(app.setStartDate('2024-01-20')).toStrictEqual(new Date('2024-01-22'))
    // Sunday
    expect(app.setStartDate('2024-01-21')).toStrictEqual(new Date('2024-01-22'))
  })
})

describe('If the end date is on a', () => {
  document.body.innerHTML =
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" min="7" max="40" value="14">'
  const startDateInput = document.getElementById('upgradeStartDate')
  const durationWeeksInput = document.getElementById('upgradeDuration')
  const endDateInput = document.getElementById('upgradeEndDate')
  test('Tuesday, Wednesday, Thursday or Friday, it remains the same day', () => {
    // Tuesday
    startDateInput.value = '2024-01-23'
    app.setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-04-30')
    // Wednesday
    startDateInput.value = '2024-01-24'
    app.setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-01')
    // Thursday
    startDateInput.value = '2024-01-25'
    app.setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-02')
    // Friday
    startDateInput.value = '2024-01-26'
    app.setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-03')
  })
  test('Saturday, Sunday or Monday, it moves back to the prior Friday', () => {
    // Saturday
    startDateInput.value = '2024-01-27'
    app.setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-03')
    // Sunday
    startDateInput.value = '2024-01-28'
    app.setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-03')
    // Monday
    startDateInput.value = '2024-01-29'
    app.setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-03')
  })
})

test('The end date is empty when the start date is invalid', () => {
  document.body.innerHTML =
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="XX">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration">'
  const startDateInput = document.getElementById('upgradeStartDate')
  const durationWeeksInput = document.getElementById('upgradeDuration')
  const endDateInput = document.getElementById('upgradeEndDate')
  startDateInput.value = 'XX'
  durationWeeksInput.value = 14
  endDateInput.value = '2024-04-30'
  expect(endDateInput.value).toBe('2024-04-30')
  app.setEndDate(startDateInput, durationWeeksInput, endDateInput)
  expect(endDateInput.value).toBe('')
})

test('Duration between two dates is a rounded number of weeks', () => {
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-01-28'))).toBe(1)
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-01-29'))).toBe(1)
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-01-30'))).toBe(1)
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-01-31'))).toBe(1)
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-01'))).toBe(2)
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-02'))).toBe(2)
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-03'))).toBe(2)
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-04'))).toBe(2)
  expect(app.getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-05'))).toBe(2)
})

test('The UI gets parsed as expected', () => {
  document.body.innerHTML =
  '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="upgradeTypeToggle">Classical upgrade</button>' +
  '<li><a class="dropdown-item active" href="#" id="upgradeTypeClassical">Classical</a></li>' +
  '<li><a class="dropdown-item" href="#" id="upgradeTypeExpedited">Expedited</a></li>' +
  '<select class="form-select" id="versionName" name="versionName"></select>' +
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
  '<div class="row row-gap-3" id="phasesSection">' +
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
  '</div>' +
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
  '<textarea class="form-control" id="chronologicalTextTextarea" rows="10"></textarea>' +
  '<textarea class="form-control" id="chronologicalListTextarea" rows="20"></textarea>' +
  '<textarea class="form-control" id="groupedTextarea" rows="10"></textarea>' +
  '<div id="visualization" class="mt-3"></div>'

  expect(Object.keys(app.ui).length).toStrictEqual(0)
  expect(app.ui).toStrictEqual({})
  app.getUI()
  expect(Object.keys(app.ui).length).toStrictEqual(20)
  expect(app.ui.upgradeTypeToggle.innerHTML).toBe('Classical upgrade')
  expect(app.ui.upgradeType.classical.id).toBe('upgradeTypeClassical')
  expect(app.ui.upgradeType.expedited.id).toBe('upgradeTypeExpedited')
  expect(app.ui.versionNameSelect.id).toBe('versionName')
  expect(app.ui.numVersionsSelect.id).toBe('numVersions')
  expect(app.ui.phasesSection.id).toBe('phasesSection')
  expect(app.ui.textual.chronologicalText.id).toBe('chronologicalTextTextarea')
  expect(app.ui.textual.chronologicalList.id).toBe('chronologicalListTextarea')
  expect(app.ui.textual.grouped.id).toBe('groupedTextarea')
  expect(app.ui.visContainer.className).toBe('mt-3')
  expect(Object.keys(app.ui.startDateInput).length).toBe(5)
  expect(Object.keys(app.ui.endDateInput).length).toBe(5)
  expect(Object.keys(app.ui.durationInput).length).toBe(5)
  expect(Object.keys(app.ui.durationValue).length).toBe(5)
  expect(Object.keys(app.ui.upgradeDateInput).length).toBe(8)
  expect(Object.keys(app.ui.envCheck).length).toBe(8)
  expect(Object.keys(app.ui.deliveryDateInput).length).toBe(4)
})

test('Default phase lengths are calculated', () => {
  expect(app.calculateDefaultPhaseLengths(4)).toStrictEqual([1, 1, 1, 1])
  expect(app.calculateDefaultPhaseLengths(5)).toStrictEqual([1, 1, 2, 1])
  expect(app.calculateDefaultPhaseLengths(6)).toStrictEqual([1, 2, 2, 1])
  expect(app.calculateDefaultPhaseLengths(7)).toStrictEqual([2, 2, 2, 1])
  expect(app.calculateDefaultPhaseLengths(8)).toStrictEqual([2, 2, 2, 2])
  expect(app.calculateDefaultPhaseLengths(9)).toStrictEqual([2, 2, 3, 2])
  expect(app.calculateDefaultPhaseLengths(10)).toStrictEqual([2, 3, 3, 2])
  expect(app.calculateDefaultPhaseLengths(11)).toStrictEqual([3, 3, 3, 2])
  expect(app.calculateDefaultPhaseLengths(12)).toStrictEqual([3, 3, 3, 3])
  expect(app.calculateDefaultPhaseLengths(13)).toStrictEqual([3, 3, 4, 3])
  expect(app.calculateDefaultPhaseLengths(14)).toStrictEqual([3, 4, 4, 3])
  expect(app.calculateDefaultPhaseLengths(15)).toStrictEqual([4, 4, 4, 3])
  expect(app.calculateDefaultPhaseLengths(16)).toStrictEqual([4, 4, 4, 4])
  expect(app.calculateDefaultPhaseLengths(17)).toStrictEqual([4, 4, 5, 4])
  expect(app.calculateDefaultPhaseLengths(18)).toStrictEqual([4, 5, 5, 4])
  expect(app.calculateDefaultPhaseLengths(19)).toStrictEqual([5, 5, 5, 4])
  expect(app.calculateDefaultPhaseLengths(20)).toStrictEqual([5, 5, 6, 4])
  expect(app.calculateDefaultPhaseLengths(21)).toStrictEqual([5, 6, 6, 4])
  expect(app.calculateDefaultPhaseLengths(22)).toStrictEqual([6, 6, 6, 4])
  expect(app.calculateDefaultPhaseLengths(23)).toStrictEqual([6, 6, 7, 4])
  expect(app.calculateDefaultPhaseLengths(24)).toStrictEqual([6, 7, 7, 4])
  expect(app.calculateDefaultPhaseLengths(25)).toStrictEqual([7, 7, 7, 4])
  expect(app.calculateDefaultPhaseLengths(26)).toStrictEqual([7, 7, 8, 4])
  expect(app.calculateDefaultPhaseLengths(27)).toStrictEqual([7, 8, 8, 4])
  expect(app.calculateDefaultPhaseLengths(28)).toStrictEqual([8, 8, 8, 4])
  expect(app.calculateDefaultPhaseLengths(29)).toStrictEqual([8, 8, 9, 4])
  expect(app.calculateDefaultPhaseLengths(30)).toStrictEqual([8, 9, 9, 4])
  expect(app.calculateDefaultPhaseLengths(31)).toStrictEqual([9, 9, 9, 4])
  expect(app.calculateDefaultPhaseLengths(32)).toStrictEqual([9, 9, 10, 4])
  expect(app.calculateDefaultPhaseLengths(33)).toStrictEqual([9, 10, 10, 4])
  expect(app.calculateDefaultPhaseLengths(34)).toStrictEqual([10, 10, 10, 4])
  expect(app.calculateDefaultPhaseLengths(35)).toStrictEqual([10, 10, 11, 4])
  expect(app.calculateDefaultPhaseLengths(36)).toStrictEqual([10, 11, 11, 4])
  expect(app.calculateDefaultPhaseLengths(37)).toStrictEqual([11, 11, 11, 4])
  expect(app.calculateDefaultPhaseLengths(38)).toStrictEqual([11, 11, 12, 4])
  expect(app.calculateDefaultPhaseLengths(39)).toStrictEqual([11, 12, 12, 4])
  expect(app.calculateDefaultPhaseLengths(40)).toStrictEqual([12, 12, 12, 4])
})

test('Duration fields are updated with default phase lengths', () => {
  document.body.innerHTML =
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" value="26">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration">' +
    '<small class="text-body-secondary" id="analysisDurationValue">4 weeks</small>' +
    '<input type="range" class="form-range" id="analysisDuration" name="analysisDuration" min="1">' +
    '<small class="text-body-secondary" id="buildDurationValue">4 weeks</small>' +
    '<input type="range" class="form-range" id="buildDuration" name="buildDuration" min="1">' +
    '<small class="text-body-secondary" id="testingDurationValue">4 weeks</small>' +
    '<input type="range" class="form-range" id="testingDuration" name="testingDuration" min="1">' +
    '<small class="text-body-secondary" id="trainingDurationValue">4 weeks</small>' +
    '<input type="range" class="form-range" id="trainingDuration" name="trainingDuration" min="1">'
  app.getUI()
  app.determineDefaultPhaseLengths()
  expect(app.ui.durationInput.analysis.value).toBe('7')
  expect(app.ui.durationInput.build.value).toBe('7')
  expect(app.ui.durationInput.testing.value).toBe('8')
  expect(app.ui.durationInput.training.value).toBe('4')
  expect(app.ui.durationInput.analysis.max).toBe('26')
  expect(app.ui.durationInput.build.max).toBe('26')
  expect(app.ui.durationInput.testing.max).toBe('26')
  expect(app.ui.durationInput.training.max).toBe('26')
  expect(app.ui.durationValue.analysis.textContent).toBe('7 weeks')
  expect(app.ui.durationValue.build.textContent).toBe('7 weeks')
  expect(app.ui.durationValue.testing.textContent).toBe('8 weeks')
  expect(app.ui.durationValue.training.textContent).toBe('4 weeks')
})

test('Visualization point date update sets its start time at 08:00', () => {
  expect(app.items.get('envPOC').start).toBe(undefined)
  app.updateVisItemDate('envPOC', '2024-01-24', 'startPoint')
  expect(app.items.get('envPOC').start).toBe(new Date('2024-01-24').setHours(8, 0, 0, 0))
})

test('Visualization phase date update sets its start time', () => {
  expect(app.items.get('trainingPhase').start).toBe(undefined)
  app.updateVisItemDate('trainingPhase', '2024-01-15', 'startPhase')
  expect(app.items.get('trainingPhase').start).toBe('2024-01-15')
})

test('Visualization phase date update sets its end time at 23:59:59', () => {
  expect(app.items.get('testingPhase').end).toBe(undefined)
  app.updateVisItemDate('testingPhase', '2024-01-25', 'end')
  expect(app.items.get('testingPhase').end).toBe(new Date('2024-01-25').setHours(23, 59, 59, 0))
})

test('Visualization app.items content gets updated', () => {
  expect(app.items.get('upgradePeriod').content).toBe(undefined)
  app.updateVisItemContent('upgradePeriod', 'This is the new item name')
  expect(app.items.get('upgradePeriod').content).toBe('This is the new item name')
})

test('Visualization group content gets updated', () => {
  expect(app.groups.get('upgrade').content).toBe('Upgrade')
  app.updateVisGroupContent('upgrade', 'This is the new group name')
  expect(app.groups.get('upgrade').content).toBe('This is the new group name')
})

test('Format date in YYYY-MM-DD format', () => {
  expect(app.formatDate(new Date('2023-12-01'))).toBe('2023-12-01')
  expect(app.formatDate(new Date('2024-01-28'))).toBe('2024-01-28')
})

test('Add N days to a date', () => {
  expect(app.dateAddNDays(new Date('2024-01-28'), -3)).toStrictEqual(new Date('2024-01-25'))
  expect(app.dateAddNDays(new Date('2024-01-28'), -1)).toStrictEqual(new Date('2024-01-27'))
  expect(app.dateAddNDays(new Date('2024-01-28'), 0)).toStrictEqual(new Date('2024-01-28'))
  expect(app.dateAddNDays(new Date('2024-01-28'), 1)).toStrictEqual(new Date('2024-01-29'))
  expect(app.dateAddNDays(new Date('2024-01-28'), 3)).toStrictEqual(new Date('2024-01-31'))
})

test('Getter and setter for app.upgradeType', () => {
  expect(app.upgradeType).toStrictEqual({ current: 'Classical', value: 'Classical' })
  app.upgradeType.current = 'Expedited'
  expect(app.upgradeType).toStrictEqual({ current: 'Expedited', value: 'Expedited' })
  app.upgradeType.current = 'Classical'
  expect(app.upgradeType).toStrictEqual({ current: 'Classical', value: 'Classical' })
})

test('Add day name in English', () => {
  expect(app.dateInEnglish('2024-02-04')).toBe('Sunday 2024-02-04')
  expect(app.dateInEnglish('2024-02-05')).toBe('Monday 2024-02-05')
  expect(app.dateInEnglish('2024-02-06')).toBe('Tuesday 2024-02-06')
  expect(app.dateInEnglish('2024-02-07')).toBe('Wednesday 2024-02-07')
  expect(app.dateInEnglish('2024-02-08')).toBe('Thursday 2024-02-08')
  expect(app.dateInEnglish('2024-02-09')).toBe('Friday 2024-02-09')
  expect(app.dateInEnglish('2024-02-10')).toBe('Saturday 2024-02-10')
})

test('Generate textual representations of a classical upgrade project', () => {
  document.body.innerHTML =
    '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="upgradeTypeToggle">Classical upgrade</button>' +
    '<li><a class="dropdown-item active" href="#" id="upgradeTypeClassical">Classical</a></li>' +
    '<li><a class="dropdown-item" href="#" id="upgradeTypeExpedited">Expedited</a></li>' +
    '<select class="form-select" id="versionName" name="versionName">' +
    '<option value="2023-05">May 2023</option>' +
    '<option value="2023-08" selected>August 2023</option>' +
    '<option value="2023-11">November 2023</option>' +
    '</select>' +
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-02-04">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate" value="2024-10-01">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" value="8">' +
    '<input type="range" class="form-range" id="analysisDuration" name="analysisDuration" min="1" value="1">' +
    '<input type="date" class="form-control" id="analysisStartDate" name="analysisStartDate" aria-label="Analysis Start Date" aria-describedby="basic-addon-asd" value="2024-02-05">' +
    '<input type="date" class="form-control" id="analysisEndDate" name="analysisEndDate" aria-label="Analysis End Date" aria-describedby="basic-addon-aed" value="2024-02-06">' +
    '<input type="range" class="form-range" id="buildDuration" name="buildDuration" min="1" value="2">' +
    '<input type="date" class="form-control" id="buildStartDate" name="buildStartDate" aria-label="Build Start Date" aria-describedby="basic-addon-bsd" value="2024-02-07">' +
    '<input type="date" class="form-control" id="buildEndDate" name="buildEndDate" aria-label="Build End Date" aria-describedby="basic-addon-bed" value="2024-02-08">' +
    '<input type="range" class="form-range" id="testingDuration" name="testingDuration" min="1" value="3">' +
    '<input type="date" class="form-control" id="testingStartDate" name="testingStartDate" aria-label="Testing Start Date" aria-describedby="basic-addon-tesd" value="2024-02-09">' +
    '<input type="date" class="form-control" id="testingEndDate" name="testingEndDate" aria-label="Testing End Date" aria-describedby="basic-addon-teed" value="2024-02-10">' +
    '<input type="range" class="form-range" id="trainingDuration" name="trainingDuration" min="1" value="4">' +
    '<input type="date" class="form-control" id="trainingStartDate" name="trainingStartDate" aria-label="Training Start Date" aria-describedby="basic-addon-trsd" value="2024-02-11">' +
    '<input type="date" class="form-control" id="trainingEndDate" name="trainingEndDate" aria-label="Training End Date" aria-describedby="basic-addon-tred" value="2024-02-12">' +
    '<input type="date" class="form-control" id="RELUpgradeDate" name="RELUpgradeDate" aria-label="REL Upgrade Date" aria-describedby="basic-addon-udREL" value="2024-02-13">' +
    '<input type="date" class="form-control" id="POCUpgradeDate" name="POCUpgradeDate" aria-label="POC Upgrade Date" aria-describedby="basic-addon-udPOC" value="2024-02-14">' +
    '<input type="date" class="form-control" id="TSTUpgradeDate" name="TSTUpgradeDate" aria-label="TST Upgrade Date" aria-describedby="basic-addon-udTST" value="2024-02-15">' +
    '<input type="date" class="form-control" id="PLYUpgradeDate" name="PLYUpgradeDate" aria-label="PLY Upgrade Date" aria-describedby="basic-addon-udPLY" value="2024-02-16">' +
    '<input type="date" class="form-control" id="MSTUpgradeDate" name="MSTUpgradeDate" aria-label="MST Upgrade Date" aria-describedby="basic-addon-udMST" value="2024-02-17">' +
    '<input type="date" class="form-control" id="ACEUpgradeDate" name="ACEUpgradeDate" aria-label="ACE Upgrade Date" aria-describedby="basic-addon-udACE" value="2024-02-18">' +
    '<input type="date" class="form-control" id="SUPUpgradeDate" name="SUPUpgradeDate" aria-label="SUP Upgrade Date" aria-describedby="basic-addon-udSUP" value="2024-02-19">' +
    '<input type="date" class="form-control" id="PRDUpgradeDate" name="PRDUpgradeDate" aria-label="PRD Upgrade Date" aria-describedby="basic-addon-udPRD" value="2024-02-20">' +
    '<input type="date" class="form-control" id="InitialSUDeliveryDate" name="InitialSUDeliveryDate" aria-label="Initial SU Delivery Date" aria-describedby="basic-addon-SUInitial" value="2024-02-21">' +
    '<input type="date" class="form-control" id="AllFixSUDeliveryDate" name="AllFixSUDeliveryDate" aria-label="All Fix SUs Delivery Date" aria-describedby="basic-addon-SUAllFix" value="2024-02-22">' +
    '<input type="date" class="form-control" id="PreUpgradeCriticalSUDeliveryDate" name="PreUpgradeCriticalSUDeliveryDate" aria-label="Pre-Upgrade Critical SU Delivery Date" aria-describedby="basic-addon-SUPreUpgradeCritical" value="2024-02-23">' +
    '<input type="date" class="form-control" id="PostUpgradeSUDeliveryDate" name="PostUpgradeSUDeliveryDate" aria-label="Post-Upgrade SU Delivery Date" aria-describedby="basic-addon-SUPostUpgrade" value="2024-02-24">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckREL" aria-label="Checkbox to include REL upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPOC" aria-label="Checkbox to include POC upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckTST" aria-label="Checkbox to include TST upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPLY" aria-label="Checkbox to include PLY upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckMST" aria-label="Checkbox to include MST upgrade">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckACE" aria-label="Checkbox to include ACE upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckSUP" aria-label="Checkbox to include SUP upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPRD" aria-label="Checkbox to include PRD upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckInitialSU" aria-label="Checkbox to include Initial SU delivery" checked>&nbsp;' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckAllFixSU" aria-label="Checkbox to include All Fix SUs delivery" checked>&nbsp;' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPreUpgradeCriticalSU" aria-label="Checkbox to include Pre-Upgrade Critical SU delivery">&nbsp;' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPostUpgradeSU" aria-label="Checkbox to include Post-Upgrade SU delivery" checked>&nbsp;' +
    '<textarea class="form-control" id="chronologicalTextTextarea" rows="20"></textarea>' +
    '<textarea class="form-control" id="chronologicalListTextarea" rows="20"></textarea>' +
    '<textarea class="form-control" id="groupedTextarea" rows="20"></textarea>'
  app.getUI()

  expect(app.upgradeType).toStrictEqual({ current: 'Classical', value: 'Classical' })
  expect(app.ui.durationInput.upgrade.value).toBe('8')
  app.generateTextualRepresentations()

  expect(app.ui.textual.chronologicalText.innerHTML).toBe(
`The upgrade to version August 2023 will last 8 weeks and take place from Sunday 2024-02-04 to Tuesday 2024-10-01.

- The Analysis phase will last 1 weeks and take place from Monday 2024-02-05 to Tuesday 2024-02-06.
- The Build phase will last 2 weeks and take place from Wednesday 2024-02-07 to Thursday 2024-02-08.
- The Testing phase will last 3 weeks and take place from Friday 2024-02-09 to Saturday 2024-02-10.
- The Training phase will last 4 weeks and take place from Sunday 2024-02-11 to Monday 2024-02-12.
- The REL environment will be upgraded on Tuesday 2024-02-13.
- The POC environment will be upgraded on Wednesday 2024-02-14.
- The TST environment will be upgraded on Thursday 2024-02-15.
- The PLY environment will be upgraded on Friday 2024-02-16.
- The ACE environment will be upgraded on Sunday 2024-02-18.
- The SUP environment will be upgraded on Monday 2024-02-19.
- The PRD environment will be upgraded on Tuesday 2024-02-20.
- The Initial SU package will be delivered on Wednesday 2024-02-21.
- The All Fix SUs SU package will be delivered on Thursday 2024-02-22.
- The Post-Upgrade SU package will be delivered on Saturday 2024-02-24.`
  )

  expect(app.ui.textual.chronologicalList.innerHTML).toBe(
`The upgrade to version August 2023 will last 8 weeks and take place from Sunday 2024-02-04 to Tuesday 2024-10-01.

- 2024-02-05: Analysis start
- 2024-02-07: Build start
- 2024-02-09: Testing start
- 2024-02-11: Training start
- 2024-02-13: REL environment upgrade
- 2024-02-14: POC environment upgrade
- 2024-02-15: TST environment upgrade
- 2024-02-16: PLY environment upgrade
- 2024-02-18: ACE environment upgrade
- 2024-02-19: SUP environment upgrade
- 2024-02-20: PRD environment upgrade
- 2024-02-21: Initial SU package delivery
- 2024-02-22: All Fix SUs SU package delivery
- 2024-02-24: Post-Upgrade SU package delivery`
  )

  expect(app.ui.textual.grouped.innerHTML).toBe(
`The upgrade to version August 2023 will last 8 weeks and take place from Sunday 2024-02-04 to Tuesday 2024-10-01.

Phases:
- The Analysis phase will last 1 weeks and take place from Monday 2024-02-05 to Tuesday 2024-02-06.
- The Build phase will last 2 weeks and take place from Wednesday 2024-02-07 to Thursday 2024-02-08.
- The Testing phase will last 3 weeks and take place from Friday 2024-02-09 to Saturday 2024-02-10.
- The Training phase will last 4 weeks and take place from Sunday 2024-02-11 to Monday 2024-02-12.

Environments:
- The REL environment will be upgraded on Tuesday 2024-02-13.
- The POC environment will be upgraded on Wednesday 2024-02-14.
- The TST environment will be upgraded on Thursday 2024-02-15.
- The ACE environment will be upgraded on Sunday 2024-02-18.
- The PLY environment will be upgraded on Friday 2024-02-16.
- The SUP environment will be upgraded on Monday 2024-02-19.
- The PRD environment will be upgraded on Tuesday 2024-02-20.

SU deliveries:
- The Initial SU package will be delivered on Wednesday 2024-02-21.
- The All Fix SUs SU package will be delivered on Thursday 2024-02-22.
- The Post-Upgrade SU package will be delivered on Saturday 2024-02-24.`
  )
})

test('Generate textual representations of an expedited upgrade project', () => {
  document.body.innerHTML =
    '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="upgradeTypeToggle">Classical upgrade</button>' +
    '<li><a class="dropdown-item" href="#" id="upgradeTypeClassical">Classical</a></li>' +
    '<li><a class="dropdown-item active" href="#" id="upgradeTypeExpedited">Expedited</a></li>' +
    '<select class="form-select" id="versionName" name="versionName">' +
    '<option value="2023-05">May 2023</option>' +
    '<option value="2023-08" selected>August 2023</option>' +
    '<option value="2023-11">November 2023</option>' +
    '</select>' +
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-02-04">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate" value="2024-10-01">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" value="8">' +
    '<input type="range" class="form-range" id="analysisDuration" name="analysisDuration" min="1" value="1">' +
    '<input type="date" class="form-control" id="analysisStartDate" name="analysisStartDate" aria-label="Analysis Start Date" aria-describedby="basic-addon-asd" value="2024-02-05">' +
    '<input type="date" class="form-control" id="analysisEndDate" name="analysisEndDate" aria-label="Analysis End Date" aria-describedby="basic-addon-aed" value="2024-02-06">' +
    '<input type="range" class="form-range" id="buildDuration" name="buildDuration" min="1" value="2">' +
    '<input type="date" class="form-control" id="buildStartDate" name="buildStartDate" aria-label="Build Start Date" aria-describedby="basic-addon-bsd" value="2024-02-07">' +
    '<input type="date" class="form-control" id="buildEndDate" name="buildEndDate" aria-label="Build End Date" aria-describedby="basic-addon-bed" value="2024-02-08">' +
    '<input type="range" class="form-range" id="testingDuration" name="testingDuration" min="1" value="3">' +
    '<input type="date" class="form-control" id="testingStartDate" name="testingStartDate" aria-label="Testing Start Date" aria-describedby="basic-addon-tesd" value="2024-02-09">' +
    '<input type="date" class="form-control" id="testingEndDate" name="testingEndDate" aria-label="Testing End Date" aria-describedby="basic-addon-teed" value="2024-02-10">' +
    '<input type="range" class="form-range" id="trainingDuration" name="trainingDuration" min="1" value="4">' +
    '<input type="date" class="form-control" id="trainingStartDate" name="trainingStartDate" aria-label="Training Start Date" aria-describedby="basic-addon-trsd" value="2024-02-11">' +
    '<input type="date" class="form-control" id="trainingEndDate" name="trainingEndDate" aria-label="Training End Date" aria-describedby="basic-addon-tred" value="2024-02-12">' +
    '<input type="date" class="form-control" id="RELUpgradeDate" name="RELUpgradeDate" aria-label="REL Upgrade Date" aria-describedby="basic-addon-udREL" value="2024-02-13">' +
    '<input type="date" class="form-control" id="POCUpgradeDate" name="POCUpgradeDate" aria-label="POC Upgrade Date" aria-describedby="basic-addon-udPOC" value="2024-02-14">' +
    '<input type="date" class="form-control" id="TSTUpgradeDate" name="TSTUpgradeDate" aria-label="TST Upgrade Date" aria-describedby="basic-addon-udTST" value="2024-02-15">' +
    '<input type="date" class="form-control" id="PLYUpgradeDate" name="PLYUpgradeDate" aria-label="PLY Upgrade Date" aria-describedby="basic-addon-udPLY" value="2024-02-16">' +
    '<input type="date" class="form-control" id="MSTUpgradeDate" name="MSTUpgradeDate" aria-label="MST Upgrade Date" aria-describedby="basic-addon-udMST" value="2024-02-17">' +
    '<input type="date" class="form-control" id="ACEUpgradeDate" name="ACEUpgradeDate" aria-label="ACE Upgrade Date" aria-describedby="basic-addon-udACE" value="2024-02-18">' +
    '<input type="date" class="form-control" id="SUPUpgradeDate" name="SUPUpgradeDate" aria-label="SUP Upgrade Date" aria-describedby="basic-addon-udSUP" value="2024-02-19">' +
    '<input type="date" class="form-control" id="PRDUpgradeDate" name="PRDUpgradeDate" aria-label="PRD Upgrade Date" aria-describedby="basic-addon-udPRD" value="2024-02-20">' +
    '<input type="date" class="form-control" id="InitialSUDeliveryDate" name="InitialSUDeliveryDate" aria-label="Initial SU Delivery Date" aria-describedby="basic-addon-SUInitial" value="2024-02-21">' +
    '<input type="date" class="form-control" id="AllFixSUDeliveryDate" name="AllFixSUDeliveryDate" aria-label="All Fix SUs Delivery Date" aria-describedby="basic-addon-SUAllFix" value="2024-02-22">' +
    '<input type="date" class="form-control" id="PreUpgradeCriticalSUDeliveryDate" name="PreUpgradeCriticalSUDeliveryDate" aria-label="Pre-Upgrade Critical SU Delivery Date" aria-describedby="basic-addon-SUPreUpgradeCritical" value="2024-02-23">' +
    '<input type="date" class="form-control" id="PostUpgradeSUDeliveryDate" name="PostUpgradeSUDeliveryDate" aria-label="Post-Upgrade SU Delivery Date" aria-describedby="basic-addon-SUPostUpgrade" value="2024-02-24">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckREL" aria-label="Checkbox to include REL upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPOC" aria-label="Checkbox to include POC upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckTST" aria-label="Checkbox to include TST upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPLY" aria-label="Checkbox to include PLY upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckMST" aria-label="Checkbox to include MST upgrade">' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckACE" aria-label="Checkbox to include ACE upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckSUP" aria-label="Checkbox to include SUP upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="envCheckPRD" aria-label="Checkbox to include PRD upgrade" checked>' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckInitialSU" aria-label="Checkbox to include Initial SU delivery" checked>&nbsp;' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckAllFixSU" aria-label="Checkbox to include All Fix SUs delivery" checked>&nbsp;' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPreUpgradeCriticalSU" aria-label="Checkbox to include Pre-Upgrade Critical SU delivery">&nbsp;' +
    '<input class="form-check-input mt-0" type="checkbox" value="" id="SUCheckPostUpgradeSU" aria-label="Checkbox to include Post-Upgrade SU delivery" checked>&nbsp;' +
    '<textarea class="form-control" id="chronologicalTextTextarea" rows="20"></textarea>' +
    '<textarea class="form-control" id="chronologicalListTextarea" rows="20"></textarea>' +
    '<textarea class="form-control" id="groupedTextarea" rows="20"></textarea>'
  app.getUI()

  expect(app.upgradeType).toStrictEqual({ current: 'Classical', value: 'Classical' })
  app.upgradeType.current = 'Expedited'
  expect(app.upgradeType).toStrictEqual({ current: 'Expedited', value: 'Expedited' })
  expect(app.ui.durationInput.upgrade.value).toBe('8')
  app.generateTextualRepresentations()

  expect(app.ui.textual.chronologicalText.innerHTML).toBe(
`The expedited upgrade to version August 2023 will last 8 weeks and take place from Sunday 2024-02-04 to Tuesday 2024-10-01.

- The REL environment will be upgraded on Tuesday 2024-02-13.
- The POC environment will be upgraded on Wednesday 2024-02-14.
- The TST environment will be upgraded on Thursday 2024-02-15.
- The PLY environment will be upgraded on Friday 2024-02-16.
- The ACE environment will be upgraded on Sunday 2024-02-18.
- The SUP environment will be upgraded on Monday 2024-02-19.
- The PRD environment will be upgraded on Tuesday 2024-02-20.
- The Initial SU package will be delivered on Wednesday 2024-02-21.
- The All Fix SUs SU package will be delivered on Thursday 2024-02-22.
- The Post-Upgrade SU package will be delivered on Saturday 2024-02-24.`
  )

  expect(app.ui.textual.chronologicalList.innerHTML).toBe(
`The expedited upgrade to version August 2023 will last 8 weeks and take place from Sunday 2024-02-04 to Tuesday 2024-10-01.

- 2024-02-13: REL environment upgrade
- 2024-02-14: POC environment upgrade
- 2024-02-15: TST environment upgrade
- 2024-02-16: PLY environment upgrade
- 2024-02-18: ACE environment upgrade
- 2024-02-19: SUP environment upgrade
- 2024-02-20: PRD environment upgrade
- 2024-02-21: Initial SU package delivery
- 2024-02-22: All Fix SUs SU package delivery
- 2024-02-24: Post-Upgrade SU package delivery`
  )

  expect(app.ui.textual.grouped.innerHTML).toBe(
`The expedited upgrade to version August 2023 will last 8 weeks and take place from Sunday 2024-02-04 to Tuesday 2024-10-01.

Environments:
- The REL environment will be upgraded on Tuesday 2024-02-13.
- The POC environment will be upgraded on Wednesday 2024-02-14.
- The TST environment will be upgraded on Thursday 2024-02-15.
- The ACE environment will be upgraded on Sunday 2024-02-18.
- The PLY environment will be upgraded on Friday 2024-02-16.
- The SUP environment will be upgraded on Monday 2024-02-19.
- The PRD environment will be upgraded on Tuesday 2024-02-20.

SU deliveries:
- The Initial SU package will be delivered on Wednesday 2024-02-21.
- The All Fix SUs SU package will be delivered on Thursday 2024-02-22.
- The Post-Upgrade SU package will be delivered on Saturday 2024-02-24.`
  )
})
