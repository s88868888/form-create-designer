import uniqueId from '@form-create/utils/lib/unique';
import {localeProps, localeOptions} from '../../utils';

const label = 'Element表格';
const name = 'FcElTable';

export default {
    menu: 'main',
    icon: 'icon-table',
    label,
    name,
    input: true,
    event: ['select', 'select-all', 'selection-change', 'cell-mouse-enter', 'cell-mouse-leave', 'cell-click', 'cell-dblclick', 'row-click', 'row-contextmenu', 'row-dblclick', 'header-click', 'header-contextmenu', 'sort-change', 'filter-change', 'current-change', 'header-dragend', 'expand-change'],
    rule({t}) {
        return {
            type: name,
            field: uniqueId(),
            title: '',
            info: '',
            $required: false,
            value: [],
            props: {
                border: true,
                stripe: false,
                showHeader: true,
                highlightCurrentRow: false,
                emptyText: '暂无数据',
                defaultSort: {},
                tooltipEffect: 'dark',
                showSummary: false,
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        width: 120
                    },
                    {
                        prop: 'age',
                        label: '年龄',
                        width: 100
                    },
                    {
                        prop: 'address',
                        label: '地址',
                        minWidth: 200
                    }
                ],
                data: [
                    {name: '张三', age: 28, address: '北京市朝阳区'},
                    {name: '李四', age: 32, address: '上海市浦东新区'},
                    {name: '王五', age: 25, address: '广州市天河区'}
                ]
            },
            children: []
        };
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [
            // 表格列配置
            {
                type: 'TableColumnConfig',
                field: 'columns',
                title: '表头配置',
                props: {
                    tableType: 'elTable'
                }
            },

            // 基础样式
            {
                type: 'switch',
                field: 'border',
                title: '显示边框',
                value: true
            },
            {
                type: 'switch',
                field: 'stripe',
                title: '斑马纹',
                value: false
            },
            {
                type: 'switch',
                field: 'showHeader',
                title: '显示表头',
                value: true
            },
            
            // 尺寸
            {
                type: 'select',
                field: 'size',
                title: '表格尺寸',
                options: localeOptions(t, [
                    {label: '大', value: 'large'},
                    {label: '默认', value: 'default'},
                    {label: '小', value: 'small'}
                ])
            },
            
            // 高度
            {
                type: 'input',
                field: 'height',
                title: '表格高度',
                props: {
                    placeholder: '如: 300 或 300px'
                },
                info: '固定表头，设置表格高度'
            },
            {
                type: 'input',
                field: 'maxHeight',
                title: '最大高度',
                props: {
                    placeholder: '如: 500 或 500px'
                },
                info: '流动表头，设置最大高度'
            },
            
            // 交互效果
            {
                type: 'switch',
                field: 'highlightCurrentRow',
                title: '高亮当前行',
                value: false,
                info: '点击时高亮当前行'
            },
            
            // Tooltip
            {
                type: 'select',
                field: 'tooltipEffect',
                title: 'Tooltip主题',
                value: 'dark',
                options: localeOptions(t, [
                    {label: '暗色', value: 'dark'},
                    {label: '亮色', value: 'light'}
                ])
            },
            
            // 合计行
            {
                type: 'switch',
                field: 'showSummary',
                title: '显示合计行',
                value: false
            },
            {
                type: 'input',
                field: 'sumText',
                title: '合计文本',
                value: '合计',
                props: {
                    placeholder: '请输入合计文本'
                }
            },
            
            // 其他配置
            {
                type: 'input',
                field: 'emptyText',
                title: '空数据提示',
                value: '暂无数据',
                props: {
                    placeholder: '请输入空数据提示文本'
                }
            },
            {
                type: 'switch',
                field: 'fit',
                title: '列宽自适应',
                value: true,
                info: '列的宽度是否自撑开'
            },
            {
                type: 'switch',
                field: 'showOverflowTooltip',
                title: '内容过长显示Tooltip',
                value: false,
                info: '内容过长时显示为省略号'
            }
        ]);
    }
};
