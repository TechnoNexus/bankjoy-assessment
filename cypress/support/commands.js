// Custom command to make an API request
Cypress.Commands.add('makeApiRequest', (url, queryParams) => {
    cy.request({
        method: 'GET',
        url: `${url}?${new URLSearchParams(queryParams).toString()}`,
    });
});

// Custom command to validate API response status
Cypress.Commands.add('validateApiResponse', (response, expectedStatus) => {
    expect(response.status).to.eq(expectedStatus);
    expect(response.body).to.have.property('observations');
    expect(response.body).to.have.property('terms');
    expect(response.body).to.have.property('seriesDetail');
    expect(response.body.terms.url).to.eq('https://www.bankofcanada.ca/terms/');
});