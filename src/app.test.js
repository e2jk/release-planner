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
  setStartDate,
} = require("./app");

describe("Test default variables", () => {
  test("There are 4 default Phases", () => {
    expect(phases).toHaveLength(4);
    expect(phases).toStrictEqual(["analysis", "build", "testing", "training"]);
  });

  test("There are 8 default Environments", () => {
    expect(environments).toHaveLength(8);
    expect(environments).toStrictEqual(["REL", "POC", "TST", "MST", "ACE", "PLY", "SUP","PRD"]);
  });

  test("There are 4 default SU Deliveries", () => {
    expect(Object.keys(suDeliveries).length).toStrictEqual(4);
    expect(suDeliveries).toHaveProperty("PreUpgradeCriticalSU", "Pre-Upgrade Critical");
    expect(suDeliveries).toStrictEqual({
      "InitialSU": "Initial",
      "AllFixSU": "All Fix SUs",
      "PreUpgradeCriticalSU": "Pre-Upgrade Critical",
      "PostUpgradeSU": "Post-Upgrade"
  });
  });

  test("The default `ui` object is empty", () => {
    expect(Object.keys(ui).length).toStrictEqual(0);
    expect(ui).toStrictEqual({});
  });

  test("There are 4 default groups for the timeline", () => {
    expect(groups.length).toStrictEqual(4);
    expect(groups.getIds()).toStrictEqual(["upgrade", "phases", "environments", "su"]);
    expect(groups.get("upgrade")).toStrictEqual({
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
    expect(items.length).toStrictEqual(17);
    expect(items.getIds()).toStrictEqual([
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
    expect(items.get("buildPhase")).toStrictEqual({
      id: "buildPhase",
      group: "phases",
      content: "Build"
    });
    expect(items.get("envPRD")).toStrictEqual({
      id: "envPRD",
      group: "environments",
      content: "PRD",
      type: "point"
    });
    expect(items.get("suPostUpgradeSU")).toStrictEqual({
      id: "suPostUpgradeSU",
      group: "su",
      content: "Post-Upgrade",
      type: "point"
    });
  });

  test("The default `timelineOptions` object is empty", () => {
    expect(Object.keys(timelineOptions).length).toStrictEqual(0);
    expect(timelineOptions).toStrictEqual({});
  });
});

describe('If the start date is on a ', () => {
  test("Monday, Tuesday, Wednesday or Thursday, it remains the same day", () => {
    expect(setStartDate("2024-01-17")).toStrictEqual(new Date("2024-01-17"));
    expect(setStartDate("2024-01-18")).toStrictEqual(new Date("2024-01-18"));
    expect(setStartDate("2024-01-22")).toStrictEqual(new Date("2024-01-22"));
    expect(setStartDate("2024-01-23")).toStrictEqual(new Date("2024-01-23"));
  });
  test("Friday, Saturday or Sunday, it moves up to the next Monday", () => {
    expect(setStartDate("2024-01-18")).toStrictEqual(new Date("2024-01-18"));
    expect(setStartDate("2024-01-19")).toStrictEqual(new Date("2024-01-22"));
    expect(setStartDate("2024-01-20")).toStrictEqual(new Date("2024-01-22"));
    expect(setStartDate("2024-01-21")).toStrictEqual(new Date("2024-01-22"));
  });
});