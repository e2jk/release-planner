/**
 * @jest-environment jsdom
 */

const app = require('../app');

test("Confirm that dates are set by default", () => {
    document.body.innerHTML =
        '<small class="text-body-secondary">Upgrade Duration: <span id="upgradeDurationValue">14 weeks</span></small>' +
        '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-01-25">' +
        '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate">' +
        '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" value="15">' +
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
        '<input type="date" class="form-control" id="PostUpgradeSUDeliveryDate" name="PostUpgradeSUDeliveryDate" aria-label="Post-Upgrade SU Delivery Date" aria-describedby="basic-addon-SUPostUpgrade">';
    
    app.getUI();

    expect(app.ui.durationInput["upgrade"].value).toBe("15");
    expect(app.ui.startDateInput["upgrade"].value).toBe("2024-01-25");
    for (let i = 0; i < app.phases.length; i++) {
        expect(app.ui.startDateInput[app.phases[i]].value).toBe("");
        expect(app.ui.endDateInput[app.phases[i]].value).toBe("");
        // Invalid/unset values show up as a value of 50
        expect(app.ui.durationInput[app.phases[i]].value).toBe("50");
    }
    for (let i = 0; i < app.environments.length; i++) {
        expect(app.ui.upgradeDateInput[app.environments[i]].value).toBe("");
    }
    Object.keys(app.suDeliveries).forEach(function(key) {
        expect(app.ui.deliveryDateInput[key].value).toBe("");
    }, app.suDeliveries);

    app.updateVisItemDate = jest.fn();
    app.ui.timeline = jest.fn();
    app.ui.timeline.setOptions = jest.fn();
    app.setDefaultDates(false);

    // Phases durations, start and end dates
    expect(app.ui.startDateInput["analysis"].value).toBe("2024-01-25");
    expect(app.ui.startDateInput["build"].value).toBe("2024-02-22");
    expect(app.ui.startDateInput["testing"].value).toBe("2024-03-21");
    expect(app.ui.startDateInput["training"].value).toBe("2024-04-11");
    expect(app.ui.endDateInput["analysis"].value).toBe("2024-02-22");
    expect(app.ui.endDateInput["build"].value).toBe("2024-03-21");
    expect(app.ui.endDateInput["testing"].value).toBe("2024-04-11");
    expect(app.ui.endDateInput["training"].value).toBe("2024-05-09");
    expect(app.ui.durationInput["analysis"].value).toBe("4");
    expect(app.ui.durationInput["build"].value).toBe("4");
    expect(app.ui.durationInput["testing"].value).toBe("3");
    expect(app.ui.durationInput["training"].value).toBe("4");
    // Environment upgrades
    expect(app.ui.upgradeDateInput["REL"].value).toBe("2024-01-25");
    expect(app.ui.upgradeDateInput["POC"].value).toBe("2024-02-22");
    expect(app.ui.upgradeDateInput["TST"].value).toBe("2024-03-21");
    expect(app.ui.upgradeDateInput["MST"].value).toBe("2024-04-11");
    expect(app.ui.upgradeDateInput["ACE"].value).toBe("2024-04-11");
    expect(app.ui.upgradeDateInput["PLY"].value).toBe("2024-04-11");
    expect(app.ui.upgradeDateInput["SUP"].value).toBe("2024-05-05");
    expect(app.ui.upgradeDateInput["PRD"].value).toBe("2024-05-09");
    // SU deliveries
    expect(app.ui.deliveryDateInput["InitialSU"].value).toBe("2024-01-25");
    expect(app.ui.deliveryDateInput["AllFixSU"].value).toBe("2024-03-28");
    expect(app.ui.deliveryDateInput["PreUpgradeCriticalSU"].value).toBe("2024-04-25");
    expect(app.ui.deliveryDateInput["PostUpgradeSU"].value).toBe("2024-05-23");

    expect(app.updateVisItemDate).toHaveBeenCalledTimes(30);
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        1,
        "analysisPhase",
        "2024-01-25",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        2,
        "analysisPhase",
        "2024-02-22",
        "end"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        3,
        "buildPhase",
        "2024-02-22",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        4,
        "buildPhase",
        "2024-03-21",
        "end"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        5,
        "testingPhase",
        "2024-03-21",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        6,
        "testingPhase",
        "2024-04-11",
        "end"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        7,
        "trainingPhase",
        "2024-04-11",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        8,
        "trainingPhase",
        "2024-05-09",
        "end"
    );
    
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        9,
        "upgradePeriod",
        "2024-01-25",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        10,
        "upgradePeriod",
        "2024-05-09",
        "end"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        11,
        "analysisPhase",
        "2024-01-25",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        12,
        "analysisPhase",
        "2024-02-22",
        "end"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        13,
        "buildPhase",
        "2024-02-22",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        14,
        "buildPhase",
        "2024-03-21",
        "end"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        15,
        "testingPhase",
        "2024-03-21",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        16,
        "testingPhase",
        "2024-04-11",
        "end"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        17,
        "trainingPhase",
        "2024-04-11",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        18,
        "trainingPhase",
        "2024-05-09",
        "end"
    );

    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        19,
        "envREL",
        "2024-01-25",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        20,
        "envPOC",
        "2024-02-22",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        21,
        "envTST",
        "2024-03-21",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        22,
        "envMST",
        "2024-04-11",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        23,
        "envACE",
        "2024-04-11",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        24,
        "envPLY",
        "2024-04-11",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        25,
        "envSUP",
        "2024-05-05",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        26,
        "envPRD",
        "2024-05-09",
        "startPoint"
    );

    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        27,
        "suInitialSU",
        "2024-01-25",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        28,
        "suAllFixSU",
        "2024-03-28",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        29,
        "suPreUpgradeCriticalSU",
        "2024-04-25",
        "startPoint"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        30,
        "suPostUpgradeSU",
        "2024-05-23",
        "startPoint"
    );

    expect(app.ui.timeline.setOptions).toHaveBeenCalledWith(
        {
            "start": "2024-01-25",
            "end": new Date("2024-05-30")
        }
    );
});