// ================================================================
// Definition of Variables
// Environments and SU Deliveries
const environments = ["REL", "POC", "TST", "MST", "ACE", "PLY", "SUP","PRD"];
const suDeliveries = {
    "InitialSU": "Initial",
    "AllFixSU": "All Fix SUs",
    "PreUpgradeCriticalSU": "Pre-Upgrade Critical",
    "PostUpgradeSU": "Post-Upgrade"
};
// UI elements
const versionNameSelect = document.getElementById('versionName');
const numVersionsSelect = document.getElementById('numVersions');
const upgradeStartDateInput = document.getElementById('upgradeStartDate');
const upgradeEndDateInput = document.getElementById('upgradeEndDate');
const upgradeDurationInput = document.getElementById('upgradeDuration');
const upgradeDurationValue = document.getElementById('upgradeDurationValue');

const analysisStartDateInput = document.getElementById('analysisStartDate');
const analysisEndDateInput = document.getElementById('analysisEndDate');
const analysisDurationInput = document.getElementById('analysisDuration');
const analysisDurationValue = document.getElementById('analysisDurationValue');

const buildStartDateInput = document.getElementById('buildStartDate');
const buildEndDateInput = document.getElementById('buildEndDate');
const buildDurationInput = document.getElementById('buildDuration');
const buildDurationValue = document.getElementById('buildDurationValue');

const testingStartDateInput = document.getElementById('testingStartDate');
const testingEndDateInput = document.getElementById('testingEndDate');
const testingDurationInput = document.getElementById('testingDuration');
const testingDurationValue = document.getElementById('testingDurationValue');

const trainingStartDateInput = document.getElementById('trainingStartDate');
const trainingEndDateInput = document.getElementById('trainingEndDate');
const trainingDurationInput = document.getElementById('trainingDuration');
const trainingDurationValue = document.getElementById('trainingDurationValue');

const RELUpgradeDateInput = document.getElementById('RELUpgradeDate');
const POCUpgradeDateInput = document.getElementById('POCUpgradeDate');
const TSTUpgradeDateInput = document.getElementById('TSTUpgradeDate');
const MSTUpgradeDateInput = document.getElementById('MSTUpgradeDate');
const ACEUpgradeDateInput = document.getElementById('ACEUpgradeDate');
const PLYUpgradeDateInput = document.getElementById('PLYUpgradeDate');
const SUPUpgradeDateInput = document.getElementById('SUPUpgradeDate');
const PRDUpgradeDateInput = document.getElementById('PRDUpgradeDate');

const InitialSUDeliveryDateInput = document.getElementById('InitialSUDeliveryDate');
const AllFixSUDeliveryDateInput = document.getElementById('AllFixSUDeliveryDate');
const PreUpgradeCriticalSUDeliveryDateInput = document.getElementById('PreUpgradeCriticalSUDeliveryDate');
const PostUpgradeSUDeliveryDateInput = document.getElementById('PostUpgradeSUDeliveryDate');

const visContainer = document.getElementById('visualization');

// ================================================================
// Timeline configuration and setup
// Create DataSets for the visualization (allows two way data-binding)
// Groups for the upgrade, the phases and the environments
const groups = new vis.DataSet([
    {id: "upgrade", content: "Upgrade", nestedGroups: ["phases", "environments", "su"]},
    {id: "phases", content: "Phases"},
    {id: "environments", content: "Environments"},
    {id: "su", content: "SU Deliveries"}
]);
// Bars for phases
const items = new vis.DataSet([
    {id: "upgradePeriod", group: "upgrade"},
    {id: "analysisPhase", group: "phases", content: "Analysis"},
    {id: "buildPhase", group: "phases", content: "Build"},
    {id: "testingPhase", group: "phases", content: "Testing"},
    {id: "trainingPhase", group: "phases", content: "Training"}
]);
// Points for environments
for (let i = 0; i < environments.length; i++) {
    items.add([
        {id: `env${environments[i]}`, content: environments[i], group: "environments", type: 'point'}
    ]);
};
// Points for SU Deliveries
Object.keys(suDeliveries).forEach(function(key, index) {
    items.add([
        {id: `su${key}`, content: this[key], group: "su", type: 'point'}
    ]);
}, suDeliveries);
// Configuration for the Timeline
const timelineOptions = {};

// ================================================================
// Initial setup of the UI
initialUISetup();
setupEventListeners();
// Create the Timeline
const timeline = new vis.Timeline(visContainer, items, groups, timelineOptions);

