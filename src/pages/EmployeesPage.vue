<!-- src/pages/index.vue -->
<template>
  <div class="white-background">
    <EmployeeTable />
  </div>
</template>

<script>
import EmployeeTable from '@/components/dashboard/EmployeeTable.vue';
export default {
  components: {
    EmployeeTable
  }
};
</script>


