import {
  apiUrl,
  queryParams
} from '../../support/testData'; // Importing test data

describe('API tests for Bank of Canada', () => {

  it('Should fetch and average the forex rates for 10 weeks', () => {
      cy.makeApiRequest(apiUrl, queryParams)
          .then((response) => {
              cy.validateApiResponse(response, 200); // Reused components from Custom command

              const observations = response.body.observations;
              expect(observations).to.be.an('array');
              expect(observations.length).to.be.greaterThan(0);

              let rates = [];
              observations.forEach(obs => {
                  expect(obs).to.have.property('FXUSDCAD');
                  expect(obs.FXUSDCAD).to.have.property('v');
                  let rate = parseFloat(obs.FXUSDCAD.v);
                  expect(rate).to.be.a('number');
                  expect(rate).to.be.greaterThan(0);
                  rates.push(rate);
              });

              let total = 0;
              rates.forEach(rate => {
                  total += rate;
              });
              let avgRate = total / rates.length;

              expect(avgRate).to.be.greaterThan(1.0);
              expect(avgRate).to.be.lessThan(2.0);
          });
  });

  // Negative test cases
  it('Should return 400 Bad Request for invalid date format', () => {
      cy.request({
          method: 'GET',
          url: `${apiUrl}?recent_weeks=invalid`,
          failOnStatusCode: false
      }).then((response) => {
          expect(response.status).to.eq(400);
      });
  });

  it('Should return 404 for invalid series code', () => {
      cy.request({
          method: 'GET',
          url: 'https://www.bankofcanada.ca/valet/observations/INVALID_CODE/json?recent_weeks=10',
          failOnStatusCode: false
      }).then((response) => {
          expect(response.status).to.eq(404);
      });
  });
});

it('Should return an error for a future date range', () => {
  cy.request({
      method: 'GET',
      url: `${apiUrl}/FXUSDCAD/json?start_date=2030-01-01&end_date=2030-01-10`,
      failOnStatusCode: false
  }).then((response) => {
      expect(response.status).to.not.eq(200);
  });
});

it('Should return an error when no parameters are passed', () => {
  cy.request({
      method: 'GET',
      url: `${apiUrl}/FXUSDCAD/json`,
      failOnStatusCode: false
  }).then((response) => {
      expect(response.status).to.not.eq(200);
  });
});