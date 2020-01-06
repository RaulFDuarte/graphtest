const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
var fs = require('fs');
const typeDefs = gql(fs.readFileSync(__dirname.concat('/schema.gql'), 'utf8').toString('utf8'));
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const RocketAPI = require('./datasources/rocket');

const store = createStore();

const server = new ApolloServer({
    context: async({ req }) => { // simple auth check on every request
        const auth = req.headers && req.headers.authorization || '';
        const email = Buffer.from(auth, 'base64').toString('ascii');
        if (!isEmail.validate(email)) return { user: null };
        // find a user by their email
        const users = await store.users.findOrCreate({ where: { email } });
        const user = users && users[0] || null;

        return { user: {...user.dataValues } };
    },
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    engine: {
        apiKey: "service:spacextksGraph:-5PEaB73KDSuA0H9ebb_Vg",
        schemaTag: "current"
    },
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store }),
        rocketAPI: new RocketAPI()
    })
});

server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});