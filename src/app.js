// Import itself (needed to mock nested calls during testing)
import * as app from './app'
// Import minified Bootstrap JavaScript and CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
// Import minified vis-timeline JavaScript and CSS
import { Timeline, DataSet } from 'vis-timeline/standalone/esm/vis-timeline-graph2d.min.js'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'

// ================================================================
// Definition of Variables
// Environments and SU Deliveries
// export let upgradeType = "Classical"
export const upgradeType = {
  value: 'Classical',
  // accessor property(setter)
  get current () {
    return this.value
  },
  // accessor property(setter)
  set current (newUpgradeType) {
    this.value = newUpgradeType
  }
}
export const phases = ['analysis', 'build', 'testing', 'training']
export const environments = ['REL', 'POC', 'TST', 'MST', 'ACE', 'PLY', 'SUP', 'PRD']
export const suDeliveries = {
  InitialSU: 'Initial',
  AllFixSU: 'All Fix SUs',
  PreUpgradeCriticalSU: 'Pre-Upgrade Critical',
  PostUpgradeSU: 'Post-Upgrade'
}

export const subdivisionsForVacations = {
  value: null,
  // accessor property(setter)
  get list () {
    return this.value
  },
  // accessor property(setter)
  set list (newSubdivisionsList) {
    this.value = newSubdivisionsList
  }
}

// Keep references to the UI elements
export const ui = {}

// ================================================================
// Timeline configuration and setup
// Create DataSets for the visualization (allows two way data-binding)
// Groups for the upgrade, the phases and the environments
export const groups = new DataSet([
  { id: 'upgrade', content: 'Upgrade', nestedGroups: ['phases', 'environments', 'su', 'vacations'] },
  { id: 'phases', content: 'Phases' },
  { id: 'environments', content: 'Environments' },
  { id: 'su', content: 'SU Deliveries' },
  { id: 'vacations', content: 'Vacations', visible: false }
])
// Bars for phases
export const items = new DataSet([
  { id: 'upgradePeriod', group: 'upgrade' },
  { id: 'analysisPhase', group: 'phases', content: 'Analysis' },
  { id: 'buildPhase', group: 'phases', content: 'Build' },
  { id: 'testingPhase', group: 'phases', content: 'Testing' },
  { id: 'trainingPhase', group: 'phases', content: 'Training' }
])
// Points for environments
for (let i = 0; i < environments.length; i++) {
  items.add([
    { id: `env${environments[i]}`, content: environments[i], group: 'environments', type: 'point' }
  ])
}
// Points for SU Deliveries
Object.keys(suDeliveries).forEach(function (key) {
  items.add([
    { id: `su${key}`, content: this[key], group: 'su', type: 'point' }
  ])
}, suDeliveries)
// Configuration for the Timeline
export const timelineOptions = {}

// ================================================================
// Functions
export function getUI () {
  ui.upgradeTypeToggle = document.getElementById('upgradeTypeToggle')
  ui.upgradeType = {
    classical: document.getElementById('upgradeTypeClassical'),
    expedited: document.getElementById('upgradeTypeExpedited')
  }
  ui.versionNameSelect = document.getElementById('versionName')
  ui.numVersionsSelect = document.getElementById('numVersions')
  ui.phasesSection = document.getElementById('phasesSection')
  ui.startDateInput = { upgrade: document.getElementById('upgradeStartDate') }
  ui.endDateInput = { upgrade: document.getElementById('upgradeEndDate') }
  ui.durationInput = { upgrade: document.getElementById('upgradeDuration') }
  ui.durationValue = { upgrade: document.getElementById('upgradeDurationValue') }
  for (let i = 0; i < phases.length; i++) {
    ui.startDateInput[phases[i]] = document.getElementById(`${phases[i]}StartDate`)
    ui.endDateInput[phases[i]] = document.getElementById(`${phases[i]}EndDate`)
    ui.durationInput[phases[i]] = document.getElementById(`${phases[i]}Duration`)
    ui.durationValue[phases[i]] = document.getElementById(`${phases[i]}DurationValue`)
  }
  ui.upgradeDateInput = {}
  ui.envCheck = {}
  for (let i = 0; i < environments.length; i++) {
    ui.upgradeDateInput[environments[i]] = document.getElementById(`${environments[i]}UpgradeDate`)
    ui.envCheck[environments[i]] = document.getElementById(`envCheck${environments[i]}`)
  }
  ui.deliveryDateInput = {}
  ui.deliveryCheck = {}
  Object.keys(suDeliveries).forEach(function (key) {
    ui.deliveryDateInput[key] = document.getElementById(`${key}DeliveryDate`)
    ui.deliveryCheck[key] = document.getElementById(`SUCheck${key}`)
  }, suDeliveries)
  ui.vacations = {
    section: document.getElementById('vacationsSection'),
    country: {
      button: document.getElementById('vacationCountryButton'),
      text: document.getElementById('vacationCountryText'),
      spinner: document.getElementById('vacationCountrySpinner'),
      list: document.getElementById('vacationCountryList')
    },
    subdivision: {
      button: document.getElementById('vacationSubdivisionButton'),
      text: document.getElementById('vacationSubdivisionText'),
      spinner: document.getElementById('vacationSubdivisionSpinner'),
      list: document.getElementById('vacationSubdivisionList')
    }
  }
  ui.textual = {
    chronologicalText: document.getElementById('chronologicalTextTextarea'),
    chronologicalList: document.getElementById('chronologicalListTextarea'),
    grouped: document.getElementById('groupedTextarea')
  }

  ui.visContainer = document.getElementById('visualization')
}

