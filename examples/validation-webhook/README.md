# Osmos Validation Webhook

This example implements a webhook servier that receives the bytes of a file and parses it to return the validation result.

## Getting Started

We implement an expressjs server with TypeScipt

Before getting started, please ensure you have NodeJS installed onto your local machine.

Next, let's install our dependencies by running

```bash
npm install
```

## Validation function

The requests Osmos will make to your service and the required response type are defined in `app.ts`. Please take a look at this file to understand the shape of the request

## Up and running

To start our server run

```bash
npm run start
```

This will start the server which is listening on port `50051`

## Integrating with Osmos

Check out Osmos docs for integration steps

https://docs.osmos.io/developer-docs/validation-and-transformation-webhooks
