/**
 * @jest-environment jsdom
 */

const app = require('../app')

test('Changing the duration per number of version to a high value', () => {
  document.body.innerHTML =
    '<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="perVersionDurationToggle">5 weeks</button>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">1 week</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">2 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">5 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">6 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem active" href="#">7 weeks</a></li>' +
    '<select class="form-select" id="numVersions" name="numVersions">' +
    '<option value="1">1 version</option>' +
    '<option value="2" selected>2 versions</option>' +
    '<option value="3">3 versions</option>' +
    '<option value="4">4 versions</option>' +
    '</select>' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" value="14">' +
    'per version, which translates to <span id="defaultNumWeeks">14</span> weeks for the 2-version upgrade that is proposed by default.' +
    '<span class="text-info" id="lowNumWeeksWarning"><br>Note: If you need a duration that is less than 4 weeks in total, please select an Expedicted upgrade type instead.</span>'
  app.getUI()

  expect(app.ui.durationInput.upgrade.value).toBe('14')
  expect(app.ui.defaultNumWeeks.innerHTML).toBe('14')
  expect(app.ui.perVersionDurationToggleItems[2].classList).not.toContain('active')
  expect(app.ui.perVersionDurationToggleItems[4].classList).toContain('active')
  expect(app.ui.lowNumWeeksWarning.classList).not.toContain('d-none')

  app.setDefaultDates = jest.fn()
  app.ui.perVersionDurationToggleItems[2].addEventListener('click', app.changePerVersionDuration)

  const event = new Event('click')
  event.preventDefault = jest.fn()
  app.ui.perVersionDurationToggleItems[2].dispatchEvent(event)

  expect(event.preventDefault).toHaveBeenCalled()
  expect(app.ui.durationInput.upgrade.value).toBe('10')
  expect(app.ui.defaultNumWeeks.innerHTML).toBe('10')
  expect(app.ui.perVersionDurationToggleItems[2].classList).toContain('active')
  expect(app.ui.perVersionDurationToggleItems[4].classList).not.toContain('active')
  expect(app.ui.lowNumWeeksWarning.classList).toContain('d-none')
  expect(app.setDefaultDates).toBeCalled()
})

test('Changing the duration per number of version to a low value', () => {
  document.body.innerHTML =
    '<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="perVersionDurationToggle">5 weeks</button>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">1 week</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">2 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">5 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem" href="#">6 weeks</a></li>' +
    '<li><a class="dropdown-item perVersionDurationToggleItem active" href="#">7 weeks</a></li>' +
    '<select class="form-select" id="numVersions" name="numVersions">' +
    '<option value="1">1 version</option>' +
    '<option value="2" selected>2 versions</option>' +
    '<option value="3">3 versions</option>' +
    '<option value="4">4 versions</option>' +
    '</select>' +
    '<input type="range" class="form-range" id="upgradeDuration" name="upgradeDuration" value="14">' +
    'per version, which translates to <span id="defaultNumWeeks">14</span> weeks for the 2-version upgrade that is proposed by default.' +
    '<span class="text-info d-none" id="lowNumWeeksWarning"><br>Note: If you need a duration that is less than 4 weeks in total, please select an Expedicted upgrade type instead.</span>'
  app.getUI()

  expect(app.ui.durationInput.upgrade.value).toBe('14')
  expect(app.ui.defaultNumWeeks.innerHTML).toBe('14')
  expect(app.ui.perVersionDurationToggleItems[1].classList).not.toContain('active')
  expect(app.ui.perVersionDurationToggleItems[4].classList).toContain('active')
  expect(app.ui.lowNumWeeksWarning.classList).toContain('d-none')

  app.setDefaultDates = jest.fn()
  app.ui.perVersionDurationToggleItems[1].addEventListener('click', app.changePerVersionDuration)

  const event = new Event('click')
  app.ui.perVersionDurationToggleItems[1].dispatchEvent(event)

  expect(app.ui.durationInput.upgrade.value).toBe('4')
  expect(app.ui.defaultNumWeeks.innerHTML).toBe('4')
  expect(app.ui.perVersionDurationToggleItems[1].classList).toContain('active')
  expect(app.ui.perVersionDurationToggleItems[4].classList).not.toContain('active')
  expect(app.ui.lowNumWeeksWarning.classList).not.toContain('d-none')
  expect(app.setDefaultDates).toBeCalled()
})