export function getClosestNextUpgradeVersion (currentYear, currentMonth) {
  let year = currentYear
  if (currentMonth + 2 > 11) {
    year = currentYear + 1
  }
  const nextReleaseMonth = `${Math.floor(((currentMonth + 2) % 12) / 3) * 3 + 2}`.padStart(2, '0')
  const nextReleaseversion = `${year}-${nextReleaseMonth}`

  return nextReleaseversion
}

export function formatDate (dateToFormat) {
  // Return the date as 'YYYY-MM-DD' for the input field
  return `${dateToFormat.getFullYear()}-${(dateToFormat.getMonth() + 1).toString().padStart(2, '0')}-${dateToFormat.getDate().toString().padStart(2, '0')}`
}

export function dateAddNDays (sourceDate, daysOffset) {
  const newDate = new Date(sourceDate.getTime())
  newDate.setDate(sourceDate.getDate() + daysOffset)
  return newDate
}

export function getMondayNWeeksLater (initialDate, nWeeksLater) {
  const sameDayInNWeeks = new Date(initialDate.getTime() + (nWeeksLater * 7 + 1) * 24 * 60 * 60 * 1000)
  const mondayInNWeeks = sameDayInNWeeks
  // Find the next Monday
  mondayInNWeeks.setDate(mondayInNWeeks.getDate() + (1 + 7 - mondayInNWeeks.getDay()) % 7)
  return formatDate(mondayInNWeeks)
}

export function initialUISetup () {
  // Dynamically generate the list of versions for the 3 years around today
  const currentYear = new Date().getFullYear()
  const months = ['February', 'May', 'August', 'November']
  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    for (const month of months) {
      const monthID = `${2 + months.indexOf(month) * 3}`.padStart(2, '0')
      const optionValue = `${year}-${monthID}`
      const optionText = `${month} ${year}`
      const option = new Option(optionText, optionValue)
      ui.versionNameSelect.add(option)
    }
  }

  // Set the default selected upgrade version to the closest month in the future
  const nextReleaseversion = getClosestNextUpgradeVersion(currentYear, new Date().getMonth())
  const defaultOption = ui.versionNameSelect.querySelector(`[value="${nextReleaseversion}"]`)
  if (defaultOption) {
    defaultOption.selected = true
  }
  app.updateVersionName()

  // Set the default values when the page is initialized (the other General settings are explicitly calculated and set elsewhere)
  ui.durationInput.upgrade.min = 7
  ui.durationInput.upgrade.max = 40
  ui.durationInput.upgrade.value = 14
  ui.numVersionsSelect.options[1].selected = true
  app.setDefaultDates(true)
}

export function setupEventListeners () {
  ui.upgradeType.classical.addEventListener('click', changeUpgradeType)
  ui.upgradeType.expedited.addEventListener('click', changeUpgradeType)
  ui.versionNameSelect.addEventListener('input', updateVersionName)
  ui.numVersionsSelect.addEventListener('change', changeNumVersions)
  ui.startDateInput.upgrade.addEventListener('input', setDefaultDates)
  ui.durationInput.upgrade.addEventListener('input', updateEndDate)
  ui.endDateInput.upgrade.addEventListener('input', updateDuration)
  for (let i = 0; i < phases.length; i++) {
    ui.startDateInput[phases[i]].addEventListener('input', updateEndDate)
    ui.durationInput[phases[i]].addEventListener('input', updateEndDate)
    ui.endDateInput[phases[i]].addEventListener('input', updateDuration)
  }
  for (let i = 0; i < environments.length; i++) {
    ui.upgradeDateInput[environments[i]].addEventListener('input', updateEnvironmentDate)
    ui.envCheck[environments[i]].addEventListener('input', includeEnvOrSUDelivery)
  }
  Object.keys(suDeliveries).forEach(function (key) {
    ui.deliveryDateInput[key].addEventListener('input', updateSUDeliveryDate)
    ui.deliveryCheck[key].addEventListener('input', includeEnvOrSUDelivery)
  }, suDeliveries)
}

