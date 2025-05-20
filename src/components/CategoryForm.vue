<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" max-width="600px">
    <v-card class="rounded-xl overflow-hidden">
      <!-- Toolbar -->
      <v-toolbar color="#2A3D54" dark flat>
        <v-toolbar-title>
          <v-icon start class="me-2">mdi-shape</v-icon>
          {{ isEdit ? 'Edit Category' : 'Add New Category' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="updateModelValue(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Form -->
      <v-card-text>
        <v-form @submit.prevent="save" class="pt-4">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="localForm.name"
                label="Category Name"
                prepend-inner-icon="mdi-format-title"
                variant="outlined"
                :rules="[required('name')]"
                required
                
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="localForm.image"
                label="Image URL"
                prepend-inner-icon="mdi-image"
                variant="outlined"
                :rules="[required('image')]"
              />
            </v-col>

            <v-col cols="12" class="text-center">
              <v-avatar size="100" style="cursor: pointer;" @click="imagePreviewDialog = true">
                <v-img :src="localForm.image" alt="Category Image">
                  <template #error>
                    <span class="text-subtitle-2 text-grey">No preview</span>
                  </template>
                </v-img>
              </v-avatar>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <!-- Actions -->
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="outlined" color="grey" @click="updateModelValue(false)">
          Cancel
        </v-btn>
        <v-btn color="#2A3D54" variant="flat" class="ml-2" style="color: white !important; background-color: #2A3D54 !important;"  @click="save">
          {{ isEdit ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="imagePreviewDialog" max-width="500">
  <v-card class="pa-4">
    <v-img
      :src="localForm.image"
      aspect-ratio="1"
      contain
      class="rounded"
    >
      <template #error>
        <div class="text-center text-grey text-subtitle-2">Image not available</div>
      </template>
    </v-img>
  </v-card>
</v-dialog>

</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  isEdit: { type: Boolean, default: false },
  form: { type: Object, required: true }
});

const required = (fieldName) => (v) => !!v || `You need to add ${fieldName}`;
const emit = defineEmits(['update:modelValue', 'save']);
const localForm = ref({ ...props.form });
const imagePreviewDialog = ref(false);

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

<style scoped>
.v-card-title {
  font-weight: 600;
}
</style>
