<script setup>
import {
  ref,
  reactive,
  shallowRef,
  inject,
  onBeforeUnmount,
  defineEmits,
  defineProps,
  onMounted,
  nextTick,
  watch,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";

const server_url = inject("server_url");
const editorRef = shallowRef();
const toolbarConfig = {
  excludeKeys: ["uploadVideo"],
};
const mode = ref("default");
const editorConfig = { placeholder: "请输入..." };
editorConfig.MENU_CONF = {};
editorConfig.MENU_CONF["uploadImage"] = {
  base64LimitSize: 10 * 1024,
  server: `${server_url}/upload/rich_editor_upload`,
};
editorConfig.MENU_CONF["insertImage"] = {
  parseImageSrc: (src) => {
    if (src.indexOf("http") !== 0) {
      return `${server_url}${src}`;
    } else {
      return src;
    }
  },
};
const valueHtml = ref("");

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:model-value"]);
let initFinished = false;

onMounted(() => {
  // nextTick(() => {
  //   valueHtml.value = props.modelValue;
  //   initFinished = true;
  // });
});

watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue) {
      nextTick(() => {
        valueHtml.value = props.modelValue;
        initFinished = true;
      });
    }
  }
);

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  if (initFinished) {
    emit("update:model-value", valueHtml.value);
  }
};
</script>


<template>
  <div>
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>


<style lang="scss" scoped></style>