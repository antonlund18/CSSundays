import { queryOptions } from "@tanstack/react-query";
import { graphql, request, type ResultOf } from "@/lib/graphql";

const MatchServersEnabledQuery = graphql(`query MatchServersEnabled { matchServersEnabled }`);

/** Whether the API hosts match servers on DatHost (staff only). */
export const matchServersEnabledQuery = () =>
  queryOptions({
    queryKey: ["matchServersEnabled"],
    staleTime: 5 * 60_000,
    queryFn: async () => (await request(MatchServersEnabledQuery)).matchServersEnabled,
  });

const TestServerFields = graphql(`
  fragment TestServerFields on TestServer {
    gameServerId dathostMatchId address map startedAt finished cancelReason score1 score2
  }
`);

const TestServerQuery = graphql(`query TestServer { testServer { ...TestServerFields } }`, [TestServerFields]);

export type TestServer = NonNullable<ResultOf<typeof TestServerQuery>["testServer"]>;

/** The admin test server with its live state; polled while one is running. */
export const testServerQuery = () =>
  queryOptions({
    queryKey: ["testServer"],
    queryFn: async () => (await request(TestServerQuery)).testServer,
    refetchInterval: (query) => (query.state.data ? 10_000 : false),
  });

const StartTestServerMutation = graphql(
  `
  mutation StartTestServer($map: String!, $steamIds: [String!]!) {
    startTestServer(map: $map, steamIds: $steamIds) { ...TestServerFields }
  }
`,
  [TestServerFields],
);
export async function startTestServer(map: string, steamIds: string[]) {
  return (await request(StartTestServerMutation, { map, steamIds })).startTestServer;
}

const StopTestServerMutation = graphql(`mutation StopTestServer { stopTestServer }`);
export async function stopTestServer() {
  await request(StopTestServerMutation);
}

const MatchServersQuery = graphql(`
  query MatchServers {
    matchServers {
      gameServerId name address on booting playersOnline isTestServer
      match {
        id phase serverStatus score1 score2
        tournament { id name }
        registration1 { team { name } }
        registration2 { team { name } }
      }
    }
  }
`);

export type MatchServer = ResultOf<typeof MatchServersQuery>["matchServers"][number];

/** This deployment's DatHost servers, for the admin overview. */
export const matchServersQuery = () =>
  queryOptions({
    queryKey: ["matchServers"],
    queryFn: async () => (await request(MatchServersQuery)).matchServers,
    refetchInterval: 15_000,
  });

const StopMatchServerMutation = graphql(`mutation StopMatchServer($gameServerId: String!) { stopMatchServer(gameServerId: $gameServerId) }`);
export async function stopMatchServer(gameServerId: string) {
  await request(StopMatchServerMutation, { gameServerId });
}