export function changeUpgradeType (evt) {
  evt.preventDefault()
  app.upgradeType.current = evt.target.id.substring(11)
  ui.upgradeTypeToggle.innerHTML = `${app.upgradeType.value} upgrade`
  if (app.upgradeType.value === 'Classical') {
    ui.upgradeType.classical.classList.add('active')
    ui.upgradeType.expedited.classList.remove('active')
    ui.durationInput.upgrade.min = 7
    ui.durationInput.upgrade.max = 40
    ui.durationInput.upgrade.value = 14
    // Show the phases section and add to the timeline
    ui.phasesSection.classList.remove('collapse')
    groups.remove('environments')
    groups.remove('su')
    groups.add([
      { id: 'phases', content: 'Phases' },
      { id: 'environments', content: 'Environments' },
      { id: 'su', content: 'SU Deliveries' }
    ])
    // Activate all SU deliveries
    Object.keys(suDeliveries).forEach(function (key) {
      if (!ui.deliveryCheck[key].checked) {
        ui.deliveryCheck[key].click()
      }
    }, suDeliveries)
  } else if (app.upgradeType.value === 'Expedited') {
    ui.upgradeType.expedited.classList.add('active')
    ui.upgradeType.classical.classList.remove('active')
    ui.durationInput.upgrade.min = 1
    ui.durationInput.upgrade.max = 4
    ui.durationInput.upgrade.value = 2
    // Hide the phases section and remove from timeline
    ui.phasesSection.classList.add('collapse')
    groups.remove('phases')
    // Deactivate most SU deliveries, keep only initial
    Object.keys(suDeliveries).forEach(function (key) {
      if (key === 'InitialSU' && !ui.deliveryCheck[key].checked) {
        ui.deliveryCheck[key].click()
      } else if (key !== 'InitialSU' && ui.deliveryCheck[key].checked) {
        ui.deliveryCheck[key].click()
      }
    }, suDeliveries)
  }
  app.setDefaultDates(false)
}

export function changeNumVersions () {
  // Changing the number of versions during an Expedited upgrade has no effect
  if (app.upgradeType.value === 'Classical') {
    const numVersions = parseInt(ui.numVersionsSelect.value)
    const calculatedDuration = 7 * numVersions

    ui.durationInput.upgrade.value = calculatedDuration
    ui.durationValue.upgrade.textContent = `${calculatedDuration} weeks`
    // Changing the number of versions changes the entire planning, so recalculate all default dates
    app.setDefaultDates(false)
  }
}

export function setStartDate (startDate) {
  // If the start date is on a Friday, Saturday or Sunday, move it up to the next Monday
  const newStartDate = new Date(startDate)
  const numDaysToAdd = { 5: 3, 6: 2, 0: 1, 1: 0, 2: 0, 3: 0, 4: 0 }[newStartDate.getDay()]
  if (numDaysToAdd > 0) {
    newStartDate.setDate(newStartDate.getDate() + numDaysToAdd)
  }
  return newStartDate
}

export function setEndDate (startDateInput, durationWeeksInput, endDateInput) {
  const startDate = new Date(startDateInput.value)
  const durationWeeks = parseInt(durationWeeksInput.value)

  if (!isNaN(startDate.getTime()) && !isNaN(durationWeeks)) {
    let endDate = new Date(startDate.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000) // Convert weeks to milliseconds
    // If the end date is on a Saturday, Sunday or Monday, move it back to the prior Friday
    const numDaysToSubstract = { 6: 1, 0: 2, 1: 3, 3: 0, 4: 0, 5: 0 }[endDate.getDay()]
    if (numDaysToSubstract > 0) {
      endDate = new Date(endDate - numDaysToSubstract * 24 * 60 * 60 * 1000)
    }
    endDateInput.valueAsDate = endDate
  } else {
    endDateInput.value = '' // Clear the value if inputs are not valid
  }
}
export function getRoundedNumberOfWeeks (startDate, endDate) {
  return Math.round((endDate - startDate) / (7 * 24 * 60 * 60 * 1000)) // Convert from milliseconds to weeks
}
export function getPhaseTypeFromEventTarget (evt) {
  let phase = ''
  let mode = 'event'
  if (typeof evt === 'object') {
    for (let i = 0; i < phases.length; i++) {
      if (evt.target.id.startsWith(phases[i])) {
        phase = phases[i]
        break
      }
    }
    if (!phase && evt.target.id.startsWith('upgrade')) {
      phase = 'upgrade'
    }
  }
  if (!phase) {
    phase = evt
    mode = 'inline'
  }
  return [phase, mode]
}
export function updateDuration (evt) {
  const [phase] = getPhaseTypeFromEventTarget(evt)

  // Keep the start date and adapt the duration
  const startDate = new Date(ui.startDateInput[phase].value)
  const endDate = new Date(ui.endDateInput[phase].value)
  const durationInWeeks = getRoundedNumberOfWeeks(startDate, endDate)
  ui.durationInput[phase].value = durationInWeeks
  ui.durationValue[phase].textContent = `${durationInWeeks} weeks`
  if (phase === 'upgrade') {
    app.setDefaultDates(false)
  } else {
    app.updateVisItemDate(`${phase}Phase`, ui.startDateInput[phase].value, 'startPhase')
    app.updateVisItemDate(`${phase}Phase`, ui.endDateInput[phase].value, 'end')
  }
  app.generateTextualRepresentations()
}
export function updateEndDate (evt) {
  const [phase, mode] = getPhaseTypeFromEventTarget(evt)
  app.setEndDate(ui.startDateInput[phase], ui.durationInput[phase], ui.endDateInput[phase])
  ui.durationValue[phase].textContent = `${ui.durationInput[phase].value} weeks`
  if (phase === 'upgrade') {
    if (mode === 'event') {
      app.setDefaultDates(false)
    }
  } else {
    app.updateVisItemDate(`${phase}Phase`, ui.startDateInput[phase].value, 'startPhase')
    app.updateVisItemDate(`${phase}Phase`, ui.endDateInput[phase].value, 'end')
  }
  app.generateTextualRepresentations()
}

