<template>
  
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"      
        color="purple"
        floating
       
        >
     
        <!-- </v-list-item> --> 
          <div class="d-flex align-center mt-4 mb-6 pa-2" >
            <!-- Avatar -->
              <v-avatar :size="rail? 40: 60" class="text-h6 font-weight-bold mr-2" color="red-darken-4">
                {{ userInitials }}
              </v-avatar>

            <!-- User Info -->
            <div v-if="!rail">
             
              <div class="text-h6 font-weight-bold">{{ user.firstName }}  {{ user.lastName }}</div>
              <div class="text-body-2 text--secondary">{{ user.email }}</div>
            </div>
          </div>
        <v-divider></v-divider>

        <v-list density="comfortable" nav>
          <div v-for="nav in navItems" :key="nav.title">
             <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">   
                         
                   <v-list-item :prepend-icon="nav.prependIcon" 
                   :title="nav.title" :value="nav.value"
                   v-bind="props" 
                   :to="nav.url">
                   </v-list-item>
              
              </template>
                  {{nav.title}}
            </v-tooltip>
         
          </div>
          
        </v-list>
        <template v-slot:append>
            <v-btn
              :icon="rail? 'mdi-chevron-right':'mdi-chevron-left'"
              variant="text"
              @click.stop="toggleRail"
            ></v-btn>
          </template>
      </v-navigation-drawer>
      
   
</template>
<script>
export default {
   data() {   
   
    return { 
      user: { 
         firstName:"Yibrah",
         lastName:"Mehari",
         email:"yibrah@pcltd.com"
      },
      drawer: true,
      rail:false,
      navigations: [],
      navItems:[
          {title:"Employees", value:"profile",prependIcon:"mdi-account-circle",url:"/employees",role:['Admin']},
       
      ],
     }
  },
  computed:{
     userInitials() {
      return `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase();
    },

  },
  methods:{
    toggleNav() {
     this.drawer = !this.drawer
    },
    toggleRail() {
        this.rail = !this.rail
    }
  }
}
</script>