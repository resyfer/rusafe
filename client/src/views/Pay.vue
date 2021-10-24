<template>
  <Navbar />
  <main class="pay">
    <div class="payment-successful" v-if="toggleSuccessDisplay">
      <i class="fas fa-times" @click="reload()"></i>
      Payment Successful!
    </div>
    <div class="title">Pay</div>
    <div class="login-form">
      <div class="error" v-if="paymentSuccess.error">
        {{ paymentSuccess.error }}
      </div>
      <form>
        <input
          type="text"
          placeholder="Username / Email of Payee*"
          v-model="transaction.payee"
        />
        <input
          type="number"
          placeholder="Amount in ₹*"
          step="0.1"
          v-model.number="transaction.amount"
        />
        <button
          type="submit"
          v-bind="{ disabled: !validTransaction }"
          @click.prevent="
            pay({
              payer: store.state.user.username,
              payee: transaction.payee,
              amount: transaction.amount,
            })
          "
        >
          Submit
        </button>
      </form>
    </div>
  </main>
</template>

<script>
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

import router from "../router/index";

import Navbar from "../components/Navbar.vue";

export default {
  name: "Pay",
  components: {
    Navbar,
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      if (!store.state.isLoggedIn) router.push("/");
      else document.title = `${store.state.user.username} | Pay - Rusafe`;
    });

    const paymentSuccess = reactive({
      error: null,
    });

    const transaction = reactive({
      payee: "",
      amount: null,
    });

    const validTransaction = computed(() => {
      return (
        transaction.payee != "" &&
        transaction.payee != store.state.user.username &&
        transaction.payee != store.state.user.email &&
        transaction.amount
      );
    });

    const { mutate: pay } = useMutation(
      gql`
        mutation pay($payer: String!, $payee: String!, $amount: Float!) {
          transaction(payer: $payer, payee: $payee, amount: $amount) {
            error
          }
        }
      `,
      {
        update: (_cache, result) => {
          console.log(result.data);
          if (result.data.transaction.error) {
            paymentSuccess.error = result.data.transaction.error;
          } else {
            toggleSuccessDisplay.value = true;
          }
        },
      }
    );

    const toggleSuccessDisplay = ref(false);

    const reload = () => {
      location.reload();
    };

    return {
      store,
      paymentSuccess,
      transaction,
      pay,
      reload,
      toggleSuccessDisplay,
      validTransaction,
    };
  },
};
</script>

<style lang="scss">
main.pay {
  background-color: var(--theme-8-100);
  min-height: calc(100vh - 8.5vh);
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  div.payment-successful {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--theme-8-100);
    background-color: var(--theme-1-100);
    height: 50vh;
    width: 60vh;
    border-radius: 2vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4vh;

    .fas {
      position: absolute;
      top: 2vh;
      right: 2vh;
      cursor: pointer;
    }
  }

  div.title {
    font-size: 3.5vh;
    margin-bottom: 5vh;
    color: var(--theme-1-100);
    text-transform: uppercase;
  }

  div.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3vh;
    width: 40%;
    height: 40vh;

    border-radius: 1.5vh;

    div.error {
      color: red;
      width: 80%;
      padding: 2vh 3vh;
      border-radius: 1vh;
      margin-bottom: 5vh;
      border: 0.2vh solid var(--theme-4-100);
      background-color: var(--theme-7-040);
      font-size: 2.4vh;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;

      input {
        outline: none;
        height: 7vh;
        width: 80%;
        border-radius: 1vh;
        padding-left: 3vh;
        font-size: 2.5vh;

        margin-bottom: 2.5vh;

        background-color: var(--theme-8-100);
        border: 0.3vh solid var(--theme-7-100);
        color: var(--theme-2-100);
      }

      button[type="submit"] {
        outline: none;
        text-decoration: none;
        padding: 2vh 5vh;
        margin-top: 3vh;
        margin-bottom: 2vh;
        border-radius: 0.75vh;
        text-transform: uppercase;
        cursor: pointer;
        border: 0.2vh solid var(--theme-5-000);
        background-color: var(--theme-5-100);
        color: var(--theme-2-100);

        &:hover {
          border: 0.2vh solid var(--theme-5-100);
          background-color: var(--theme-8-100);
          color: var(--theme-5-100);
          transition: 0.2s ease-in-out;
        }

        &:disabled {
          background-color: var(--theme-3-100);
          color: var(--theme-9-100);
          border: 0.2vh solid var(--theme-9-000);
          cursor: not-allowed;

          &:hover {
            background-color: var(--theme-3-100);
            color: var(--theme-9-100);
          }
        }
      }
    }

    .login-links {
      color: var(--theme-0-100);
      margin-top: 1vh;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
