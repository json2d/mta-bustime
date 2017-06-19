# mta-bustime

🚌 Node.js wrapper for MTA-BusTime REST API

## Installation

```sh
npm install mta-bustime --save
```

## Usage
First, create a `BusTime` object with your API key.
```javascript
const BusTime = require('mta-bustime')

var bustime = new BusTime(API_KEY)
```

Then, use the wrapper functions to make requests to the API endpoints and retrieve the responses
```javascript
// OneBusAway API
bustime.agenciesWithCoverage({/* options */},function(err,res,body) { /* do something with response */ })
bustime.routesForAgency('MTA NYCT',{/* options */},function(err,res,body) { /* do something with response */ })
bustime.stopsForRoute('MTA NYCT_B70',{includePolylines:false /* , more options */ },function(err,res,body) { /* do something with response */ })


var LineRef ='B70',
  DirectionRef = 0,
  MonitoringRef = 308194

// SIRI API
bustime.stopMonitoring({LineRef,DirectionRef,MonitoringRef},function(err,res,body) { /* do something with response */ })

```

For more information on the API endpoints and available query options for each, see the references below:
http://bustime.mta.info/wiki/Developers/OneBusAwayRESTfulAPI
http://bustime.mta.info/wiki/Developers/SIRIStopMonitoring


## Tests
To run tests on the wrapper functions:

```sh
npm test
```

Responses for test API requests are saved to `test/cache` for further inspection.

## Dependencies

- [request](https://github.com/request/request): Simplified HTTP request client.
- [dotenv](https://github.com/motdotla/dotenv): Loads environment variables from .env file

## Dev Dependencies

- [tap](https://github.com/tapjs/node-tap): A Test-Anything-Protocol library


## License

MIT
