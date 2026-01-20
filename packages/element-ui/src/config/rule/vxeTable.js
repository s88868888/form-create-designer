import uniqueId from '@form-create/utils/lib/unique';
import {localeProps, localeOptions} from '../../utils';

const label = 'VXE表格';
const name = 'FcVxeTable';

export default {
    menu: 'main',
    icon: 'icon-table',
    label,
    name,
    input: true,
    event: ['cell-click', 'cell-dblclick', 'edit-closed', 'edit-actived', 'checkbox-change', 'checkbox-all', 'radio-change', 'current-change', 'sort-change', 'filter-change', 'page-change'],
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
                stripe: true,
                showHeader: true,
                loading: false,
                align: 'left',
                headerAlign: 'left',
                showOverflow: 'tooltip',
                showHeaderOverflow: 'tooltip',
                highlightCurrentRow: false,
                highlightHoverRow: true,
                emptyText: '暂无数据',
                resizable: true,
                columns: [
                    {
                        field: 'name',
                        title: '姓名',
                        width: 120
                    },
                    {
                        field: 'age',
                        title: '年龄',
                        width: 100
                    },
                    {
                        field: 'address',
                        title: '地址',
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
                    tableType: 'vxeTable'
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
                value: true
            },
            {
                type: 'switch',
                field: 'showHeader',
                title: '显示表头',
                value: true
            },
            
            // 对齐方式
            {
                type: 'radio',
                field: 'align',
                title: '内容对齐',
                value: 'left',
                options: localeOptions(t, [
                    {label: '左对齐', value: 'left'},
                    {label: '居中', value: 'center'},
                    {label: '右对齐', value: 'right'}
                ])
            },
            {
                type: 'radio',
                field: 'headerAlign',
                title: '表头对齐',
                value: 'left',
                options: localeOptions(t, [
                    {label: '左对齐', value: 'left'},
                    {label: '居中', value: 'center'},
                    {label: '右对齐', value: 'right'}
                ])
            },
            
            // 溢出处理
            {
                type: 'select',
                field: 'showOverflow',
                title: '内容溢出',
                value: 'tooltip',
                options: localeOptions(t, [
                    {label: '不处理', value: false},
                    {label: '省略号', value: 'ellipsis'},
                    {label: '原生title', value: 'title'},
                    {label: 'Tooltip提示', value: 'tooltip'}
                ]),
                info: '内容超出时的显示方式'
            },
            {
                type: 'select',
                field: 'showHeaderOverflow',
                title: '表头溢出',
                value: 'tooltip',
                options: localeOptions(t, [
                    {label: '不处理', value: false},
                    {label: '省略号', value: 'ellipsis'},
                    {label: '原生title', value: 'title'},
                    {label: 'Tooltip提示', value: 'tooltip'}
                ]),
                info: '表头超出时的显示方式'
            },
            
            // 交互效果
            {
                type: 'switch',
                field: 'resizable',
                title: '列宽拖动',
                value: true,
                info: '允许拖动调整列宽'
            },
            {
                type: 'switch',
                field: 'highlightHoverRow',
                title: '悬停高亮',
                value: true,
                info: '鼠标悬停时高亮行'
            },
            {
                type: 'switch',
                field: 'highlightCurrentRow',
                title: '高亮当前行',
                value: false,
                info: '点击时高亮当前行'
            },
            
            // 其他配置
            {
                type: 'switch',
                field: 'loading',
                title: '加载状态',
                value: false,
                info: '显示加载动画'
            },
            {
                type: 'input',
                field: 'emptyText',
                title: '空数据提示',
                value: '暂无数据',
                props: {
                    placeholder: '请输入空数据提示文本'
                }
            }
        ]);
    }
};
