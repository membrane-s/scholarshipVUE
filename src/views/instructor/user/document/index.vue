<template>
    <div class="app-container">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card style="height: calc(100vh - 125px)">
            <div slot="header">
              <span>已填申请条件</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                icon="el-icon-refresh-right"
                @click="refreshCondition()"
              ></el-button>
            </div>
            <el-table
              v-loading="subLoading"
              :data="conditionContent"
              :height="tableHeight"
              highlight-current-row
              @row-click="handleConditionValue"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                width="60"
                type="index"
                prop="conditionId"
              ></el-table-column>
              <el-table-column
                label="申请条件内容"
                align="center"
                prop="condition"
                :show-overflow-tooltip="true"
              >
              </el-table-column>

            </el-table>
          </el-card>
        </el-col>
  


        <el-col :span="8">
          <el-card style="height: calc(100vh - 125px)">
            <div slot="header">
              <span>条件库</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                icon="el-icon-refresh-right"
                @click="refreshCondition()"
              ></el-button>
            </div>
            <el-table
              v-loading="subLoading"
              :data="unConditionContent"
              :height="tableHeight"
              highlight-current-row
              @row-click="handleConditionValue"
              style="width: 100%"
            >
            <el-table-column
                label="序号"
                width="60"
                type="index"
                prop="conditionId"
              ></el-table-column>
              <el-table-column
                label="申请条件内容"
                align="center"
                prop="condition"
                :show-overflow-tooltip="true"
              >
              </el-table-column>

              <el-table-column
                prop="tag"
                label="标签"
                width="100"
                :filters="[{ text: '必填', value: 1 }, { text: '非必填', value: 0 }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.isNecessity === 1 ? 'success' : 'primary'"
                    disable-transitions>{{scope.row.isNecessity === 1 ? "必填" : "非必填"}}</el-tag>
                </template>
              </el-table-column>

            </el-table>
          </el-card>
        </el-col>
  
        <el-col :span="8">
          <el-card :bordered="false" style="height: calc(100vh - 125px)">
            <div slot="header">
              <span>条件详情</span>
            </div>
            <el-form :model="ConditionForm">
              <el-row :gutter="32">
                <el-col :offset="1" :span="22">
                  <el-form-item label="条件编号:" prop="conditionId">
                    <el-input v-model="ConditionForm.conditionId" :readOnly="true" />
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="22">
                  <el-form-item label="条件内容:" prop="condition">
                    <el-input v-model="ConditionForm.condition" :readOnly="true" />
                  </el-form-item>
                </el-col>
                <el-col :offset="1" :span="22">
                  <el-form-item label="申请条件:" prop="cacheValue">
                    <el-input
                      v-model="ConditionForm.cacheValue"
                      type="textarea"
                      :rows="8"
                      :readOnly="true"
                    />
                  </el-form-item>
                </el-col>
                
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { listAllCondition, getCondition} from "@/api/instructor/condition";
  
  export default {
    name: "studentDocument",
    data() {
      return {
        conditionContent: [],
        unConditionContent: [],
        ConditionForm: {},
        loading: true,
        subLoading: false,
        tableHeight: window.innerHeight - 200
      };
    },
    created() {
      this.getConditions();
    },
    methods: {
      filterTag(value, row) {
        return row.isNecessity === value;
      },
      /** 查询缓存名称列表 */
      getConditions() {
        this.loading = true;
        listAllCondition().then(response => {
          this.conditionContent = response.data.conditionContent;
          this.unConditionContent = response.data.conditionContents;
          this.loading = false;
        });
      },
      /** 刷新缓存名称列表 */
      refreshCondition() {
        this.getConditions();
        this.$modal.msgSuccess("刷新列表成功");
      },
      /** 查询缓存内容详细 */
      handleConditionValue(row) {
        getCondition(row.conditionId).then(response => {
          this.ConditionForm = response.data;
        });
      },
    },
  };
  </script>
  