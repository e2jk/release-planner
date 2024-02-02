/**
* @jest-environment jsdom
*/

const app = require('../app')

test('Get public holidays for a country', () => {
  document.body.innerHTML =
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-02-02">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate" value="2024-05-06">'
  app.getUI()

  expect(app.ui.startDateInput.upgrade.value).toBe('2024-02-02')
  expect(app.ui.endDateInput.upgrade.value).toBe('2024-05-06')

  app.getJSONFromURL = jest.fn()

  app.getVacationsForCountrySubdivisions('public', 'NL')

  expect(app.getJSONFromURL).toBeCalledWith('https://openholidaysapi.org/PublicHolidays?countryIsoCode=NL&languageIsoCode=EN&validFrom=2023-12-14&validTo=2024-06-25', expect.any(Function))
})

test('Get school holidays for a country that has no subdivisions', () => {
  document.body.innerHTML =
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-02-02">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate" value="2024-05-06">'
  app.getUI()

  expect(app.ui.startDateInput.upgrade.value).toBe('2024-02-02')
  expect(app.ui.endDateInput.upgrade.value).toBe('2024-05-06')

  app.getJSONFromURL = jest.fn()

  app.getVacationsForCountrySubdivisions('school', 'AL', null)

  expect(app.getJSONFromURL).toBeCalledWith('https://openholidaysapi.org/SchoolHolidays?countryIsoCode=AL&languageIsoCode=EN&validFrom=2023-12-14&validTo=2024-06-25', expect.any(Function))
})

test('Get school holidays for a subdivision of a country', () => {
  document.body.innerHTML =
    '<input type="date" class="form-control" id="upgradeStartDate" name="upgradeStartDate" value="2024-02-02">' +
    '<input type="date" class="form-control" id="upgradeEndDate" name="upgradeEndDate" value="2024-05-06">'
  app.getUI()

  expect(app.ui.startDateInput.upgrade.value).toBe('2024-02-02')
  expect(app.ui.endDateInput.upgrade.value).toBe('2024-05-06')

  app.getJSONFromURL = jest.fn()

  app.getVacationsForCountrySubdivisions('public', 'BE', 'BE-FR')

  expect(app.getJSONFromURL).toBeCalledWith('https://openholidaysapi.org/PublicHolidays?countryIsoCode=BE&languageIsoCode=EN&validFrom=2023-12-14&validTo=2024-06-25&subdivisionCode=BE-FR', expect.any(Function))
})
