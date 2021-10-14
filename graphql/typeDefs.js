const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Void {
    error: String
  }

  # User
  type UserTransactionParty {
    _id: ID
    email: String
    amount: Float
  }

  type UserTransaction {
    _id: ID
    category: String
    party: UserTransactionParty
  }

  type UserAccount {
    _id: ID
    name: String
    branch: String
    iifsc: String
  }

  type Card {
    number: Int
    holder: String
    expiry: [Int]
  }

  type Otp {
    value: String
    expiry: Int
  }

  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    dob: [Int]
    balance: Float
    verified: Boolean
    transactions: [UserTransaction]
    accounts: [UserAccount]
    cards: [Card]
    otp: Otp
  }

  type Query {
    users: [User]
  }

  type Mutation {
    signup(
      name: String!
      username: String!
      email: String!
      password: String!
      dob: [Int!]!
    ): Void
  }
`;

module.exports = typeDefs;
