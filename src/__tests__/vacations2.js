/**
 * @jest-environment jsdom
 */

const app = require('../app')

test('Get list of subdivision of this country for vacations', () => {
  document.body.innerHTML =
        '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="vacationSubdivisionButton">' +
        '<span id="vacationSubdivisionText">DUMMY</span>' +
        '<div class="spinner-border spinner-border-sm collapse" role="status" id="vacationSubdivisionSpinner">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '</button>'
  app.getUI()

  expect(app.ui.vacations.subdivision.text.innerHTML).toBe('DUMMY')
  expect(app.ui.vacations.subdivision.spinner.classList).not.toContain('show')

  app.getJSONFromURL = jest.fn()
  app.getSubdivisionsForVacations('NL')

  expect(app.ui.vacations.subdivision.text.innerHTML).toBe('Subdivision')
  expect(app.ui.vacations.subdivision.spinner.classList).toContain('show')
  expect(app.getJSONFromURL).toBeCalledWith('https://openholidaysapi.org/Subdivisions?countryIsoCode=NL', app.populateSubdivisionsForVacations)
})

test('Populate the list of subdivisions of one country for vacations', () => {
  document.body.innerHTML =
        '<div class="spinner-border spinner-border-sm collapse" role="status" id="vacationCountrySpinner"></div>' +
        '<button class="btn btn-secondary dropdown-toggle disabled d-none" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="vacationSubdivisionButton">' +
        '<span id="vacationSubdivisionText">Subdivision</span>' +
        '<div class="spinner-border spinner-border-sm collapse show" role="status" id="vacationSubdivisionSpinner">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '</button>' +
        '<ul class="dropdown-menu" id="vacationSubdivisionList"></ul>'
  app.getUI()

  expect(app.ui.vacations.subdivision.spinner.classList).toContain('show')
  expect(app.ui.vacations.subdivision.button.classList).toContain('d-none')
  expect(app.ui.vacations.subdivision.button.classList).toContain('disabled')
  expect(app.ui.vacations.subdivision.list.children.length).toBe(0)

  const data = [
    {
      code: 'NL-MI',
      name: [
        { language: 'NL', text: 'Regio Midden' },
        { language: 'DE', text: 'Region Mitte' },
        { language: 'EN', text: 'Central Region' }
      ]
    },
    {
      code: 'NL-NO',
      name: [
        { language: 'NL', text: 'Regio Noord' },
        { language: 'DE', text: 'Region Nord' },
        { language: 'EN', text: 'North Region' }
      ]
    },
    {
      code: 'NL-ZU',
      name: [
        { language: 'NL', text: 'Regio Zuid' },
        { language: 'DE', text: 'Region Süd' },
        { language: 'EN', text: 'South Region' }
      ]
    }
  ]
  app.populateSubdivisionsForVacations(data, 'https://openholidaysapi.org/Subdivisions?countryIsoCode=NL')

  expect(app.ui.vacations.subdivision.spinner.classList).not.toContain('show')
  expect(app.ui.vacations.subdivision.button.classList).not.toContain('d-none')
  expect(app.ui.vacations.subdivision.button.classList).not.toContain('disabled')
  expect(app.ui.vacations.subdivision.list.children.length).toBe(3)
  expect(app.ui.vacations.subdivision.list.children[2].children.length).toBe(1)
  expect(app.ui.vacations.subdivision.list.children[2].children[0].id).toBe('vacationSubdivision-NL_NL-ZU')
  expect(app.ui.vacations.subdivision.list.children[2].children[0].innerHTML).toBe('South Region')
})

test('Populate the list of subdivisions of one country for vacations, when that country has no subdivisions', () => {
  document.body.innerHTML =
        '<div class="spinner-border spinner-border-sm collapse" role="status" id="vacationCountrySpinner"></div>' +
        '<button class="btn btn-secondary dropdown-toggle disabled d-none" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="vacationSubdivisionButton">' +
        '<span id="vacationSubdivisionText">Subdivision</span>' +
        '<div class="spinner-border spinner-border-sm collapse show" role="status" id="vacationSubdivisionSpinner">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '</button>' +
        '<ul class="dropdown-menu" id="vacationSubdivisionList"></ul>'
  app.getUI()

  expect(app.ui.vacations.subdivision.spinner.classList).toContain('show')
  expect(app.ui.vacations.subdivision.button.classList).toContain('d-none')
  expect(app.ui.vacations.subdivision.list.children.length).toBe(0)

  const data = []
  app.getVacationsForCountrySubdivisions = jest.fn()
  app.populateSubdivisionsForVacations(data, 'https://openholidaysapi.org/Subdivisions?countryIsoCode=AL')

  expect(app.ui.vacations.subdivision.spinner.classList).not.toContain('show')
  expect(app.ui.vacations.subdivision.button.classList).toContain('d-none')
  expect(app.ui.vacations.subdivision.list.children.length).toBe(0)
  expect(app.getVacationsForCountrySubdivisions).toHaveBeenCalledWith('school', 'AL', null)
})
