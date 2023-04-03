<template>
  <div class="app-container">

    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="奖学金名称" prop="scholarshipName">
            <el-input
              v-model="queryParams.scholarshipName"
              placeholder="请输入奖学金名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="奖学金金额" prop="amount">
            <el-input
              v-model="queryParams.amount"
              placeholder="请输入奖学金金额"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
    
          <el-form-item label="创建日期" prop="createTime">
            <el-date-picker clearable
              v-model="queryParams.createTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择创建日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="修改时间" prop="modifyTime">
            <el-date-picker clearable
              v-model="queryParams.modifyTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择修改时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10"  class="mb8">
          <el-col :span="1.5" >
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['instructor:scholarship:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['instructor:scholarship:edit']"
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
              v-hasPermi="['instructor:scholarship:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['instructor:scholarship:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
    
        <el-table v-loading="loading" :data="scholarshipList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="奖学金名称" align="center" prop="scholarshipName" />
          <el-table-column label="奖学金金额" align="center" prop="amount" />
          <el-table-column label="奖金所属的部门" align="center">
            <template v-slot="scope">
              <el-tooltip :content="scope.row.depts.map(dept => dept.deptName).join(', ')" hide-when-empty>
                <span v-if="scope.row.depts.length === 1">{{ scope.row.depts[0].deptName }}</span>
                <span v-else>触碰查看</span>
              </el-tooltip>
            </template>
          </el-table-column> 
          <el-table-column label="奖金类型" align="center">
            <template v-slot="scope">
              <el-tooltip :content="scope.row.types.map(type => type.scholarshipTypeName).join(', ')" hide-when-empty>
                <span v-if="scope.row.types.length === 1">{{ scope.row.types[0].scholarshipTypeName }}</span>
                <span v-else>触碰查看</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改日期" align="center" prop="modifyTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.modifyTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['instructor:scholarship:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['instructor:scholarship:remove']"
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
      </el-col>
    </el-row>

    <el-dialog title="选择申请条件" :visible.sync="showDialog">
      <el-table :data="conditionList" :key="tableKey" ref="Mytable">
        <el-table-column prop="conditionId"  label="ID" align="center" width="100"></el-table-column>
        <el-table-column prop="condition" label="申请条件详情" align="center" :formatter="formatDetails"></el-table-column>
        <el-table-column prop="bindCondition" align="center" label="绑定条件" width="100">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.bindCondition"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="weight" align="center" label="权重数值" width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.weight" size="mini"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="conditioncancle">取 消</el-button>
        <el-button type="primary" @click="submitConditions">保 存</el-button>
      </div>
      <pagination
      v-show="conditiontotal>0"
      :total="conditiontotal"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="showDiaLog"
    />
    </el-dialog>

    <!-- 添加或修改奖学金信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="奖金名称" prop="scholarshipName">
          <el-input v-model="form.scholarshipName" placeholder="请输入奖学金名称" />
        </el-form-item>
        <el-form-item label="奖金金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入奖学金金额" />
        </el-form-item>

        <el-form-item label="奖金类型">
          <el-select v-model="form.typeIds" multiple placeholder="请选择奖金类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.scholarshipTypeId"
              :label="item.scholarshipTypeName"
              :value="item.scholarshipTypeId"
              :disabled="item.status == 1"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="归属部门" v-show=true>
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            ref="dept"
            node-key="id"
            :show-count="true"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showDiaLog(form.scholarshipName)">申请条件</el-button>
        </el-form-item>
      </el-form>
      

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listScholarship, getScholarship, delScholarship, addScholarship, updateScholarship, savescholarshipcondition } from "@/api/instructor/scholarship";
import { deptTreeSelect } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { listCondition} from "@/api/instructor/condition";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
  name: "Scholarship",
  components: { Treeselect },
  data() {
    return {
      tableKey: 0,
      showDialog: false,
      conditionList:[],
      selectedCondtions: [],
      conditionoptions:[],
      conditionloading: true,
      conditiontotal: 0,
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
      //奖金类型
      typeOptions: [],
      // 奖学金信息表格数据
      scholarshipList: [],
      // 部门树选项
      deptOptions: undefined,
      // 弹出层标题
      title: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 部门名称
      deptName: undefined,
      // 是否显示弹出层
      open: false,
      conditionopen: false,
      deptExpand: false,
      deptNodeAll: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        scholarshipName: null,
        amount: null,
        deptId: undefined,
        createTime: null,
        modifyTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createtorId: [
          { required: true, message: "创建用户ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getDeptTree();
    this.getList();
  },
  methods: {
    conditioncancle(){
      this.showDialog = false;
    },
    showDiaLog(scholarshipName){
      this.showDialog = true;
      if(scholarshipName != undefined){//修改
        this.conditionList.forEach((condition, index) => {
          const selectedItem = this.selectedCondtions.find(item => item.conditionId === condition.conditionId);
          if(selectedItem){
            this.conditionList.splice(index,1,selectedItem);
          }
        });
        this.conditionloading = false;
        this.conditionreset();
      }else{
        this.conditionloading = false;
      }
    },
    formatDetails(row, column, cellValue) {
      const text = row[column.property];
      if(text.length <= 500){
        return text;
      }else{
        const shortText = text.slice(0,10);
        const fullText = text;
        return <span title={fullText} data-condition={fullText}>{shortText}...</span>
      }
    },
    /** 查询奖学金信息列表 */
    getList() {
      this.loading = true;
      listScholarship(this.queryParams).then(response => {
        this.scholarshipList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },//申请条件按钮
    submitConditions() {      
      this.selectedCondtions = this.conditionList.filter((item) => item.bindCondition);
      this.showDialog = false;
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.deptExpand = false,
      this.deptNodeAll = false,
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
    },//申请条件表单重置
    conditionreset() {
      // 重置表格数据
      this.conditionList = this.conditionoptions.map(item => Object.assign({}, item));
      this.tableKey++;
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
      this.ids = selection.map(item => item.scholarshipId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      listCondition(this.queryParams).then(response => {
        this.conditionList = response.rows;
        this.conditiontotal = response.total;
      });
      getScholarship().then(response => {
        this.open = true;
        this.typeOptions = response.types;
        if(this.$refs.dept){
          this.$refs.dept.setCheckedKeys([]);
        }
        this.title = "添加奖学金信息";
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true: false;
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const scholarshipId = row.scholarshipId || this.ids;
      listCondition(this.queryParams).then(response => {
        this.conditionList = response.rows;
        this.conditiontotal = response.total;
      });
      getScholarship(scholarshipId).then(response => {
        this.form = response.data;
        this.open = true;
        this.typeOptions = response.types;
        this.$set(this.form, "typeIds", response.typeIds);
        this.title = "修改奖学金信息";
        this.selectedCondtions = response.data.conditions;
        const temp = this.conditionList;
        this.conditionoptions = temp;
        this.$nextTick(() => {
            this.$refs.dept.setCheckedKeys(response.checkedKeys);
        });
      });

    },
    mounted() {
      getScholarship(scholarshipId).then(response => {
      this.handleUpdate(response);
      });
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.scholarshipId != undefined) {
            this.form.deptIds = this.getDeptAllCheckedKeys();
            this.form.conditions = this.selectedCondtions;
            updateScholarship(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.deptIds = this.getDeptAllCheckedKeys();
            this.form.conditions = this.selectedCondtions;
            addScholarship(this.form).then(response => {
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
      const scholarshipIds = row.scholarshipId || this.ids;
      this.$modal.confirm('是否确认删除奖学金信息编号为"' + scholarshipIds + '"的数据项？').then(function() {
        return delScholarship(scholarshipIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('instructor/scholarship/export', {
        ...this.queryParams
      }, `scholarship_${new Date().getTime()}.xlsx`)
    }
  },
};
</script>
