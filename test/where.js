require('dotenv').config({path: '/test/config/.env'})

const tap = require('tap')
const fs = require('fs')

const BusTime = require('../lib/mta-bustime')

var bustime = new BusTime(process.env.KEY)

var cachePath = __dirname + '/cache/'

tap.test("agencies-with-coverage", function (t) {
  bustime.agenciesWithCoverage({},function(err,res,body) {
    t.equal(err,null)
    t.equal(body.code,200)

    t.ok(Array.isArray(body.data))
    body.data.forEach((item) => {
      t.ok(item.agency)
    })

    fs.writeFileSync(cachePath + 'agencies-with-coverage.json',JSON.stringify(body,null,4));

    t.end();
  })
})

tap.test("routes-for-agency", function (t) {
  bustime.routesForAgency('MTA NYCT',{},function(err,res,body) {
    t.equal(err,null);
    t.equal(body.code,200)

    t.ok(Array.isArray(body.data.list))
    var route = body.data.list[0]
    t.ok(route.id)


    fs.writeFileSync(cachePath + 'routes-for-agency_MTA NYCT.json',JSON.stringify(body,null,4));

    t.end();
  })
})

tap.test("stops-for-route", function (t) {
  bustime.stopsForRoute('MTA%20NYCT_B70',{includePolylines:false},function(err,res,body) {
    t.equal(err,null);
    t.equal(body.code,200)

    t.ok(Array.isArray(body.data.stops))
    stopId = body.data.stopGroupings[0].stopGroups[0].stopIds[0];
    t.ok(stopId)

    fs.writeFileSync(cachePath + 'stops-for-route_MTA NYCT_B70.json',JSON.stringify(body,null,4));

    t.end();
  })
})
