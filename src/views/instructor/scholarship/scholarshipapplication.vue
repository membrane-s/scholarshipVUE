<template>
    <div class="app-container">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="奖金名称" prop="scholarshipName">
              <el-input
                v-model="queryParams.scholarshipName"
                placeholder="请输入奖学金名称"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="奖金金额" prop="amount">
              <el-input
                v-model="queryParams.amount"
                placeholder="请输入奖学金金额"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10"  class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
      
          <el-table v-loading="loading" :data="scholarshipList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="奖学金名称" align="center" prop="scholarshipName" />
            <el-table-column label="奖学金金额" align="center" prop="amount" />
            <el-table-column label="奖金类型" align="center">
              <template v-slot="scope">
                <el-tooltip :content="scope.row.types.map(type => type.scholarshipTypeName).join(', ')" hide-when-empty>
                  <span v-if="scope.row.types.length === 1">{{ scope.row.types[0].scholarshipTypeName }}</span>
                  <span v-else>触碰查看</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="scholarshipapplicaiton(scope.row)"
                  v-hasPermi="['instructor:condition:slistCondition']"
                >申请</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="specialscholarshipapplicaiton(scope.row)"
                  v-hasPermi="['instructor:condition:slistCondition']"
                >特殊申请</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />


      <!-- 奖金申请框-->
      <el-dialog title="申请奖学金" :visible.sync="open"  append-to-body>
          <el-row>
            <!-- 左侧表单，展示学生对应的条件 -->   
              <el-table :data="alldata" :border="false" style="width: 100%">
                <el-table-column prop="conditionId" label="ID" align="center" width="100" :class-name="getClass"></el-table-column>
                <el-table-column prop="condition" label="申请条件" align="center" :class-name="getClass"/>
                <el-table-column prop="adjunct" label="申请附件" align="center" :class-name="getClass"/>
              </el-table>
              <el-button type="primary" @click="handleSubmit">申请</el-button>
              <el-button @click="handleClose">取消</el-button>
          </el-row>
      </el-dialog>
      
    </div>
  </template>
  
  <script>
  import { slistScholarship, getScholarship } from "@/api/instructor/scholarship";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { slistCondition} from "@/api/instructor/condition";
  import { addApplication} from "@/api/instructor/application";

  
  export default {
    name: "applicationScholarship",
    components: { Treeselect },
    data() {
      return {
        no_approve: [],
        alldata: [],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 奖学金信息表格数据
        scholarshipList: [],
        //申请的奖学金
        selectedScholarship: [],
        // 弹出层标题
        title: "",
        //是否特殊申请
        special:undefined,
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          scholarshipName: null,
          scholarshipId: null,
          amount: null,
          createTime: null,
          modifyTime: null
        },
        // 表单参数
        form: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 对未填写行进行处理 */
      getClass(row) {
        if(this.no_approve.some(item => item.conditionId === row.conditionId)){
          return 'gray-row';
        }
        return '';
      },
      /** 申请 */
      handleSubmit(row) {
        if (this.special === 1) {
              this.$prompt('请填写特殊申请原因', '提示', {
              confirmButtonText: '',
              cancelButtonText: '',
              inputPattern: /\S/,
              inpurErrorMessage: '请填写特殊申请原因'
            }).then(({ value }) => {
              const params = {};
              params.scholarshipId = row.scholarshipId;
              params.conditionContent = this.alldata;
              params.special = this.special;
              params.specialReason = value; // 存储申请原因
              this.submitApplication(params);
            });
        } else {
            const params = {};
            params.scholarshipId = row.scholarshipId;
            params.conditionContent = this.alldata;
            params.special = this.special;
            this.submitApplication(params);
        }
      },
      async submitApplication(params) {
        try {
          await addApplication(params);
          this.open = false;
          this.title = '申请奖金';
        } catch (error) {
          console.error(error);
        }
      },

      /** 取消 */
      handleClose() {
        this.open = false;
      },
      /** 查询奖学金信息列表 */
      getList() {
        this.loading = true;
        slistScholarship(this.queryParams).then(response => {
          this.scholarshipList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 奖学金申请 */
      scholarshipapplicaiton(row) {
        this.selectedScholarship = row;
        slistCondition(row.scholarshipId).then(response => {
          this.alldata = response.alldata;
          this.no_approve = response.no_approve;
        });
        this.title = "奖学金申请";
        this.special = 0;
        if(this.alldata.length !== 0) this.open = true;
        else this.open = false;
      },
      /** 奖学金特殊申请 */
      specialscholarshipapplicaiton(row) {
        this.selectedScholarship = row;
        slistCondition(row.scholarshipId).then(response => {
          this.alldata = response.alldata;
          this.no_approve = response.no_approve;
        });
        this.special = 1;
        this.title = "奖学金特殊申请";
        if(this.alldata.length !== 0) this.open = true;
        else this.open = false;
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 表单重置
      reset() {
        this.form = {
          scholarshipId: undefined,
          typeIds: [],
          createtorId: undefined,
          scholarshipName: undefined,
          amount: undefined,
          deptId: undefined,
          conditionContent: undefined,
          createTime: undefined,
          modifier: undefined,
          modifyTime: undefined,
          deptCheckStrictly: false,
        };
        this.resetForm("form");
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.scholarshipId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      mounted() {
        getScholarship(scholarshipId).then();
      }
    },
  };
  </script>
<style>
  .gray-row {
    background-color: #f5f5f5;
    color: #c0c4cc;
  }

</style>
  