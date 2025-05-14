import { defineStore } from "pinia";
import { onBeforeMount } from "vue";
import employeesData from "@/assets/employees.json";
import { nextTick } from "vue"; // Import nextTick from Vue

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
    // Open the dialog
    openDialog() {
      this.dialogVisible = true;
    },
    // Open the EditDialog
    openEditDialog() {
      this.dialogEditVisible = true;
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
    // close the EditDialog
    closeEditDialog() {
      this.dialogEditVisible = false;
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
    // save an Item
    saveItem() {
      if (this.editedIndex > -1) {
        // Update the existing item
        this.items[this.editedIndex] = { ...this.editedItem }; // Directly replace the item
        console.log("Updated item:", this.items[this.editedIndex]); // Log the updated item to check if it's working
      } else {
        // Add a new item
        const maxId = this.items.length
          ? Math.max(...this.items.map((item) => item.id))
          : 0;
        const newItem = { ...this.editedItem, id: maxId + 1 };
        this.items.push(newItem); // Push the new item into the array
        console.log("Added new item:", newItem);
      }

      // Close the dialogs after saving the item
      this.closeDialog();
      this.closeEditDialog();
    },
    // Delete an item
    deleteItem() {
      this.items = this.items.filter((item) => item.id !== this.editedItem.id);
      this.closeDeleteDialog();
    },
  },
});
