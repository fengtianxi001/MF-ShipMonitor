import { createApp } from "vue";
import App from "./App.vue";
import autofit from "autofit.js";
import "animate.css";
import "@/assets/fonts/DincorosBlack/result.css";
import "@/assets/fonts/DouyuFont/result.css";
import "@/assets/fonts/SarasaMonoSC/result.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const boostrap = async () => {
  const app = createApp(App);
  app.mount("#app");

  const ScreenSize = {
    big: [2560, 1440],
    normal: [1920, 1080],
  }.normal;

  autofit.init({
    el: "#app",
    dw: ScreenSize[0],
    dh: ScreenSize[1],
    resize: true,
  });
};
boostrap();
