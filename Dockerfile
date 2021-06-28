FROM node:9.1

#ENV NODE_ENV dev

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app/node_modules

WORKDIR /home/node/app

COPY . /home/node/app

COPY package*.json ./
#COPY node_modules ./custom_modules
RUN mv /home/node/app/node_modules /home/node/app/custom_modules
# Defaults to dev but can be overriden by -E option. i.e. 'docker run ... -e NODE_ENV=production'


# http on 1337, https on 1338
EXPOSE 1337
EXPOSE 1338

RUN chown -R node:node /home/node/app
RUN sed -i 's|git+ssh.*/\(.*\)\.git.*"|/home/node/app/custom_modules/\1"|g' package.json
RUN npm install -g  yarn
USER node
RUN yarn install --non-interactive --check-files
CMD yarn start
