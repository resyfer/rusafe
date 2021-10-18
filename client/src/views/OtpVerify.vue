<template>
  <div class="title">Otp Verify</div>
  <div class="error">{{ authDetails.error }}</div>
  <form>
    <input
      type="text"
      placeholder="Username / Email"
      v-model.trim="credentials.identifier"
    />
    <input type="text" placeholder="OTP" v-model="credentials.otp" />
    <button
      type="submit"
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
</template>

<script>
import { reactive } from "vue";
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
          }

          store.commit("userLoggedIn", result.data.otpVerify.user);
          Cookies.set("jwt", result.data.otpVerify.jwt, { expires: 365 });
          router.push("/profile");
        },
      }
    );

    return {
      credentials,
      verifyOtp,
      authDetails,
    };
  },
};
</script>

<style lang="scss"></style>
