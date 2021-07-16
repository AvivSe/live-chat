import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql, split, HttpLink
} from "@apollo/client";

import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from "@apollo/client/utilities";

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
        reconnect: true
    }
});

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql'
});

const splitLink = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </ApolloProvider>
    ,
    document.getElementById('root')
);
