import Vue from "vue";
import VueResource from "vue-resource";
import App from "./App.vue";
import store from "./store";

Vue.use(VueResource);
window.onload = () => {
	new Vue({
			el: "#plugin",
			store,
			render: h => h(App)
	});
}