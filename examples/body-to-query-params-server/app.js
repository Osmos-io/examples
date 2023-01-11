const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const axios = require('axios');
const { json } = require('stream/consumers');

const port = 3000

app.post('/', (req, res) => {
    const headerOutboundUrl = req.get('Outbound-Url');
    console.log('Outbount Url: ' + process.env.OUTBOUND_URL);
    const outboundUrl = headerOutboundUrl + "?";

    const outboundQueryParams = req.get('Query-Param-Fields');
    console.log('Query Parameter Fields: ' + outboundQueryParams);

    const params = outboundQueryParams.split(',');

    console.log('POST body: ', req.body);

    let outboundUrlThisRequest = outboundUrl;
    params.forEach(param => {
        outboundUrlThisRequest = outboundUrlThisRequest + param + '=' + req.body[param] + '&';
        delete req.body[param];
    });
    console.log('Sending payload: ' + JSON.stringify(req.body));
    console.log('Payload URL: ' + outboundUrlThisRequest);

    axios.post(outboundUrlThisRequest, req.body)
        .then(_response => {
            res.end()
        })
        .catch(error => {
            console.log('Error: ' + error);
            res.status(error.status).send(error)
        });

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
