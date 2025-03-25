# Bankjoy Forex API Tests

Simple tests for Bank of Canada Valet API forex rates.

## Setup

1. Install Node.js
2. Run: `npm install cypress --save-dev`
3. Run `npm install mochawesome --save-dev`
4. Run with mocha report `npx cypress run --reporter mochawesome`


## Running Tests

```bash
npx cypress run
```

## What This Does

1. Gets USD to CAD rates for last 10 weeks
2. Calculates the average rate
3. Tests error handling for invalid requests
