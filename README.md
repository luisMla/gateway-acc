<h1>GATEWAY</h1>

## Description micro-services

```
+--------+      +----------------+
|        |----->|                |
| gateway|<-----| subscription   |
|        |      |                |
+--------+      +----------------+
```

- Related repositories

  - [subscription](https://github.com/luisMla/subscription-acc)
  - [mail](https://github.com/luisMla/mails-acc)

- gateway

  - The gateway service collects all request and redirects them to the subscription service, implements a system to trace the possible errors that come from the subscription service.
  - All endpoints request a custom header to validate the identity additionally the endpoints that could contain sensitive information request a valid session token (JWT) in the subscription service that is the one that contains the users and roles layer.
  - For this JWT validation the service performs a clone of the original headers and injects the x-api-key that the service expects, to simplify all the tests that header for now is 123456
  - The environments are created from the file .env.example all the variables contained there should be housed in a secrets file
  - Postman collection in ./docs.
  - system alive:

    - this endpoint is placed in root service in `http://localhost:3002/alive`

  - Structure of auth services:

    - auth controller:
      - Fulfills the following functions: registration, login, and retrieval of logged user data.
        - register.
        - login.
        - me.

  - Structure of subscription services:

    - public controller:
      - This controller enables two methods to create and cancel subscriptions, it needs authorization through the X-API-KEY.
    - private controller:
      - This driver enables the query of subscriptions both by ID and general paged search and send email for newsletter. Requires authentication with JWT and X-API-KEY and ROLES (in subscriptions micro service) to prevent the access to sensitive information from subscribers or actions.

  - log system:
    - All http errors will be wrapped inside the custom http service, and will be logged with `winston` for now only have console transport integration.
    - Interesting file [http.service](https://github.com/luisMla/gateway-acc/blob/master/src/modules/shared/http.service.ts)

- subscriptions

  - service that contains the logic, data processing and storage of the subscriptions to the different campaigns/newsletter
  - moore information on https://github.com/luisMla/subscription-acc#readme

- mail

  - service that manages the sending of emails
  - more information https://github.com/luisMla/mails-acc#readme

- improvements for deployment in enterprise
  - Join the tree services in on repo using lerna or similar https://github.com/lerna/lerna
  - Join logger a set a stacktrace system
  - include Jenkins Pipelines
  - Prepare images for Kubernetes

---

## Start Guide

- use node v14.16.1

### Inside Docker containers

Create docker network

```bash
$  docker network create -d bridge expose_apis
```

Just run already prepared bash script:

```bash
$ ./init
```

It will setup the project for you (starting docker-compose stack).
The NestJS app running in dev mode will be exposed on `http://localhost` (port 3002)

For IDE autocompletion to work, run `yarn` on the host machine.

## Test

```bash
# unit tests
$ docker exec -it gateway yarn test

# test coverage
$ docker exec -it gateway yarn test:cov
```

## Environment Configuration

Integrated Configuration Module so you can just inject `ConfigService`
and read all environment variables from `.env` file, which is created automatically by the init script from `.env.example`.

## Swagger

RESTful APIs you can describe with already integrated Swagger.
To see all available endpoints visit http://localhost:3002/api/docs

## Authentication - JWT

Already preconfigured JWT authentication.
It's suggested to change current password hashing to something more secure.
You can start use already working implementation of `Login` and `Registration`
endpoints, just take a look at [http://localhost:3002/api/docs](http://localhost:3002/api/docs).

## Authentication - X-API-KEY

This is an internal service, it should only receive requests from the gateway

## CI/CD

In a enterprise environment the process should be:

Make a commit to a branch with a label like "deploy", Jenkins performs a git pull of the branch, performs the build, launches the tests, if everything is correct, reset the corresponding pm2 processes. Finally, if everything went well, you should send a confirmation email.