export function calculateDefaultPhaseLengths (upgradeDuration) {
  let durationToAllocate = upgradeDuration

  // Minimum phase durations
  let analysisDuration = 2
  let buildDuration = 2
  let testingDuration = 1
  let trainingDuration = 2
  durationToAllocate = durationToAllocate - (analysisDuration + buildDuration + testingDuration + trainingDuration)

  // Allocate the time evenly to the 4 different phases
  let equalDivide = Math.floor(durationToAllocate / 4)
  if (equalDivide > 0) {
    analysisDuration += equalDivide
    buildDuration += equalDivide
    testingDuration += equalDivide
    trainingDuration += equalDivide
    durationToAllocate -= (4 * equalDivide)
  }

  // Do not allocate more that 4 weeks to the training phase
  if (trainingDuration > 4) {
    durationToAllocate += trainingDuration - 4
    trainingDuration = 4
  }

  // Allocate the remaining time on the phases except Training
  equalDivide = Math.floor(durationToAllocate / 3)
  if (equalDivide > 0) {
    analysisDuration += equalDivide
    buildDuration += equalDivide
    testingDuration += equalDivide
    durationToAllocate -= (3 * equalDivide)
  }

  // Allocate the potential remaining weeks to Testing and Building (in that order of preference)
  if (durationToAllocate > 0) {
    testingDuration += 1
    durationToAllocate--
  }
  if (durationToAllocate > 0) {
    buildDuration += 1
    durationToAllocate--
  }

  return [analysisDuration, buildDuration, testingDuration, trainingDuration]
}
export function determineDefaultPhaseLengths () {
  // The length of phases depends on the number of weeks alloted for the entire upgrade
  const upgradeDuration = parseInt(ui.durationInput.upgrade.value)

  const durations = calculateDefaultPhaseLengths(upgradeDuration)
  const analysisDuration = durations[0]
  const buildDuration = durations[1]
  const testingDuration = durations[2]
  const trainingDuration = durations[3]

  ui.durationInput.analysis.value = analysisDuration
  ui.durationInput.analysis.max = upgradeDuration
  ui.durationValue.analysis.textContent = `${ui.durationInput.analysis.value} weeks`
  ui.durationInput.build.value = buildDuration
  ui.durationInput.build.max = upgradeDuration
  ui.durationValue.build.textContent = `${ui.durationInput.build.value} weeks`
  ui.durationInput.testing.value = testingDuration
  ui.durationInput.testing.max = upgradeDuration
  ui.durationValue.testing.textContent = `${ui.durationInput.testing.value} weeks`
  ui.durationInput.training.value = trainingDuration
  ui.durationInput.training.max = upgradeDuration
  ui.durationValue.training.textContent = `${ui.durationInput.training.value} weeks`
}

