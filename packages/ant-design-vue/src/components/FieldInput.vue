<template>
    <div class="_fd-field-input">
        <i class="fc-icon icon-group" @click.stop="copy"></i>
        <!-- 有字段ID选项时显示下拉框 -->
        <template v-if="hasFieldOptions">
            <a-cascader
                v-model:value="cascaderValue"
                :options="fieldIdOptions"
                :field-names="cascaderFieldNames"
                :placeholder="t('form.selectField') || '请选择字段'"
                :disabled="fieldReadonly || disabled"
                :allow-clear="true"
                :show-search="{ filter: cascaderFilter }"
                size="small"
                popup-class-name="_fd-field-cascader-popup"
                @change="onCascaderChange"
            />
        </template>
        <!-- 没有选项时显示原来的输入框 -->
        <template v-else>
            <a-input v-model:value="value"
                     :readonly="fieldReadonly || disabled"
                     :disabled="fieldReadonly || disabled"
                     size="small"
                     @focus="onFocus"
                     @blur="onInput">
                <template #addonAfter v-if="!fieldReadonly">
                    <i class="fc-icon icon-auto" @click="makeField"></i>
                </template>
            </a-input>
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
        fieldIdOptions() {
            return this.designer.setupState.fieldIdOptions || [];
        },
        // 是否有字段ID选项
        hasFieldOptions() {
            return is.trueArray(this.fieldIdOptions);
        },
        // 级联选择器字段名配置
        cascaderFieldNames() {
            return {
                value: 'value',
                label: 'label',
                children: 'children',
            };
        }
    },
    data() {
        return {
            value: this.modelValue || '',
            oldValue: '',
            cascaderValue: [],
        }
    },
    watch: {
        modelValue: {
            handler(n) {
                this.value = n;
                this.cascaderValue = this.findValuePath(n);
            },
            immediate: true
        },
        fieldIdOptions: {
            handler() {
                this.cascaderValue = this.findValuePath(this.modelValue);
            },
            immediate: true
        }
    },
    methods: {
        copy() {
            copyTextToClipboard(this.modelValue);
        },
        // 根据值查找完整路径
        findValuePath(val) {
            if (!val || !is.trueArray(this.fieldIdOptions)) return [];
            const path = [];
            const find = (options, target) => {
                for (const opt of options) {
                    if (opt.value === target) {
                        path.push(opt.value);
                        return true;
                    }
                    if (opt.children && opt.children.length) {
                        path.push(opt.value);
                        if (find(opt.children, target)) {
                            return true;
                        }
                        path.pop();
                    }
                }
                return false;
            };
            find(this.fieldIdOptions, val);
            return path;
        },
        // 搜索过滤
        cascaderFilter(inputValue, path) {
            return path.some(option => 
                option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
                option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
            );
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
            } else if (!/^[a-zA-Z]/.test(field)) {
                errorMessage(this.t('computed.fieldChar'));
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
        // 级联选择器变化处理
        onCascaderChange(val) {
            // ant-design-vue cascader 返回的是数组路径，取最后一个值
            const selectedValue = is.trueArray(val) ? val[val.length - 1] : null;
            if (selectedValue && selectedValue !== this.modelValue) {
                this.oldValue = this.modelValue;
                this.value = selectedValue;
                // 检查是否重复
                if (this.getSubFieldChildren().filter(v => v.field === selectedValue).length > 0) {
                    errorMessage(this.t('computed.fieldExist', {label: selectedValue}));
                    this.cascaderValue = this.findValuePath(this.modelValue);
                    return;
                }
                this.designer.emit('changeField', {field: selectedValue, oldField: this.modelValue, rule: this.activeRule});
                this.$emit('update:modelValue', selectedValue);
            } else if (!selectedValue && this.modelValue) {
                // 清空时恢复原值
                this.cascaderValue = this.findValuePath(this.modelValue);
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
    top: 0;
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

._fd-field-input .ant-input-group-addon {
    width: 25px;
    padding: 0;
    margin: 0;
    color: #AAAAAA;
    cursor: pointer;
}

._fd-field-input .ant-cascader,
._fd-field-input .ant-select {
    width: 100%;
}

._fd-field-input .ant-select-selector {
    font-size: 12px;
}
</style>

<style>
/* 全局样式 - 级联选择器弹出层 */
._fd-field-cascader-popup .ant-cascader-menu {
    min-width: 120px;
}
</style>
