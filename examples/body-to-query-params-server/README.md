This very simple server is set up to turn JSON properties in the inboud request into query parameters for the outbound request.

Incoming requests shouls set the following headers (example data shown):

```
Outbound-Url: https://httpbin.org/post
Query-Param-Fields: queryparam1,queryparam2
```

When this server receives a request with a POSt body like the example one below:

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