export function setDefaultDates (skipRedrawTimeline) {
  let timelineEndDate, daysToShiftEnd
  if (app.upgradeType.value === 'Classical') {
    determineDefaultPhaseLengths()
    updateEndDate('upgrade')

    // Set start date of the Analysis phase is the same as start of the upgrade itself
    ui.startDateInput.analysis.valueAsDate = setStartDate(ui.startDateInput.upgrade.value)
    updateEndDate('analysis')

    // Default start date of the build phase is the end of the analysis phase
    ui.startDateInput.build.valueAsDate = setStartDate(ui.endDateInput.analysis.value)
    updateEndDate('build')

    // Default start date of the testing phase is the end of the build phase
    ui.startDateInput.testing.valueAsDate = setStartDate(ui.endDateInput.build.value)
    updateEndDate('testing')

    // Default start date of the training phase is the end of the build phase
    ui.startDateInput.training.valueAsDate = setStartDate(ui.endDateInput.testing.value)
    updateEndDate('training')

    // Default dates for the environment upgrades
    // REL at the start of the project
    ui.upgradeDateInput.REL.value = ui.startDateInput.upgrade.value
    // POC at the start of the build phase
    ui.upgradeDateInput.POC.value = ui.startDateInput.build.value
    // TST at the start of the testing phase
    ui.upgradeDateInput.TST.value = ui.startDateInput.testing.value
    // MST, ACEs and PLY at the start of the training phase
    ui.upgradeDateInput.MST.value = ui.startDateInput.training.value
    ui.upgradeDateInput.ACE.value = ui.startDateInput.training.value
    ui.upgradeDateInput.PLY.value = ui.startDateInput.training.value
    // PRD and SUP dates
    ui.upgradeDateInput.PRD.value = ui.endDateInput.upgrade.value
    // SUP 4 days before the PRD upgrade
    const PRDUpgradeDate = new Date(ui.upgradeDateInput.PRD.value)
    const SUPUpgradeDate = new Date(PRDUpgradeDate.getTime() - 4 * 24 * 60 * 60 * 1000) // 4 days in milliseconds
    ui.upgradeDateInput.SUP.valueAsDate = SUPUpgradeDate

    // Default dates for the SU deliveries
    // Initial SU Delivery at the start of the project
    ui.deliveryDateInput.InitialSU.value = ui.startDateInput.upgrade.value
    // All Fix SUs Delivery 2 weeks after the end of the Testing phase
    const testingEndDate = new Date(ui.endDateInput.testing.value)
    const AllFixSUDeliveryDate = new Date(testingEndDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000) // 4 days in milliseconds
    ui.deliveryDateInput.AllFixSU.valueAsDate = AllFixSUDeliveryDate
    // Pre-Upgrade Critical SU 2 weeks before the PRD upgrade
    const PreUpgradeCriticalSUDate = new Date(PRDUpgradeDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000) // 2 weeks in milliseconds
    ui.deliveryDateInput.PreUpgradeCriticalSU.valueAsDate = PreUpgradeCriticalSUDate
    // Post-Upgrade SU Delivery 2 weeks after the PRD upgrade
    // (yeah, you could argue that the PRD upgrade date is thus not the real end of the upgrade...)
    const PostUpgradeSUDate = new Date(PRDUpgradeDate.getTime() + 2 * 7 * 24 * 60 * 60 * 1000) // 2 weeks in milliseconds
    ui.deliveryDateInput.PostUpgradeSU.valueAsDate = PostUpgradeSUDate

    // Define the timeline's begin and end dates
    timelineEndDate = PostUpgradeSUDate
    // Shift the timeline's end date by a couple of days, so that the last SU package remains visible
    daysToShiftEnd = 3 * parseInt(ui.durationInput.upgrade.value) / 6

    app.updateVisItemDate('analysisPhase', ui.startDateInput.analysis.value, 'startPhase')
    app.updateVisItemDate('analysisPhase', ui.endDateInput.analysis.value, 'end')
    app.updateVisItemDate('buildPhase', ui.startDateInput.build.value, 'startPhase')
    app.updateVisItemDate('buildPhase', ui.endDateInput.build.value, 'end')
    app.updateVisItemDate('testingPhase', ui.startDateInput.testing.value, 'startPhase')
    app.updateVisItemDate('testingPhase', ui.endDateInput.testing.value, 'end')
    app.updateVisItemDate('trainingPhase', ui.startDateInput.training.value, 'startPhase')
    app.updateVisItemDate('trainingPhase', ui.endDateInput.training.value, 'end')
  } else if (app.upgradeType.value === 'Expedited') {
    updateEndDate('upgrade')

    // Default dates for the environment upgrades
    const upgradeDuration = parseInt(ui.durationInput.upgrade.value)
    const upgradeStartDate = new Date(ui.startDateInput.upgrade.value)
    const dateShift = {
      REL: [0, 0, 0, 0],
      POC: [1, 3, 3, 4],
      TST: [2, 7, 8, 9],
      MST: [3, 9, 11, 15],
      ACE: [3, 9, 11, 15],
      PLY: [3, 9, 11, 15],
      SUP: [4, 10, 16, 23],
      PRD: [5, 11, 18, 25]
    }
    for (let i = 0; i < environments.length; i++) {
      const daysOffset = dateShift[environments[i]][upgradeDuration - 1]
      ui.upgradeDateInput[environments[i]].value = formatDate(dateAddNDays(upgradeStartDate, daysOffset))
    }

    // Initial SU Delivery at the start of the project
    ui.deliveryDateInput.InitialSU.value = ui.startDateInput.upgrade.value

    timelineEndDate = new Date(ui.endDateInput.upgrade.value)
    daysToShiftEnd = 1
  }

  app.updateVisItemDate('upgradePeriod', ui.startDateInput.upgrade.value, 'startPhase')
  app.updateVisItemDate('upgradePeriod', ui.endDateInput.upgrade.value, 'end')
  for (let i = 0; i < environments.length; i++) {
    app.updateVisItemDate(`env${environments[i]}`, ui.upgradeDateInput[environments[i]].value, 'startPoint')
  }
  Object.keys(suDeliveries).forEach(function (key) {
    if (items.get(`su${key}`)) {
      app.updateVisItemDate(`su${key}`, ui.deliveryDateInput[key].value, 'startPoint')
    }
  }, suDeliveries)

  if (!skipRedrawTimeline) {
    timelineOptions.start = ui.startDateInput.upgrade.value
    timelineEndDate.setDate(timelineEndDate.getDate() + daysToShiftEnd)
    timelineOptions.end = timelineEndDate
    ui.timeline.setOptions(timelineOptions)
  }

  app.generateTextualRepresentations()
}

