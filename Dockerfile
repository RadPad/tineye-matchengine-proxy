FROM node:6.2.1
MAINTAINER Michael Clifford <cliff@onradpad.com>

EXPOSE 3000

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN npm i

CMD ["npm", "start"]
