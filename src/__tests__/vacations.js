/**
 * @jest-environment jsdom
 */

const app = require('../app')

// test('Test getJSONFromURL', async () => {
//     const requestURL = 'http://example.com/dummyURL'
//     const callback = jest.fn()
//     await app.getJSONFromURL(requestURL, callback)
//     expect(callback).toBeCalledWith('click', expect.any(Function))
// })

describe('Test creating HTML DOM elements from string', () => {
  test('Passing empty string to fromHTML with trim', () => {
    const resultingDOM = app.fromHTML(' ')
    expect(resultingDOM).toBe(null)
  })

  test('Create a simple DOM element from HTML string', () => {
    const resultingDOM = app.fromHTML('<div id="testDiv">Test</div> ', false)
    expect(resultingDOM.id).toBe('testDiv')
    expect(resultingDOM.innerHTML).toBe('Test')
  })

  test('Create a nested DOM elements from HTML string', () => {
    const resultingDOM = app.fromHTML('<div id="testDiv"><span id="span1">Test Span One</span><span id="span2">Test Span Two</span></div>')
    expect(resultingDOM.children.length).toBe(2)
    expect(resultingDOM.children[1].id).toBe('span2')
    expect(resultingDOM.children[1].innerHTML).toBe('Test Span Two')
  })

  test('Create an adjacent DOM element from HTML string', () => {
    const resultingDOM = app.fromHTML('<div id="testDiv1">Test</div><div id="testDiv2"><span id="span1">Test Span One</span><span id="span2">Test Span Two</span></div>')
    expect(resultingDOM.length).toBe(2)
    expect(resultingDOM[1].id).toBe('testDiv2')
    expect(resultingDOM[1].children.length).toBe(2)
    expect(resultingDOM[1].children[1].id).toBe('span2')
    expect(resultingDOM[1].children[1].innerHTML).toBe('Test Span Two')
  })
})

test('Test getEnglishName with empty array', () => {
  const names = []
  expect(app.getEnglishName(names)).toBe('')
})

test('Retrieve name in English from multi-lingual array', () => {
  const names = [
    { language: 'FR', text: 'Vacances de printemps (Pâques)' },
    { language: 'NL', text: 'Paasvakantie' },
    { language: 'DE', text: 'Frühjahrsferien' },
    { language: 'EN', text: 'Spring Holidays' }
  ]
  expect(app.getEnglishName(names)).toBe('Spring Holidays')
})

test('Get list of countries for vacations', () => {
  document.body.innerHTML =
        '<div class="spinner-border spinner-border-sm collapse" role="status" id="vacationCountrySpinner">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>'
  app.getUI()

  expect(app.ui.vacations.country.spinner.classList).not.toContain('show')

  app.getJSONFromURL = jest.fn()
  app.getCountriesForVacations()

  expect(app.ui.vacations.country.spinner.classList).toContain('show')
  expect(app.getJSONFromURL).toBeCalledWith('https://openholidaysapi.org/Countries', app.populateCountriesForVacations)
})

test('Populate the list of countries for vacations', () => {
  document.body.innerHTML =
        '<div class="spinner-border spinner-border-sm collapse show" role="status" id="vacationCountrySpinner">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '<ul class="dropdown-menu" id="vacationCountryList"></ul>'
  app.getUI()

  expect(app.ui.vacations.country.spinner.classList).toContain('show')
  expect(app.ui.vacations.country.list.children.length).toBe(0)

  const data = [
    {
      isoCode: 'BE',
      name: [
        { language: 'EN', text: 'Belgium' },
        { language: 'NL', text: 'België' },
        { language: 'FR', text: 'Belgique (la)' },
        { language: 'DE', text: 'Belgien' }
      ],
      officialLanguages: ['NL', 'FR', 'DE']
    },
    {
      isoCode: 'NL',
      name: [
        { language: 'EN', text: 'Netherlands (the)' },
        { language: 'NL', text: 'Nederland' },
        { language: 'DE', text: 'Niederlande' }
      ],
      officialLanguages: ['NL']
    }
  ]
  app.populateCountriesForVacations(data)

  expect(app.ui.vacations.country.spinner.classList).not.toContain('show')
  expect(app.ui.vacations.country.list.children.length).toBe(2)
  expect(app.ui.vacations.country.list.children[1].children.length).toBe(1)
  expect(app.ui.vacations.country.list.children[1].children[0].id).toBe('vacationCountry-NL')
  expect(app.ui.vacations.country.list.children[1].children[0].innerHTML).toBe('Netherlands (the)')
})

