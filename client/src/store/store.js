import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      user: null,
      isLoggedIn: false,
      jwt: null,
    };
  },
  mutations: {
    userLoggedIn(state, user) {
      state.user = user;
      state.isLoggedIn = true;
    },

    userLoggedOut(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export default store;
