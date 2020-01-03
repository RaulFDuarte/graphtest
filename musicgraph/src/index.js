const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
var fs = require('fs');
const typeDefs = gql(fs.readFileSync('/home/raul/apis/apollo/musicgraph/src/schema.gql').toString('utf8'));
const resolvers = require('./resolvers');
const MusicAPI = require('./datasources/music');

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    engine: {
        apiKey: "service:musicGraph:Suuik42UqQWUo5OdcoKXmw",
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