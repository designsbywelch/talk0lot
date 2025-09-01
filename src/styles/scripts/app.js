import { Router } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const router = new Router(app);
  router.start();
});
