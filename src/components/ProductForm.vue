<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" max-width="700px">
    <v-card class="rounded-xl overflow-hidden">
      <!-- Toolbar -->
      <v-toolbar color="#2A3D54" dark flat>
        <v-toolbar-title>
          <v-icon start class="me-2">mdi-package-variant</v-icon>
          {{ isEdit ? 'Product Details' : 'Add New Product' }}
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
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="localForm.title"
                label="Title"
                prepend-inner-icon="mdi-format-title"
                variant="outlined"
                :rules="[required('title')]"
                required
                :disabled="!isAdmin"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="localForm.price"
                label="Price"
                type="number"
                prepend-inner-icon="mdi-currency-usd"
                variant="outlined"
                :rules="[required('price')]"
                required
                :disabled="!isAdmin"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="localForm.description"
                label="Description"
                prepend-inner-icon="mdi-text"
                variant="outlined"
                auto-grow
                :rules="[required('description')]"
                required
                :disabled="!isAdmin"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="localForm.categoryId"
                :items="categories"
                item-title="title"
                item-value="value"
                label="Category"
                prepend-inner-icon="mdi-shape"
                variant="outlined"
                :rules="[required('category')]"
                required
                :disabled="isEdit"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="localForm.image"
                label="Image URL"
                prepend-inner-icon="mdi-image"
                variant="outlined"
                :rules="[required('url')]"
                :disabled="!isAdmin"
              />
            </v-col>

            <v-col cols="12" class="text-center">
            <v-avatar size="100" style="cursor: pointer;" @click="imagePreviewDialog = true">
              <v-img :src="localForm.image" alt="Product Image">
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
      <v-card-actions class="pa-4" v-if="isAdmin">
        <v-spacer />
        <v-btn variant="outlined" color="grey" @click="updateModelValue(false)">
          Cancel
        </v-btn>
        <v-btn color="#2A3D54" variant="flat" class="ml-2" style="color: white !important; background-color: #2A3D54 !important;" @click="save">
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
import { ref, watch, computed } from 'vue';
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isAdmin = computed(() => user.value?.role === 'admin')
const required = (fieldName) => (v) => !!v || `You need to add ${fieldName}`;



const props = defineProps({
  modelValue: { type: Boolean, required: true },
  isEdit: { type: Boolean, default: false },
  form: { type: Object, required: true },
  categories: { type: Array, default: () => [] }
});

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

const openImage = () => {
  if (localForm.value.image) {
    window.open(localForm.value.image, '_blank');
  }
};
</script>