test('Select a country for vacations', () => {
  document.body.innerHTML =
        '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="vacationCountryButton">' +
        '<span id="vacationCountryText">Country</span>' +
        '<div class="spinner-border spinner-border-sm collapse" role="status" id="vacationCountrySpinner">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '</button>' +
        '<ul class="dropdown-menu" id="vacationCountryList">' +
        '<li><a class="dropdown-item" href="#" id="vacationCountry-BE">Belgium</a></li>' +
        '<li><a class="dropdown-item" href="#" id="vacationCountry-NL">Netherlands (the)</a></li>' +
        '</ul>' +
        '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="vacationSubdivisionButton">' +
        '<span id="vacationSubdivisionText">Subdivision</span>' +
        '<div class="spinner-border spinner-border-sm collapse" role="status" id="vacationSubdivisionSpinner">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '</button>'
  app.getUI()

  expect(app.ui.vacations.subdivision.button.classList).not.toContain('disabled')
  expect(app.ui.vacations.country.text.innerHTML).toBe('Country')
  expect(app.groups.get('vacations').visible).toBe(false)

  document.getElementById('vacationCountry-NL').addEventListener('click', app.selectVacationCountry)

  app.getSubdivisionsForVacations = jest.fn()
  app.getVacationsForCountrySubdivisions = jest.fn()

  const event = new Event('click')
  event.preventDefault = jest.fn()
  document.getElementById('vacationCountry-NL').dispatchEvent(event)

  expect(event.preventDefault).toHaveBeenCalled()
  expect(app.ui.vacations.subdivision.button.classList).toContain('disabled')
  expect(app.ui.vacations.country.text.innerHTML).toBe('Netherlands (the)')
  expect(app.groups.get('vacations').visible).toBe(true)
  expect(app.getSubdivisionsForVacations).toHaveBeenCalledWith('NL')
  expect(app.getVacationsForCountrySubdivisions).toHaveBeenCalledWith('public', 'NL')
})

test('Select a subdivision for vacations', () => {
  document.body.innerHTML =
        '<span id="vacationSubdivisionText">Subdivision</span>' +
        '<li><a class="dropdown-item" href="#" id="vacationSubdivision-NL_NL-ZU">South Region</a></li>'
  app.getUI()

  expect(app.ui.vacations.subdivision.text.innerHTML).toBe('Subdivision')

  document.getElementById('vacationSubdivision-NL_NL-ZU').addEventListener('click', app.selectVacationSubdivision)

  app.getVacationsForCountrySubdivisions = jest.fn()

  const event = new Event('click')
  event.preventDefault = jest.fn()
  document.getElementById('vacationSubdivision-NL_NL-ZU').dispatchEvent(event)

  expect(event.preventDefault).toHaveBeenCalled()
  expect(app.ui.vacations.subdivision.text.innerHTML).toBe('South Region')
  expect(app.getVacationsForCountrySubdivisions).toHaveBeenCalledWith('school', 'NL', 'NL-ZU')
})

test('Draw public holidays on the timeline', () => {
  const data = [
    {
      id: 'fc163490-cfaa-4dff-aada-a2dfffd80d40',
      startDate: '2024-03-31',
      endDate: '2024-03-31',
      type: 'Public',
      name: [{ language: 'EN', text: 'Easter' }],
      nationwide: true
    },
    {
      id: 'a353d8d7-5927-4992-8553-d16589803c54',
      startDate: '2024-04-01',
      endDate: '2024-04-01',
      type: 'Public',
      name: [{ language: 'EN', text: 'Easter Monday' }],
      nationwide: true
    }
  ]

  app.items.add({
    id: 'vac_public_DUMMY1',
    content: 'DUMMY PUBLIC HOLIDAY',
    group: 'vacations',
    type: 'box',
    start: '2024-01-01',
    end: '2024-01-01'
  })

  app.items.add({
    id: 'vac_school_DUMMY2',
    content: 'DUMMY SCHOOL HOLIDAY',
    group: 'vacations',
    type: 'range',
    start: '2024-02-01',
    end: '2024-03-01'
  })

  expect(app.items.length).toStrictEqual(19)
  expect(app.items.getIds()).toContain('vac_public_DUMMY1')
  expect(app.items.getIds()).toContain('vac_school_DUMMY2')
  expect(app.items.getIds()).not.toContain('vac_public_fc163490-cfaa-4dff-aada-a2dfffd80d40')
  expect(app.items.getIds()).not.toContain('vac_public_a353d8d7-5927-4992-8553-d16589803c54')

  app.drawVacationsOnTimeline('public', data)

  expect(app.items.length).toStrictEqual(19)
  expect(app.items.getIds()).not.toContain('vac_public_DUMMY1')
  expect(app.items.getIds()).not.toContain('vac_school_DUMMY2')
  expect(app.items.getIds()).toContain('vac_public_fc163490-cfaa-4dff-aada-a2dfffd80d40')
  expect(app.items.getIds()).toContain('vac_public_a353d8d7-5927-4992-8553-d16589803c54')

  const item1 = app.items.get('vac_public_fc163490-cfaa-4dff-aada-a2dfffd80d40')
  expect(item1.content).toBe('Easter')
  expect(item1.type).toBe('box')
  expect(item1.start).toBe(new Date('2024-03-31').setHours(0, 0, 0, 0))
  expect(item1.end).toBe(new Date('2024-03-31').setHours(23, 59, 59, 0))

  const item2 = app.items.get('vac_public_a353d8d7-5927-4992-8553-d16589803c54')
  expect(item2.content).toBe('Easter Monday')
  expect(item2.type).toBe('box')
  expect(item2.start).toBe(new Date('2024-04-01').setHours(0, 0, 0, 0))
  expect(item2.end).toBe(new Date('2024-04-01').setHours(23, 59, 59, 0))
})

