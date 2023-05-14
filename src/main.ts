/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import store from './store'

loadFonts()

// Create vue app
const app = createApp(App).use(store)

// Add global components
app.component('QuillEditor', QuillEditor)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)


// Mount vue app
app.mount('#app')