export function updateVisItemDate (itemID, date, type) {
  const item = items.get(itemID)
  if (type === 'startPhase') {
    item.start = date
  } else if (type === 'startPoint') {
    const startDate = new Date(date).setHours(8, 0, 0, 0)
    item.start = startDate
  } else if (type === 'end') {
    const endDate = new Date(date).setHours(23, 59, 59, 0)
    item.end = endDate
  }
  items.update(item)
}

export function updateVisItemContent (itemID, content) {
  const item = items.get(itemID)
  item.content = content
  items.update(item)
}

export function updateVisGroupContent (groupID, content) {
  const group = groups.get(groupID)
  group.content = content
  groups.update(group)
}

export function determineUpgradeStartDate (releaseMonth, today) {
  if (!today) {
    today = new Date()
  }
  const mondayIn3weeks = app.getMondayNWeeksLater(today, 3)
  // Let's assume a new version is released the first Monday of the month
  const releaseDate = app.getMondayNWeeksLater(new Date(releaseMonth), 0)
  if (mondayIn3weeks > releaseDate) {
    // If the version is already released today, start the Monday in 3 weeks
    return mondayIn3weeks
  } else {
    // If the version is not yet released as of today, start 1 week after the date of the release
    return app.getMondayNWeeksLater(new Date(releaseDate), 0)
  }
}
export function updateVersionName (evt) {
  const selectedVersion = ui.versionNameSelect.options[ui.versionNameSelect.selectedIndex]
  const versionName = selectedVersion.text
  app.updateVisItemContent('upgradePeriod', `Upgrade to ${versionName}`)
  app.updateVisGroupContent('upgrade', versionName)

  // Set the start date of the upgrade
  ui.startDateInput.upgrade.value = app.determineUpgradeStartDate(selectedVersion.value)
  if (evt) {
    app.setDefaultDates()
  }
}

export function updateEnvironmentDate (evt) {
  const envName = evt.target.id.substring(0, 3)
  const startDate = evt.target.value
  app.updateVisItemDate(`env${envName}`, startDate, 'startPoint')
  app.generateTextualRepresentations()
}
export function includeEnvOrSUDelivery (evt) {
  let envName, suName, dateElement, checkElement, itemID, data
  if (evt.target.id.startsWith('envCheck')) {
    envName = evt.target.id.substring(evt.target.id.length - 3)
    checkElement = ui.envCheck[envName]
    dateElement = ui.upgradeDateInput[envName]
    itemID = `env${envName}`
    data = {
      id: itemID,
      content: envName,
      group: 'environments',
      type: 'point',
      start: new Date(dateElement.value).setHours(8, 0, 0, 0)
    }
  } else if (evt.target.id.startsWith('SUCheck')) {
    suName = evt.target.id.substring(7)
    checkElement = ui.deliveryCheck[suName]
    dateElement = ui.deliveryDateInput[suName]
    itemID = `su${suName}`
    data = {
      id: itemID,
      content: suDeliveries[suName],
      group: 'su',
      type: 'point',
      start: new Date(dateElement.value).setHours(8, 0, 0, 0)
    }
  }
  if (checkElement.checked) {
    dateElement.disabled = false
    items.add(data)
  } else {
    dateElement.disabled = true
    items.remove(itemID)
  }
  app.generateTextualRepresentations()
}

export function updateSUDeliveryDate (evt) {
  const suName = evt.target.id.substring(0, evt.target.id.length - 'DeliveryDate'.length)
  const startDate = evt.target.value
  app.updateVisItemDate(`su${suName}`, startDate, 'startPoint')
  app.generateTextualRepresentations()
}

export async function getJSONFromURL (requestURL, success) {
  const request = new Request(requestURL)

  const response = await fetch(request)
  const jsonContent = await response.json()

  success(jsonContent, requestURL)
}

