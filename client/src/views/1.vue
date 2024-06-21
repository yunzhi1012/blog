<template>
    <div class="border-wrapper" style="
        overflow-x: auto;
        overflow-y: auto;
        padding: 0 15px;
        padding-top: 5px;
        height: 100%;
      ">
      <el-row style="height: 40px; line-height: 40px">
        <div class="card_header">
          <el-col :span="5">
            <div style="display: flex">
              <el-input v-model="search" style="width: 400px" placeholder="请输入内容" size="mini"
                onkeyup="this.value=this.value.replace(/(^\s*)|(\s*$)/g,'')" @input="searchInput" />
              <el-select ref="country_select" v-model.trim="searchForm.role_id" filterable clearable size="mini"
                placeholder="所属组" style="margin: 0 10px; width: 400px" @change="searchInput">
                <el-option v-for="(item, index) in roleData" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </el-col>
          <el-col :span="16">
            <div>
              <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addUser">添加用户</el-button>
              <el-button type="primary" size="mini" icon="el-icon-refresh" @click="resetSelectRow">重置</el-button>
            </div>
          </el-col>
        </div>
      </el-row>
      <el-row>
        <el-table :height="tableH" style="width: 100%;overflow: auto;"  :cell-style="{ height: '48px', padding: '5px 0' }"
          :header-cell-style="{ background: 'rgb(236 234 234)' }" :data="userTable" :border="true" tooltip-effect="dark"
          @selection-change="selectChange">
          <el-table-column label="序号" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名称" align="center" />
          <el-table-column prop="nickname" label="用户昵称" align="center" />
  
          <!-- <el-table-column
              prop="user_group_id"
              label="所属组"
              align="center"
            /> -->
          <el-table-column label="所属组" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.user_group_id == 1">默认组</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="电子邮箱" align="center" />
          <el-table-column prop="is_active" label="是否激活" align="center">
            <template slot-scope="scope">
              <!-- <el-switch v-model="scope.row.is_active" disabled /> -->
              <div v-if="scope.row.is_active">
                <img src="@/assets/img/yes.png" style="width: 24px; height: 24px;" />
              </div>
              <div v-else>
                <img src="@/assets/img/no.png" style="width: 24px; height: 24px;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="last_login_time" label="最后登录时间" align="center" />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="edit_column(scope.row)">
                编辑
              </el-button>
              <el-button type="text" @click="delete_column(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- <el-row> -->
        <div style="text-align: center; padding: 10px 0;position: absolute;bottom: 0;left: 50%;transform: translate(-50%,0);">
          <el-pagination :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="pageTotal" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      <!-- </el-row> -->
      <!-- 创建/修改 用户 弹出框 -->
      <el-dialog title="用户" :visible.sync="show_dialog"  :close-on-click-modal="false" :close-on-press-escape="false"
        :append-to-body="true" style="height: 100%;" top="8vh" width="40%" destroy-on-close @closed="handleCloseclose">
        <div class="business_dialog_style">
          <el-form ref="user_from" :model="user_from" label-width="115px" :rules="rules">
            <el-form-item label="用户名称:" :required="true">
              <el-input v-model="user_from.username" :disabled="isdisabled" />
            </el-form-item>
            <el-form-item label="用户昵称：" :required="true">
              <el-input v-model="user_from.nickname" />
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="user_from.email" />
            </el-form-item>
            <el-form-item label="电话号码：" prop="phone">
              <el-input v-model="user_from.phone" />
            </el-form-item>
            <el-form-item label="密码" prop="pass" :required="true" :disabled="isdisabled">
              <el-input type="password" v-model="user_from.password" autocomplete="off" show-password
                :disabled="isdisabled"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass" :required="true" :disabled="isdisabled">
              <el-input type="password" v-model="user_from.checkPass" autocomplete="off" show-password
                :disabled="isdisabled"></el-input>
            </el-form-item>
            <el-form-item label="所属组：" :required="true">
              <el-select v-model="user_from.user_group_id" style="width: 100%" placeholder="请选择"
                @change="getSelect($event)">
                <el-option v-for="item in roleData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否激活：" prop="is_active">
              <el-switch v-model="user_from.is_active" />
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button v-if="flag == 1" type="primary" @click="save_user_info(user_from)">确定</el-button>
          <el-button v-if="flag == 2" type="primary" @click="update_user_info">确定修改</el-button>
          <el-button @click="show_dialog = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import {
    UserInfo,
    addUserInfo,
    changeUserInfo,
    deleteUserInfo,
    userGroupInfo,
  } from "@/api/system";
  export default {
    name: "UserInfo",
    data() {
      // var validatePass = (rule, value, callback) => {
      //     if (value === '') {
      //       callback(new Error('请输入密码'));
      //     } else {
      //       if (this.user_from.checkPass !== '') {
      //         this.$refs.user_from.validateField('checkPass');
      //       }
      //       callback();
      //     }
      //   };
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.user_from.pass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        tableH:600,
        selectid: "",
        flag: 1,
        stateData: "",
        pageTotal: null,
        search: "",
        searchForm: {
          role_id: null,
        },
        roleNickname: [
          {
            id: 1,
            nickname: "用户1",
          },
        ],
  
        idList: "",
        userTable: [],
        show_dialog: false,
        currentPage: 1,
        pageSize: 20,
        user_from: {
          // checkPass: "",
          // pass: "",
          // // newPassword:"",
          // // confirmPassword:"",
          // username: "",
          // nickname: "",
          // email: "",
          // phone: "",
          // user_code: "",
          // role_id: "",
          is_active: true,
          user_group_id: 1,
        },
        rules: {
          // pass: [
          //   { validator: validatePass, trigger: 'blur' }
          // ],
          checkPass: [{ validator: validatePass2, trigger: "blur" }],
        },
        roleData: [],
        userId: 0,
        editData: [],
        isdisabled: false,
        // 获取的总数据
        ticket: [],
      };
    },
    computed: {
      // groupFit(id) {
      //   let groupName = ""
      //   this.roleData.forEach((item, index) => {
      //     if (item.id == id) {
      //       groupName = item.name
      //     }
      //   })
      //   return groupName
      // }
    },
    created(){
      var wh = window.innerHeight - 120;
      this.tableH = wh - 100;
    },
    mounted() {
      // if (location.href.indexOf("#reloaded") == -1) {
      //   location.href = location.href + "#reloaded";
      //   location.reload();
      // }
  
      this.UserData();
      this.getGroupData();
    },
    methods: {
      // 初始数据
      UserData() {
        UserInfo({
          page_number: (this.currentPage - 1) * this.pageSize,
          page_size: this.pageSize,
        }).then((res) => {
          console.log(res);
          if (res.code == 0) {
            // this.ticket = res.data.rows;
            console.log(this.ticket);
            this.userTable = res.data.rows;
            // this.userTable = res.data;
            this.pageTotal = res.data.total;
            // this.getPageInfo();
          }
        });
      },
      getGroupData() {
        userGroupInfo().then((res) => {
          console.log(res);
          console.log(res.data.rows);
          if (res.code == 0) {
            this.roleData = res.data.rows;
          }
        });
      },
      // 删除用户数据
      delete_column(data) {
        this.$confirm('确认删除？')
          .then(_ => {
            deleteUserInfo({ id: data.id }).then((res) => {
              console.log(res);
              if (res.code == 0) {
                this.UserData();
              }
            });
          })
          .catch(_ => { });
  
      },
  
      getSelect(data) {
        this.selectid = data;
      },
      selectChange() { },
      // 搜索
      searchInput() { },
      // 重置
      resetSelectRow() {
        this.search = "";
        this.searchForm.role_id = "";
      },
      // 添加按钮
      addUser() {
        this.show_dialog = true;
        this.isdisabled = false;
        this.flag = 1;
        // this.user_from.nickname = "";
        // this.user_from.email = "";
        // this.user_from.phone = "";
        // this.user_from.user_code = "";
        // this.user_from = {}
        // this.$set(this.user_from, 'user_group_id', this.roleData[0].name)
      },
      // 编辑按钮
      edit_column(data) {
        console.log(data);
        this.show_dialog = true;
        this.isdisabled = false;
        this.flag = 2;
        this.editData = data;
        console.log(data, "data");
        this.user_from = {};
        this.$set(this.user_from, "username", data.username);
        this.$set(this.user_from, "nickname", data.nickname);
        this.$set(this.user_from, "email", data.email);
        this.$set(this.user_from, "phone", data.phone);
        this.$set(this.user_from, "user_code", data.user_code);
        this.$set(this.user_from, "pass", data.password);
        this.$set(this.user_from, "checkPass", data.password);
        this.$set(this.user_from, "is_active", data.is_active);
        let selectval = "";
  
        console.log(data.user_group_id);
        // 获得用户的群组明
        this.roleData.forEach((item) => {
          if (item.id == data.user_group_id) {
            selectval = item.name;
          }
        });
        console.log(selectval);
        this.$set(this.user_from, "user_group_id", data.user_group_id);
        this.userId = data.id;
      },
      // 添加用户数据
      addUserData() {
        console.log(111);
  
        // let addData = {
        //   username: this.user_from.username,
        //   nickname: this.user_from.nickname,
        //   email: this.user_from.email,
        //   phone: this.user_from.phone,
        //   password: this.user_from.pass,
        //   is_active: this.user_from.is_active,
        //   user_group_id: this.selectid,
        // };
        // console.log(addData);
        addUserInfo(this.user_from).then((res) => {
          // console.log(res);
          if (res.code == 0) {
            this.UserData();
            this.show_dialog = false;
          }
        });
      },
      // 修改用户数据
      editUserData() {
        let upData = {
          id: this.userId,
          nickname: this.user_from.nickname,
          email: this.user_from.email,
          phone: this.user_from.phone,
          username: this.user_from.username,
          password: this.user_from.pass,
          is_active: this.user_from.is_active,
          user_group_id: this.selectid,
        };
        console.log(upData);
        // changeUserInfo(upData).then((res) => {
        //   console.log(res);
        //   if (res.code == 0) {
        //     this.UserData();
        //     this.show_dialog = false;
        //   }
        // });
        changeUserInfo({ id: this.userId, ...this.user_from }).then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.UserData();
            this.show_dialog = false;
          }
        });
      },
      handleCloseclose() {
        this.user_from = {};
        this.user_from.user_group_id = 1;
        this.user_from.is_active = true;
      },
      // getPageInfo() {
      //   this.userTable = [];
      //   for (
      //     let i = (this.currentPage - 1) * this.pageSize;
      //     i < this.pageTotal;
      //     i++
      //   ) {
      //     this.userTable.push(this.ticket[i]);
      //     if (this.userTable.length === this.pageSize) break;
      //   }
      // },
      handleSizeChange(size) {
        console.log(size);
        this.pageSize = size;
        this.UserData();
        // this.pageSize = size;
        // //数据重新分页
        // this.getPageInfo();
      },
      handleCurrentChange(pageNumber) {
        this.currentPage = pageNumber;
        this.UserData();
        // this.currentPage = pageNumber;
        // //数据重新分页
        // this.getPageInfo();
      },
      save_user_info(data) {
        // console.log(this.user_from);
        // this.addUserData();
        addUserInfo(this.user_from).then((res) => {
          if (res.code == 0) {
            this.UserData();
            this.show_dialog = false;
            this.$message.success(res.msg);
          }
        });
      },
      update_user_info() {
        this.editUserData();
      },
    },
  };
  </script>
  <style scoped>
  .card_footer {
    padding: 15px 0;
    text-align: center;
    /* position: absolute;
    left: 34%;
    bottom: 2%; */
  }
  </style>
  