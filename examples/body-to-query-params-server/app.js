const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios');
const { json } = require('stream/consumers');

const app = express()
app.use(bodyParser.json())

const port = 3000

app.post('/', (req, res) => {
    const headerOutboundUrl = req.get('x-Osmos-Outbound-Url');
    if (headerOutboundUrl === undefined || headerOutboundUrl === '') {
        res.status(500).send('Outbound URL not set')
    }
    console.log('Outbount Url: ' + headerOutboundUrl);
    let outboundUrl = new URL(headerOutboundUrl);

    const outboundQueryParams = req.get('x-Osmos-Query-Param-Fields');
    console.log('Query Parameter Fields: ' + outboundQueryParams);

    const params = outboundQueryParams.split(',');

    console.log('POST body: ', req.body);

    params.forEach((param) => {
        outboundUrl.searchParams.append(param.trim(), req.body.param);
        delete req.body[param];
    });
    const outboundUrlThisRequest = outboundUrl.href;
    console.log('Sending payload: ' + JSON.stringify(req.body));
    console.log('Payload URL: ' + outboundUrlThisRequest.href);

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
