# tineye-proxy

A micro-service interface to [Tineye](https://www.tineye.com/)

## Requirements

* Node.js >= 6.0.0
* Redis

## Usage

The required environment variables are listed in `.env.dev`. Set your custom
environment variables and run the following:
```bash
npm i
npm start
```

## Local Development

Local development is very straightforward with Docker and Docker Compose. If using Docker w/ Docker Machine, replace `localhost` with the output of `docker-machine ip` in the commands below.

### Environment Variables

The supported/required environment variables can be found in `.env.dev`. If
using Docker Compose, put all custom values in `.env.local` (this file needs
    to exist for local development with Docker Compose, even if it is empty).

### Running the app

With Docker Compose:
```bash
docker-compose run --rm node npm i
docker-compose run --rm --service-ports node
```

Without Docker:
```bash
npm i
npm start
```

Testing the API:
```bash
# Add an image
curl -H "Content-Type: application/json" \
    -H "Authorization: Basic dXNlcm5hbWU6UEBzc3cwcmQ=" \
    -X POST \
    -d '{"url":"http://tineye.com/images/meloncat.jpg","filepath":"meloncat.jpg"}' localhost:3000/api/photos/add

# Search for the added image
curl -H "Content-Type: application/json" \
    -H "Authorization: Basic dXNlcm5hbWU6UEBzc3cwcmQ=" \
    -X POST \
    -d '{"url":"http://tineye.com/images/meloncat.jpg"}' localhost:3000/api/photos/search

# Delete the added image
curl -H "Content-Type: application/json" \
    -H "Authorization: Basic dXNlcm5hbWU6UEBzc3cwcmQ=" \
    -X DELETE localhost:3000/api/photos/delete?filepath=meloncat.jpg

# Compare two images
curl -H "Content-Type: application/json" \
    -H "Authorization: Basic dXNlcm5hbWU6UEBzc3cwcmQ=" \
    -X POST \
    -d '{"url1":"http://tineye.com/images/meloncat.jpg","url2":"http://tineye.com/images/meloncat.jpg"}' localhost:3000/api/photos/compare

# Get the image count of your index
curl -X GET localhost:3000/api/photos/count

# Get the status of the TinEye service
curl -X GET localhost:3000/api/photos/ping
```

## Testing
```
docker-compose run --rm node npm test
```
