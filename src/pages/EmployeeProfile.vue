<template>
  <v-container fluid class="pa-0 fill-height">
    <!-- HEADER SHEET  -->
    <v-sheet height="30%" class="purple darken-3 d-flex flex-column align-center justify-end pa-6">
      <v-avatar
        v-if="!employeeStore.isEditing"
        :size="rail ? 40 : 60"
        class="text-h6 font-weight-bold"
        color="red-darken-4"
      >
        {{ userInitials }}
      </v-avatar>
    </v-sheet>

    <!-- MAIN CONTENT CARD centered -->
    <v-container fluid class="fill-height d-flex align-center justify-center mt-n16 px-0">
      <v-row align="center" justify="center" class="w-100">
        <v-col cols="12" md="10" lg="8" xl="6" class="px-2">
          <v-card elevation="5" class="rounded-lg" style="min-height: 70vh;">
            
            <!-- WRAP ALL EDITABLE FIELDS IN SINGLE FORM -->
            <v-form ref="form" v-model="isEditValid" lazy-validation>
              <v-card-text class="py-6">
                <!-- FULL NAME -->
                <div class="mb-6">
                  <template v-if="employeeStore.isEditing">
                    <v-text-field
                      v-model="employeeStore.editedItem.fullName"
                      label="Full Name"
                      variant="outlined"
                      density="comfortable"
                      class="w-100"
                      :rules="[v => !!v || 'Full name is required']"
                    />
                  </template>
                  <div v-else class="text-h4 font-weight-bold text-center">
                    {{ profile.fullName }}
                  </div>
                </div>

                <v-divider class="my-4" />

                <!-- OTHER FIELDS -->
                <v-row>
                  <v-col cols="12" md="6">
                    <template v-if="employeeStore.isEditing">
                      <v-text-field
                        v-model="employeeStore.editedItem.occupation"
                        label="Occupation"
                        variant="outlined"
                        density="compact"
                        :rules="[v => !!v || 'Occupation is required']"
                      />
                    </template>
                    <v-chip v-else class="ma-2 purple lighten-4">
                      <v-icon left>mdi-briefcase</v-icon>
                      {{ profile.occupation }}
                    </v-chip>
                  </v-col>

                  <v-col cols="12" md="6">
                    <template v-if="employeeStore.isEditing">
                      <v-text-field
                        v-model="employeeStore.editedItem.department"
                        label="Department"
                        variant="outlined"
                        density="compact"
                        :rules="[v => !!v || 'Department is required']"
                      />
                    </template>
                    <v-chip v-else class="ma-2 deep-purple lighten-3 white--text">
                      <v-icon left>mdi-domain</v-icon>
                      {{ profile.department }}
                    </v-chip>
                  </v-col>
                </v-row>

                <v-divider class="my-4" />

                <v-row>
                  <!-- Employment Date -->
                  <v-col cols="12" md="6">
                    <template v-if="employeeStore.isEditing">
                      <v-text-field
                        v-model="employeeStore.editedItem.employmentDate"
                        type="date"
                        label="Employment Date"
                        variant="outlined"
                        density="compact"
                        :rules="[v => !!v || 'Employment date is required']"
                      />
                    </template>
                    <div v-else>
                      <div class="text-caption">Employment Date</div>
                      <div class="font-weight-bold">{{ formatDate(profile.employmentDate) }}</div>
                      <v-chip :color="employmentStatusColor" small class="mt-1">
                        {{ employmentStatus }}
                      </v-chip>
                    </div>
                  </v-col>
                  <!-- Termination Date -->
                  <v-col cols="12" md="6">
                    <template v-if="employeeStore.isEditing">
                      <v-text-field
                        v-model="employeeStore.editedItem.terminationDate"
                        type="date"
                        label="Termination Date"
                        variant="outlined"
                        density="compact"
                        :rules="[v => !!v || 'Termination date is required']"
                      />
                    </template>
                    <div v-else>
                      <div class="text-caption">Termination Date</div>
                      <div class="font-weight-bold">{{ formatDate(profile.terminationDate) }}</div>
                      <v-chip :color="terminationStatusColor" small class="mt-1">
                        {{ terminationStatus }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- ACTION BUTTONS -->
              <v-card-actions class="justify-end pa-4">
                <template v-if="!employeeStore.isEditing">
                  <v-btn color="secondary" @click="goHome" prepend-icon="mdi-arrow-left">
                    Back to Home
                  </v-btn>
                </template>

                <template v-else>
                  <v-btn color="red-darken-1" variant="outlined" @click="goHome">
                    Cancel
                  </v-btn>
                  <v-btn
                    color="#452624"
                    variant="outlined"
                    @click="saveItem"
                    :disabled="!isEditValid || !isChanged"
                    class="ml-2"
                  >
                    Update
                  </v-btn>
                </template>
              </v-card-actions>

            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { parseISO, isAfter, format } from 'date-fns';
import { useRoute, useRouter } from 'vue-router';
import { useEmployeeStore } from '@/store/employeeStore';

const route = useRoute();
const router = useRouter();
const employeeStore = useEmployeeStore();

const id = route.params.id;
const profile = computed(() =>
  employeeStore.items.find(emp => emp.id == id) || {}
);
const isEditValid = ref(false);
const form = ref(null);

const isChanged = computed(() =>
  JSON.stringify(employeeStore.editedItem) !== JSON.stringify(profile.value)
);

// initials
const userInitials = computed(() => {
  const name = employeeStore.editedItem.fullName || profile.value.fullName || '';
  return name
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
});

// employement Status
const employmentStatus = computed(() => {
  const d = parseISO(employeeStore.editedItem.employmentDate || profile.value.employmentDate || '');
  return isAfter(d, new Date()) ? 'Employed soon' : 'Currently employed';
});
// EmployementStatus Color
const employmentStatusColor = computed(() =>
  employmentStatus.value === 'Employed soon' ? 'green' : 'purple'
);

// termination status
const terminationStatus = computed(() => {
  const d = parseISO(employeeStore.editedItem.terminationDate || profile.value.terminationDate || '');
  return isAfter(d, new Date()) ? 'To be terminated' : 'Terminated';
});
//termination color
const terminationStatusColor = computed(() =>
  terminationStatus.value === 'Terminated' ? 'red' : 'deep-purple'
);

const formatDate = d =>
  d ? format(parseISO(d), 'MMM dd, yyyy') : '—';
// return to homepage
const goHome = () => router.push('/');
// save and employee
const saveItem = async () => {
  const valid = await form.value.validate();
  if (!valid) return;
  employeeStore.updateEmployee(employeeStore.editedItem);
  router.push('/');
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
.mt-n16 {
  margin-top: -96px;
}
.mb-6 {
  margin-bottom: 24px;
}
.px-2 {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
