/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "unfonts.css";
import "./assets/styles/theme.css"; // ← loads your white defaults

import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia());
registerPlugins(app);
app.mount("#app");
