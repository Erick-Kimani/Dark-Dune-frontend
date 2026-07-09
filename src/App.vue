<template>
  <Navbar v-if="!isEditorRoute" />
  <router-view />
  <Footer v-if="!isEditorRoute" />
</template>

<script>
import Navbar from '@/Components/Navbar.vue'
import Footer from '@/Components/Footer.vue'

export default {
  components: { Navbar, Footer },

  computed: {
    isEditorRoute() {
      return this.$route.path.startsWith('/editor')
    }
  }
}
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #090909;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 72px;
}
</style>