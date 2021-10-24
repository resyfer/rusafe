import { createApp, provide, h } from "vue";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";

import router from "./router";

import store from "./store/store";

import App from "./App.vue";

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri:
    process.env.NODE_ENV == "development"
      ? "http://localhost:5000/graphql"
      : "https://resyfer-rusafe.herokuapp.com/graphql",
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app
  .use(router)
  .use(store)
  .mount("#app");
