var http = require('http');

//'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=DuncanMc-duncante-PRD-3d2ce5828-80679aa8&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=%28sparkletts%2Csparklets%29'

var options = {
  host: 'svcs.ebay.com',
  port: 80,
  path: '/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=DuncanMc-duncante-PRD-3d2ce5828-80679aa8&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=%28sparkletts%2Csparklets%29',
  method: 'GET'
};

var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    var data = '';
    res.on('data', function (chunk) {
      // data receiveed
      data += chunk
    });
    res.on('end', function() {
      obj = JSON.parse(data)
      items = obj.findItemsByKeywordsResponse[0].searchResult[0].item
      items.forEach(function(item){ console.log(item.title); }); 
    });
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();
