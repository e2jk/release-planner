// Import itself (needed to mock nested calls during testing)
import * as app from './app';
// Import minified Bootstrap JavaScript and CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap/dist/css/bootstrap.min.css";
// Import minified vis-timeline JavaScript and CSS
import { Timeline, DataSet } from "vis-timeline/standalone/esm/vis-timeline-graph2d.min.js";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

// ================================================================
// Definition of Variables
// Environments and SU Deliveries
export const phases = ["analysis", "build", "testing", "training"];
export const environments = ["REL", "POC", "TST", "MST", "ACE", "PLY", "SUP","PRD"];
export const suDeliveries = {
    "InitialSU": "Initial",
    "AllFixSU": "All Fix SUs",
    "PreUpgradeCriticalSU": "Pre-Upgrade Critical",
    "PostUpgradeSU": "Post-Upgrade"
};

// Keep references to the UI elements
export const ui = {};

// ================================================================
// Timeline configuration and setup
// Create DataSets for the visualization (allows two way data-binding)
// Groups for the upgrade, the phases and the environments
export const groups = new DataSet([
    {id: "upgrade", content: "Upgrade", nestedGroups: ["phases", "environments", "su"]},
    {id: "phases", content: "Phases"},
    {id: "environments", content: "Environments"},
    {id: "su", content: "SU Deliveries"}
]);
// Bars for phases
export const items = new DataSet([
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
}
// Points for SU Deliveries
Object.keys(suDeliveries).forEach(function(key) {
    items.add([
        {id: `su${key}`, content: this[key], group: "su", type: 'point'}
    ]);
}, suDeliveries);
// Configuration for the Timeline
export const timelineOptions = {};

// ================================================================
// Functions
export function getUI() {
    ui.versionNameSelect = document.getElementById('versionName');
    ui.versionNameSelect = document.getElementById('versionName');
    ui.numVersionsSelect = document.getElementById('numVersions');
    ui.startDateInput = {"upgrade": document.getElementById('upgradeStartDate')};
    ui.endDateInput = {"upgrade": document.getElementById('upgradeEndDate')};
    ui.durationInput = {"upgrade": document.getElementById('upgradeDuration')};
    ui.durationValue = {"upgrade": document.getElementById('upgradeDurationValue')};
    for (let i = 0; i < phases.length; i++) {
        ui.startDateInput[phases[i]] = document.getElementById(`${phases[i]}StartDate`);
        ui.endDateInput[phases[i]] = document.getElementById(`${phases[i]}EndDate`);
        ui.durationInput[phases[i]] = document.getElementById(`${phases[i]}Duration`);
        ui.durationValue[phases[i]] = document.getElementById(`${phases[i]}DurationValue`);
    }
    ui.upgradeDateInput = {};
    for (let i = 0; i < environments.length; i++) {
        ui.upgradeDateInput[environments[i]] = document.getElementById(`${environments[i]}UpgradeDate`);
    }
    ui.deliveryDateInput = {};
    Object.keys(suDeliveries).forEach(function(key) {
        ui.deliveryDateInput[key] = document.getElementById(`${key}DeliveryDate`);
    }, suDeliveries);

    ui.visContainer = document.getElementById('visualization');
}

export function getClosestNextUpgradeVersion(currentYear, currentMonth) {
    let year = currentYear;
    if (currentMonth + 2 > 11) {
        year = currentYear + 1;
    }
    const nextReleaseMonth = `${Math.floor(((currentMonth + 2) % 12) / 3) * 3 + 2}`.padStart(2, '0');
    const nextReleaseversion = `${year}-${nextReleaseMonth}`;

    return nextReleaseversion;
}

export function getMondayIn4Weeks(today) {
    // 3 weeks * 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const mondayInFourWeeks = new Date(today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
    // Find the next Monday
    mondayInFourWeeks.setDate(mondayInFourWeeks.getDate() + (1 + 7 - mondayInFourWeeks.getDay()) % 7);
    // Format the date as 'YYYY-MM-DD' for the input field
    const formattedDate = `${mondayInFourWeeks.getFullYear()}-${(mondayInFourWeeks.getMonth() + 1).toString().padStart(2, '0')}-${mondayInFourWeeks.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
}

export function initialUISetup() {
    // Dynamically generate the list of versions for the 3 years around today
    const currentYear = new Date().getFullYear();
    const months = ['February', 'May', 'August', 'November'];
    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
        for (const month of months) {
            const monthID = `${2 + months.indexOf(month) * 3}`.padStart(2, '0');
            const optionValue = `${year}-${monthID}`;
            const optionText = `${month} ${year}`;
            const option = new Option(optionText, optionValue);
            ui.versionNameSelect.add(option);
        }
    }

    // Set the default selected upgrade version to the closest month in the future
    const nextReleaseversion = getClosestNextUpgradeVersion(currentYear, new Date().getMonth());
    const defaultOption = ui.versionNameSelect.querySelector(`[value="${nextReleaseversion}"]`);
    if (defaultOption) {
        defaultOption.selected = true;
    }
    
    // Set the default upgradeStartDate to be the Monday in 4 weeks
    ui.startDateInput["upgrade"].value = getMondayIn4Weeks(new Date());

    // Set the default values when the page is initialized (the other General settings are explicitly calculated and set elsewhere)
    ui.durationInput["upgrade"].value = 14;
    ui.numVersionsSelect.options[1].selected = true;
    app.setDefaultDates(true);            
    app.updateVersionName();
}

export function setupEventListeners() {
    ui.versionNameSelect.addEventListener('input', updateVersionName);
    ui.numVersionsSelect.addEventListener('change', changeNumVersions);
    ui.startDateInput["upgrade"].addEventListener('input', setDefaultDates);
    ui.durationInput["upgrade"].addEventListener('input', updateEndDate);
    ui.endDateInput["upgrade"].addEventListener('input', updateDuration);
    for (let i = 0; i < phases.length; i++) {
        ui.startDateInput[phases[i]].addEventListener('input', updateEndDate);
        ui.durationInput[phases[i]].addEventListener('input', updateEndDate);
        ui.endDateInput[phases[i]].addEventListener('input', updateDuration);
    }
    for (let i = 0; i < environments.length; i++) {
        document.getElementById(`${environments[i]}UpgradeDate`).addEventListener('input', updateEnvironmentDate);
    }
    Object.keys(suDeliveries).forEach(function(key) {
        document.getElementById(`${key}DeliveryDate`).addEventListener('input', updateSUDeliveryDate);
    }, suDeliveries);
}

export function changeNumVersions() {
    const numVersions = parseInt(ui.numVersionsSelect.value);
    const calculatedDuration = 7 * numVersions;
    
    ui.durationInput["upgrade"].value = calculatedDuration;
    ui.durationValue["upgrade"].textContent = `${calculatedDuration} weeks`;
    // Changing the number of versions changes the entire planning, so recalculate all default dates
    app.setDefaultDates(false);
}

export function setStartDate(startDate) {
    // If the start date is on a Friday, Saturday or Sunday, move it up to the next Monday
    let newStartDate = new Date(startDate);
    const numDaysToAdd = {5: 3, 6: 2, 0: 1, 1: 0, 2: 0, 3: 0, 4: 0}[newStartDate.getDay()];
    if (numDaysToAdd > 0) {
        newStartDate.setDate(newStartDate.getDate() + numDaysToAdd);
    }
    return newStartDate;
}

export function setEndDate(startDateInput, durationWeeksInput, endDateInput) {
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
export function getRoundedNumberOfWeeks(startDate, endDate) {
    return Math.round((endDate - startDate) / (7 * 24 * 60 * 60 * 1000)); // Convert from milliseconds to weeks
}
export function getPhaseTypeFromEventTarget(evt) {
    let phase = "";
    let mode = "event";
    if ("object" === typeof evt) {
        for (let i = 0; i < phases.length; i++) {
            if (evt.target.id.startsWith(phases[i])) {
                phase = phases[i];
                break;
            }
        }
        if (!phase && evt.target.id.startsWith("upgrade")) {
            phase = "upgrade";
        }
    }
    if (!phase) {
        phase = evt;
        mode = "inline";
    }
    return [phase, mode];
}
export function updateDuration(evt) {
    const [phase, ] = getPhaseTypeFromEventTarget(evt);
    
    // Keep the start date and adapt the duration
    const startDate = new Date(ui.startDateInput[phase].value);
    const endDate = new Date(ui.endDateInput[phase].value);
    const durationInWeeks = getRoundedNumberOfWeeks(startDate, endDate);
    ui.durationInput[phase].value = durationInWeeks;
    ui.durationValue[phase].textContent = `${durationInWeeks} weeks`;
    if ("upgrade" === phase) {
        app.setDefaultDates(false);
    } else {
        app.updateVisItemDate(`${phase}Phase`, ui.startDateInput[phase].value, "startPhase");
        app.updateVisItemDate(`${phase}Phase`, ui.endDateInput[phase].value, "end");
    }
}
export function updateEndDate(evt) {
    const [phase, mode] = getPhaseTypeFromEventTarget(evt);
    app.setEndDate(ui.startDateInput[phase], ui.durationInput[phase], ui.endDateInput[phase]);
    ui.durationValue[phase].textContent = `${ui.durationInput[phase].value} weeks`;
    if ("upgrade" === phase) {
        if ("event" === mode) {
            app.setDefaultDates(false);
        }
    } else {
        app.updateVisItemDate(`${phase}Phase`, ui.startDateInput[phase].value, "startPhase");
        app.updateVisItemDate(`${phase}Phase`, ui.endDateInput[phase].value, "end");
    }
}

export function calculateDefaultPhaseLengths(upgradeDuration) {
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

    return [analysisDuration, buildDuration, testingDuration, trainingDuration];
}
export function determineDefaultPhaseLengths() {
    //The length of phases depends on the number of weeks alloted for the entire upgrade
    const upgradeDuration = parseInt(ui.durationInput["upgrade"].value);

    const durations = calculateDefaultPhaseLengths(upgradeDuration);
    let analysisDuration = durations[0];
    let buildDuration = durations[1];
    let testingDuration = durations[2];
    let trainingDuration = durations[3];

    ui.durationInput["analysis"].value = analysisDuration;
    ui.durationInput["analysis"].max = upgradeDuration;
    ui.durationValue["analysis"].textContent = `${ui.durationInput["analysis"].value} weeks`;
    ui.durationInput["build"].value = buildDuration;
    ui.durationInput["build"].max = upgradeDuration;
    ui.durationValue["build"].textContent = `${ui.durationInput["build"].value} weeks`;
    ui.durationInput["testing"].value = testingDuration;
    ui.durationInput["testing"].max = upgradeDuration;
    ui.durationValue["testing"].textContent = `${ui.durationInput["testing"].value} weeks`;
    ui.durationInput["training"].value = trainingDuration;
    ui.durationInput["training"].max = upgradeDuration;
    ui.durationValue["training"].textContent = `${ui.durationInput["training"].value} weeks`;
}

export function setDefaultDates(skipRedrawTimeline) {
    determineDefaultPhaseLengths();
    updateEndDate("upgrade");

    // Set start date of the Analysis phase is the same as start of the upgrade itself
    ui.startDateInput["analysis"].valueAsDate = setStartDate(ui.startDateInput["upgrade"].value);
    updateEndDate("analysis");

    // Default start date of the build phase is the end of the analysis phase
    ui.startDateInput["build"].valueAsDate = setStartDate(ui.endDateInput["analysis"].value);
    updateEndDate("build");

    // Default start date of the testing phase is the end of the build phase
    ui.startDateInput["testing"].valueAsDate = setStartDate(ui.endDateInput["build"].value);
    updateEndDate("testing");

    // Default start date of the training phase is the end of the build phase
    ui.startDateInput["training"].valueAsDate = setStartDate(ui.endDateInput["testing"].value);
    updateEndDate("training");

    // Default dates for the environment upgrades
    // REL at the start of the project
    ui.upgradeDateInput["REL"].value = ui.startDateInput["upgrade"].value;
    // POC at the start of the build phase
    ui.upgradeDateInput["POC"].value = ui.startDateInput["build"].value;
    // TST at the start of the testing phase
    ui.upgradeDateInput["TST"].value = ui.startDateInput["testing"].value;
    // MST, ACEs and PLY at the start of the training phase
    ui.upgradeDateInput["MST"].value = ui.startDateInput["training"].value;
    ui.upgradeDateInput["ACE"].value = ui.startDateInput["training"].value;
    ui.upgradeDateInput["PLY"].value = ui.startDateInput["training"].value;
    // PRD and SUP dates
    ui.upgradeDateInput["PRD"].value = ui.endDateInput["upgrade"].value;
    // SUP 4 days before the PRD upgrade
    const PRDUpgradeDate = new Date(ui.upgradeDateInput["PRD"].value);
    const SUPUpgradeDate = new Date(PRDUpgradeDate.getTime() - 4 * 24 * 60 * 60 * 1000); // 4 days in milliseconds
    ui.upgradeDateInput["SUP"].valueAsDate = SUPUpgradeDate;

    // Default dates for the SU deliveries
    // Initial SU Delivery at the start of the project
    ui.deliveryDateInput["InitialSU"].value = ui.startDateInput["upgrade"].value;
    // All Fix SUs Delivery 2 weeks after the end of the Testing phase
    const testingEndDate = new Date(ui.endDateInput["testing"].value);
    const AllFixSUDeliveryDate = new Date(testingEndDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 4 days in milliseconds
    ui.deliveryDateInput["AllFixSU"].valueAsDate = AllFixSUDeliveryDate;
    // Pre-Upgrade Critical SU 2 weeks before the PRD upgrade
    const PreUpgradeCriticalSUDate = new Date(PRDUpgradeDate.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks in milliseconds
    ui.deliveryDateInput["PreUpgradeCriticalSU"].valueAsDate = PreUpgradeCriticalSUDate;
    // Post-Upgrade SU Delivery 2 weeks after the PRD upgrade
    // (yeah, you could argue that the PRD upgrade date is thus not the real end of the upgrade...)
    const PostUpgradeSUDate = new Date(PRDUpgradeDate.getTime() + 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks in milliseconds
    ui.deliveryDateInput["PostUpgradeSU"].valueAsDate = PostUpgradeSUDate;

    app.updateVisItemDate("upgradePeriod", ui.startDateInput["upgrade"].value, "startPhase");
    app.updateVisItemDate("upgradePeriod", ui.endDateInput["upgrade"].value, "end");
    app.updateVisItemDate("analysisPhase", ui.startDateInput["analysis"].value, "startPhase");
    app.updateVisItemDate("analysisPhase", ui.endDateInput["analysis"].value, "end");
    app.updateVisItemDate("buildPhase", ui.startDateInput["build"].value, "startPhase");
    app.updateVisItemDate("buildPhase", ui.endDateInput["build"].value, "end");
    app.updateVisItemDate("testingPhase", ui.startDateInput["testing"].value, "startPhase");
    app.updateVisItemDate("testingPhase", ui.endDateInput["testing"].value, "end");
    app.updateVisItemDate("trainingPhase", ui.startDateInput["training"].value, "startPhase");
    app.updateVisItemDate("trainingPhase", ui.endDateInput["training"].value, "end");
    for (let i = 0; i < environments.length; i++) {
        app.updateVisItemDate(`env${environments[i]}`, document.getElementById(`${environments[i]}UpgradeDate`).value, "startPoint");
    }                
    Object.keys(suDeliveries).forEach(function(key) {
        app.updateVisItemDate(`su${key}`, document.getElementById(`${key}DeliveryDate`).value, "startPoint");
    }, suDeliveries);

    // Define the timeline's begin and end dates
    timelineOptions.start = ui.startDateInput["upgrade"].value;
    let timelineEndDate = PostUpgradeSUDate;
    // Shift the timeline's end date by a couple of days, so that the last SU package remains visible
    const daysToShiftEnd = 3 * parseInt(ui.durationInput["upgrade"].value) / 6;
    timelineEndDate.setDate(PostUpgradeSUDate.getDate() + daysToShiftEnd);
    timelineOptions.end = timelineEndDate;
    if (!skipRedrawTimeline) {
        ui.timeline.setOptions(timelineOptions);
    }
}

export function updateVisItemDate(itemID, date, type) {
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

export function updateVisItemContent(itemID, content) {
    const item = items.get(itemID);
    item.content = content;
    items.update(item);
}

export function updateVisGroupContent(groupID, content) {
    const group = groups.get(groupID);
    group.content = content;
    groups.update(group);
}

export function updateVersionName() {
    const versionName = ui.versionNameSelect.options[ui.versionNameSelect.selectedIndex].text;
    app.updateVisItemContent("upgradePeriod", `Upgrade to ${versionName}`);
    app.updateVisGroupContent("upgrade", versionName);
}

export function updateEnvironmentDate(evt) {
    const envName = evt.target.id.substring(0, 3);
    const startDate = evt.target.value;
    app.updateVisItemDate(`env${envName}`, startDate, "startPoint");
}

export function updateSUDeliveryDate(evt) {
    const suName = evt.target.id.substring(0, evt.target.id.length - "DeliveryDate".length);
    const startDate = evt.target.value;
    app.updateVisItemDate(`su${suName}`, startDate, "startPoint");
}

export function startUp() {
    // Initial setup of the UI
    app.getUI();
    app.initialUISetup();
    app.setupEventListeners();
    // Create the Timeline
    ui.timeline = new Timeline(ui.visContainer, items, groups, timelineOptions);
}

document.addEventListener('DOMContentLoaded', startUp);