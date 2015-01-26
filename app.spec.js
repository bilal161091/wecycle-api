var frisby = require('frisby');


frisby.create('testing a simple api')
    .get('http://localhost:5000/')
    .expectStatus(200)
.toss();

