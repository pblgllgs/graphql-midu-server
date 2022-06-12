import { ApolloServer, UserInputError, gql } from 'apollo-server';
import axios from 'axios';
import { v1 as uuid } from 'uuid';

const persons = [
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
  enum YesNo {
    YES
    NO
  }

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
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person!
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(name: String!, phone: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      const {data: personsFromRestApi} = await axios.get('http://localhost:3001/persons');
      if (!args.phone) return personsFromRestApi;
      return personsFromRestApi.filter((person) => {
        return args.phone === 'YES' ? person.phone : !person.phone;
      });
    },
    findPerson: (root, args) => {
      return persons.find((persona) => persona.name === args.name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError(
          `Person with name ${args.name} already exists`,
          {
            invalidArgs: args.name,
          }
        );
      }
      const newPerson = {
        ...args,
        id: uuid(),
      };
      persons.push(newPerson);
      return newPerson;
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name);
      if (personIndex === -1) return null;
      const person = persons[personIndex];
      const updatedPerson = { ...person, phone: args.phone };
      persons[personIndex] = updatedPerson;
      return updatedPerson;
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
