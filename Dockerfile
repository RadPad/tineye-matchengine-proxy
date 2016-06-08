FROM node:6.0.0
MAINTAINER Michael Clifford <cliff@onradpad.com>

EXPOSE 3000

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN npm i

CMD ["npm", "start"]
