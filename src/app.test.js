/**
 * @jest-environment jsdom
 */

const {
  phases,
  environments,
  suDeliveries,
  ui,
  groups,
  items,
  timelineOptions,
} = require("./app");

test("There are 4 default Phases", () => {
  expect(phases).toHaveLength(4);
  expect(phases).toEqual(["analysis", "build", "testing", "training"]);
});

test("There are 8 default Environments", () => {
  expect(environments).toHaveLength(8);
  expect(environments).toEqual(["REL", "POC", "TST", "MST", "ACE", "PLY", "SUP","PRD"]);
});

test("There are 4 default SU Deliveries", () => {
  expect(Object.keys(suDeliveries).length).toEqual(4);
  expect(suDeliveries).toHaveProperty("PreUpgradeCriticalSU", "Pre-Upgrade Critical");
  expect(suDeliveries).toEqual({
    "InitialSU": "Initial",
    "AllFixSU": "All Fix SUs",
    "PreUpgradeCriticalSU": "Pre-Upgrade Critical",
    "PostUpgradeSU": "Post-Upgrade"
});
});

test("The default `ui` object is empty", () => {
  expect(Object.keys(ui).length).toEqual(0);
  expect(ui).toEqual({});
});

test("There are 4 default groups for the timeline", () => {
  expect(groups.length).toEqual(4);
  expect(groups.getIds()).toEqual(["upgrade", "phases", "environments", "su"]);
  expect(groups.get("upgrade")).toEqual({
    id: "upgrade",
    content: "Upgrade",
    nestedGroups: [
      "phases",
      "environments",
      "su"
    ]
  });
});

test("There are 17 default bars and points for the timeline", () => {
  expect(items.length).toEqual(17);
  expect(items.getIds()).toEqual([
    'upgradePeriod',
    'analysisPhase',
    'buildPhase',
    'testingPhase',
    'trainingPhase',
    'envREL',
    'envPOC',
    'envTST',
    'envMST',
    'envACE',
    'envPLY',
    'envSUP',
    'envPRD',
    'suInitialSU',
    'suAllFixSU',
    'suPreUpgradeCriticalSU',
    'suPostUpgradeSU'        
  ]);
  expect(items.get("buildPhase")).toEqual({
    id: "buildPhase",
    group: "phases",
    content: "Build"
  });
  expect(items.get("envPRD")).toEqual({
    id: "envPRD",
    group: "environments",
    content: "PRD",
    type: "point"
  });
  expect(items.get("suPostUpgradeSU")).toEqual({
    id: "suPostUpgradeSU",
    group: "su",
    content: "Post-Upgrade",
    type: "point"
  });
});

test("The default `timelineOptions` object is empty", () => {
  expect(Object.keys(timelineOptions).length).toEqual(1);
  expect(timelineOptions).toEqual({});
});