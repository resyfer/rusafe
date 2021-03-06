import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Profile from "../views/Profile.vue";
import History from "../views/History.vue";
import Pay from "../views/Pay.vue";
import OtpVerify from "../views/OtpVerify.vue";
import NewOtp from "../views/NewOtp.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import AuthVerify from "../views/AuthVerify.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/otp-verify/:identifier",
    name: "Otp Verify",
    component: OtpVerify,
  },
  {
    path: "/new-otp",
    name: "New Otp",
    component: NewOtp,
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    component: ForgotPassword,
  },
  {
    path: "/auth-verify/:identifier",
    name: "Auth Verify",
    component: AuthVerify,
  },
  {
    path: "/history",
    name: "History",
    component: History,
  },
  {
    path: "/pay",
    name: "Pay",
    component: Pay,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
