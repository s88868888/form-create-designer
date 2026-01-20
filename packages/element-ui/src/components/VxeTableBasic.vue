<template>
  <div class="_fc-vxe-table-preview" :class="tableClasses" :style="tableStyles">
    <!-- 表头 -->
    <div v-if="showHeader" class="_fc-vxe-table-header">
      <div
        v-for="(col, index) in tableColumns"
        :key="`header-${col.field}-${index}`"
        class="_fc-vxe-table-cell"
        :class="getCellClasses(col)"
        :style="getCellStyles(col, 'header')"
        :title="getHeaderTitle(col)"
      >
        <span class="_fc-vxe-table-cell-content">{{ col.title }}</span>
        <i v-if="col.sortable" class="_fc-vxe-table-sort-icon">⇅</i>
        <i v-if="col.filters && col.filters.length" class="_fc-vxe-table-filter-icon">▼</i>
      </div>
    </div>

    <!-- 表体 -->
    <div class="_fc-vxe-table-body" :style="bodyStyles">
      <template v-if="displayData.length > 0">
        <div
          v-for="(row, rowIndex) in displayData"
          :key="`row-${rowIndex}`"
          class="_fc-vxe-table-row"
          :class="getRowClasses(rowIndex)"
        >
          <div
            v-for="(col, colIndex) in tableColumns"
            :key="`cell-${rowIndex}-${col.field}-${colIndex}`"
            class="_fc-vxe-table-cell"
            :class="getCellClasses(col)"
            :style="getCellStyles(col, 'body')"
            :title="getCellTitle(row, col)"
          >
            <span class="_fc-vxe-table-cell-content">
              {{ formatCellValue(row[col.field]) }}
            </span>
          </div>
        </div>
      </template>
      
      <!-- 空数据 -->
      <div v-else class="_fc-vxe-table-empty">
        <span>{{ emptyText || '暂无数据' }}</span>
      </div>
    </div>

    <!-- 加载遮罩 -->
    <div v-if="loading" class="_fc-vxe-table-loading">
      <div class="_fc-vxe-table-loading-spinner"></div>
      <span>加载中...</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FcVxeTable',
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
      type: [Boolean, String],
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
    showFooter: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: [Number, String],
      default: undefined
    },
    maxHeight: {
      type: [Number, String],
      default: undefined
    },
    align: {
      type: String,
      default: 'left'
    },
    headerAlign: {
      type: String,
      default: undefined
    },
    showOverflow: {
      type: [Boolean, String],
      default: 'tooltip'
    },
    showHeaderOverflow: {
      type: [Boolean, String],
      default: 'tooltip'
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    highlightHoverRow: {
      type: Boolean,
      default: true
    },
    emptyText: {
      type: String,
      default: ''
    },
    resizable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // 表格数据
    const tableData = computed(() => {
      return props.modelValue && props.modelValue.length > 0 
        ? props.modelValue 
        : props.data || []
    })

    // 显示的数据（限制行数以提高性能）
    const displayData = computed(() => {
      const data = tableData.value
      return data.slice(0, 50) // 最多显示50行
    })

    // 表格列配置
    const tableColumns = computed(() => {
      if (!props.columns || props.columns.length === 0) {
        return []
      }
      return props.columns.map(col => ({
        type: col.type,
        field: col.field || col.value,
        title: col.title || col.label,
        width: col.width,
        minWidth: col.minWidth,
        maxWidth: col.maxWidth,
        fixed: col.fixed,
        align: col.align || props.align,
        headerAlign: col.headerAlign || props.headerAlign,
        sortable: col.sortable || false,
        filters: col.filters,
        visible: col.visible !== false,
        ...col
      }))
    })

    // 表格样式类
    const tableClasses = computed(() => {
      return {
        'is-border': props.border === true || props.border === 'full',
        'is-stripe': props.stripe,
        'is-loading': props.loading
      }
    })

    // 表格样式
    const tableStyles = computed(() => {
      const styles = {}
      if (props.height) {
        styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
      }
      if (props.maxHeight) {
        styles.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
      }
      return styles
    })

    // 表体样式
    const bodyStyles = computed(() => {
      const styles = {}
      if (props.height || props.maxHeight) {
        styles.overflowY = 'auto'
      }
      return styles
    })

    // 获取行样式类
    const getRowClasses = (rowIndex) => {
      return {
        'is-stripe-row': props.stripe && rowIndex % 2 === 1,
        'is-hover': props.highlightHoverRow
      }
    }

    // 获取单元格样式类
    const getCellClasses = (col) => {
      return {
        'is-fixed-left': col.fixed === 'left',
        'is-fixed-right': col.fixed === 'right',
        'is-sortable': col.sortable,
        'is-filterable': col.filters && col.filters.length > 0
      }
    }

    // 获取单元格样式
    const getCellStyles = (col, type) => {
      const styles = {}
      
      // 宽度
      if (col.width) {
        styles.width = typeof col.width === 'number' ? `${col.width}px` : col.width
        styles.flexShrink = 0
      } else if (col.minWidth) {
        styles.minWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth
      }
      
      // 对齐方式
      if (type === 'header') {
        styles.textAlign = col.headerAlign || props.headerAlign || col.align || props.align
      } else {
        styles.textAlign = col.align || props.align
      }
      
      // 溢出处理
      const overflow = type === 'header' ? 
        (col.showHeaderOverflow !== undefined ? col.showHeaderOverflow : props.showHeaderOverflow) :
        (col.showOverflow !== undefined ? col.showOverflow : props.showOverflow)
      
      if (overflow && overflow !== false) {
        styles.overflow = 'hidden'
        styles.textOverflow = 'ellipsis'
        styles.whiteSpace = 'nowrap'
      }
      
      return styles
    }

    // 格式化单元格值
    const formatCellValue = (value) => {
      if (value === null || value === undefined) {
        return '-'
      }
      return String(value)
    }

    // 获取表头 title 属性
    const getHeaderTitle = (col) => {
      const overflow = col.showHeaderOverflow !== undefined ? col.showHeaderOverflow : props.showHeaderOverflow
      if (overflow === 'title' || overflow === 'tooltip') {
        return col.title
      }
      return undefined
    }

    // 获取单元格 title 属性
    const getCellTitle = (row, col) => {
      const overflow = col.showOverflow !== undefined ? col.showOverflow : props.showOverflow
      if (overflow === 'title' || overflow === 'tooltip') {
        return formatCellValue(row[col.field])
      }
      return undefined
    }

    return {
      tableData,
      displayData,
      tableColumns,
      tableClasses,
      tableStyles,
      bodyStyles,
      getRowClasses,
      getCellClasses,
      getCellStyles,
      formatCellValue,
      getHeaderTitle,
      getCellTitle
    }
  }
}
</script>

