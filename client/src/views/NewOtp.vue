<template>
  <div class="new-otp">
    <div class="title">New OTP</div>

    <div class="error" v-if="authDetails.error">{{ authDetails.error }}</div>
    <form>
      <input
        type="text"
        placeholder="Username / Email"
        v-model.trim="credentials.identifier"
      />
      <button
        type="submit"
        @click.prevent="
          newOtp({
            identifier: credentials.identifier,
          })
        "
      >
        Request OTP
      </button>
    </form>
  </div>
</template>

<script>
import { reactive, watch } from "vue";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

import router from "../router/index";

export default {
  name: "NewOtp",
  setup() {
    document.title = "New OTP | Rusafe";

    const credentials = reactive({
      identifier: "",
    });

    const authDetails = reactive({
      error: "",
    });

    watch(authDetails, () => {
      if (authDetails.error == null) {
        router.push(`/otp-verify/${credentials.identifier}`);
      }
    });

    const { mutate: newOtp } = useMutation(
      gql`
        mutation newOtp($identifier: String!) {
          newOtp(identifier: $identifier) {
            error
          }
        }
      `,
      {
        update(_cache, result) {
          authDetails.error = result.data.newOtp.error;
        },
      }
    );

    return {
      credentials,
      authDetails,
      newOtp,
    };
  },
};
</script>

<style lang="scss">
div.new-otp {
  background-color: var(--theme-8-100);
  height: 100vh;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  div.title {
    font-size: 3.5vh;
    margin-bottom: 5vh;
    color: var(--theme-1-100);
    text-transform: uppercase;
  }

  div.error {
    color: red;
    width: calc(40% * 80 / 100);
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
    padding: 3vh 0;
    width: 40%;
    height: 30vh;

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
    }
  }

  .new-otp {
    color: var(--theme-0-100);
    margin-top: 1vh;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
