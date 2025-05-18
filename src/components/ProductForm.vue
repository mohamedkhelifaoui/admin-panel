<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" max-width="600px">
    <v-card>
      <v-card-title>{{ isEdit ? 'Edit Product' : 'Add Product' }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="save">
          <v-text-field
            v-model="localForm.title"
            label="Title"
            required
          ></v-text-field>
          <v-textarea
            v-model="localForm.description"
            label="Description"
            required
          ></v-textarea>
          <v-text-field
            v-model="localForm.price"
            label="Price"
            type="number"
            required
          ></v-text-field>
          <v-select
            v-model="localForm.categoryId"
            :items="categories"
            label="Category"
            required
          ></v-select>
          <v-text-field
            v-model="localForm.image"
            label="Image URL"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="updateModelValue(false)">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const localForm = ref({ ...props.form });

watch(() => props.form, (newForm) => {
  localForm.value = { ...newForm };
}, { deep: true });

const updateModelValue = (value) => {
  emit('update:modelValue', value);
};

const save = () => {
  emit('save', localForm.value);
};
</script>