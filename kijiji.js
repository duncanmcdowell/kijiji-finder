var kijiji = require("kijiji-scraper");
var mongoose = require('mongoose');
var CronJob = require('cron').CronJob;
var Email = require('email').Email;

mongoose.connect('mongodb://localhost/cafe');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var adSchema = new Schema({  id: ObjectId,
                             link: String,
                             title: String,
                             image: String,
                             description: String,
                             date: Date,
                             address: String,
                             displacement: String,
                             kilometers: Number,
                             year: Number,
                             price: String });
                                
var Advertisement = mongoose.model('Advertisement', adSchema);

var prefs = {"locationId": 9004, "categoryId": 30}
var params = {"minPrice":0, "maxPrice": 5000, "keywords": "bmw '+' k75", "adType": "OFFER"}

kijiji.query(prefs, params, function(error, ads) {
  if (error) {
    console.log('error: ',error);
  }
  if (ads) {
    for (var i=0; i<ads.length; i++) {
      ad = ads[i];
      var adInstance = new Advertisement({ title: ad.title,
                                   link: ad.link,
                                   image: ad.innerAd.image,
                                   description: ad.description,
                                   date: ad.pubDate,
                                   address: ad.innerAd.info['Address'],
                                   displacement: ad.innerAd.info['Engine Displacement (cc)'],
                                   kilometers: ad.innerAd.info['Kilometers'],
                                   year: ad.innerAd.info['Year'],
                                   price: ad.innerAd.info['Price'] });
      
      // We only want to save actual motorcycles (check for year and price) and new records (check for title)
      Advertisement.find({title: ad.title, price: ad.innerAd.info['Price']},function(err, ad) {
        if(err) {
          console.log(err)
        }
        if(ad.length == 0 && adInstance.year) {
          //SEND EMAIL HERE
          adInstance.save(function (error, adInstance) {
            if (error) {console.log(error);}
          });
        }
      });
        

    }
  }
});

//Advertisement.find(function(err, ads) {
//  console.log(ads);
//});

var myMsg = new Email(
{ from: "duncan@duncanmcdowell.com", 
  to:   "duncan@blitzen.com", 
  subject: "Knock knock...", 
  body: "Who's there?"
});

myMsg.send(function(err){ console.log(err) });

new CronJob('0 */15 * * * *', function() {
    console.log('You will see this message every fifteen minutes');
}, null, true, 'America/Toronto');
  //Advertisement.find().remove().exec()
