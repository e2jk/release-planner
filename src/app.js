// Import minified Bootstrap JavaScript and CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap/dist/css/bootstrap.min.css";
// Import minified vis-timeline JavaScript and CSS
import { Timeline, DataSet } from "vis-timeline/standalone/esm/vis-timeline-graph2d.min.js";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

// ================================================================
// Definition of Variables
// Environments and SU Deliveries
const phases = ["analysis", "build", "testing", "training"];
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
const startDateInput = {"upgrade": document.getElementById('upgradeStartDate')};
const endDateInput = {"upgrade": document.getElementById('upgradeEndDate')};
const durationInput = {"upgrade": document.getElementById('upgradeDuration')};
const durationValue = {"upgrade": document.getElementById('upgradeDurationValue')};
for (let i = 0; i < phases.length; i++) {
    startDateInput[phases[i]] = document.getElementById(`${phases[i]}StartDate`);
    endDateInput[phases[i]] = document.getElementById(`${phases[i]}EndDate`);
    durationInput[phases[i]] = document.getElementById(`${phases[i]}Duration`);
    durationValue[phases[i]] = document.getElementById(`${phases[i]}DurationValue`);
};
const upgradeDateInput = {};
for (let i = 0; i < environments.length; i++) {
    upgradeDateInput[environments[i]] = document.getElementById(`${environments[i]}UpgradeDate`);
};
const deliveryDateInput = {};
Object.keys(suDeliveries).forEach(function(key, index) {
    deliveryDateInput[key] = document.getElementById(`${key}DeliveryDate`);
}, suDeliveries);

const visContainer = document.getElementById('visualization');

