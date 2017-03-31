const API_PATH = "http://bustime.mta.info/api"

const request = require('request')

function BusTime(key) {
  this.key = key;
  this.where = service('where')
  this.siri = service('siri')
}

var factory = function(name) {

  return function(command, arg, qs) {
    let url

    if(typeof arg == 'object') {
      qs = arg
      arg = undefined
      url = [API_PATH,name,command].join('/')
    }else if(typeof arg == 'string'){
      url = [API_PATH,name,command,arg].join('/')
    }

    let opts = buildOptions(url,this.key,qs)

    return new Promise(function (fulfill, reject){
      request(opts, (err,res,body) => {
        if (err) reject(err)
        else fullfill({res,body,command,arg,qs})
      })
    })
  }
}

var buildOptions(url,key,qs) {
  return {
    url,
    json:true,
    qs: Object.assign({},qs,{key})
  }
}

// Usage:
// var bustime = new BusTime('this-is-my-key')
// bustime.where('agencies-with-coverage').then(storeData)
// bustime.where('routes-for-agency',someAgency,{}).then(storeData)
// bustime.where('stops-for-route',someRoute,{}).then(storeData)
// bustime.siri('stop-monitoring',{LineRef:'Q8'}).then(broadcastData)
//

module.exports = BusTime;
