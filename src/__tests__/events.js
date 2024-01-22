/**
 * @jest-environment jsdom
 */

const app = require('../app');

test("UI events get triggered as expected", () => {
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
    '<div id="visualization" class="mt-3"></div>';
    app.getUI();
    app.ui.numVersionsSelect.addEventListener = jest.fn();
    app.ui.durationInput["upgrade"].addEventListener = jest.fn();
    app.ui.startDateInput["upgrade"].addEventListener = jest.fn();
    app.ui.endDateInput["upgrade"].addEventListener = jest.fn();
    for (let i = 0; i < app.phases.length; i++) {
        app.ui.durationInput[app.phases[i]].addEventListener = jest.fn();
        app.ui.startDateInput[app.phases[i]].addEventListener = jest.fn();
        app.ui.endDateInput[app.phases[i]].addEventListener = jest.fn();
    }
    app.ui.versionNameSelect.addEventListener = jest.fn();
    for (let i = 0; i < app.environments.length; i++) {
        app.ui.upgradeDateInput[app.environments[i]].addEventListener = jest.fn();
    };
    Object.keys(app.suDeliveries).forEach(function(key, index) {
        app.ui.deliveryDateInput[key].addEventListener = jest.fn();
    }, app.suDeliveries);

    app.setupEventListeners();

    expect(Object.keys(app.ui).length).toStrictEqual(9);
    expect(app.ui.numVersionsSelect.addEventListener).toBeCalledWith("change", expect.any(Function));
    expect(app.ui.numVersionsSelect.addEventListener).toBeCalledTimes(1);
    expect(app.ui.durationInput["upgrade"].addEventListener).toBeCalledWith("input", expect.any(Function));
    expect(app.ui.durationInput["upgrade"].addEventListener).toBeCalledTimes(2);
    expect(app.ui.startDateInput["upgrade"].addEventListener).toBeCalledWith("input", expect.any(Function));
    expect(app.ui.startDateInput["upgrade"].addEventListener).toBeCalledTimes(2);
    expect(app.ui.endDateInput["upgrade"].addEventListener).toBeCalledWith("input", expect.any(Function));
    expect(app.ui.endDateInput["upgrade"].addEventListener).toBeCalledTimes(1);
    for (let i = 0; i < app.phases.length; i++) {
        expect(app.ui.durationInput[app.phases[i]].addEventListener).toBeCalledWith("input", expect.any(Function));
        expect(app.ui.durationInput[app.phases[i]].addEventListener).toBeCalledTimes(2);
        expect(app.ui.startDateInput[app.phases[i]].addEventListener).toBeCalledWith("input", expect.any(Function));
        expect(app.ui.startDateInput[app.phases[i]].addEventListener).toBeCalledTimes(1);
        expect(app.ui.endDateInput[app.phases[i]].addEventListener).toBeCalledWith("input", expect.any(Function));
        expect(app.ui.endDateInput[app.phases[i]].addEventListener).toBeCalledTimes(1);
    };
    expect(app.ui.versionNameSelect.addEventListener).toBeCalledWith("input", expect.any(Function));
    expect(app.ui.versionNameSelect.addEventListener).toBeCalledTimes(1);
    for (let i = 0; i < app.environments.length; i++) {
        expect(app.ui.upgradeDateInput[app.environments[i]].addEventListener).toBeCalledWith("input", expect.any(Function));
        expect(app.ui.upgradeDateInput[app.environments[i]].addEventListener).toBeCalledTimes(1);
    };
    Object.keys(app.suDeliveries).forEach(function(key, index) {
        expect(app.ui.deliveryDateInput[key].addEventListener).toBeCalledWith("input", expect.any(Function));
        expect(app.ui.deliveryDateInput[key].addEventListener).toBeCalledTimes(1);
    }, app.suDeliveries);
  });