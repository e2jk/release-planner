/**
 * @jest-environment jsdom
 */

const app = require('../app');
import Timeline from "vis-timeline/standalone/esm/vis-timeline-graph2d.min.js";
jest.mock('vis-timeline/standalone/esm/vis-timeline-graph2d.min.js');

test("Application starts up at DOMContentLoaded", () => {
    document.addEventListener('DOMContentLoaded', app.startUp);
    app.getUI = jest.fn();
    app.initialUISetup = jest.fn();
    app.setupEventListeners = jest.fn();
    
    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);

    expect(app.getUI).toHaveBeenCalled();
    expect(app.initialUISetup).toHaveBeenCalled();
    expect(app.setupEventListeners).toHaveBeenCalled();
    //TODO: confirm the constructor has been called (currently returns `undefined`)
    // expect(Timeline).toHaveBeenCalled();
});