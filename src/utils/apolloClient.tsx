import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { PropsWithChildren } from 'react';
import { setContext } from '@apollo/client/link/context';
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});
const httpLink = createHttpLink({
  uri: `${API_ROOT}${GRAPHQL_PREFIX}`,
});

const client = new ApolloClient({
  uri: `${API_ROOT}${GRAPHQL_PREFIX}`, //GraphQL server url
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const CustomApolloProvider = ({ children }: PropsWithChildren) => {
  return (
    <ApolloProvider
      client={client}
    > 
      { children } 
    </ApolloProvider>
  );
};

export default CustomApolloProvider;