// ================================================================
// Functions  
function initialUISetup() {
    // Dynamically generate the list of versions for the 3 years around today
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const months = ['February', 'May', 'August', 'November'];
    for (let year = currentYear - 1; year <= nextYear; year++) {
        for (const month of months) {
            const monthID = `${2 + months.indexOf(month) * 3}`.padStart(2, '0');
            const optionValue = `${year}-${monthID}`;
            const optionText = `${month} ${year}`;
            const option = new Option(optionText, optionValue);
            versionNameSelect.add(option);
        }
    }

    // Set the default selected upgrade version to the closest month in the future
    const currentMonth = new Date().getMonth();
    let year = currentYear;
    if (currentMonth + 2 > 11) {
        year = nextYear;
    }
    const nextReleaseMonth = `${Math.floor(((currentMonth + 2) % 12) / 3) * 3 + 2}`.padStart(2, '0');
    const nextReleaseversion = `${year}-${nextReleaseMonth}`;
    const defaultOption = versionNameSelect.querySelector(`[value="${nextReleaseversion}"]`);
    if (defaultOption) {
        defaultOption.selected = true;
    }
    
    // Set the default upgradeStartDate to be the Monday in 4 weeks
    const today = new Date();
    // 3 weeks * 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const mondayInFourWeeks = new Date(today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
    // Find the next Monday
    mondayInFourWeeks.setDate(mondayInFourWeeks.getDate() + (1 + 7 - mondayInFourWeeks.getDay()) % 7);
    // Format the date as 'YYYY-MM-DD' for the input field
    const formattedDate = `${mondayInFourWeeks.getFullYear()}-${(mondayInFourWeeks.getMonth() + 1).toString().padStart(2, '0')}-${mondayInFourWeeks.getDate().toString().padStart(2, '0')}`;
    upgradeStartDateInput.value = formattedDate;

    // Set the default values when the page is initialized (the other General settings are explicitly calculated and set elsewhere)
    upgradeDurationInput.value = 14;
    numVersionsSelect.options[1].selected = true;
    setDefaultDates(false, true);            
    updateVersionName();
}

function setupEventListeners() {
    numVersionsSelect.addEventListener('change', changeNumVersions);
    upgradeDurationInput.addEventListener('input', () => {
        upgradeDurationValue.textContent = `${upgradeDurationInput.value} weeks`;
        setDefaultDates();
    });
    upgradeStartDateInput.addEventListener('input', setDefaultDates);
    upgradeStartDateInput.addEventListener('input', updateUpgradeEndDate);
    upgradeDurationInput.addEventListener('input', updateUpgradeEndDate);
    upgradeEndDateInput.addEventListener('input', updateUpgradeDuration);
    analysisStartDateInput.addEventListener('input', updateAnalysisEndDate);
    analysisDurationInput.addEventListener('input', updateAnalysisEndDate);
    analysisDurationInput.addEventListener('input', () => {
        analysisDurationValue.textContent = `${analysisDurationInput.value} weeks`;
    });
    analysisEndDateInput.addEventListener('input', updateAnalysisDuration);
    buildStartDateInput.addEventListener('input', updateBuildEndDate);
    buildDurationInput.addEventListener('input', updateBuildEndDate);
    buildDurationInput.addEventListener('input', () => {
        buildDurationValue.textContent = `${buildDurationInput.value} weeks`;
    });
    buildEndDateInput.addEventListener('input', updateBuildDuration);
    testingStartDateInput.addEventListener('input', updateTestingEndDate);
    testingDurationInput.addEventListener('input', updateTestingEndDate);
    testingDurationInput.addEventListener('input', () => {
        testingDurationValue.textContent = `${testingDurationInput.value} weeks`;
    });
    testingEndDateInput.addEventListener('input', updateTestingDuration);
    trainingStartDateInput.addEventListener('input', updateTrainingEndDate);
    trainingDurationInput.addEventListener('input', updateTrainingEndDate);
    trainingDurationInput.addEventListener('input', () => {
        trainingDurationValue.textContent = `${trainingDurationInput.value} weeks`;
    });
    trainingEndDateInput.addEventListener('input', updateTrainingDuration);
    versionNameSelect.addEventListener('input', updateVersionName);            
    for (let i = 0; i < environments.length; i++) {
        document.getElementById(`${environments[i]}UpgradeDate`).addEventListener('input', updateEnvironmentDate);
    };
    Object.keys(suDeliveries).forEach(function(key, index) {
        document.getElementById(`${key}DeliveryDate`).addEventListener('input', updateSUDeliveryDate);
    }, suDeliveries);
}

