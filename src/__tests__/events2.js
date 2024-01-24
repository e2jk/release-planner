/**
 * @jest-environment jsdom
 */

const app = require('../app');

test("updateEnvironmentDate when an environment's upgrade date is changed", () => {
    document.body.innerHTML =
        '<input type="date" class="form-control" id="POCUpgradeDate" name="POCUpgradeDate" aria-label="POC Upgrade Date" aria-describedby="basic-addon-udPOC" value="2024-01-24">';
    app.getUI();
    // Testing when triggered from an event
    document.getElementById(`POCUpgradeDate`).addEventListener('input', app.updateEnvironmentDate);
    
    app.updateVisItemDate = jest.fn();
    
    const event = new Event("input");
    document.getElementById(`POCUpgradeDate`).dispatchEvent(event);

    expect(app.updateVisItemDate).toHaveBeenCalledWith(
        "envPOC",
        "2024-01-24",
        "startPoint"
    );
});

test("updateSUDeliveryDate when an SU dDelivery date is changed", () => {
    document.body.innerHTML =
        '<input type="date" class="form-control" id="AllFixSUDeliveryDate" name="AllFixSUDeliveryDate" aria-label="All Fix SUs Delivery Date" aria-describedby="basic-addon-SUAllFix" value="2024-01-24">';
    app.getUI();
    // Testing when triggered from an event
    document.getElementById(`AllFixSUDeliveryDate`).addEventListener('input', app.updateSUDeliveryDate);
    
    app.updateVisItemDate = jest.fn();
    
    const event = new Event("input");
    document.getElementById(`AllFixSUDeliveryDate`).dispatchEvent(event);

    expect(app.updateVisItemDate).toHaveBeenCalledWith(
        "suAllFixSU",
        "2024-01-24",
        "startPoint"
    );
});