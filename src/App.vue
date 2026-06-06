<template>
  <div class="app-wrapper">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/Components/Navbar.vue'
import Footer from '@/Components/Footer.vue'
</script>

<style>
/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #090909;  /* matches your footer/page dark bg */
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