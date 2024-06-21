<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
import { ref,defineProps,defineEmits } from "vue";
const props = defineProps({
  modelValue: String,
});

const emits = defineEmits(['update:modelValues'])
</script>

<style lang="scss" scoped>
.body {
  height: 100vh;
  width: 100vw;
}
</style>