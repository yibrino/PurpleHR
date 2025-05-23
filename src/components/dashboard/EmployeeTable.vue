<template>
  <div>
    <v-data-table :headers="employeeStore.columns" :items="filteredEmployees" :search="search" items-per-page="6">
      
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
          <v-select
  v-model="selectedDepartment"
  :items="departments"
  label="Department"
  clearable
  class="mr-3"
  density="compact"
  variant="outlined"
  hide-details
></v-select>

<v-select
  v-model="selectedEmploymentStatus"
  :items="employmentStatusOptions"
  label="Employment"
  clearable
  class="mr-3"
  density="compact"
  variant="outlined"
  hide-details
></v-select>

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
  
    <div class="d-flex justify-end align-center my-4" style="gap: 10px;">
 

  <!-- Import Button -->
  <v-btn
    color="#452624"
    variant="outlined"
    accept=".csv, .json"

    @click="$refs.importInput.click()"
  >
    <v-icon start>mdi-upload</v-icon>
    Import
  </v-btn>

  <!-- Export Button -->
  <v-btn
    color="#452624"
    elevation="15"
    @click="exportEmployees"
  >
    <v-icon start color="white">mdi-download</v-icon>
    <span style="color: white;">Export</span>
  </v-btn>

  <!-- Hidden file input -->
  <input
    ref="importInput"
    type="file"
    @change="importEmployees"
    accept=".csv"
    style="display: none"
  />
   <!-- Add Employee -->
   <v-btn
    color="#452624"
    variant="outlined"
    @click="employeeStore.openDialog"
  >
    <v-icon start>mdi-account-plus</v-icon>
    <v-tooltip activator="parent" location="top">
      Add New {{ employeeStore.dialogTitle }}
    </v-tooltip>
  </v-btn>
</div>

   
 
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
      selectedDepartment: null,
      selectedEmploymentStatus: null,
      isEditValid: false,
      isValidAdd: false,
    };
  },
  computed: {
  departments() {
    const allDepartments = this.employeeStore.items.map(emp => emp.department);
    return [...new Set(allDepartments)].filter(Boolean); // remove duplicates and empty
  },
  employmentStatusOptions() {
    return ['Currently Employed', 'Employed Soon'];
  },
  
  filteredEmployees() {
    return this.employeeStore.items.filter((emp) => {
      const matchesSearch = Object.values(emp)
        .some(value => String(value).toLowerCase().includes(this.search.toLowerCase()));

      const matchesDepartment = this.selectedDepartment ? emp.department === this.selectedDepartment : true;

      const employmentStatus = this.formatEmploymentStatus(emp.employmentDate);
      const matchesEmployment = this.selectedEmploymentStatus ? employmentStatus === this.selectedEmploymentStatus : true;
      return matchesSearch && matchesDepartment && matchesEmployment;
    });
  }
  
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

exportEmployees() {
  // ensure store is initialized
  if (!this.employeeStore.items.length) {
    this.employeeStore.initializeItems();
  }

  const headers = this.employeeStore.columns.map(h => h.title);
  const keys = this.employeeStore.columns
    .filter(col => col.key !== 'actions')
    .map(col => col.key);
  console.log('Headers:', headers);
  console.log('Keys:   ', keys);
  console.log('Rows:   ', this.filteredEmployees);

  const csvRows = this.filteredEmployees.length
    ? this.filteredEmployees.map(emp =>
        keys.map(key =>
          `"${(emp[key] ?? '').toString().replace(/"/g, '""')}"`
        ).join(',')
      )
    : [];

  const csvContent = [ headers.join(','), ...csvRows ].join('\n');
  console.log('CSV content:\n', csvContent);

  if (!csvRows.length) {
    return this.$toast.warning('No employee data to export.');
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'employees.csv';
  link.click();
},

importEmployees(event) {
  const file = event.target.files[0];
  if (!file) return;

  const extension = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();

  reader.onload = e => {
    const content = e.target.result;

    if (extension === 'csv') {
      const [hdrLine, ...lines] = content.trim().split('\n');
      const headers = hdrLine.split(',').map(h => h.replace(/(^")|("$)/g, ''));
      const newRecords = lines.map(line => {
        const cols = line.match(/(".*?"|[^",\s]+)(?="|,|\s*$)/g);
        const obj = {};
        headers.forEach((h, i) => {
          obj[this.mapHeaderToKey(h)] = cols[i]?.replace(/^"|"$/g, '');
        });
        return obj;
      });

      this.employeeStore.items.push(...newRecords);
      alert('CSV imported successfully!');
    }

    else if (extension === 'json') {
      try {
        const jsonData = JSON.parse(content);
        if (Array.isArray(jsonData)) {
          this.employeeStore.items.push(...jsonData);
          alert('JSON imported successfully!');
        } else {
          alert('Invalid JSON format. Expected an array of records.');
        }
      } catch (err) {
        alert('Failed to parse JSON: ' + err.message);
      }
    }

    else {
      alert('Unsupported file type. Please upload a CSV or JSON file.');
    }
  };

  reader.readAsText(file);
  event.target.value = ''; // reset the file input
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