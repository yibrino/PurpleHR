<template>
  <div>
    <v-data-table :headers="employeeStore.columns" :items="employeeStore.items" :search="search" items-per-page="6">
      
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title><strong>{{ employeeStore.dialogTitle }}s </strong></v-toolbar-title>
          <!-- vertical divided b/n title and search box -->
          <v-divider class="mx-4" inset vertical></v-divider>
          <!-- input box -->
          <v-text-field
            v-model="search"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search"
            variant="outlined"
            hide-details
            single-line
            rounded
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <div>
          <v-btn-toggle rounded="xl" variant="outlined" divided>
            <v-btn>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">            
                    <v-icon class="me-2" size="small" @click="editItem(item)" color="#452624" v-bind="props">
                      mdi-pencil
                    </v-icon>
                </template>
                 Edit {{ employeeStore.dialogTitle }}
               </v-tooltip>
              </v-btn>
            <v-btn>
              <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">            
                  
                <v-icon size="small" @click="employeeStore.openDeleteDialog(item)" color="error" v-bind="props">
                  mdi-delete
                </v-icon>
              </template>
                  Delete {{ employeeStore.dialogTitle }}
            </v-tooltip>
            </v-btn>
          </v-btn-toggle>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn color="#452624" @click="initialize" loading>Reload</v-btn>
      </template>
    </v-data-table>

 
  <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="employeeStore.dialogDeleteVisible" max-width="600px" min-height="100px">
      <v-card >
        <v-card-title class="text-h5 " >Are you sure you want to delete this {{employeeStore.dialogTitle}}?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="outlined" @click="employeeStore.closeDeleteDialog">Cancel</v-btn>
          <v-btn color="#452624" variant="outlined" @click="employeeStore.deleteItem">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
   

 
  </div>
  
</template>

<script>
import { useEmployeeStore } from '@/store/employeeStore';

export default {
  name: 'employee-table',
  data() {
    return {
      employeeStore: useEmployeeStore(),
      search: '',
      isValid: false,
      isValidAdd: false,
    };
  },
  mounted() {
  this.employeeStore.initializeItems(); 
},
  methods: {
    initialize() {
      this.employeeStore.initializeItems();
    },
    editItem(item) {
      this.employeeStore.editedItem = { ...item };
      this.employeeStore.openEditDialog();
    }
  }
};
</script>

<style scoped>
.v-data-table {
  overflow-y: hidden !important;
}
</style>