/**
 * @jest-environment jsdom
 */

// import userEvent from '@testing-library/user-event'

const app = require('../app');

test("Get phase type when not an event", () => {
    // When passing just a string, get that string back
    expect(app.getPhaseTypeFromEventTarget("abc")).toBe("abc");
});

test("Update end date when triggered from an event", () => {
    document.body.innerHTML =
        '<input type="range" class="form-range" id="analysisDuration" name="analysisDuration" min="1">' +
        '<input type="date" class="form-control" id="analysisStartDate" name="analysisStartDate" aria-label="Analysis Start Date" aria-describedby="basic-addon-asd" value="2024-01-23">' +
        '<input type="date" class="form-control" id="analysisEndDate" name="analysisEndDate" aria-label="Analysis End Date" aria-describedby="basic-addon-aed" value="2024-01-23">';
    app.getUI();
    
    // Testing when triggered from an event
    app.ui.startDateInput["analysis"].addEventListener('input', app.updateEndDate);

    app.setEndDate = jest.fn();
    app.updateVisItemDate = jest.fn();
    
    const event = new Event("input");
    app.ui.startDateInput["analysis"].dispatchEvent(event);

    expect(app.setEndDate).toBeCalledTimes(1);
    expect(app.setEndDate).toBeCalledWith(
        app.ui.startDateInput["analysis"],
        app.ui.durationInput["analysis"],
        app.ui.endDateInput["analysis"]
    );
    expect(app.updateVisItemDate).toBeCalledTimes(2);
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        1,
        "analysisPhase",
        "2024-01-23",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        2,
        "analysisPhase",
        "2024-01-23",
        "end"
    );
});

test("Update end date when triggered from an event", () => {
    document.body.innerHTML =
        '<input type="range" class="form-range" id="analysisDuration" name="analysisDuration" min="1">' +
        '<input type="date" class="form-control" id="analysisStartDate" name="analysisStartDate" aria-label="Analysis Start Date" aria-describedby="basic-addon-asd" value="2024-01-23">' +
        '<input type="date" class="form-control" id="analysisEndDate" name="analysisEndDate" aria-label="Analysis End Date" aria-describedby="basic-addon-aed" value="2024-01-23">';
    app.getUI();
    
    app.setEndDate = jest.fn();
    app.updateVisItemDate = jest.fn();
    
    // Testing when ran directly
    app.updateEndDate("analysis");

    expect(app.setEndDate).toBeCalledTimes(1);
    expect(app.setEndDate).toBeCalledWith(
        app.ui.startDateInput["analysis"],
        app.ui.durationInput["analysis"],
        app.ui.endDateInput["analysis"]
    );
    expect(app.updateVisItemDate).toBeCalledTimes(2);
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        1,
        "analysisPhase",
        "2024-01-23",
        "startPhase"
    );
    expect(app.updateVisItemDate).toHaveBeenNthCalledWith(
        2,
        "analysisPhase",
        "2024-01-23",
        "end"
    );
});