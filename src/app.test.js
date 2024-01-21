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
  setEndDate,
  getRoundedNumberOfWeeks,
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

describe("If the start date is on a", () => {
  test("Monday, Tuesday, Wednesday or Thursday, it remains the same day", () => {
    // Wednesday
    expect(setStartDate("2024-01-17")).toStrictEqual(new Date("2024-01-17"));
    // Thursday
    expect(setStartDate("2024-01-18")).toStrictEqual(new Date("2024-01-18"));
    // Monday
    expect(setStartDate("2024-01-22")).toStrictEqual(new Date("2024-01-22"));
    // Tuesday
    expect(setStartDate("2024-01-23")).toStrictEqual(new Date("2024-01-23"));
  });
  test("Friday, Saturday or Sunday, it moves up to the next Monday", () => {
    // Friday
    expect(setStartDate("2024-01-19")).toStrictEqual(new Date("2024-01-22"));
    // Saturday
    expect(setStartDate("2024-01-20")).toStrictEqual(new Date("2024-01-22"));
    // Sunday
    expect(setStartDate("2024-01-21")).toStrictEqual(new Date("2024-01-22"));
  });
});

describe("If the end date is on a", () => {
  document.body.innerHTML =
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" min="7" max="40" value="14">';
  const startDateInput = document.getElementById("upgradeStartDate");
  const durationWeeksInput = document.getElementById("upgradeDuration");
  const endDateInput = document.getElementById("upgradeEndDate");
  test("Tuesday, Wednesday, Thursday or Friday, it remains the same day", () => {
    // Tuesday
    startDateInput.value = "2024-01-23";
    setEndDate(startDateInput, durationWeeksInput, endDateInput);
    expect(endDateInput.value).toBe("2024-04-30");
    // Wednesday
    startDateInput.value = "2024-01-24";
    setEndDate(startDateInput, durationWeeksInput, endDateInput);
    expect(endDateInput.value).toBe("2024-05-01");
    // Thursday
    startDateInput.value = "2024-01-25";
    setEndDate(startDateInput, durationWeeksInput, endDateInput);
    expect(endDateInput.value).toBe("2024-05-02");
    // Friday
    startDateInput.value = "2024-01-26";
    setEndDate(startDateInput, durationWeeksInput, endDateInput);
    expect(endDateInput.value).toBe("2024-05-03");
  });
  test("Saturday, Sunday or Monday, it moves back to the prior Friday", () => {
    // Saturday
    startDateInput.value = "2024-01-27";
    setEndDate(startDateInput, durationWeeksInput, endDateInput);
    expect(endDateInput.value).toBe("2024-05-03");
    // Sunday
    startDateInput.value = "2024-01-28";
    setEndDate(startDateInput, durationWeeksInput, endDateInput);
    expect(endDateInput.value).toBe("2024-05-03");
    // Monday
    startDateInput.value = "2024-01-29";
    setEndDate(startDateInput, durationWeeksInput, endDateInput);
    expect(endDateInput.value).toBe("2024-05-03");
  });
});

test("The end date is empty when the start date is invalid", () => {
  document.body.innerHTML =
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="XX">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate">' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration">';
  const startDateInput = document.getElementById("upgradeStartDate");
  const durationWeeksInput = document.getElementById("upgradeDuration");
  const endDateInput = document.getElementById("upgradeEndDate");
  startDateInput.value = "XX";
  durationWeeksInput.value = 14;
  endDateInput.value = "2024-04-30";
  expect(endDateInput.value).toBe("2024-04-30");
  setEndDate(startDateInput, durationWeeksInput, endDateInput);
  expect(endDateInput.value).toBe("");
});

test("Duration between two dates is a rounded number of weeks", () => {
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-01-28"))).toBe(1);
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-01-29"))).toBe(1);
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-01-30"))).toBe(1);
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-01-31"))).toBe(1);
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-02-01"))).toBe(2);
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-02-02"))).toBe(2);
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-02-03"))).toBe(2);
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-02-04"))).toBe(2);
  expect(getRoundedNumberOfWeeks(new Date("2024-01-21"), new Date("2024-02-05"))).toBe(2);
});