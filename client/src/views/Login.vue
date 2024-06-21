<script setup>
import { ref, reactive, inject, getCurrentInstance } from "vue";
import { AdminStore } from "../stores/AdminStore";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const axios = inject("axios");
const message = inject("message");
const adminStore = AdminStore();

const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: localStorage.getItem("password") || "",
  remeber: localStorage.getItem("remeber") == 1,
});

const startTime = ref('')
const endTime = ref('')
const timePick = ref['8:00','9:00','10:00','11:00','12:00','13:00','14:00']
/**验证表单规则 */
let rules = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" },
  ],
};

const login = async () => {
  let res = await axios.post("/admin/login", {
    account: admin.account,
    password: admin.password,
  });
  if (res.data.code == 200 && res.data?.data) {
    adminStore.id = res.data.data.id;
    adminStore.token = res.data.data.token;
    adminStore.account = res.data.data.account;
    if (admin.remeber) {
      localStorage.setItem("account", admin.account);
      localStorage.setItem("password", admin.password);
      localStorage.setItem("remeber", admin.remeber ? 1 : 0);
    }
    message.success("登陆成功!");
    router.push("/dashboard");
  } else {
    message.error("登陆失败!");
  }
};

const isClick = ref(true);

const chechk = () => {
  isClick.value = !isClick.value;
  console.log(isClick.value);
};
</script>

<template>
  <div class="login-panel">
    <p>{{ adminStore.num }}</p>
    <button @click="adminStore.addNum()">click</button>
    <div class="demo-time-range">
      <el-time-select
        v-model="startTime"
        style="width: 240px"
        :max-time="timePick[timePick.length-1]"
        class="mr-4"
        placeholder="Start time"
        start="08:30"
        step="00:15"
        end="18:30"
      />
      <el-time-select
        v-model="endTime"
        style="width: 240px"
        :max-time="timePick[timePick.length-1]"
        placeholder="End time"
        start="08:30"
        step="00:15"
        end="18:30"
      />
    </div>
    <input type="radio" :value="isClick" :checked="isClick" @click="chechk" />
    <n-card title="管理后台登录">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="admin.account" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="admin.password"
            type="password"
            placeholder="请输入密码"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:checked="admin.remeber" label="记住我" />
        <n-button @click="login">登录</n-button>
      </template>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>

<!-- 父组件 -->
<!-- <template>
  <div v-if="show">
    <Child1 v-model="abc"></Child1>
    <Child2 ></Child2>
  </div>
  <button @click="change">click</button>
  <p>abc in parent component: {{ abc }}</p>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
const Child1 = defineAsyncComponent(() =>
  import("./Chilrden.vue").then((module) => {
    module.default.name = "Child1";
    return module;
  })
);
const Child2 = defineAsyncComponent(() =>
  import("./Chilrden2.vue").then((module) => {
    module.default.name = "Child2";
    return module;
  })
);

const abc = ref("adsfa");
const show = ref(false);
function change() {
  show.value = !show.value;
}
</script> -->


<style lang="scss" scoped>
</style>