describe('API tests for Bank of Canada', () => {
    const apiUrl = 'https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json';
    const recentWeeks = 10;
  
    it('Should fetch and average the forex rates for 10 weeks', () => {
        cy.request(`${apiUrl}?recent_weeks=${recentWeeks}`)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('observations');
          expect(response.body).to.have.property('terms');
          expect(response.body).to.have.property('seriesDetail');
          expect(response.body.terms.url).to.eq('https://www.bankofcanada.ca/terms/');
          expect(response.body.seriesDetail.id).to.eq('FXUSDCAD');
          
          const observations = response.body.observations;
          expect(observations).to.be.an('array');
          expect(observations.length).to.be.greaterThan(0);
  
        let rates = [];
        observations.forEach(param => {
          expect(param).to.have.property('FXUSDCAD');
          expect(param.FXUSDCAD).to.have.property('v');
          let rate = parseFloat(param.FXUSDCAD.v);
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
  