/**
 * @param {String} HTML representing a single element.
 * @param {Boolean} flag representing whether or not to trim input whitespace, defaults to true.
 * @return {Element | HTMLCollection | null}
 */
export function fromHTML (html, trim = true) {
  // From https://stackoverflow.com/a/35385518
  // Process the HTML string.
  html = trim ? html.trim() : html
  if (!html) return null

  // Then set up a new template element.
  const template = document.createElement('template')
  template.innerHTML = html
  const result = template.content.children

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0]
  return result
}

export function drawVacationsOnTimeline (type, data) {
  // Remove all previous vacation items on the timeline
  // When a new country is selected, remove all previous vacations.
  // When a subdivision is selected, keep public holidays and remove only previous school holidays
  let itemFilter = 'vac_'
  if (type === 'school') {
    itemFilter = 'vac_school'
  }
  const vacItems = items.get({
    filter: function (item) {
      return item.id.startsWith(itemFilter)
    }
  })
  for (let i = 0; i < vacItems.length; i++) {
    items.remove(vacItems[i].id)
  }
  let itemType
  for (let i = 0; i < data.length; i++) {
    itemType = 'box'
    if (data[i].startDate !== data[i].endDate) {
      itemType = 'range'
    }
    items.add({
      id: `vac_${type}_${data[i].id}`,
      content: getEnglishName(data[i].name),
      group: 'vacations',
      type: itemType,
      start: new Date(data[i].startDate).setHours(0, 0, 0, 0),
      end: new Date(data[i].endDate).setHours(23, 59, 59, 0)
    })
  }
}

export function selectVacationSubdivision (evt) {
  evt.preventDefault()
  const country = evt.target.id.substring(20).split('_')[0]
  const subdivision = evt.target.id.substring(21 + country.length)
  ui.vacations.subdivision.text.innerHTML = evt.target.innerHTML
  app.getVacationsForCountrySubdivisions('school', country, subdivision)
}

export function selectVacationCountry (evt) {
  evt.preventDefault()
  ui.vacations.subdivision.button.classList.add('disabled')
  const country = evt.target.id.substring(16)
  ui.vacations.country.text.innerHTML = evt.target.innerHTML
  groups.update({ id: 'vacations', visible: true })
  app.getSubdivisionsForVacations(country)
  app.getVacationsForCountrySubdivisions('public', country)
}

export function getEnglishName (names) {
  let name = ''
  for (let i = 0; i < names.length; i++) {
    if (names[i].language === 'EN') {
      name = names[i].text
      continue
    }
  }
  return name
}

export function populateSubdivisionsForVacations (data, requestURL) {
  ui.vacations.subdivision.spinner.classList.remove('show')
  subdivisionsForVacations.list = data
  const country = requestURL.substring(56)
  if (subdivisionsForVacations.list.length === 0) {
    // This country has no subdivisions, hide the subdivision button and directly get the dates
    ui.vacations.subdivision.button.classList.add('d-none')
    app.getVacationsForCountrySubdivisions('school', country, null)
  } else {
    ui.vacations.subdivision.button.classList.remove('d-none')
    ui.vacations.subdivision.button.classList.remove('disabled')
    ui.vacations.subdivision.list.innerHTML = ''
    for (let i = 0; i < subdivisionsForVacations.list.length; i++) {
      const li = fromHTML(`<li><a class="dropdown-item" href="#" id="vacationSubdivision-${country}_${subdivisionsForVacations.list[i].code}">${getEnglishName(subdivisionsForVacations.list[i].name)}</a></li>`)
      li.addEventListener('click', selectVacationSubdivision)
      ui.vacations.subdivision.list.appendChild(li)
    }
  }
}

export function populateCountriesForVacations (data) {
  ui.vacations.country.spinner.classList.remove('show')
  for (let i = 0; i < data.length; i++) {
    const li = fromHTML(`<li><a class="dropdown-item" href="#" id="vacationCountry-${data[i].isoCode}">${getEnglishName(data[i].name)}</a></li>`)
    li.addEventListener('click', selectVacationCountry)
    ui.vacations.country.list.appendChild(li)
  }
}

export function getVacationsForCountrySubdivisions (type, country, subdivision) {
  let urlType = 'PublicHolidays'
  if (type === 'school') {
    urlType = 'SchoolHolidays'
  }
  const upgradeStartDate = new Date(ui.startDateInput.upgrade.value)
  const validFrom = formatDate(dateAddNDays(upgradeStartDate, -50))
  const upgradeEndDate = new Date(ui.endDateInput.upgrade.value)
  const validTo = formatDate(dateAddNDays(upgradeEndDate, 50))
  let requestURL = `https://openholidaysapi.org/${urlType}?countryIsoCode=${country}&languageIsoCode=EN&validFrom=${validFrom}&validTo=${validTo}`
  if (subdivision) {
    requestURL += `&subdivisionCode=${subdivision}`
  }
  app.getJSONFromURL(requestURL, (data, requestURL) => { app.drawVacationsOnTimeline(type, data) })
}

