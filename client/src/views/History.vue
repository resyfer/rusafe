<template>
  <Navbar />
  <main class="history">
    <div class="title">History</div>
    <div class="transactions">
      <div
        class="transaction"
        v-for="transaction in store.state.user.transactions"
        v-bind:key="transaction._id"
        v-on:click="router.push(`/transaction/${transaction._id}`)"
      >
        <div class="party">
          <div class="name">
            {{ transaction.party.name }} ({{ transaction.party.username }})
          </div>
        </div>
        <div class="quantity">
          <div class="icon">
            <i
              v-if="transaction.category == 'deposit'"
              class="deposit fas fa-sort-up"
            ></i>
            <i
              v-if="transaction.category == 'withdrawal'"
              class="withdrawal fas fa-sort-down"
            ></i>
          </div>
          <div
            class="amount"
            v-bind:class="{
              deposit: transaction.category == 'deposit',
              withdrawal: transaction.category == 'withdrawal',
            }"
          >
            ₹
            {{ new Intl.NumberFormat("en-IN").format(transaction.amount) }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "vuex";
import router from "../router/index";

import Navbar from "../components/Navbar.vue";

export default {
  name: "History",
  components: {
    Navbar,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      if (!store.state.isLoggedIn) router.push("/");
      else document.title = `${store.state.user.username} | History - Rusafe`;
    });

    return {
      store,
      router,
    };
  },
};
</script>

<style lang="scss">
main.history {
  min-height: calc(100vh - 8.5vh);
  width: 100%;

  div.title {
    font-size: 4vh;
    text-align: center;
    width: 80%;
    margin: 4vh auto;
    border-bottom: 0.2vh solid var(--theme-4-100);
  }

  .withdrawal {
    color: rgba(255, 0, 0, 0.9);
  }

  .deposit {
    color: rgba(0, 255, 0, 0.9);
  }

  div.transactions {
    width: 100%;
    border-radius: 1vh;

    div.transaction {
      height: 10vh;
      margin: 1.5vh auto;
      width: 90%;
      border-radius: 1.5vh;
      border: 0.3vh solid var(--theme-4-100);
      padding: 0 5vh;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      background-color: var(--theme-8-100);
      color: var(--theme-1-100);
      font-size: 2.75vh;

      cursor: pointer;

      div.quantity {
        display: flex;
        align-items: center;

        div.icon {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 2vh;

          i.deposit {
            transform: translate(0, 25%);
          }

          i.withdrawal {
            transform: translate(0, -25%);
          }
        }
      }
    }
  }
}
</style>
