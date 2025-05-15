import { defineStore } from "pinia";
import employeesData from "@/assets/employees.json";
import { nextTick } from "vue"; // nextTick from Vue

export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    dialogTitle: "Employee",
    componentName: "employee",
    items: [],
    // Columns of the grid
    columns: [
      { title: "Full Name", key: "fullName" },
      { title: "Occupation", key: "occupation" },
      { title: "Department", key: "department" },
      { title: "Employment Date", key: "employmentDate" },
      { title: "Termination Date", key: "terminationDate" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    // all fields
    formFields: [
      {
        key: "fullName",
        label: "Full Name",
        fieldName: "input",
        cols: 6,
        md: 6,
        prependIcon: "mdi-account",
        rules: [(v) => !!v || "Required"],
      },
      {
        key: "occupation",
        label: "Occupation",
        fieldName: "input",
        cols: 6,
        md: 6,
        prependIcon: "mdi-briefcase",
        rules: [(v) => !!v || "Required"],
      },
      {
        key: "department",
        label: "Department",
        fieldName: "input",
        cols: 6,
        md: 6,
        prependIcon: "mdi-office-building",
        rules: [(v) => !!v || "Required"],
      },
      {
        key: "employmentDate",
        label: "Employment Date",
        fieldName: "input",
        type: "date",
        cols: 6,
        md: 6,
        prependIcon: "mdi-calendar-start",
        rules: [(v) => !!v || "Required"],
      },
      {
        key: "terminationDate",
        label: "Termination Date",
        fieldName: "input",
        type: "date",
        cols: 6,
        md: 6,
        prependIcon: "mdi-calendar-end",
        rules: [(v) => !!v || "Required"],
      },
    ],
    dialogVisible: false,
    dialogDeleteVisible: false,
    editedIndex: -1,
    editedItem: {
      id: null,
      fullName: "",
      occupation: "",
      department: "",
      employmentDate: "",
      terminationDate: "",
    },
    defaultItem: {
      id: null,
      fullName: "",
      occupation: "",
      department: "",
      employmentDate: "",
      terminationDate: "",
    },
    isEditing: false,
  }),

  actions: {
    initializeItems() {
      if (this.items.length === 0) {
        this.items = [...employeesData];
      }
    },
    // Open the dialog
    openDialog() {
      this.dialogVisible = true;
    },
    // Open the DeleteDialog
    openDeleteDialog(item) {
      this.editedItem = { ...item };
      this.dialogDeleteVisible = true;
    },
    // close the Dialog
    closeDialog() {
      this.dialogVisible = false;
      nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },
    // close the DeleteDialog
    closeDeleteDialog() {
      this.dialogDeleteVisible = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    // Update an employee
    updateEmployee(updatedEmp) {
      const idx = this.items.findIndex(
        (e) => Number(e.id) === Number(updatedEmp.id)
      );
      if (idx > -1) {
        this.items.splice(idx, 1, { ...updatedEmp });
      }
      this.isEditing = false;
    },
    // Add an Employee
    addEmployee() {
      const maxId = Math.max(...this.items.map((item) => item.id), 0);
      this.items.push({ ...this.editedItem, id: maxId + 1 });
      this.closeDialog();
    },

    // Delete an employee
    deleteEmployee() {
      this.items = this.items.filter((item) => item.id !== this.editedItem.id);
      this.closeDeleteDialog();
    },
  },
});
