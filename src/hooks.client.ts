import type { HandleClientError } from "@sveltejs/kit";
// To use Clerk components:
import { initializeClerkClient } from "clerk-sveltekit/client";
// Or for headless mode:
// import { initializeClerkClient } from 'clerk-sveltekit/headless'
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "$env/static/public";

initializeClerkClient(PUBLIC_CLERK_PUBLISHABLE_KEY, {
  afterSignInUrl: "/",
  afterSignUpUrl: "/",
  signInUrl: "/login",
  signUpUrl: "/register",
  appearance: {
    variables: {
      colorPrimary: "#8aadf4",
      colorBackground: "#363a4f",
      colorText: "#cad3f5",
      colorTextSecondary: "#b5bfe2",
      colorDanger: "#ed8796",
      colorSuccess: "#a6da95",
      colorWarning: "#eed49f",
      colorAlphaShade: "#ffffff",
      colorInputText: "#cad3f5",
      colorTextOnPrimaryBackground: "#181926",
      colorInputBackground: "#1e2030",
    },
  },
});

export const handleError: HandleClientError = async ({ error, event }) => {
  console.error(error, event);
};
