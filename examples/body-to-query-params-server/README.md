This very simple server is set up to turn JSON properties in the inbound request into query parameters for the outbound request.

Osmos's HTTP API Destination connector should set the following headers (example data shown), with batching disabled:

```
  x-Osmos-Outbound-Url: https://httpbin.org/post
  x-Osmos-Query-Param-Fields: queryparam1,queryparam2
```

Here, `queryparam1` and `queryparam2` are any fields in the Osmos Connector schema. When using an Uploader, these can be set to be parameterized fields. Then, these fields can be set to constant values in the browser JS (eg: user id, session id etc) and Osmos + this web server will send these values as query parameters instead.

Osmos will then make outbound requests with payloads in them that look like below:

```
{
  foo: 'dfoo',
  bar: 'dbar',
  baz: 'dbaz',
  queryparam1: 'dqp1',
  queryparam2: 'dqp2'
}
```

It will make an outbound request to
`https://httpbin.org/post?queryparam1=dqp1&queryparam2=dqp2&`
with payload

```
{
    "foo":"dfoo",
    "bar":"dbar",
    "baz":"dbaz"
}
```
