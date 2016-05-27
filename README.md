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

# Send a request
curl -H "Content-Type: application/json" \
    -X POST \
    -d '{"image":{"url":"image_url","path":"image_path"}}' `docker-machine ip`:3000/photos/add
```

### Testing
```
docker-compose run --rm node npm test
```

# Contributing
