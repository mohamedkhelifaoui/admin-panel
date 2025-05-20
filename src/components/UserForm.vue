<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" max-width="600px">
    <v-card class="rounded-xl overflow-hidden">
      <!-- Toolbar -->
      <v-toolbar color="#2A3D54" dark flat>
        <v-toolbar-title>
          <v-icon start class="me-2">mdi-account</v-icon>
          {{ isEdit ? 'Edit User' : 'Add New User' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
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
                v-model="localForm.name"
                label="Full Name"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[required('name')]"
                required
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="localForm.email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="[required('email')]"
                required
                :error="emailError !== ''"
                :error-messages="emailError"
                :disabled="isEdit"

              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="localForm.password"
                label="Password"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                :rules="[required('password')]"
                :required="!isEdit"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="localForm.role"
                :items="['customer', 'admin']"
                label="Role"
                prepend-inner-icon="mdi-shield-account"
                variant="outlined"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="localForm.avatar"
                label="Avatar URL"
                prepend-inner-icon="mdi-image"
                variant="outlined"
                :rules="[required('avatar')]"
              />
            </v-col>

            <v-col cols="12" class="text-center">
              <v-avatar size="100" style="cursor: pointer;" @click="avatarPreviewDialog = true">
                <v-img :src="localForm.avatar" alt="Avatar">
                  <template v-slot:error>
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
        <v-btn color="#2A3D54" variant="flat" class="ml-2" style="color: white !important; background-color: #2A3D54 !important;" @click="save">
          {{ isEdit ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="avatarPreviewDialog" max-width="400">
  <v-card class="pa-4 text-center">
    <v-img
      :src="localForm.avatar"
      max-height="300"
      aspect-ratio="1"
      contain
      class="rounded"
    >
      <template #error>
        <div class="text-grey text-subtitle-2">Image not available</div>
      </template>
    </v-img>
  </v-card>
</v-dialog>

</template>

<script setup>
import { ref, watch } from 'vue';
import api from '../services/api';


const props = defineProps({
  modelValue: { type: Boolean, required: true },
  isEdit: { type: Boolean, default: false },
  form: { type: Object, required: true }
});

const required = (fieldName) => (v) => !!v || `You need to add ${fieldName}`;
const emit = defineEmits(['update:modelValue', 'save']);
const localForm = ref({ ...props.form });
const emailError = ref('');
const avatarPreviewDialog = ref(false);

watch(() => props.form, (newForm) => {
  localForm.value = { ...newForm };
  emailError.value = ''; 
}, { deep: true });

const updateModelValue = (value) => {
  emit('update:modelValue', value);
};

const save = async () => {
  emailError.value = '';

  if (!props.isEdit) {
    const isEmailUsed = await checkEmailExists(localForm.value.email);
    if (isEmailUsed) {
      emailError.value = 'This email is already in use.';
      return;
    }
  }
  const payload = { ...localForm.value };
  if (!props.isEdit) {
    delete payload.role;
  }

  emit('save', localForm.value);
};


const checkEmailExists = async (email, excludeUserId = null) => {
  try {
    const params = { email };
    if (excludeUserId) params.excludeUserId = excludeUserId;
    
    const response = await api.get('/users', { params: { email } });
    return response.data.some(user => user.email === email);
  } catch (err) {
    console.error('Email check failed', err);
    return false;
  }
};

</script>

<style scoped>
.v-card-title {
  font-weight: 600;
}
</style>