function changeNumVersions() {
    const numVersions = parseInt(numVersionsSelect.value);
    const calculatedDuration = 7 * numVersions;
    
    upgradeDurationInput.value = calculatedDuration;
    upgradeDurationValue.textContent = `${calculatedDuration} weeks`;
    // Changing the number of versions changes the entire planning, so recalculate all default dates
    setDefaultDates();
}

function setStartDate(startDate) {
    // If the start date is on a Friday, Saturday or Sunday, move it up to the next Monday
    let newStartDate = new Date(startDate);
    const numDaysToAdd = {5: 3, 6: 2, 0: 1, 1: 0, 2: 0, 3: 0, 4: 0}[newStartDate.getDay()];
    if (numDaysToAdd > 0) {
        newStartDate.setDate(newStartDate.getDate() + numDaysToAdd);
    }
    return newStartDate;
}

function setEndDate(startDateInput, durationWeeksInput, endDateInput) {
    const startDate = new Date(startDateInput.value);
    const durationWeeks = parseInt(durationWeeksInput.value);
    
    if (!isNaN(startDate.getTime()) && !isNaN(durationWeeks)) {
        let endDate = new Date(startDate.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000); // Convert weeks to milliseconds
        // If the end date is on a Saturday, Sunday or Monday, move it back to the prior Friday
        const numDaysToSubstract = {6: 1, 0: 2, 1: 3, 3: 0, 4: 0, 5: 0}[endDate.getDay()];
        if (numDaysToSubstract > 0) {
            endDate = new Date(endDate - numDaysToSubstract * 24 * 60 * 60 * 1000);
        }
        endDateInput.valueAsDate = endDate;
    } else {
        endDateInput.value = ''; // Clear the value if inputs are not valid
    }
}
function updateUpgradeEndDate() {
    setEndDate(upgradeStartDateInput, upgradeDurationInput, upgradeEndDateInput);
}
function getRoundedNumberOfWeeks(startDate, endDate) {
    return Math.round((endDate - startDate) / (7 * 24 * 60 * 60 * 1000)); // Convert from milliseconds to weeks
}
function updateDuration(startDateInput, endDateInput, durationInput, durationValue) {
    // Keep the start date and adapt the duration
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const durationInWeeks = getRoundedNumberOfWeeks(startDate, endDate);
    durationInput.value = durationInWeeks;
    durationValue.textContent = `${durationInWeeks} weeks`;
}
function updateUpgradeDuration() {
    updateDuration(upgradeStartDateInput, upgradeEndDateInput, upgradeDurationInput, upgradeDurationValue);
    // Recalculate the rest of the default dates
    setDefaultDates(true);
}
function updateAnalysisDuration() {
    updateDuration(analysisStartDateInput, analysisEndDateInput, analysisDurationInput, analysisDurationValue);
    updateVisItemDate("analysisPhase", analysisStartDateInput.value, "startPhase");
    updateVisItemDate("analysisPhase", analysisEndDateInput.value, "end");
}
function updateBuildDuration() {
    updateDuration(buildStartDateInput, buildEndDateInput, buildDurationInput, buildDurationValue);
    updateVisItemDate("buildPhase", buildStartDateInput.value, "startPhase");
    updateVisItemDate("buildPhase", buildEndDateInput.value, "end");
}
function updateTestingDuration() {
    updateDuration(testingStartDateInput, testingEndDateInput, testingDurationInput, testingDurationValue);
    updateVisItemDate("testingPhase", testingStartDateInput.value, "startPhase");
    updateVisItemDate("testingPhase", testingEndDateInput.value, "end");
}
function updateTrainingDuration() {
    updateDuration(trainingStartDateInput, trainingEndDateInput, trainingDurationInput, trainingDurationValue);
    updateVisItemDate("trainingPhase", trainingStartDateInput.value, "startPhase");
    updateVisItemDate("trainingPhase", trainingEndDateInput.value, "end");
}
function updateAnalysisEndDate() {
    setEndDate(analysisStartDateInput, analysisDurationInput, analysisEndDateInput);
    updateVisItemDate("analysisPhase", analysisStartDateInput.value, "startPhase");
    updateVisItemDate("analysisPhase", analysisEndDateInput.value, "end");
}
function updateBuildEndDate() {
    setEndDate(buildStartDateInput, buildDurationInput, buildEndDateInput);
    updateVisItemDate("buildPhase", buildStartDateInput.value, "startPhase");
    updateVisItemDate("buildPhase", buildEndDateInput.value, "end");
}
function updateTestingEndDate() {
    setEndDate(testingStartDateInput, testingDurationInput, testingEndDateInput);
    updateVisItemDate("testingPhase", testingStartDateInput.value, "startPhase");
    updateVisItemDate("testingPhase", testingEndDateInput.value, "end");
}
function updateTrainingEndDate() {
    setEndDate(trainingStartDateInput, trainingDurationInput, trainingEndDateInput);
    updateVisItemDate("trainingPhase", trainingStartDateInput.value, "startPhase");
    updateVisItemDate("trainingPhase", trainingEndDateInput.value, "end");
}