<style scoped>
._fc-vxe-table-preview {
  position: relative;
  width: 100%;
  background: #fff;
  font-size: 14px;
  border-radius: 4px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

._fc-vxe-table-preview.is-border {
  border: 1px solid #e8eaec;
}

/* 表头 */
._fc-vxe-table-header {
  display: flex;
  background: #f8f8f9;
  font-weight: 500;
  color: #515a6e;
  border-bottom: 1px solid #e8eaec;
}

._fc-vxe-table-preview.is-border ._fc-vxe-table-header {
  border-bottom: 1px solid #e8eaec;
}

/* 表体 */
._fc-vxe-table-body {
  position: relative;
  min-height: 100px;
}

/* 单元格 */
._fc-vxe-table-cell {
  position: relative;
  flex: 1;
  padding: 12px 10px;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

._fc-vxe-table-preview.is-border ._fc-vxe-table-cell {
  border-right: 1px solid #e8eaec;
}

._fc-vxe-table-cell:last-child {
  border-right: none;
}

._fc-vxe-table-cell-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 排序图标 */
._fc-vxe-table-sort-icon {
  margin-left: 4px;
  font-size: 12px;
  color: #c5c8ce;
  font-style: normal;
}

._fc-vxe-table-cell.is-sortable:hover ._fc-vxe-table-sort-icon {
  color: #515a6e;
}

/* 筛选图标 */
._fc-vxe-table-filter-icon {
  margin-left: 4px;
  font-size: 10px;
  color: #c5c8ce;
  font-style: normal;
}

._fc-vxe-table-cell.is-filterable:hover ._fc-vxe-table-filter-icon {
  color: #515a6e;
}

/* 固定列 */
._fc-vxe-table-cell.is-fixed-left,
._fc-vxe-table-cell.is-fixed-right {
  position: sticky;
  background: inherit;
  z-index: 1;
}

._fc-vxe-table-cell.is-fixed-left {
  left: 0;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

._fc-vxe-table-cell.is-fixed-right {
  right: 0;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
}

/* 行 */
._fc-vxe-table-row {
  display: flex;
  color: #515a6e;
  transition: background-color 0.2s;
  border-bottom: 1px solid #e8eaec;
}

._fc-vxe-table-row:last-child {
  border-bottom: none;
}

._fc-vxe-table-row.is-hover:hover {
  background-color: #ebf7ff;
}

._fc-vxe-table-row.is-stripe-row {
  background: #fafafa;
}

._fc-vxe-table-row.is-stripe-row.is-hover:hover {
  background: #ebf7ff;
}

/* 空数据 */
._fc-vxe-table-empty {
  padding: 60px 0;
  text-align: center;
  color: #c5c8ce;
  font-size: 14px;
}

/* 加载遮罩 */
._fc-vxe-table-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

._fc-vxe-table-loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e8eaec;
  border-top-color: #2d8cf0;
  border-radius: 50%;
  animation: vxe-table-spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes vxe-table-spin {
  to {
    transform: rotate(360deg);
  }
}

._fc-vxe-table-loading span {
  color: #515a6e;
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 768px) {
  ._fc-vxe-table-cell {
    padding: 8px 6px;
    font-size: 12px;
  }
}
</style>
