# tineye-proxy

A micro-service interface to [Tineye](https://www.tineye.com/)

## Installation

### Requirements

Please make sure you have [Docker Toolbox](https://github.com/docker/toolbox/releases) installed before proceeding.

### Local Development

```
# Setup and run the app
docker-compose run --rm node npm i
docker-compose run --rm --service-ports node

# Add an image
curl -H "Content-Type: application/json" \
    -X POST \
    -d '{"url":"http://tineye.com/images/meloncat.jpg","filepath":"meloncat.jpg"}' `docker-machine ip`:3000/photos/add

# Search for the added image
curl -H "Content-Type: application/json" \
    -X POST \
    -d '{"image_url":"http://tineye.com/images/meloncat.jpg"}' `docker-machine ip`:3000/photos/search

# Delete the added image
curl -H "Content-Type: application/json" \
    -X POST \
    -d '{"filepath":"meloncat.jpg"}' `docker-machine ip`:3000/photos/delete
```

### Testing
```
docker-compose run --rm node npm test
```

# Contributing