function determineDefaultPhaseLengths() {
    //The length of phases depends on the number of weeks alloted for the entire upgrade
    const upgradeDuration = parseInt(upgradeDurationInput.value);
    let durationToAllocate = upgradeDuration;

    // Minimum phase durations
    let analysisDuration = 2;
    let buildDuration = 2;
    let testingDuration = 1;
    let trainingDuration = 2;
    durationToAllocate = durationToAllocate - (analysisDuration + buildDuration + testingDuration + trainingDuration);

    // Allocate the time evenly to the 4 different phases
    let equalDivide = Math.floor(durationToAllocate / 4);
    if (equalDivide > 0) {
        analysisDuration += equalDivide;
        buildDuration += equalDivide;
        testingDuration += equalDivide;
        trainingDuration += equalDivide;
        durationToAllocate -= (4*equalDivide);
    }

    // Do not allocate more that 4 weeks to the training phase
    if (trainingDuration > 4) {
        durationToAllocate += trainingDuration - 4;
        trainingDuration = 4;
    }

    // Allocate the remaining time on the phases except Training
    equalDivide = Math.floor(durationToAllocate / 3);
    if (equalDivide > 0) {
        analysisDuration += equalDivide;
        buildDuration += equalDivide;
        testingDuration += equalDivide;
        durationToAllocate -= (3*equalDivide);
    }

    // Allocate the potential remaining weeks to Testing and Building (in that order of preference)
    if (durationToAllocate > 0) {
        testingDuration += 1;
        durationToAllocate--;
    }
    if (durationToAllocate > 0) {
        buildDuration += 1;
        durationToAllocate--;
    }

    analysisDurationInput.value = analysisDuration;
    analysisDurationInput.max = upgradeDuration;
    analysisDurationValue.textContent = `${analysisDurationInput.value} weeks`;
    buildDurationInput.value = buildDuration;
    buildDurationInput.max = upgradeDuration;
    buildDurationValue.textContent = `${buildDurationInput.value} weeks`;
    testingDurationInput.value = testingDuration;
    testingDurationInput.max = upgradeDuration;
    testingDurationValue.textContent = `${testingDurationInput.value} weeks`;
    trainingDurationInput.value = trainingDuration;
    trainingDurationInput.max = upgradeDuration;
    trainingDurationValue.textContent = `${trainingDurationInput.value} weeks`;
}

