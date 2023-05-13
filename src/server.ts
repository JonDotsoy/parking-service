import { Server } from "https://deno.land/std@0.166.0/http/server.ts";
import { GraphQLHTTP } from "https://deno.land/x/gql@1.1.2/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";
import { app } from "./bootstrap.ts";

const typeDefs = gql`

  type Parking {
    id: String!
    location: String!
  }

  type Session {
    accessToken:String!
    tokenType:String!
    expiresIn: Int!
  }

  type Error {
    error: String!
    errorDescription: String!
  }

  union SingInResponse = Session | Error

  type Query {
    parkingCollection: [Parking!]!
  }

  type CreateParking {
    location: String!
  }

  type Mutation {
    singIn(username:String!, password: String!): SingInResponse
    createParking(location: String!): Parking
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const resolvers = {
  Query: {
    parkingCollection: () => app.parkingModule.parkingQuery.parkingCollection(),
  },
  Mutation: {
    singIn: (
      _: any,
      { username, password }: { username: string; password: string },
    ) => app.signInMutation.signIn(username, password),
    createParking: async (_: any, { location }: { location: string }) =>
      await app.parkingModule.parkingMutation.createParking({ location }),
  },
};

const schema = makeExecutableSchema({ resolvers, typeDefs });

const server = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    if (pathname === "/graphql") {
      return await GraphQLHTTP<Request>({
        schema,
        graphiql: true,
      })(req);
    }

    return new Response("Not Found", { status: 404 });
  },
  port: 3100,
});

console.log(`Server ready ${new URL(`http://localhost:3100/graphql`)}`);
server.listenAndServe();
