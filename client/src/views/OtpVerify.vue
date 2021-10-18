<template>
  <div class="verify-otp">
    <div class="title">Verify OTP</div>
    <div class="error" v-if="authDetails.error">{{ authDetails.error }}</div>
    <form>
      <input type="text" placeholder="OTP" v-model.trim="credentials.otp" />
      <button
        type="submit"
        v-bind="{ disabled: !validOtp }"
        @click.prevent="
          verifyOtp({
            identifier: credentials.identifier,
            otp: credentials.otp,
          })
        "
      >
        Verify
      </button>
    </form>
    <router-link class="new-otp" to="/new-otp">
      Expired OTP? Request New
    </router-link>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useMutation } from "@vue/apollo-composable";
import Cookies from "js-cookie";
import gql from "graphql-tag";
import router from "../router";

export default {
  name: "OtpVerify",
  setup() {
    const route = useRoute();
    const store = useStore();

    const credentials = reactive({
      identifier: route.params.identifier,
      otp: "",
    });

    const authDetails = reactive({
      error: null,
    });

    const { mutate: verifyOtp } = useMutation(
      gql`
        mutation verifyOtp($identifier: String!, $otp: String!) {
          otpVerify(identifier: $identifier, otp: $otp) {
            jwt
            user {
              _id
              name
              username
              img
              balance
              phone
            }
            error
          }
        }
      `,
      {
        update(_cache, result) {
          if (result.data.otpVerify.error) {
            authDetails.error = result.data.otpVerify.error;
            return;
          }

          store.commit("userLoggedIn", result.data.otpVerify.user);
          Cookies.set("jwt", result.data.otpVerify.jwt, { expires: 365 });
          router.push("/profile");
        },
      }
    );

    const validOtp = computed(() => {
      return credentials.identifier !== "" && credentials.otp.length === 8;
    });

    return {
      credentials,
      verifyOtp,
      authDetails,
      validOtp,
    };
  },
};
</script>

<style lang="scss">
div.verify-otp {
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

  .new-otp {
    color: var(--theme-0-100);
    margin-top: 1vh;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