test('Draw school holidays on the timeline', () => {
  const data = [
    {
      id: '3ae2036f-292a-4884-b2f5-90d010784f7b',
      startDate: '2024-04-29',
      endDate: '2024-05-10',
      type: 'School',
      name: [{ language: 'EN', text: 'Spring Holidays' }],
      nationwide: false,
      subdivisions: [
        {
          code: 'BE-FR',
          shortName: 'FR'
        }
      ]
    },
    {
      id: 'ddef1d51-1b5b-421c-bc8c-6ce58aeaaa8e',
      startDate: '2024-07-01',
      endDate: '2024-08-31',
      type: 'School',
      name: [{ language: 'EN', text: 'Summer Holidays' }],
      nationwide: true
    }
  ]

  app.items.add({
    id: 'vac_public_DUMMY1',
    content: 'DUMMY PUBLIC HOLIDAY',
    group: 'vacations',
    type: 'box',
    start: '2024-01-01',
    end: '2024-01-01'
  })

  app.items.add({
    id: 'vac_school_DUMMY2',
    content: 'DUMMY SCHOOL HOLIDAY',
    group: 'vacations',
    type: 'range',
    start: '2024-02-01',
    end: '2024-03-01'
  })

  expect(app.items.length).toStrictEqual(21)
  expect(app.items.getIds()).toContain('vac_public_DUMMY1')
  expect(app.items.getIds()).toContain('vac_public_fc163490-cfaa-4dff-aada-a2dfffd80d40')
  expect(app.items.getIds()).toContain('vac_public_a353d8d7-5927-4992-8553-d16589803c54')
  expect(app.items.getIds()).toContain('vac_school_DUMMY2')
  expect(app.items.getIds()).not.toContain('vac_school_3ae2036f-292a-4884-b2f5-90d010784f7b')
  expect(app.items.getIds()).not.toContain('vac_school_ddef1d51-1b5b-421c-bc8c-6ce58aeaaa8e')

  app.drawVacationsOnTimeline('school', data)

  expect(app.items.length).toStrictEqual(22)
  expect(app.items.getIds()).toContain('vac_public_DUMMY1')
  expect(app.items.getIds()).toContain('vac_public_fc163490-cfaa-4dff-aada-a2dfffd80d40')
  expect(app.items.getIds()).toContain('vac_public_a353d8d7-5927-4992-8553-d16589803c54')
  expect(app.items.getIds()).not.toContain('vac_school_DUMMY2')
  expect(app.items.getIds()).toContain('vac_school_3ae2036f-292a-4884-b2f5-90d010784f7b')
  expect(app.items.getIds()).toContain('vac_school_ddef1d51-1b5b-421c-bc8c-6ce58aeaaa8e')

  const item1 = app.items.get('vac_school_3ae2036f-292a-4884-b2f5-90d010784f7b')
  expect(item1.content).toBe('Spring Holidays')
  expect(item1.type).toBe('range')
  expect(item1.start).toBe(new Date('2024-04-29').setHours(0, 0, 0, 0))
  expect(item1.end).toBe(new Date('2024-05-10').setHours(23, 59, 59, 0))

  const item2 = app.items.get('vac_school_ddef1d51-1b5b-421c-bc8c-6ce58aeaaa8e')
  expect(item2.content).toBe('Summer Holidays')
  expect(item2.type).toBe('range')
  expect(item2.start).toBe(new Date('2024-07-01').setHours(0, 0, 0, 0))
  expect(item2.end).toBe(new Date('2024-08-31').setHours(23, 59, 59, 0))
})
