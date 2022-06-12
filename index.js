import { ApolloServer,UserInputError, gql } from 'apollo-server';
import { v1 as uuid } from 'uuid';

const personas = [
  {
    name: 'Juan',
    phone: '12345678',
    street: 'Calle falsa 123',
    city: 'Ciudad falsa',
    id: '12345678',
  },
  {
    name: 'Pedro',
    phone: '87654321',
    street: 'Calle verdadera 123',
    city: 'Ciudad verdadera',
    id: '14785236',
  },
  {
    name: 'Maria',
    street: 'Calle falsa 123',
    city: 'Ciudad falsa',
    id: '87654321',
  },
];

const typeDefinitions = gql`
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }
  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person!
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => personas.length,
    allPersons: () => personas,
    findPerson: (root, args) => {
      return personas.find((persona) => persona.name === args.name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (personas.find((p) => p.name === args.name)) {
        throw new UserInputError(`Person with name ${args.name} already exists`,{
            invalidArgs: args.name
        });
      }
      const newPerson = {
        ...args,
        id: uuid(),
      };
      personas.push(newPerson);
      return newPerson;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
