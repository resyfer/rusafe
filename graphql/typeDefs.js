const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Void {
    error: String
  }

  # User
  type UserTransactionParty {
    _id: ID
    email: String
  }

  type UserTransaction {
    _id: ID
    category: String
    party: UserTransactionParty
    amount: Float
  }

  type Otp {
    value: String
    expiry: Int
  }

  type AuthString {
    value: String
    expiry: Int
  }

  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    balance: Float
    verified: Boolean
    img: String
    transactions: [UserTransaction]
    phone: Float
    otp: Otp
    authString: AuthString
    error: String
  }

  type PreviewUser {
    _id: ID
    name: String
    email: String
    img: String
  }

  type Query {
    user(jwt: String!): User
    previewUser(identifier: String!): PreviewUser
  }

  type Credentials {
    jwt: String
    user: User
    error: String
  }

  type Mutation {
    # Auth
    signup(
      name: String!
      username: String!
      email: String!
      password: String!
      img: String!
      phone: Float!
    ): Void

    otpVerify(identifier: String!, otp: String!): Credentials

    login(identifier: String!, password: String!): Credentials

    newOtp(identifier: String!): Void

    # Forgot Password
    generateString(identifier: String!): Void
    forgotPassword(
      identifier: String!
      authString: String!
      newPassword: String!
    ): Credentials

    # Transactions
    transactions(payer: ID!, payee: ID!, amount: Float!): Void
  }
`;

module.exports = typeDefs;