function setDefaultDates(skipUpdateUpgradeEndDate=false, skipRedrawTimeline=false) {
    determineDefaultPhaseLengths();

    if (!skipUpdateUpgradeEndDate) {
        updateUpgradeEndDate();
    }

    // Set start date of the Analysis phase is the same as start of the upgrade itself
    analysisStartDateInput.valueAsDate = setStartDate(upgradeStartDateInput.value);
    updateAnalysisEndDate();

    // Default start date of the build phase is the end of the analysis phase
    buildStartDateInput.valueAsDate = setStartDate(analysisEndDateInput.value);
    updateBuildEndDate();

    // Default start date of the testing phase is the end of the build phase
    testingStartDateInput.valueAsDate = setStartDate(buildEndDateInput.value);
    updateTestingEndDate();

    // Default start date of the training phase is the end of the build phase
    trainingStartDateInput.valueAsDate = setStartDate(testingEndDateInput.value);
    updateTrainingEndDate();

    // Default dates for the environment upgrades
    // REL at the start of the project
    RELUpgradeDateInput.value = upgradeStartDateInput.value;
    // POC at the start of the build phase
    POCUpgradeDateInput.value = buildStartDateInput.value;
    // TST at the start of the testing phase
    TSTUpgradeDateInput.value = testingStartDateInput.value;
    // MST, ACEs and PLY at the start of the training phase
    MSTUpgradeDateInput.value = trainingStartDateInput.value;
    ACEUpgradeDateInput.value = trainingStartDateInput.value;
    PLYUpgradeDateInput.value = trainingStartDateInput.value;
    // PRD and SUP dates
    PRDUpgradeDateInput.value = upgradeEndDateInput.value;
    // SUP 4 days before the PRD upgrade
    const PRDUpgradeDate = new Date(PRDUpgradeDateInput.value);
    const SUPUpgradeDate = new Date(PRDUpgradeDate.getTime() - 4 * 24 * 60 * 60 * 1000); // 4 days in milliseconds
    SUPUpgradeDateInput.valueAsDate = SUPUpgradeDate;

    // Default dates for the SU deliveries
    // Initial SU Delivery at the start of the project
    InitialSUDeliveryDateInput.value = upgradeStartDateInput.value;
    // All Fix SUs Delivery 2 weeks after the end of the Testing phase
    const testingEndDate = new Date(testingEndDateInput.value);
    const AllFixSUDeliveryDate = new Date(testingEndDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 4 days in milliseconds
    AllFixSUDeliveryDateInput.valueAsDate = AllFixSUDeliveryDate;
    // Pre-Upgrade Critical SU 2 weeks before the PRD upgrade
    const PreUpgradeCriticalSUDate = new Date(PRDUpgradeDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks in milliseconds
    PreUpgradeCriticalSUDeliveryDateInput.valueAsDate = PreUpgradeCriticalSUDate;
    // Post-Upgrade SU Delivery 2 weeks after the PRD upgrade
    // (yeah, you could argue that the PRD upgrade date is thus not the real end of the upgrade...)
    const PostUpgradeSUDate = new Date(PRDUpgradeDate.getTime() + 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks in milliseconds
    PostUpgradeSUDeliveryDateInput.valueAsDate = PostUpgradeSUDate;

    updateVisItemDate("upgradePeriod", upgradeStartDateInput.value, "startPhase");
    updateVisItemDate("upgradePeriod", upgradeEndDateInput.value, "end");
    updateVisItemDate("analysisPhase", analysisStartDateInput.value, "startPhase");
    updateVisItemDate("analysisPhase", analysisEndDateInput.value, "end");
    updateVisItemDate("buildPhase", buildStartDateInput.value, "startPhase");
    updateVisItemDate("buildPhase", buildEndDateInput.value, "end");
    updateVisItemDate("testingPhase", testingStartDateInput.value, "startPhase");
    updateVisItemDate("testingPhase", testingEndDateInput.value, "end");
    updateVisItemDate("trainingPhase", trainingStartDateInput.value, "startPhase");
    updateVisItemDate("trainingPhase", trainingEndDateInput.value, "end");
    for (let i = 0; i < environments.length; i++) {
        updateVisItemDate(`env${environments[i]}`, document.getElementById(`${environments[i]}UpgradeDate`).value, "startPoint");
    };                
    Object.keys(suDeliveries).forEach(function(key, index) {
        updateVisItemDate(`su${key}`, document.getElementById(`${key}DeliveryDate`).value, "startPoint");
    }, suDeliveries);

    // Define the timeline's begin and end dates
    timelineOptions.start = upgradeStartDateInput.value;
    let timelineEndDate = PostUpgradeSUDate;
    // Shift the timeline's end date by a couple of days, so that the last SU package remains visible
    const daysToShiftEnd = 3 * parseInt(upgradeDurationInput.value) / 6;
    timelineEndDate.setDate(PostUpgradeSUDate.getDate() + daysToShiftEnd);
    timelineOptions.end = timelineEndDate;
    if (!skipRedrawTimeline) {
        timeline.setOptions(timelineOptions);
    }
}

function updateVisItemDate(itemID, date, type) {
    const item = items.get(itemID);
    if ("startPhase" === type) {
        item.start = date;
    } else if ("startPoint" === type) {
        const startDate = new Date(date).setHours(8,0,0,0);
        item.start = startDate;
    } else if ("end" === type) {
        const endDate = new Date(date).setHours(23,59,59,0);
        item.end = endDate;
    }
    items.update(item);
}

function updateVisItemContent(itemID, content) {
    const item = items.get(itemID);
    item.content = content;
    items.update(item);
}

function updateVisGroupContent(groupID, content) {
    const group = groups.get(groupID);
    group.content = content;
    groups.update(group);
}

function updateVersionName() {
    const versionName = versionNameSelect.options[versionNameSelect.selectedIndex].text;
    updateVisItemContent("upgradePeriod", `Upgrade to ${versionName}`);
    updateVisGroupContent("upgrade", versionName);
}

function updateEnvironmentDate(evt) {
    const envName = evt.target.id.substring(0, 3);
    const startDate = evt.target.value;
    updateVisItemDate(`env${envName}`, startDate, "startPoint");
}

function updateSUDeliveryDate(evt) {
    const suName = evt.target.id.substring(0, evt.target.id.length - "DeliveryDate".length);
    const startDate = evt.target.value;
    updateVisItemDate(`su${suName}`, startDate, "startPoint");
}