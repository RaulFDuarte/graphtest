const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
var fs = require('fs');
const typeDefs = gql(fs.readFileSync(__dirname.concat('/schema.gql'), 'utf8').toString('utf8'));
const resolvers = require('./resolvers');
const MusicAPI = require('./datasources/music');

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    engine: {
        schemaTag: "current"
    },
    dataSources: () => ({
        musicAPI: new MusicAPI()
    }),
    introspection: true
});

server.listen({ port: 4004 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});