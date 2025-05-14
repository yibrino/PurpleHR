<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  //
</script>
<style scoped>
/* Ensures the entire application doesn’t overflow */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* Prevents vertical and horizontal scroll */
}

#app {
  height: 100%;
  overflow: hidden; /* Ensures no scroll in the root container */
}
</style>