
var path = require("path");
var temp_dir = path.join(process.cwd(), 'temp/');

require('dotenv').config()

const tap = require('tap')
const fs = require('fs')

const BusTime = require('../lib/mta-bustime')

var bustime = new BusTime(process.env.KEY)
//
// var realtime = function (url,callback) {
//     request(url,function (err, res, body) {
//         if(err || res.statusCode != 200) return console.log(err)
//         callback(body);
//     });
// }
//
// var local = function(path,callback) {
//     fs.readFile(path,function (err,data){
//         if(err) return console.log(err);
//         callback(data);
//     })
// }

 // 'Q24': {
 //  ref: 'MTA NYCT_Q24'
 //  stops: [
 //    [{id: '302058', name: 'PATCHEN AV/LAFAYETTE AV'}...],
 //    [{id: '904206', name: 'ARCHER AV/MERRICK BL'}]
 //  ]
 //  ends: ["JAMAICA 168 ST via ATLANTIC" , "LFYTT ST PTCHN AV via ATLNTC AV"]
 // }
// var temp = function(key){return 'temp/'+key+'.json'};

var buildDB = function(opts,callback) {
    var db = {};
    var routeCount = 0;


    bustime.agenciesWithCoverage({},function(err,res,agencies){

        // if(opts.cache) fs.writeFile( temp("agencies-with-coverage"), agencies);

        agencies.data.forEach((item) => {
            var agent = item.agency
            console.log("Getting routes for " + agent.id);

            // opts.getter( opts.paths.routes(agent.id), function(routes){
            bustime.routesForAgency(agent.id,{},function(err,res,routesObj){

                routeCount += routesObj.data.list.length;
                console.log("Routes: " + routeCount);
                if (routesObj.data.list.length==0) return;
                // else if(opts.cache) fs.writeFile( temp(routesObj.data.list[0].agencyId), routes);

                routesObj.data.list.forEach((route)=> {

                    bustime.stopsForRoute(route.id,{},function(err,res,stopsObj){

                        var groupsList = stopsObj.data.stopGroupings[0].stopGroups;
                        var stopsList = stopsObj.data.stops;

                        var route = stopsObj.data.route;
                        var bean = { ref: route.id, ends: [], stops: {codes:[],names:[]} };//ordered array for stops in two directions (0,1)

                        for(var g in groupsList) bean.ends[g] = groupsList[g].name.name

                        // var bean = { ref: route.id, ends, stops: {codes,names} }; //ordered array for stops in two directions (0,1)
                        // bean.ends = groupsList.map((stopGroup) => stopGroup.name.name)
                        // bean.stops.codes = groupsList.map((stopGroup) => stopGroup.stopIds.map((stopId)=> stopId.substring(4))) // stripping 'MTA_' from ids and fill stopCodes
                        // var stopsMap = stopsList.reduce((acc,stop)=> {acc[stop.code] = stop},{})
                        // bean.stops.names = groupsList.map((stopGroup) => stopGroup.stopIds.map((stopId)=> stopsMap[stopId].name))

                        var stopsMap = stopsList.reduce((acc,stop)=> {acc[stop.code] = stop},{})
                        groupsList.forEach((stopGroup)=>{
                          bean.ends.push(stopGroup.name.name)
                          var codes = [], names = []
                          stopGroup.stopIds.forEach((stopId)=>{
                            codes.push(stopId.substring(4))
                            names.push(stopsMap[stopId].name)
                          })
                          bean.stops.codes.push(codes);
                          bean.stops.names.push(names);
                          // bean.stops.codes.push(stopGroup.stopIds.map((stopId)=> stopId.substring(4)))
                          // bean.stops.names.push(stopGroup.stopIds.map((stopId)=> stopsMap[stopId].name))
                        })

                        if(stopsList.length != 0) {
                            // if(opts.cache) fs.writeFile( temp(stopsObj.data.route.id), stops);

                            var stopCodes = bean.stops.codes;
                            var stopNames = bean.stops.names;
                            // ⚠️ limited stops will have only 1 direction sometimes


                            for(var g in groupsList) {
                                stopCodes[g] = [];
                                stopNames[g] = [];
                                for(var a in groupsList[g].stopIds)
                                    //strip 'MTA_' from ids and fill stopCodes
                                    stopCodes[g][a] = groupsList[g].stopIds[a].substring(4);
                            }
                            //grab stop names in order correlating to stopIds
                            for (var k in stopsList) {
                                for(var g in groupsList) {
                                    var index = stopCodes[g].indexOf(stopsList[k].code);
                                    if(index != -1) {
                                        stopNames[g][index] = stopsList[k].name;
                                    }
                                }
                            }
                        }
                        console.log("Discovered "+stopsList.length+" stops for " + route.shortName);
                        db[route.shortName] = bean;
                        if( Object.keys(db).length == routeCount) {
                            // if(opts.cache) fs.writeFile( temp('db'), JSON.stringify(data));
                            callback(db);
                        }
                    });
                })
            });
        })
    });
}



// buildDB({
//     getter:local,
//     cache:false,
//     paths: {
//         agencies:temp,
//         routes:temp,
//         stops:temp
//     }
// },function(db) {
//     fs.writeFile( temp('_db_'), JSON.stringify(db));
// });

// buildDB({
//     getter:realtime,
//     cache:true,
//     paths: {
//         agencies: function(key){ return "http://bustime.mta.info/api/where/"+key+".json?key="+_KEY_}},
//         routes: function(key){ return "http://bustime.mta.info/api/where/routes-for-agency/"+key+".json?key="+_KEY_}},
//         stops: function(key){ return "http://bustime.mta.info/api/where/stops-for-route/"+key+".json?key="+_KEY_}}
//     }
// )

buildDB({},function(db) {
    fs.writeFile( 'db.json', JSON.stringify(db,null,4));
});
