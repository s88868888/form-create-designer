import {localeOptions} from '../../utils';

export default function form({t}) {
    return [
        {
            type: 'input',
            field: 'formCreateFormName',
            value: '',
            title: t('form.formName'),
        }, {
            type: 'select',
            field: 'labelAlign',
            title: t('form.labelAlign'),
            options: localeOptions(t, [
                {
                    label: 'center',
                    value: 'center',
                },
                {
                    label: 'left',
                    value: 'left',
                },
                {
                    label: 'right',
                    value: 'right',
                },
                {
                    label: 'top',
                    value: 'top',
                },
            ])
        }, {
            type: 'radio',
            field: 'inputAlign',
            title: t('form.inputAlign'),
            options: localeOptions(t, [
                {
                    label: 'left',
                    value: 'left',
                },
                {
                    label: 'center',
                    value: 'center',
                },
                {
                    label: 'right',
                    value: 'right',
                },
            ])
        },
        {
            type: 'SizeInput',
            field: 'labelWidth',
            title: t('form.labelWidth'),
        },
        {
            type: 'input',
            field: 'labelColor',
            title: t('form.labelColor'),
            value: '#9ca3af',
            props: {
                type: 'color'
            }
        },
        {
            type: 'switch',
            field: 'labelBold',
            title: t('form.labelBold'),
            value: false,
        },
        {
            type: 'input',
            field: 'valueColor',
            title: t('form.valueColor'),
            value: '#111827',
            props: {
                type: 'color'
            }
        },
        {
            type: 'switch',
            field: 'valueBold',
            title: t('form.valueBold'),
            value: false,
        },
        {
            type: 'switch',
            field: 'colon',
            title: t('form.colon'),
        }, {
            type: 'switch',
            field: '_submitBtn>show',
            value: true,
            title: t('form.submitBtn'),
        }, {
            type: 'switch',
            field: '_resetBtn>show',
            value: false,
            title: t('form.resetBtn'),
        }, {
            type: 'switch',
            field: '_detailBtn>show',
            value: false,
            title: t('form.detailBtn'),
        }, {
            type: 'input',
            field: '_detailBtn>innerText',
            value: '',
            title: t('form.detailBtnText'),
            props: {
                placeholder: t('form.detailBtnTextPlaceholder')
            },
            control: [{
                value: true,
                rule: [{
                    type: 'hidden',
                    field: '_detailBtn>show'
                }]
            }]
        }, {
            type: 'input',
            field: '_detailBtn>routeName',
            value: '',
            title: t('form.detailBtnRouteName'),
            props: {
                placeholder: t('form.detailBtnRouteNamePlaceholder')
            },
            control: [{
                value: true,
                rule: [{
                    type: 'hidden',
                    field: '_detailBtn>show'
                }]
            }]
        }, {
            type: 'FnConfig',
            field: 'formCreate_event',
            name: 'event',
            warning: t('form.controlDocument', {doc: '<a target="_blank" href="https://form-create.com/v3/guide/global-event" style="color: inherit;text-decoration: underline;">' + t('form.document') + '</a>'}),
            value: {},
            col: {show: true},
            props: {
                eventConfig: [
                    {
                        name: 'onSubmit',
                        info: t('form.onSubmit'),
                        args: ['formData', 'api'],
                    },
                    {
                        name: 'onReset',
                        info: t('form.onReset'),
                        args: ['api'],
                    },
                    {
                        name: 'onCreated',
                        info: t('form.onCreated'),
                        args: ['api'],
                    },
                    {
                        name: 'onMounted',
                        info: t('form.onMounted'),
                        args: ['api'],
                    },
                    {
                        name: 'onReload',
                        info: t('form.onReload'),
                        args: ['api'],
                    },
                    {
                        name: 'onChange',
                        info: t('form.onChange'),
                        args: ['field', 'value', 'options'],
                    },
                    {
                        name: 'beforeSubmit',
                        info: t('form.beforeSubmit'),
                        args: ['formData', 'data'],
                    },
                    {
                        name: 'beforeFetch',
                        info: t('form.beforeFetch'),
                        args: ['config', 'data'],
                    },
                ]
            },
            title: t('form.event'),
        },
    ];
}
