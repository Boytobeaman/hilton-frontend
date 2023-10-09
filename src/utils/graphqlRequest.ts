import { request } from 'umi';

export async function graphqlRequest(
  query: string,
  { variables }: any = {},
  endpoint: string = `${API_ROOT}${GRAPHQL_PREFIX}`,
) {

  return request(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

}