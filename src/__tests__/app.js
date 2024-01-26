/**
 * @jest-environment jsdom
 */

const {
  phases,
  environments,
  suDeliveries,
  ui,
  groups,
  items,
  timelineOptions,
  getUI,
  setStartDate,
  setEndDate,
  getRoundedNumberOfWeeks,
  calculateDefaultPhaseLengths,
  determineDefaultPhaseLengths,
  updateVisItemDate,
  updateVisItemContent,
  updateVisGroupContent
} = require('../app')

describe('Test default variables', () => {
  test('There are 4 default Phases', () => {
    expect(phases).toHaveLength(4)
    expect(phases).toStrictEqual(['analysis', 'build', 'testing', 'training'])
  })

  test('There are 8 default Environments', () => {
    expect(environments).toHaveLength(8)
    expect(environments).toStrictEqual(['REL', 'POC', 'TST', 'MST', 'ACE', 'PLY', 'SUP', 'PRD'])
  })

  test('There are 4 default SU Deliveries', () => {
    expect(Object.keys(suDeliveries).length).toStrictEqual(4)
    expect(suDeliveries).toHaveProperty('PreUpgradeCriticalSU', 'Pre-Upgrade Critical')
    expect(suDeliveries).toStrictEqual({
      InitialSU: 'Initial',
      AllFixSU: 'All Fix SUs',
      PreUpgradeCriticalSU: 'Pre-Upgrade Critical',
      PostUpgradeSU: 'Post-Upgrade'
    })
  })

  test('The default `ui` object is empty', () => {
    expect(Object.keys(ui).length).toStrictEqual(0)
    expect(ui).toStrictEqual({})
  })

  test('There are 4 default groups for the timeline', () => {
    expect(groups.length).toStrictEqual(4)
    expect(groups.getIds()).toStrictEqual(['upgrade', 'phases', 'environments', 'su'])
    expect(groups.get('upgrade')).toStrictEqual({
      id: 'upgrade',
      content: 'Upgrade',
      nestedGroups: [
        'phases',
        'environments',
        'su'
      ]
    })
  })

  test('There are 17 default bars and points for the timeline', () => {
    expect(items.length).toStrictEqual(17)
    expect(items.getIds()).toStrictEqual([
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
    expect(items.get('buildPhase')).toStrictEqual({
      id: 'buildPhase',
      group: 'phases',
      content: 'Build'
    })
    expect(items.get('envPRD')).toStrictEqual({
      id: 'envPRD',
      group: 'environments',
      content: 'PRD',
      type: 'point'
    })
    expect(items.get('suPostUpgradeSU')).toStrictEqual({
      id: 'suPostUpgradeSU',
      group: 'su',
      content: 'Post-Upgrade',
      type: 'point'
    })
  })

  test('The default `timelineOptions` object is empty', () => {
    expect(Object.keys(timelineOptions).length).toStrictEqual(0)
    expect(timelineOptions).toStrictEqual({})
  })
})

describe('If the start date is on a', () => {
  test('Monday, Tuesday, Wednesday or Thursday, it remains the same day', () => {
    // Wednesday
    expect(setStartDate('2024-01-17')).toStrictEqual(new Date('2024-01-17'))
    // Thursday
    expect(setStartDate('2024-01-18')).toStrictEqual(new Date('2024-01-18'))
    // Monday
    expect(setStartDate('2024-01-22')).toStrictEqual(new Date('2024-01-22'))
    // Tuesday
    expect(setStartDate('2024-01-23')).toStrictEqual(new Date('2024-01-23'))
  })
  test('Friday, Saturday or Sunday, it moves up to the next Monday', () => {
    // Friday
    expect(setStartDate('2024-01-19')).toStrictEqual(new Date('2024-01-22'))
    // Saturday
    expect(setStartDate('2024-01-20')).toStrictEqual(new Date('2024-01-22'))
    // Sunday
    expect(setStartDate('2024-01-21')).toStrictEqual(new Date('2024-01-22'))
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
    setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-04-30')
    // Wednesday
    startDateInput.value = '2024-01-24'
    setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-01')
    // Thursday
    startDateInput.value = '2024-01-25'
    setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-02')
    // Friday
    startDateInput.value = '2024-01-26'
    setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-03')
  })
  test('Saturday, Sunday or Monday, it moves back to the prior Friday', () => {
    // Saturday
    startDateInput.value = '2024-01-27'
    setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-03')
    // Sunday
    startDateInput.value = '2024-01-28'
    setEndDate(startDateInput, durationWeeksInput, endDateInput)
    expect(endDateInput.value).toBe('2024-05-03')
    // Monday
    startDateInput.value = '2024-01-29'
    setEndDate(startDateInput, durationWeeksInput, endDateInput)
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
  setEndDate(startDateInput, durationWeeksInput, endDateInput)
  expect(endDateInput.value).toBe('')
})

test('Duration between two dates is a rounded number of weeks', () => {
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-01-28'))).toBe(1)
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-01-29'))).toBe(1)
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-01-30'))).toBe(1)
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-01-31'))).toBe(1)
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-01'))).toBe(2)
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-02'))).toBe(2)
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-03'))).toBe(2)
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-04'))).toBe(2)
  expect(getRoundedNumberOfWeeks(new Date('2024-01-21'), new Date('2024-02-05'))).toBe(2)
})

test('The UI gets parsed as expected', () => {
  document.body.innerHTML =
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
  '<input type="date" class="form-control" id="RELUpgradeDate" name="RELUpgradeDate" aria-label="REL Upgrade Date" aria-describedby="basic-addon-udREL">' +
  '<input type="date" class="form-control" id="POCUpgradeDate" name="POCUpgradeDate" aria-label="POC Upgrade Date" aria-describedby="basic-addon-udPOC">' +
  '<input type="date" class="form-control" id="TSTUpgradeDate" name="TSTUpgradeDate" aria-label="TST Upgrade Date" aria-describedby="basic-addon-udTST">' +
  '<input type="date" class="form-control" id="PLYUpgradeDate" name="PLYUpgradeDate" aria-label="PLY Upgrade Date" aria-describedby="basic-addon-udPLY">' +
  '<input type="date" class="form-control" id="MSTUpgradeDate" name="MSTUpgradeDate" aria-label="MST Upgrade Date" aria-describedby="basic-addon-udMST">' +
  '<input type="date" class="form-control" id="ACEUpgradeDate" name="ACEUpgradeDate" aria-label="ACE Upgrade Date" aria-describedby="basic-addon-udACE">' +
  '<input type="date" class="form-control" id="SUPUpgradeDate" name="SUPUpgradeDate" aria-label="SUP Upgrade Date" aria-describedby="basic-addon-udSUP">' +
  '<input type="date" class="form-control" id="PRDUpgradeDate" name="PRDUpgradeDate" aria-label="PRD Upgrade Date" aria-describedby="basic-addon-udPRD">' +
  '<input type="date" class="form-control" id="InitialSUDeliveryDate" name="InitialSUDeliveryDate" aria-label="Initial SU Delivery Date" aria-describedby="basic-addon-SUInitial">' +
  '<input type="date" class="form-control" id="AllFixSUDeliveryDate" name="AllFixSUDeliveryDate" aria-label="All Fix SUs Delivery Date" aria-describedby="basic-addon-SUAllFix">' +
  '<input type="date" class="form-control" id="PreUpgradeCriticalSUDeliveryDate" name="PreUpgradeCriticalSUDeliveryDate" aria-label="Pre-Upgrade Critical SU Delivery Date" aria-describedby="basic-addon-SUPreUpgradeCritical">' +
  '<input type="date" class="form-control" id="PostUpgradeSUDeliveryDate" name="PostUpgradeSUDeliveryDate" aria-label="Post-Upgrade SU Delivery Date" aria-describedby="basic-addon-SUPostUpgrade">' +
  '<div id="visualization" class="mt-3"></div>'

  expect(Object.keys(ui).length).toStrictEqual(0)
  expect(ui).toStrictEqual({})
  getUI()
  expect(Object.keys(ui).length).toStrictEqual(9)
  expect(ui.versionNameSelect.id).toBe('versionName')
  expect(ui.numVersionsSelect.id).toBe('numVersions')
  expect(ui.visContainer.className).toBe('mt-3')
  expect(Object.keys(ui.startDateInput).length).toBe(5)
  expect(Object.keys(ui.endDateInput).length).toBe(5)
  expect(Object.keys(ui.durationInput).length).toBe(5)
  expect(Object.keys(ui.durationValue).length).toBe(5)
  expect(Object.keys(ui.upgradeDateInput).length).toBe(8)
  expect(Object.keys(ui.deliveryDateInput).length).toBe(4)
})

test('Default phase lengths are calculated', () => {
  expect(calculateDefaultPhaseLengths(7)).toStrictEqual([2, 2, 1, 2])
  expect(calculateDefaultPhaseLengths(10)).toStrictEqual([3, 3, 2, 2])
  expect(calculateDefaultPhaseLengths(14)).toStrictEqual([4, 4, 3, 3])
  expect(calculateDefaultPhaseLengths(18)).toStrictEqual([5, 5, 4, 4])
  expect(calculateDefaultPhaseLengths(21)).toStrictEqual([6, 6, 5, 4])
  expect(calculateDefaultPhaseLengths(26)).toStrictEqual([7, 8, 7, 4])
  expect(calculateDefaultPhaseLengths(28)).toStrictEqual([8, 8, 8, 4])
  expect(calculateDefaultPhaseLengths(40)).toStrictEqual([12, 12, 12, 4])
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
  getUI()
  determineDefaultPhaseLengths()
  expect(ui.durationInput.analysis.value).toBe('7')
  expect(ui.durationInput.build.value).toBe('8')
  expect(ui.durationInput.testing.value).toBe('7')
  expect(ui.durationInput.training.value).toBe('4')
  expect(ui.durationInput.analysis.max).toBe('26')
  expect(ui.durationInput.build.max).toBe('26')
  expect(ui.durationInput.testing.max).toBe('26')
  expect(ui.durationInput.training.max).toBe('26')
  expect(ui.durationValue.analysis.textContent).toBe('7 weeks')
  expect(ui.durationValue.build.textContent).toBe('8 weeks')
  expect(ui.durationValue.testing.textContent).toBe('7 weeks')
  expect(ui.durationValue.training.textContent).toBe('4 weeks')
})

test('Visualization point date update sets its start time at 08:00', () => {
  expect(items.get('envPOC').start).toBe(undefined)
  updateVisItemDate('envPOC', '2024-01-24', 'startPoint')
  expect(items.get('envPOC').start).toBe(new Date('2024-01-24').setHours(8, 0, 0, 0))
})

test('Visualization phase date update sets its start time', () => {
  expect(items.get('trainingPhase').start).toBe(undefined)
  updateVisItemDate('trainingPhase', '2024-01-15', 'startPhase')
  expect(items.get('trainingPhase').start).toBe('2024-01-15')
})

test('Visualization phase date update sets its end time at 23:59:59', () => {
  expect(items.get('testingPhase').end).toBe(undefined)
  updateVisItemDate('testingPhase', '2024-01-25', 'end')
  expect(items.get('testingPhase').end).toBe(new Date('2024-01-25').setHours(23, 59, 59, 0))
})

test('Visualization items content gets updated', () => {
  expect(items.get('upgradePeriod').content).toBe(undefined)
  updateVisItemContent('upgradePeriod', 'This is the new item name')
  expect(items.get('upgradePeriod').content).toBe('This is the new item name')
})

test('Visualization group content gets updated', () => {
  expect(groups.get('upgrade').content).toBe('Upgrade')
  updateVisGroupContent('upgrade', 'This is the new group name')
  expect(groups.get('upgrade').content).toBe('This is the new group name')
})
