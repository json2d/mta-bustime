const request = require('request')
const API_PATH = "http://bustime.mta.info/api"

function BusTime(key) {
  this.key = key;
}

BusTime.prototype.buildOptions = function(url,qs) {
  return {
    url,
    qs: Object.assign({},qs,{key: this.key}),
    json:true,
  }
}

BusTime.prototype.stopMonitoring = function(qs, callback) {
  var url = API_PATH + '/siri/stop-monitoring.json'
  var opts = this.buildOptions(url,qs)
  //opts.qs = {MonitoringRef, DirectionRef, LineRef}

  request(opts, callback)
}

BusTime.prototype.agenciesWithCoverage = function(qs, callback) {
  var url = API_PATH + '/where/agencies-with-coverage.json'
  var opts = this.buildOptions(url,qs)

  request(opts, callback)
}

BusTime.prototype.routesForAgency = function(agency, qs, callback) {
  var url = API_PATH + '/where/routes-for-agency/' + agency + '.json'
  var opts = this.buildOptions(url,qs)

  request(opts, callback)
}

BusTime.prototype.stopsForRoute = function(route, qs, callback) {
  var url = API_PATH + '/where/stops-for-route/' + route + '.json'
  var opts = this.buildOptions(url,qs)

  request(opts, callback)
}


module.exports = BusTime;
