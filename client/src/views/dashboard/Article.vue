<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue";

const message = inject("message");
const axios = inject("axios");
const dialog = inject("dialog")

const addArticle = reactive({
  categoryId: null,
  title: "",
  content: "",
});

const updateArticle = reactive({
  id: null,
  categoryId: null,
  title: "",
  content: "",
});

onMounted(() => {
  loadBlog();
  loadCategory();
});

const blogListInfo = ref([]);
const loadBlog = async () => {
  let res = await axios.get("/blog/search");
  blogListInfo.value = res.data.data.rows;
};
const loadBlogDetail = async (id) => {
  let res = await axios.get(`/blog/detail?id=${id}`);

  updateArticle.id = res.data.rows[0].id;
  updateArticle.title = res.data.rows[0].title;
  updateArticle.categoryId = res.data.rows[0].category_id;
  updateArticle.content = res.data.rows[0].content;
};

const categoryList = ref([]);
const loadCategory = async () => {
  let res = await axios.get("/category/list");
  if (res.data.code == 200) {
    categoryList.value = res.data.rows.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }
};

const add = async () => {
  let res = await axios.post("/blog/_token/add", addArticle);
  if (res.data.code == 200) {
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
};

const tabIndex = ref("list");

const changeTab = (tabName) => {
  tabIndex.value = tabName;
};

const toUpdate = (blog) => {
  tabIndex.value = "update";
  loadBlogDetail(blog.id);
};

const toDelete = (blog) => {
  dialog.warning({
    title: "警告",
    content: "确定删除？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      deleteBlog(blog.id);
    },
  });
};

const deleteBlog = async (id) => {
  let res = await axios.delete(`/blog/_token/delete?id=${id}`);
  if (res.data.code == 200) {
    loadBlog()
    message.success("删除成功!");
  } else {
    message.error(`删除失败!${res.data.msg}`);
  }
};

const updateFinish = async () => {
  let res = await axios.put("/blog/_token/update", updateArticle);
  console.log(res, "res");
  if (res.data.code == 200) {
    // Object.assign(updateArticle, {
    //   id: null,
    //   categoryId: null,
    //   title: "",
    //   content: "",
    // });
    Object.keys(updateArticle).forEach((key) => {
      updateArticle[key] = "";
    });

    tabIndex.value = "list";
    loadBlog();
    message.success("修改成功!");
  } else {
    message.error(`修改失败!${res.data.msg}`);
  }
};
</script>

<template>
  <n-tabs :value="tabIndex" type="line" animated @update:value="changeTab">
    <n-tab-pane name="list" tab="文章列表">
      <div v-for="blog in blogListInfo" style="margin-bottom: 15px">
        <n-card>
          <h3>{{ blog.title }}</h3>
          {{ blog.content }}
          <template #footer>
            <n-space align="center">
              <div>发布时间：{{ blog.create_time }}</div>
              <n-button @click="toUpdate(blog)">修改</n-button>
              <n-button @click="toDelete(blog)">删除</n-button>
            </n-space>
          </template>
        </n-card>
      </div>
    </n-tab-pane>
    <n-tab-pane name="add" tab="添加文章">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="addArticle.title" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="addArticle.categoryId"
            :options="categoryList"
          />
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="addArticle.content" />
        </n-form-item>
        <n-form-item>
          <n-button @click="add">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="update" tab="修改文章">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="updateArticle.title" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="updateArticle.categoryId"
            :options="categoryList"
          />
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="updateArticle.content" />
        </n-form-item>
        <n-form-item>
          <n-button @click="updateFinish">修改</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
  <!-- <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="删除"
    content="是否确认删除?"
    positive-text="确认"
    negative-text="返回"
    @positive-click="deleteBlog()"
  /> -->
</template>
  
<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>

<style lang="scss" scoped></style>