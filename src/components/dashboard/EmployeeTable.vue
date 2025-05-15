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
        <!-- Employment Date Status -->
        <template v-slot:item.employmentDate="{ item }">
        {{ formatEmploymentStatus(item.employmentDate) }}
      </template>

      <!-- Termination Date Status -->
      <template v-slot:item.terminationDate="{ item }">
        {{ formatTerminationStatus(item.terminationDate) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <div>
          <v-btn-toggle rounded="xl" variant="outlined" divided>
             <!-- View Profile button -->
  <v-btn>
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-icon
          size="small"
          @click="viewProfile(item)"
          color="primary"
          v-bind="props"
        >
          mdi-eye
        </v-icon>
      </template>
      View Profile
    </v-tooltip>
  </v-btn>
        <!-- Clickable edit icon wrapped in a button -->
            <v-btn>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">            
                    <v-icon class="me-2" size="small" @click="editEmployee(item)" color="#452624" v-bind="props">
                      mdi-pencil
                    </v-icon>
                </template>
                 Edit {{ employeeStore.dialogTitle }}
               </v-tooltip>
              </v-btn>
         <!-- Clickable delete icon wrapped in a button -->

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
    <v-row>
        <v-co>
            <v-spacer>
            </v-spacer>
            <v-btn
    color="grey"
    @click="employeeStore.openDialog"
    rounded
    class="mt-8"
    elevation="15"
    style="position: fixed; bottom: 20px; right: 20px; z-index: 10;"
    >
    <v-icon class="me-2" color="#ffffff">mdi-account-plus</v-icon>
    <v-tooltip activator="parent" location="top">
        Add New {{ employeeStore.dialogTitle }}
    </v-tooltip>
    </v-btn>
        </v-co>
    </v-row>


 
  <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="employeeStore.dialogDeleteVisible" max-width="600px" min-height="100px">
      <v-card >
        <v-card-title class="text-h5 " >Are you sure you want to delete this {{employeeStore.dialogTitle}}?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="outlined" @click="employeeStore.closeDeleteDialog">Cancel</v-btn>
          <v-btn color="#452624" variant="outlined" @click="employeeStore.deleteEmployee">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
   
<!-- Add Dialog -->
    <v-dialog v-model="employeeStore.dialogVisible" max-width="700px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5"> Add {{ employeeStore.dialogTitle }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form" v-model="isValidAdd">
          <v-container>
            <v-row >
              <v-col v-for="field in employeeStore.formFields" :key="field.key" :cols="field.cols" :md="field.md" class="pa-1">
                <v-text-field
                  v-if="field.fieldName == 'input'"
                  v-model="employeeStore.editedItem[field.key]"
                  :label="field.label"
                  :prepend-inner-icon="field.prependIcon"
                 :type="field.type"
                 :rules="field.rules"
                 variant="outlined"
                  density="compact"              
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="outlined" @click="employeeStore.closeDialog">Cancel</v-btn>
          <v-btn color="#452624" variant="outlined" @click="employeeStore.addEmployee" :disabled="!isValidAdd">Save</v-btn>
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
      isEditValid: false,
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
    // view employeeProfile
viewProfile(emp) {
    console.log("id",emp.id),
    this.$router.push({ name: 'EmployeeProfile', params: { id: emp.id } }),
    this.employeeStore.isEditing=false
  },
// editEmployee in EmployeeProfile
editEmployee(emp) {
  this.employeeStore.editedItem = { ...emp }; // Copy item data into editedItem
  this.employeeStore.editedIndex = this.employeeStore.items.indexOf(emp); // Store the index
  console.log("Edited Item",this.employeeStore.editedItem )
  this.employeeStore.isEditing=true, 
  this.$router.push({
    name:"EmployeeProfileEdit",
    params:{id:emp.id},
  })

  
},

// employment status
formatEmploymentStatus(dateStr) {
      const today = new Date();
      const date = new Date(dateStr);
      return date > today ? 'Employed Soon' : 'Currently Employed';
    },
    // termination status
    formatTerminationStatus(dateStr) {
      const today = new Date();
      const date = new Date(dateStr);
      return date > today ? 'To Be Terminated' : 'Terminated';
    },

  }
};
</script>

<style scoped>
.v-data-table {
  overflow-y: hidden !important;
}
</style>