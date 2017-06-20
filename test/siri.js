require('dotenv').config({path: '/test/config/.env'})

const tap = require('tap')
const fs = require('fs')

const BusTime = require('../lib/mta-bustime')

var cachePath = __dirname + '/cache/'

var bustime = new BusTime(process.env.KEY)
tap.test("stop-monitoring", function (t) {
  var LineRef ='B70',
    DirectionRef = 0,
    MonitoringRef = 308194

  bustime.stopMonitoring({LineRef,DirectionRef,MonitoringRef},function(err,res,body) {
    t.equal(err,null);
    t.type(body.Siri,'object')
    fs.writeFileSync( cachePath + 'stop-monitoring_B70_308194.json',JSON.stringify(body,null,4));
    t.end();
  })
})
