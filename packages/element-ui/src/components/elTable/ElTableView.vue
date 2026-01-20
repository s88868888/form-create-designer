<template>
  <div class="_fd-el-table" :class="tableClasses">
    <!-- 表头 -->
    <div v-if="showHeader" class="_fd-el-table-header">
      <div
        v-for="(col, index) in displayColumns"
        :key="`header-${index}`"
        class="_fd-el-table-cell"
        :style="getCellStyle(col)"
      >
        {{ col.label }}
      </div>
    </div>

    <!-- 表体 -->
    <div class="_fd-el-table-body" :style="bodyStyle">
      <template v-if="displayData.length > 0">
        <div
          v-for="(row, rowIndex) in displayData"
          :key="`row-${rowIndex}`"
          class="_fd-el-table-row"
          :class="getRowClass(rowIndex)"
        >
          <div
            v-for="(col, colIndex) in displayColumns"
            :key="`cell-${rowIndex}-${colIndex}`"
            class="_fd-el-table-cell"
            :style="getCellStyle(col)"
          >
            {{ formatValue(row[col.prop]) }}
          </div>
        </div>
      </template>
      
      <!-- 空数据 -->
      <div v-else class="_fd-el-table-empty">
        {{ emptyText || '暂无数据' }}
      </div>
      
      <!-- 合计行 -->
      <div v-if="showSummary && displayData.length > 0" class="_fd-el-table-footer">
        <div
          v-for="(col, index) in displayColumns"
          :key="`footer-${index}`"
          class="_fd-el-table-cell"
          :style="getCellStyle(col)"
        >
          {{ index === 0 ? (sumText || '合计') : '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ElTableView',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
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
    size: {
      type: String,
      default: 'default'
    },
    height: [String, Number],
    maxHeight: [String, Number],
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: {
      type: String,
      default: '合计'
    },
    fit: {
      type: Boolean,
      default: true
    },
    showOverflowTooltip: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const displayColumns = computed(() => {
      if (props.columns && props.columns.length > 0) {
        return props.columns;
      }
      return [
        { prop: 'name', label: '姓名', width: 120 },
        { prop: 'age', label: '年龄', width: 100 },
        { prop: 'address', label: '地址', minWidth: 200 }
      ];
    });

    const displayData = computed(() => {
      const mv = props.modelValue;
      if (mv && mv.length > 0) {
        return mv.slice(0, 5);
      }
      const d = props.data;
      if (d && d.length > 0) {
        return d.slice(0, 5);
      }
      return [
        { name: '张三', age: 28, address: '北京市朝阳区' },
        { name: '李四', age: 32, address: '上海市浦东新区' },
        { name: '王五', age: 25, address: '广州市天河区' }
      ];
    });

    const tableClasses = computed(() => ({
      'is-border': props.border,
      'is-stripe': props.stripe,
      [`el-table--${props.size}`]: props.size && props.size !== 'default'
    }));

    const bodyStyle = computed(() => {
      const style = {};
      if (props.height) {
        style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
        style.overflowY = 'auto';
      } else if (props.maxHeight) {
        style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
        style.overflowY = 'auto';
      }
      return style;
    });

    const getCellStyle = (col) => {
      const style = {};
      if (col.width) {
        style.width = typeof col.width === 'number' ? `${col.width}px` : col.width;
        style.flexShrink = 0;
      } else if (col.minWidth) {
        style.minWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth;
      }
      if (col.align) {
        style.textAlign = col.align;
      }
      return style;
    };

    const getRowClass = (index) => ({
      'is-stripe-row': props.stripe && index % 2 === 1
    });

    const formatValue = (value) => {
      if (value === null || value === undefined) {
        return '-';
      }
      return String(value);
    };

    return {
      displayColumns,
      displayData,
      tableClasses,
      bodyStyle,
      getCellStyle,
      getRowClass,
      formatValue
    };
  }
});
</script>

<style scoped>
._fd-el-table {
  width: 100%;
  background: #fff;
  font-size: 14px;
  color: #606266;
  border-radius: 4px;
  overflow: hidden;
}

._fd-el-table.is-border {
  border: 1px solid #EBEEF5;
}

._fd-el-table.el-table--small {
  font-size: 12px;
}

._fd-el-table.el-table--small ._fd-el-table-cell {
  padding: 8px 10px;
}

._fd-el-table.el-table--large ._fd-el-table-cell {
  padding: 16px 10px;
}

/* 表头 */
._fd-el-table-header {
  display: flex;
  background: #F5F7FA;
  font-weight: 500;
  color: #909399;
}

._fd-el-table.is-border ._fd-el-table-header {
  border-bottom: 1px solid #EBEEF5;
}

/* 表体 */
._fd-el-table-body {
  position: relative;
  min-height: 100px;
}

/* 单元格 */
._fd-el-table-cell {
  flex: 1;
  padding: 12px 10px;
  text-align: left;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

._fd-el-table.is-border ._fd-el-table-cell {
  border-right: 1px solid #EBEEF5;
}

._fd-el-table-cell:last-child {
  border-right: none;
}

/* 行 */
._fd-el-table-row {
  display: flex;
  transition: background-color 0.25s ease;
}

._fd-el-table.is-border ._fd-el-table-row {
  border-bottom: 1px solid #EBEEF5;
}

._fd-el-table-row:hover {
  background-color: #F5F7FA;
}

._fd-el-table-row.is-stripe-row {
  background: #FAFAFA;
}

._fd-el-table-row.is-stripe-row:hover {
  background: #F5F7FA;
}

/* 空数据 */
._fd-el-table-empty {
  padding: 40px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

/* 合计行 */
._fd-el-table-footer {
  display: flex;
  background: #F5F7FA;
  font-weight: 500;
  color: #606266;
  border-top: 1px solid #EBEEF5;
}
</style>
