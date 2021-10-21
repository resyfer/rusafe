<template>
  <Navbar />
  <main class="profile" v-if="store.state.isLoggedIn">
    <div class="left profile-info">
      <div class="pfp">
        <img
          v-bind:src="store.state.user.img"
          v-bind:alt="store.state.user.name"
        />
      </div>
      <div class="user">
        <div class="name">
          {{ store.state.user.name }}
        </div>
        <div class="username">
          {{ store.state.user.username }}
        </div>
        <div class="email">
          {{ store.state.user.email }}
        </div>
      </div>
      <!-- <div class="qrcode">
        <div class="code-btn">QR Code</div>
        <div class="code">
          <qrcode-vue v-bind:value="qrCodeLink" />
        </div>
      </div> -->
    </div>

    <div class="divider"></div>

    <div class="right profile-info">
      <div class="balance">
        <div class="ruppee">₹</div>
        <div class="amount">
          {{ new Intl.NumberFormat("en-IN").format(store.state.user.balance) }}
        </div>
      </div>
      <div class="past-transactions-container">
        <div class="title">Recent Transactions</div>
        <div class="past-transactions">
          <div
            class="transaction"
            v-for="transaction in store.state.user.transactions.slice(0, 10)"
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
      </div>
    </div>
  </main>
</template>

<script>
import { useStore } from "vuex";
import { onMounted } from "vue";
import router from "../router/index";

// import QrcodeVue from "qrcode.vue";

import Navbar from "../components/Navbar.vue";

export default {
  name: "Profile",
  components: {
    Navbar,
    // QrcodeVue,
  },
  setup() {
    const store = useStore();
    // let qrCodeLink;
    // if (store.state.user)
    //   qrCodeLink = process.env.NODE_ENV === "development"
    //     ? `http://localhost:3000/user/${store.state.user.username}`
    //     : "";

    onMounted(() => {
      if (!store.state.isLoggedIn) router.push("/");
      else document.title = `${store.state.user.username} | Profile - Rusafe`;
    });

    return {
      store,
      router,
      // qrCodeLink,
    };
  },
};
</script>

<style lang="scss">
main.profile {
  background-color: var(--theme-1-100);
  min-height: calc(100vh - 8.5vh);
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  div.profile-info {
    height: calc(100vh - 8.5vh - 3vh);
    width: 49.9%;
  }

  div.divider {
    width: 0.2%;
    height: calc(100vh - 8.5vh - 5vh);
    background-color: var(--theme-8-100);
  }

  div.left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    div.pfp {
      height: 35vh;
      aspect-ratio: 1/1;
      border: 0.5vh solid var(--theme-8-100);
      border-radius: 50%;
      overflow: hidden;

      img {
        height: 100%;
      }
    }

    div.user {
      font-size: 3vh;
      text-align: center;

      div.name {
        font-size: 5vh;
        margin-bottom: 3vh;
      }
    }
  }

  div.right {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    div.balance {
      height: 15vh;
      width: 80%;
      background-color: var(--theme-8-100);
      color: var(--theme-2-100);
      border-radius: 2vh;
      font-size: 7.5vh;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 3vh;
    }

    .withdrawal {
      color: rgba(255, 0, 0, 0.9);
    }

    .deposit {
      color: rgba(0, 255, 0, 0.9);
    }

    div.past-transactions-container {
      width: 90%;

      div.title {
        font-size: 3vh;
        text-align: center;
        width: 80%;
        margin: auto;
        border-bottom: 0.2vh solid var(--theme-4-100);
      }

      div.past-transactions {
        height: 50vh;
        width: 100%;
        overflow-y: scroll;
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
  }
}
</style>
