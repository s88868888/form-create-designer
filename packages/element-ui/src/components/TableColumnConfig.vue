<template>
    <div class="_td-table-column-config">
        <el-table
            :data="value"
            border
            :size="size || 'small'"
            style="width: 100%">
            <!-- 标题列 -->
            <el-table-column :label="t('tableColumnConfig.title')" width="150">
                <template #default="scope">
                    <el-input
                        :size="size || 'small'"
                        :disabled="disabled"
                        v-model="scope.row.title"
                        :placeholder="t('tableColumnConfig.titlePlaceholder')"
                        @blur="onInput(scope.row)">
                    </el-input>
                </template>
            </el-table-column>

            <!-- 字段列 - 支持搜索和自定义添加 -->
            <el-table-column :label="t('tableColumnConfig.field')" width="200">
                <template #default="scope">
                    <el-select
                        :size="size || 'small'"
                        :disabled="disabled"
                        v-model="scope.row.field"
                        filterable
                        allow-create
                        default-first-option
                        :placeholder="t('tableColumnConfig.fieldPlaceholder')"
                        @change="onInput(scope.row)">
                        <el-option-group
                            v-for="group in fieldOptions"
                            :key="group.value"
                            :label="group.label">
                            <el-option
                                v-for="item in group.children"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">{{ item.label }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                        </el-option-group>
                    </el-select>
                </template>
            </el-table-column>

            <!-- 宽度列 -->
            <el-table-column :label="t('tableColumnConfig.width')" width="120">
                <template #default="scope">
                    <el-input
                        :size="size || 'small'"
                        :disabled="disabled"
                        v-model="scope.row.width"
                        :placeholder="t('tableColumnConfig.widthPlaceholder')"
                        @blur="onInput(scope.row)">
                        <template #append>px</template>
                    </el-input>
                </template>
            </el-table-column>

            <!-- 最小宽度列 -->
            <el-table-column :label="t('tableColumnConfig.minWidth')" width="120">
                <template #default="scope">
                    <el-input
                        :size="size || 'small'"
                        :disabled="disabled"
                        v-model="scope.row.minWidth"
                        :placeholder="t('tableColumnConfig.auto')"
                        @blur="onInput(scope.row)">
                        <template #append>px</template>
                    </el-input>
                </template>
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column width="50" align="center" fixed="right" v-if="!disabled">
                <template #default="scope">
                    <i class="fc-icon icon-delete" @click="del(scope.$index)"></i>
                </template>
            </el-table-column>
        </el-table>

        <div class="_td-table-column-config-handle">
            <el-button link type="primary" @click="add" v-if="!disabled">
                <i class="fc-icon icon-add"></i> {{ t('tableColumnConfig.add') }}
            </el-button>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import {copy} from '@form-create/utils/lib/extend';

export default defineComponent({
    name: 'TableColumnConfig',
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: {
            type: Array,
            default: () => []
        },
        // 表格类型: 'elTable' 或 'vxeTable'
        tableType: {
            type: String,
            default: 'elTable'
        },
        size: String,
        disabled: Boolean,
    },
    inject: ['designer'],
    watch: {
        modelValue: {
            handler() {
                this.value = this.tidyModelValue();
            },
            deep: true
        }
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        // 从设计器配置中获取字段列表
        fieldOptions() {
            const config = this.designer.setupState.config || {};
            return config.fieldList || [];
        }
    },
    data() {
        return {
            value: this.tidyModelValue(),
        };
    },
    methods: {
        tidyModelValue() {
            const modelValue = this.modelValue || [];
            return modelValue.map(v => {
                const item = copy(v);
                // 根据表格类型统一字段名
                if (this.tableType === 'elTable') {
                    // Element Table 使用 prop 和 label
                    item.field = item.prop || item.field || '';
                    item.title = item.label || item.title || '';
                } else {
                    // VXE Table 使用 field 和 title
                    item.field = item.field || item.prop || '';
                    item.title = item.title || item.label || '';
                }
                // 确保宽度是字符串
                if (item.width !== undefined && item.width !== null && item.width !== '') {
                    item.width = String(item.width).replace(/px$/i, '');
                }
                if (item.minWidth !== undefined && item.minWidth !== null && item.minWidth !== '') {
                    item.minWidth = String(item.minWidth).replace(/px$/i, '');
                }
                return item;
            });
        },
        tidyValue() {
            return this.value.map(v => {
                const item = {};

                // 根据表格类型设置对应的字段名
                if (this.tableType === 'elTable') {
                    // Element Table 使用 prop 和 label
                    item.prop = v.field;
                    item.label = v.title;
                } else {
                    // VXE Table 使用 field 和 title
                    item.field = v.field;
                    item.title = v.title;
                }

                // 处理宽度 - 只有有值时才添加
                if (v.width && v.width.trim() !== '') {
                    const width = parseInt(v.width);
                    if (!isNaN(width)) {
                        item.width = width;
                    }
                }

                if (v.minWidth && v.minWidth.trim() !== '') {
                    const minWidth = parseInt(v.minWidth);
                    if (!isNaN(minWidth)) {
                        item.minWidth = minWidth;
                    }
                }

                // 保留其他属性
                Object.keys(v).forEach(key => {
                    if (!['field', 'title', 'width', 'minWidth', 'prop', 'label'].includes(key)) {
                        item[key] = v[key];
                    }
                });

                return item;
            }).filter(v => {
                // 根据表格类型检查对应的字段名
                if (this.tableType === 'elTable') {
                    return v.prop && v.prop.trim() !== '';
                } else {
                    return v.field && v.field.trim() !== '';
                }
            }); // 过滤掉没有字段的列
        },
        onInput(item) {
            // 至少需要填写字段名
            if (item.field && item.field.trim() !== '') {
                this.input();
            }
        },
        input() {
            const value = this.tidyValue();
            this.$emit('update:modelValue', value);
            this.$emit('change', value);
        },
        add() {
            this.value.push({
                title: '',
                field: '',
                width: '',
                minWidth: ''
            });
        },
        del(idx) {
            this.value.splice(idx, 1);
            this.input();
        }
    }
});
</script>

<style scoped>
._td-table-column-config {
    width: 100%;
}

._td-table-column-config .el-table {
    z-index: 1;
}

._td-table-column-config-handle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 5px;
}

._td-table-column-config .el-select {
    width: 100%;
}

._td-table-column-config .fc-icon.icon-delete {
    cursor: pointer;
    color: #f56c6c;
    font-size: 16px;
}

._td-table-column-config .fc-icon.icon-delete:hover {
    color: #f78989;
}

._td-table-column-config .fc-icon.icon-add {
    margin-right: 4px;
}
</style>
