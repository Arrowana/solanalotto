import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
      themes: {
        dark: {
            background: colors.shades.black
        }
      }
  }
});
