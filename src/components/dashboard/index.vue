<template>
    <v-app>
        <v-main>
            <AppBar/>
            <SideNav/>

            <v-container fluid>
            <router-view />
          </v-container>
        </v-main>
    </v-app>
</template>
<script>
import AppBar from './AppBar.vue'
export default {

    component:{
        AppBar,
    },
  
    
}
</script>