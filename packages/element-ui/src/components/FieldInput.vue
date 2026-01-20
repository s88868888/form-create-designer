<template>
    <div class="_fd-field-input">
        <i class="fc-icon icon-group" @click.stop="copy"></i>
        <!-- 有字段ID选项时显示下拉框 -->
        <template v-if="hasFieldOptions">
            <el-select
                v-model="selectValue"
                :placeholder="t('form.selectField') || '请选择字段'"
                :disabled="fieldReadonly || disabled"
                clearable
                filterable
                allow-create
                default-first-option
                @change="onSelectChange"
            >
                <el-option-group
                    v-for="group in fieldList"
                    :key="group.value"
                    :label="group.label"
                >
                    <el-option
                        v-for="item in group.children"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                </el-option-group>
            </el-select>
        </template>
        <!-- 没有选项时显示原来的输入框 -->
        <template v-else>
            <el-input
                v-model="value"
                :readonly="fieldReadonly || disabled"
                :disabled="fieldReadonly || disabled"
                @focus="onFocus"
                @blur="onInput"
            >
                <template #append v-if="!fieldReadonly">
                    <i class="fc-icon icon-auto" @click="makeField"></i>
                </template>
            </el-input>
        </template>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import uniqueId from '@form-create/utils/lib/unique';
import errorMessage from '../utils/message';
import {copyTextToClipboard} from '../utils/index';
import is from '@form-create/utils/lib/type';

export default defineComponent({
    name: 'FieldInput',
    inject: ['designer'],
    emits: ['update:modelValue'],
    props: {
        modelValue: String,
        disabled: Boolean,
    },
    computed: {
        fieldReadonly() {
            return this.designer.setupState.fieldReadonly;
        },
        activeRule() {
            return this.designer.setupState.activeRule;
        },
        t() {
            return this.designer.setupState.t;
        },
        // 获取字段ID选项配置
        fieldList() {
            return this.designer.setupState.fieldList || [];
        },
        // 是否有字段ID选项
        hasFieldOptions() {
            return is.trueArray(this.fieldList);
        },
    },
    data() {
        return {
            value: this.modelValue || '',
            oldValue: '',
            selectValue: this.modelValue || '',
        }
    },
    watch: {
        modelValue(n) {
            this.value = n;
            this.selectValue = n;
        }
    },
    methods: {
        copy() {
            copyTextToClipboard(this.modelValue);
        },
        getSubChildren() {
            let subChildren = this.designer.setupState.getSubFormChildren(this.activeRule) || [];
            subChildren = is.trueArray(subChildren) ? subChildren : this.designer.setupState.children;
            return subChildren;
        },
        getSubFieldChildren() {
            const subChildren = this.getSubChildren();
            const list = [];
            const getRule = (children) => {
                children && children.forEach(rule => {
                    if (rule && rule._fc_drag_tag && rule.field) {
                        list.push({...rule, children: []});
                    } else if (rule && rule.children) {
                        getRule(rule.children);
                    }
                });
                return list;
            }
            return getRule(subChildren);
        },
        checkValue() {
            const oldField = this.oldValue;
            let field = (this.value || '').replace(/[\s\　]/g, '');
            if (!field) {
                errorMessage(this.t('computed.fieldEmpty'));
                return oldField;
            } else if (oldField !== field) {
                const flag = field.indexOf('.') > -1;
                if (flag) {
                    field = field.replaceAll('.', '_');
                }
                if (this.getSubFieldChildren().filter(v => v.field === field).length > 0) {
                    errorMessage(this.t('computed.fieldExist', {label: field}));
                    return oldField;
                }
                if (flag) {
                    return field;
                }
            }
            this.oldValue = '';
            return field;
        },
        onFocus() {
            this.oldValue = this.value;
        },
        makeField() {
            this.oldValue = this.value;
            this.value = uniqueId();
            this.onInput();
        },
        onInput() {
            if (this.value !== this.modelValue) {
                this.value = this.checkValue();
                this.oldValue = this.value;
                if (this.value !== this.modelValue) {
                    this.designer.emit('changeField', {field: this.value, oldField: this.modelValue, rule: this.activeRule});
                    this.$emit('update:modelValue', this.value);
                }
            }
        },
        // 下拉选择器变化处理
        onSelectChange(val) {
            if (val && val !== this.modelValue) {
                this.oldValue = this.modelValue;
                // 去除空格
                val = val.replace(/[\s\　]/g, '');
                this.value = val;
                this.selectValue = val;
                // 检查是否重复
                if (this.getSubFieldChildren().filter(v => v.field === val).length > 0) {
                    errorMessage(this.t('computed.fieldExist', {label: val}));
                    this.selectValue = this.modelValue;
                    return;
                }
                this.designer.emit('changeField', {field: val, oldField: this.modelValue, rule: this.activeRule});
                this.$emit('update:modelValue', val);
            }
        },
    },
});
</script>

<style>
._fd-field-input {
    width: 100%;
}

._fd-field-input > .fc-icon {
    position: absolute;
    right: 28px;
    top: 1px;
    z-index: 3;
    color: #a8abb2;
    cursor: pointer;
    width: 24px;
    height: 24px;
    text-align: center;
}

._fd-field-input > .fc-icon:hover {
    color: #2E73FF;
}

._fd-field-input .el-input-group__append {
    width: 25px;
    padding: 0;
    margin: 0;
    color: #606266;
    cursor: pointer;
}

._fd-field-input .el-select {
    width: 100%;
}
</style>
