const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();


app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

var cds_services = {
  "services": [
    {
      "hook": "patient-view",
      "name": "CME-ster",
      "description": "Curated CME you probably listened to and want to remember.",
      "id": "cme-ster",
      "prefetch": {
        "patient": "Patient/{{context.patientId}}",
        "condition": "Condition?patient={{context.patientId}}"
      }
    }
  ]
}

app.get('/', (req, res) => {
  res.send('Your Clinical Decision Support service')
});

app.get('/cds-services', (req, res) =>{
  res.send(cds_services)
})

app.post('/cds-services/cme-ster', (req, res) =>{
  var dementia = []
  _.each(req.body.prefetch.condition.entry, function(val,index){
    _.each(val.resource.code.coding, function(v,i){
      console.log(v)
      if (v.display.match(/dementia|alzheimer/gi)){
        dementia.push(v.display)
      }
    })
  })
  if (dementia.length > 0){

      var cme_ster_dementia_card = 
      {
        "cards": [
          {
            "summary": "CME-ster Summary",
            "indicator": "critical",
            "detail": "This patient has a history of <b>"+dementia.join(", ")+"</b>.  There are great podcasts about dementia, including:",
            "source": {
              "label": "CME-ster Label",
              "url": "https://patient.dev",
              "icon": "https://www.patient.dev/wp-content/uploads/2021/11/cmester2.png"
            },
            "links": [
              {
                "label": "Curbsiders Podcast",
                "url": "https://thecurbsiders.com/podcast/268",
                "type": "absolute"
              },
              {
                "label": "Curbsiders Podcast2",
                "url": "https://thecurbsiders.com/podcast/168",
                "type": "absolute"
              }              
            ]
          },
{
            "summary": "Some other CDS Thing",
            "indicator": "critical",
            "detail": "This patient has a history of <b>"+dementia.join(", ")+"</b>.  There are great podcasts about dementia, including:",
            "source": {
              "label": "CME-ster Label",
              "url": "https://patient.dev",
              "icon": "https://www.patient.dev/wp-content/uploads/2021/11/cmester2.png"
            },
            "links": [
              {
                "label": "Curbsiders Podcast",
                "url": "https://thecurbsiders.com/podcast/268",
                "type": "absolute"
              },
              {
                "label": "Curbsiders Podcast2",
                "url": "https://thecurbsiders.com/podcast/168",
                "type": "absolute"
              }              
            ]
          }          
        ]
      }
  res.send(cme_ster_dementia_card)
  }else{
  res.send({})    
  }

})

app.listen(3000, () => {
  console.log('server started');
});