export function getSubdivisionsForVacations (country) {
  ui.vacations.subdivision.text.innerHTML = 'Subdivision'
  ui.vacations.subdivision.spinner.classList.add('show')
  app.getJSONFromURL(`https://openholidaysapi.org/Subdivisions?countryIsoCode=${country}`, app.populateSubdivisionsForVacations)
}

export function getCountriesForVacations () {
  ui.vacations.country.spinner.classList.add('show')
  app.getJSONFromURL('https://openholidaysapi.org/Countries', app.populateCountriesForVacations)
}

export function dateInEnglish (date) {
  const weekday = new Date(date).toLocaleString('en-us', { weekday: 'long' })
  return `${weekday} ${date}`
}

export function addToEvents (events, date, shortDescription, longDescription) {
  let item = events.find(item => item.date === date)
  if (!item) {
    events.push({ date, values: [] })
    item = events.find(item => item.date === date)
  }
  item.values.push([shortDescription, longDescription])
  return events
}

export function generateTextualRepresentations () {
  const selectedVersion = ui.versionNameSelect.options[ui.versionNameSelect.selectedIndex].text
  let duration = parseInt(ui.durationInput.upgrade.value)
  let startDate = ui.startDateInput.upgrade.value
  let endDate = ui.endDateInput.upgrade.value

  let chronologicalTextText
  let chronologicalListText
  let groupedText

  let events = []
  let text
  let phaseName

  if (app.upgradeType.value === 'Classical') {
    chronologicalTextText = `The upgrade to version ${selectedVersion} will last ${duration} weeks and take place from ${dateInEnglish(startDate)} to ${dateInEnglish(endDate)}.\n`
    chronologicalListText = chronologicalTextText
    groupedText = `${chronologicalTextText}\nPhases:`
    for (let i = 0; i < phases.length; i++) {
      duration = parseInt(ui.durationInput[phases[i]].value)
      startDate = ui.startDateInput[phases[i]].value
      endDate = ui.endDateInput[phases[i]].value
      phaseName = phases[i].charAt(0).toUpperCase() + phases[i].slice(1)
      text = `The ${phaseName} phase will last ${duration} weeks and take place from ${dateInEnglish(startDate)} to ${dateInEnglish(endDate)}.`
      groupedText = `${groupedText}\n- ${text}`
      events = app.addToEvents(events, startDate, `${phaseName} start`, text)
    }
    groupedText = `${groupedText}\n`
  } else if (app.upgradeType.value === 'Expedited') {
    chronologicalTextText = `The expedited upgrade to version ${selectedVersion} will last ${duration} weeks and take place from ${dateInEnglish(startDate)} to ${dateInEnglish(endDate)}.\n`
    chronologicalListText = chronologicalTextText
    groupedText = chronologicalTextText
  }
  groupedText = `${groupedText}\nEnvironments:`
  for (let i = 0; i < environments.length; i++) {
    if (ui.envCheck[environments[i]].checked) {
      startDate = ui.upgradeDateInput[environments[i]].value
      text = `The ${environments[i]} environment will be upgraded on ${dateInEnglish(startDate)}.`
      groupedText = `${groupedText}\n- ${text}`
      events = app.addToEvents(events, startDate, `${environments[i]} environment upgrade`, text)
    }
  }
  groupedText = `${groupedText}\n\nSU deliveries:`
  Object.keys(suDeliveries).forEach(function (key) {
    if (ui.deliveryCheck[key].checked) {
      startDate = ui.deliveryDateInput[key].value
      text = `The ${this[key]} SU package will be delivered on ${dateInEnglish(startDate)}.`
      groupedText = `${groupedText}\n- ${text}`
      events = app.addToEvents(events, startDate, `${this[key]} SU package delivery`, text)
    }
  }, suDeliveries)

  events.sort(
    (a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0
  )
  for (const event of events) {
    for (let i = 0; i < event.values.length; i++) {
      chronologicalTextText = `${chronologicalTextText}\n- ${event.values[i][1]}`
      chronologicalListText = `${chronologicalListText}\n- ${event.date}: ${event.values[i][0]}`
    }
  }

  ui.textual.chronologicalText.innerHTML = chronologicalTextText
  ui.textual.chronologicalList.innerHTML = chronologicalListText
  ui.textual.grouped.innerHTML = groupedText
}

export function startUp () {
  // Initial setup of the UI
  app.getUI()
  app.initialUISetup()
  app.setupEventListeners()
  // Create the Timeline
  ui.timeline = new Timeline(ui.visContainer, items, groups, timelineOptions)
  // Get the list of countries for vacations
  app.getCountriesForVacations()
}

document.addEventListener('DOMContentLoaded', startUp)
