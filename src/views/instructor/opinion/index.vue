<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="审核人ID" prop="reviewerId">
        <el-input
          v-model="queryParams.reviewerId"
          placeholder="请输入审核人ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核日期" prop="reviewDate">
        <el-date-picker clearable
          v-model="queryParams.reviewDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择审核日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核意见" prop="opinion">
        <el-input
          v-model="queryParams.opinion"
          placeholder="请输入审核意见"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核结果" prop="reviewResult">
        <el-select v-model="queryParams.reviewResult" placeholder="请选择审核结果" clearable>
          <el-option
            v-for="dict in dict.type.application_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['instructor:opinion:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['instructor:opinion:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['instructor:opinion:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="opinionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请人" align="center" prop="userName" />
      <el-table-column label="申请奖金" align="center" prop="scholarShip" />
      <el-table-column label="审核人" align="center" prop="reviewerId" />
      <el-table-column label="审核日期" align="center" prop="reviewDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reviewDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" align="center" prop="opinion" />
      <el-table-column label="审核结果" align="center" prop="reviewResult">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.application_status" :value="scope.row.reviewResult"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['instructor:opinion:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['instructor:opinion:remove']"
          >删除</el-button>
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

    <!-- 添加或修改审核意见对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOpinion, getOpinion, delOpinion, addOpinion, updateOpinion } from "@/api/instructor/opinion";

export default {
  name: "Opinion",
  dicts: ['application_status'],
  data() {
    return {
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
      // 审核意见表格数据
      opinionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reviewerId: null,
        reviewDate: null,
        opinion: null,
        reviewResult: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        reviewerId: [
          { required: true, message: "审核人ID不能为空", trigger: "blur" }
        ],
        reviewDate: [
          { required: true, message: "审核日期不能为空", trigger: "blur" }
        ],
        opinion: [
          { required: true, message: "审核意见不能为空", trigger: "blur" }
        ],
        reviewResult: [
          { required: true, message: "审核结果不能为空", trigger: "change" }
        ],
        applicationId: [
          { required: true, message: "申请ID不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询审核意见列表 */
    getList() {
      this.loading = true;
      listOpinion(this.queryParams).then(response => {
        this.opinionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        reviewId: null,
        reviewerId: null,
        reviewDate: null,
        opinion: null,
        reviewResult: null,
        applicationId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.reviewId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加审核意见";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const reviewId = row.reviewId || this.ids
      getOpinion(reviewId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改审核意见";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.reviewId != null) {
            updateOpinion(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOpinion(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const reviewIds = row.reviewId || this.ids;
      this.$modal.confirm('是否确认删除审核意见编号为"' + reviewIds + '"的数据项？').then(function() {
        return delOpinion(reviewIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('instructor/opinion/export', {
        ...this.queryParams
      }, `opinion_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
