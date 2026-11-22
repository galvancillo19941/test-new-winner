import { createApp, createSSRApp } from "vue";
import LandingPage from "./pages/LandingPage.vue";
import { config, siteKey } from "./site/site.ts";
import "./style.css";

// Builds prerender the page into #app (scripts/prerender.ts): hydrate it.
// `vp dev` serves an empty #app, so it renders from scratch.
const hydrate = document.getElementById("app")?.hasChildNodes();
const app = (hydrate ? createSSRApp : createApp)(LandingPage);
app.provide(siteKey, config);
app.mount("#app");