// ================================================================
// Timeline configuration and setup
// Create DataSets for the visualization (allows two way data-binding)
// Groups for the upgrade, the phases and the environments
const groups = new DataSet([
    {id: "upgrade", content: "Upgrade", nestedGroups: ["phases", "environments", "su"]},
    {id: "phases", content: "Phases"},
    {id: "environments", content: "Environments"},
    {id: "su", content: "SU Deliveries"}
]);
// Bars for phases
const items = new DataSet([
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
const timeline = new Timeline(visContainer, items, groups, timelineOptions);

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
    startDateInput["upgrade"].value = formattedDate;

    // Set the default values when the page is initialized (the other General settings are explicitly calculated and set elsewhere)
    durationInput["upgrade"].value = 14;
    numVersionsSelect.options[1].selected = true;
    setDefaultDates(false, true);            
    updateVersionName();
}

function setupEventListeners() {
    numVersionsSelect.addEventListener('change', changeNumVersions);
    durationInput["upgrade"].addEventListener('input', () => {
        durationValue["upgrade"].textContent = `${durationInput["upgrade"].value} weeks`;
        setDefaultDates();
    });
    startDateInput["upgrade"].addEventListener('input', setDefaultDates);
    startDateInput["upgrade"].addEventListener('input', updateUpgradeEndDate);
    durationInput["upgrade"].addEventListener('input', updateUpgradeEndDate);
    endDateInput["upgrade"].addEventListener('input', updateUpgradeDuration);
    startDateInput["analysis"].addEventListener('input', updateAnalysisEndDate);
    durationInput["analysis"].addEventListener('input', updateAnalysisEndDate);
    durationInput["analysis"].addEventListener('input', () => {
        durationValue["analysis"].textContent = `${durationInput["analysis"].value} weeks`;
    });
    endDateInput["analysis"].addEventListener('input', updateAnalysisDuration);
    startDateInput["build"].addEventListener('input', updateBuildEndDate);
    durationInput["build"].addEventListener('input', updateBuildEndDate);
    durationInput["build"].addEventListener('input', () => {
        durationValue["build"].textContent = `${durationInput["build"].value} weeks`;
    });
    endDateInput["build"].addEventListener('input', updateBuildDuration);
    startDateInput["testing"].addEventListener('input', updateTestingEndDate);
    durationInput["testing"].addEventListener('input', updateTestingEndDate);
    durationInput["testing"].addEventListener('input', () => {
        durationValue["testing"].textContent = `${durationInput["testing"].value} weeks`;
    });
    endDateInput["testing"].addEventListener('input', updateTestingDuration);
    startDateInput["training"].addEventListener('input', updateTrainingEndDate);
    durationInput["training"].addEventListener('input', updateTrainingEndDate);
    durationInput["training"].addEventListener('input', () => {
        durationValue["training"].textContent = `${durationInput["training"].value} weeks`;
    });
    endDateInput["training"].addEventListener('input', updateTrainingDuration);
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
    
    durationInput["upgrade"].value = calculatedDuration;
    durationValue["upgrade"].textContent = `${calculatedDuration} weeks`;
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
    setEndDate(startDateInput["upgrade"], durationInput["upgrade"], endDateInput["upgrade"]);
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
    updateDuration(startDateInput["upgrade"], endDateInput["upgrade"], durationInput["upgrade"], durationValue["upgrade"]);
    // Recalculate the rest of the default dates
    setDefaultDates(true);
}
function updateAnalysisDuration() {
    updateDuration(startDateInput["analysis"], endDateInput["analysis"], durationInput["analysis"], durationValue["analysis"]);
    updateVisItemDate("analysisPhase", startDateInput["analysis"].value, "startPhase");
    updateVisItemDate("analysisPhase", endDateInput["analysis"].value, "end");
}
function updateBuildDuration() {
    updateDuration(startDateInput["build"], endDateInput["build"], durationInput["build"], durationValue["build"]);
    updateVisItemDate("buildPhase", startDateInput["build"].value, "startPhase");
    updateVisItemDate("buildPhase", endDateInput["build"].value, "end");
}
function updateTestingDuration() {
    updateDuration(startDateInput["testing"], endDateInput["testing"], durationInput["testing"], durationValue["testing"]);
    updateVisItemDate("testingPhase", startDateInput["testing"].value, "startPhase");
    updateVisItemDate("testingPhase", endDateInput["testing"].value, "end");
}
function updateTrainingDuration() {
    updateDuration(startDateInput["training"], endDateInput["training"], durationInput["training"], durationValue["training"]);
    updateVisItemDate("trainingPhase", startDateInput["training"].value, "startPhase");
    updateVisItemDate("trainingPhase", endDateInput["training"].value, "end");
}
function updateAnalysisEndDate() {
    setEndDate(startDateInput["analysis"], durationInput["analysis"], endDateInput["analysis"]);
    updateVisItemDate("analysisPhase", startDateInput["analysis"].value, "startPhase");
    updateVisItemDate("analysisPhase", endDateInput["analysis"].value, "end");
}
function updateBuildEndDate() {
    setEndDate(startDateInput["build"], durationInput["build"], endDateInput["build"]);
    updateVisItemDate("buildPhase", startDateInput["build"].value, "startPhase");
    updateVisItemDate("buildPhase", endDateInput["build"].value, "end");
}
function updateTestingEndDate() {
    setEndDate(startDateInput["testing"], durationInput["testing"], endDateInput["testing"]);
    updateVisItemDate("testingPhase", startDateInput["testing"].value, "startPhase");
    updateVisItemDate("testingPhase", endDateInput["testing"].value, "end");
}
function updateTrainingEndDate() {
    setEndDate(startDateInput["training"], durationInput["training"], endDateInput["training"]);
    updateVisItemDate("trainingPhase", startDateInput["training"].value, "startPhase");
    updateVisItemDate("trainingPhase", endDateInput["training"].value, "end");
}

function determineDefaultPhaseLengths() {
    //The length of phases depends on the number of weeks alloted for the entire upgrade
    const upgradeDuration = parseInt(durationInput["upgrade"].value);
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

    durationInput["analysis"].value = analysisDuration;
    durationInput["analysis"].max = upgradeDuration;
    durationValue["analysis"].textContent = `${durationInput["analysis"].value} weeks`;
    durationInput["build"].value = buildDuration;
    durationInput["build"].max = upgradeDuration;
    durationValue["build"].textContent = `${durationInput["build"].value} weeks`;
    durationInput["testing"].value = testingDuration;
    durationInput["testing"].max = upgradeDuration;
    durationValue["testing"].textContent = `${durationInput["testing"].value} weeks`;
    durationInput["training"].value = trainingDuration;
    durationInput["training"].max = upgradeDuration;
    durationValue["training"].textContent = `${durationInput["training"].value} weeks`;
}

function setDefaultDates(skipUpdateUpgradeEndDate=false, skipRedrawTimeline=false) {
    determineDefaultPhaseLengths();

    if (!skipUpdateUpgradeEndDate) {
        updateUpgradeEndDate();
    }

    // Set start date of the Analysis phase is the same as start of the upgrade itself
    startDateInput["analysis"].valueAsDate = setStartDate(startDateInput["upgrade"].value);
    updateAnalysisEndDate();

    // Default start date of the build phase is the end of the analysis phase
    startDateInput["build"].valueAsDate = setStartDate(endDateInput["analysis"].value);
    updateBuildEndDate();

    // Default start date of the testing phase is the end of the build phase
    startDateInput["testing"].valueAsDate = setStartDate(endDateInput["build"].value);
    updateTestingEndDate();

    // Default start date of the training phase is the end of the build phase
    startDateInput["training"].valueAsDate = setStartDate(endDateInput["testing"].value);
    updateTrainingEndDate();

    // Default dates for the environment upgrades
    // REL at the start of the project
    upgradeDateInput["REL"].value = startDateInput["upgrade"].value;
    // POC at the start of the build phase
    upgradeDateInput["POC"].value = startDateInput["build"].value;
    // TST at the start of the testing phase
    upgradeDateInput["TST"].value = startDateInput["testing"].value;
    // MST, ACEs and PLY at the start of the training phase
    upgradeDateInput["MST"].value = startDateInput["training"].value;
    upgradeDateInput["ACE"].value = startDateInput["training"].value;
    upgradeDateInput["PLY"].value = startDateInput["training"].value;
    // PRD and SUP dates
    upgradeDateInput["PRD"].value = endDateInput["upgrade"].value;
    // SUP 4 days before the PRD upgrade
    const PRDUpgradeDate = new Date(upgradeDateInput["PRD"].value);
    const SUPUpgradeDate = new Date(PRDUpgradeDate.getTime() - 4 * 24 * 60 * 60 * 1000); // 4 days in milliseconds
    upgradeDateInput["SUP"].valueAsDate = SUPUpgradeDate;

    // Default dates for the SU deliveries
    // Initial SU Delivery at the start of the project
    deliveryDateInput["InitialSU"].value = startDateInput["upgrade"].value;
    // All Fix SUs Delivery 2 weeks after the end of the Testing phase
    const testingEndDate = new Date(endDateInput["testing"].value);
    const AllFixSUDeliveryDate = new Date(testingEndDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 4 days in milliseconds
    deliveryDateInput["AllFixSU"].valueAsDate = AllFixSUDeliveryDate;
    // Pre-Upgrade Critical SU 2 weeks before the PRD upgrade
    const PreUpgradeCriticalSUDate = new Date(PRDUpgradeDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks in milliseconds
    deliveryDateInput["PreUpgradeCriticalSU"].valueAsDate = PreUpgradeCriticalSUDate;
    // Post-Upgrade SU Delivery 2 weeks after the PRD upgrade
    // (yeah, you could argue that the PRD upgrade date is thus not the real end of the upgrade...)
    const PostUpgradeSUDate = new Date(PRDUpgradeDate.getTime() + 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks in milliseconds
    deliveryDateInput["PostUpgradeSU"].valueAsDate = PostUpgradeSUDate;

    updateVisItemDate("upgradePeriod", startDateInput["upgrade"].value, "startPhase");
    updateVisItemDate("upgradePeriod", endDateInput["upgrade"].value, "end");
    updateVisItemDate("analysisPhase", startDateInput["analysis"].value, "startPhase");
    updateVisItemDate("analysisPhase", endDateInput["analysis"].value, "end");
    updateVisItemDate("buildPhase", startDateInput["build"].value, "startPhase");
    updateVisItemDate("buildPhase", endDateInput["build"].value, "end");
    updateVisItemDate("testingPhase", startDateInput["testing"].value, "startPhase");
    updateVisItemDate("testingPhase", endDateInput["testing"].value, "end");
    updateVisItemDate("trainingPhase", startDateInput["training"].value, "startPhase");
    updateVisItemDate("trainingPhase", endDateInput["training"].value, "end");
    for (let i = 0; i < environments.length; i++) {
        updateVisItemDate(`env${environments[i]}`, document.getElementById(`${environments[i]}UpgradeDate`).value, "startPoint");
    };                
    Object.keys(suDeliveries).forEach(function(key, index) {
        updateVisItemDate(`su${key}`, document.getElementById(`${key}DeliveryDate`).value, "startPoint");
    }, suDeliveries);

    // Define the timeline's begin and end dates
    timelineOptions.start = startDateInput["upgrade"].value;
    let timelineEndDate = PostUpgradeSUDate;
    // Shift the timeline's end date by a couple of days, so that the last SU package remains visible
    const daysToShiftEnd = 3 * parseInt(durationInput["upgrade"].value) / 6;
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