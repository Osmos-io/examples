This very simple server is set up to turn JSON properties in the inbound request into query parameters for the outbound request.

Incoming requests should set the following headers (example data shown):


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
