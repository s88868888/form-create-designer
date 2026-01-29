import uniqueId from '@form-create/utils/lib/unique';

const label = '附件列表';
const name = 'fcFileList';

export default {
  menu: 'main',
  icon: 'icon-upload',
  label,
  name,
  input: true,
  event: ['preview', 'download'],
  validate: ['array'],
  rule({ t }) {
    return {
      type: name,
      field: uniqueId(),
      title: t ? t('com.fileList.name') : '附件列表',
      info: '',
      $required: false,
      value: [],
      props: {
        showSize: true,
        showDownload: true,
        showBatchDownload: true,
        showDownloadAll: true
      }
    };
  },
  props() {
    return [
      {
        type: 'switch',
        field: 'showSize',
        title: '显示文件大小',
        value: true
      },
      {
        type: 'switch',
        field: 'showDownload',
        title: '显示下载按钮',
        value: true
      },
      {
        type: 'switch',
        field: 'showBatchDownload',
        title: '显示批量下载',
        value: true
      },
      {
        type: 'switch',
        field: 'showDownloadAll',
        title: '显示下载全部',
        value: true
      }
    ];
  }
};
