import { GraphQLServer, PubSub } from 'graphql-yoga'
import { Prisma } from 'prisma-binding'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
		secret: "thisismysupersecrettext"
})

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        // Mutation,
        // Subscription,
        // User,
        // Post,
        // Comment
    },
    context: {
        //db,
				//pubsub,
				prisma
    }
})

server.start(() => {
    console.log('The server is up!')
})