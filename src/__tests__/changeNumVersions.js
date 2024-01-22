/**
 * @jest-environment jsdom
 */

const app = require('../app');

test("Changing the number of versions changes the length of the upgrade period", () => {
    document.body.innerHTML =
        '<select class="form-select" id="numVersions" name="numVersions">' +
        '<option value="1">1 version</option>' +
        '<option value="2" selected>2 versions</option>' +
        '<option value="3">3 versions</option>' +
        '<option value="4">4 versions</option>' +
        '</select>' +
        '<span id="upgradeDurationValue">14 weeks</span>' +
        '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" min="7" max="40" value="14">';
    app.ui.numVersionsSelect = document.getElementById("numVersions");
    app.ui.durationInput = {"upgrade": document.getElementById("upgradeDuration")};
    app.ui.durationValue = {"upgrade": document.getElementById("upgradeDurationValue")};
    expect(app.ui.numVersionsSelect.value).toBe("2");
    expect(app.ui.durationInput["upgrade"].value).toBe("14");
    expect(app.ui.durationValue["upgrade"].textContent).toBe("14 weeks");
    
    app.ui.numVersionsSelect.value = 3;
    expect(app.ui.numVersionsSelect.value).toBe("3");
    
    // Mock the nested function
    app.setDefaultDates = jest.fn();
    app.changeNumVersions();

    expect(app.ui.durationInput["upgrade"].value).toBe("21");
    expect(app.ui.durationValue["upgrade"].textContent).toBe("21 weeks");
    expect(app.setDefaultDates).toHaveBeenCalled();
});