<template>
  <div class="_fd-vxe-table" :class="{'has-border': border, 'is-stripe': stripe}">
    <div class="_fd-vxe-table-header" v-if="showHeader !== false">
      <div class="_fd-vxe-table-cell" 
           v-for="(col, idx) in displayColumns" 
           :key="idx"
           :style="{textAlign: col.align || headerAlign || 'left', width: col.width ? col.width + 'px' : 'auto', minWidth: col.minWidth ? col.minWidth + 'px' : 'auto'}">
        {{ col.title || col.label || '列' + (idx + 1) }}
      </div>
    </div>
    <div class="_fd-vxe-table-body">
      <div class="_fd-vxe-table-row" v-for="(row, ridx) in displayData" :key="ridx">
        <div class="_fd-vxe-table-cell" 
             v-for="(col, cidx) in displayColumns" 
             :key="cidx"
             :style="{textAlign: col.align || align || 'left', width: col.width ? col.width + 'px' : 'auto', minWidth: col.minWidth ? col.minWidth + 'px' : 'auto'}">
          {{ row[col.field || col.value] || '-' }}
        </div>
      </div>
      <div class="_fd-vxe-table-empty" v-if="!displayData || displayData.length === 0">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'VxeTableView',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    border: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    height: [String, Number],
    align: {
      type: String,
      default: 'left'
    },
    headerAlign: {
      type: String,
      default: 'left'
    }
  },
  computed: {
    displayColumns() {
      // 确保返回普通数组，而不是响应式代理
      const cols = this.columns;
      if (cols && Array.isArray(cols) && cols.length > 0) {
        return JSON.parse(JSON.stringify(cols));
      }
      // 默认列配置
      return [
        {title: '姓名', field: 'name', width: 120},
        {title: '年龄', field: 'age', width: 100},
        {title: '地址', field: 'address', minWidth: 200}
      ];
    },
    displayData() {
      // 优先使用 modelValue（form-create 的 v-model 绑定）
      const mv = this.modelValue;
      if (mv && Array.isArray(mv) && mv.length > 0) {
        return JSON.parse(JSON.stringify(mv.slice(0, 5))); // 最多显示5行
      }
      // 其次使用 data 属性
      const d = this.data;
      if (d && Array.isArray(d) && d.length > 0) {
        return JSON.parse(JSON.stringify(d.slice(0, 5))); // 最多显示5行
      }
      // 如果没有数据，显示示例数据（预览时使用）
      return [
        {name: '张三', age: 28, address: '北京市朝阳区'},
        {name: '李四', age: 32, address: '上海市浦东新区'},
        {name: '王五', age: 25, address: '广州市天河区'}
      ];
    }
  },
  mounted() {
    // 调试日志已移除
  }
});
</script>

<style>
._fd-vxe-table {
  min-height: 150px;
  width: 100%;
  background: #fff;
  font-size: 14px;
  border-radius: 4px;
  overflow: hidden;
}

._fd-vxe-table.has-border {
  border: 1px solid #EBEEF5;
}

._fd-vxe-table-header {
  display: flex;
  background: #f5f7fa;
  font-weight: 500;
  color: #606266;
}

._fd-vxe-table.has-border ._fd-vxe-table-header {
  border-bottom: 1px solid #EBEEF5;
}

._fd-vxe-table-cell {
  flex: 1;
  padding: 12px 10px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

._fd-vxe-table.has-border ._fd-vxe-table-cell {
  border-right: 1px solid #EBEEF5;
}

._fd-vxe-table-cell:last-child {
  border-right: none;
}

._fd-vxe-table-body {
  min-height: 100px;
}

._fd-vxe-table-row {
  display: flex;
  color: #606266;
  transition: background-color 0.2s;
}

._fd-vxe-table-row:hover {
  background-color: #f5f7fa;
}

._fd-vxe-table.has-border ._fd-vxe-table-row {
  border-bottom: 1px solid #EBEEF5;
}

._fd-vxe-table.is-stripe ._fd-vxe-table-row:nth-child(even) {
  background: #fafafa;
}

._fd-vxe-table.is-stripe ._fd-vxe-table-row:nth-child(even):hover {
  background: #f0f2f5;
}

._fd-vxe-table-row:last-child {
  border-bottom: none;
}

._fd-vxe-table-empty {
  padding: 40px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>
