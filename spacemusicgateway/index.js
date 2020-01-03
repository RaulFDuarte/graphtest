const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request, context }) {
        // pass the user's id from the context to underlying services
        // as a header called `user-id`
        request.http.headers.set('authorization', context.authtoken);
    }
}

// Initialize an ApolloGateway instance and pass it an array of implementing
// service names and URLs
const gateway = new ApolloGateway({
    serviceList: [
        { name: 'music', url: 'http://localhost:4004/' },
        { name: 'spacex', url: 'http://localhost:4000/' },
        // more services
    ],
    buildService({ name, url }) {
        return new AuthenticatedDataSource({ url });
    },
});


const server = new ApolloServer({
    gateway,
    engine: {
        apiKey: "service:tksfirst123g:cgxOyiE_Sf0DE43IgtovJw",
        schemaTag: "current"
    },
    subscriptions: false,
    context: ({ req }) => {
        const authtoken = req.headers.authorization || '';
        return { authtoken };
    },
    introspection: true,
});

server.listen({ port: 5000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});