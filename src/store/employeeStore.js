import { defineStore } from "pinia";
import { onBeforeMount } from "vue";
import employeesData from "@/assets/employees.json";
export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    dialogTitle: "Employee",
    componentName: "employee",
    items: [],
    columns: [
      { title: "Full Name", key: "fullName" },
      { title: "Occupation", key: "occupation" },
      { title: "Department", key: "department" },
      { title: "Employment Date", key: "employmentDate" },
      { title: "Termination Date", key: "terminationDate" },
      { title: "Actions", key: "actions", sortable: false },
    ],
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
        fieldName: "autocomplete",
        cols: 6,
        md: 6,
        prependIcon: "mdi-office-building",
        items: ["AI and Computer Science", "Engineering", "HR"],
        rules: [],
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
        rules: [],
      },
    ],
    dialogVisible: false,
    dialogEditVisible: false,
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
  }),

  actions: {
    initializeItems() {
      this.items = [...employeesData]; // Use the imported JSON data
    },

    openDialog() {
      this.dialogVisible = true;
    },

    openEditDialog() {
      this.dialogEditVisible = true;
    },

    openDeleteDialog(item) {
      this.editedItem = { ...item };
      this.dialogDeleteVisible = true;
    },

    closeDialog() {
      this.dialogVisible = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeEditDialog() {
      this.dialogEditVisible = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDeleteDialog() {
      this.dialogDeleteVisible = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    saveItem() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        const newId = Math.max(...this.items.map((item) => item.id)) + 1;
        this.items.push({ ...this.editedItem, id: newId });
      }
      this.closeDialog();
      this.closeEditDialog();
    },

    deleteItem() {
      this.items = this.items.filter((item) => item.id !== this.editedItem.id);
      this.closeDeleteDialog();
    },
  },
});
