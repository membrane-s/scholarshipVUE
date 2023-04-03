<template>
    <div>
      <el-row>
        <el-col :span="11">
          <el-table
            :data="sourceData"
            height="300"
            border
            @selection-change="handleSourceSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            ></el-table-column>
            <el-table-column
              v-for="(col, index) in columns"
              :key="index"
              :label="col.label"
              :prop="col.prop"
            ></el-table-column>
          </el-table>
        </el-col>
  
        <el-col :span="2" class="transfer-buttons">
          <el-button
            type="primary"
            icon="el-icon-arrow-right"
            @click="addToTarget"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            @click="removeFromTarget"
          ></el-button>
        </el-col>
  
        <el-col :span="11">
          <el-table
            :data="targetData"
            height="300"
            border
            @selection-change="handleTargetSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            ></el-table-column>
            <el-table-column
              v-for="(col, index) in columns"
              :key="index"
              :label="col.label"
              :prop="col.prop"
            ></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      columns: Array,
      sourceData: Array,
      targetData: Array,
    },
    name: "ConditionTransfer",
    data() {
      return {
        sourceSelectedRows: [],
        targetSelectedRows: [],
      };
    },
    methods: {
      handleSourceSelectionChange(selection) {
        this.sourceSelectedRows = selection;
      },
      handleTargetSelectionChange(selection) {
        this.targetSelectedRows = selection;
      },
      addToTarget() {
        this.targetData.push(...this.sourceSelectedRows);
        this.sourceData = this.sourceData.filter(
          (row) => !this.sourceSelectedRows.includes(row)
        );
        this.sourceSelectedRows = [];
      },
      removeFromTarget() {
        this.sourceData.push(...this.targetSelectedRows);
        this.targetData = this.targetData.filter(
          (row) => !this.targetSelectedRows.includes(row)
        );
        this.targetSelectedRows = [];
      },
    },
  };
  </script>
  
  <style scoped>
  .transfer-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  </style>