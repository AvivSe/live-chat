import 'reflect-metadata';
import {ApolloServer} from 'apollo-server';
import {buildSchema} from 'type-graphql';
import {Resolvers} from './schema/Resolvers';
import {createConnection} from "typeorm";

const main = async () => {
    const connection = await createConnection();
    await connection.synchronize();

    const schema = await buildSchema({
        resolvers: [Resolvers],
    });

    const apolloServer = new ApolloServer({schema});

    await apolloServer.listen().then(({url}) => console.log(`Server started on ${url}`),
    );
};

main();
