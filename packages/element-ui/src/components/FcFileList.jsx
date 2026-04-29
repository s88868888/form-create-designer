import {defineComponent, h} from 'vue';

const toArray = (v) => Array.isArray(v) ? v : (v ? [v] : []);

const ViewIcon = () => h('svg', {
    viewBox: '0 0 1024 1024', width: '1em', height: '1em', fill: 'currentColor'
}, [
    h('path', {d: 'M512 384c-70.4 0-128 57.6-128 128s57.6 128 128 128 128-57.6 128-128-57.6-128-128-128z m0 320c-105.6 0-192-86.4-192-192s86.4-192 192-192 192 86.4 192 192-86.4 192-192 192z'}),
    h('path', {d: 'M512 192C288 192 102.4 358.4 32 512c70.4 153.6 256 320 480 320s409.6-166.4 480-320c-70.4-153.6-256-320-480-320z m0 576c-176 0-332.8-128-400-256 67.2-128 224-256 400-256s332.8 128 400 256c-67.2 128-224 256-400 256z'})
]);

const DownloadIcon = () => h('svg', {
    viewBox: '0 0 1024 1024', width: '1em', height: '1em', fill: 'currentColor'
}, [
    h('path', {d: 'M544 684.8V192h-64v492.8l-144-144-44.8 44.8L512 806.4l220.8-220.8-44.8-44.8-144 144zM832 768H192v64h640v-64z'})
]);

const MOCK_FILES = [
    {name: '项目需求说明书.pdf', url: '', size: 2516582, operator: '张三'},
    {name: '设计稿终稿_v3.png', url: '', size: 524288, operator: '李四'},
    {name: '接口文档.docx', url: '', size: 91136, operator: '王五'},

];

function getFileType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'other';
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function mapFiles(list) {
    return list.map((file, index) => ({
        ...file,
        id: index,
        type: getFileType(file.name),
        sizeText: formatFileSize(file.size)
    }));
}

function downloadFile(url, fileName) {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = fileName || url.split('/').pop();
    if (url && url.startsWith('http') && !url.startsWith(window.location.origin)) {
        fetch(url).then(r => r.blob()).then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            link.href = blobUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }).catch(() => {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } else if (url) {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default defineComponent({
    name: 'fcFileList',
    inheritAttrs: false,
    formCreateParser: {
        toFormValue(value) { return toArray(value); },
        toValue(formValue) { return formValue; }
    },
    props: {
        modelValue: {type: Array, default: () => []},
        showSize: {type: Boolean, default: false},
        showOperator: {type: Boolean, default: false},
        showDownload: {type: Boolean, default: true},
        showBatchDownload: {type: Boolean, default: true},
        showDownloadAll: {type: Boolean, default: true},
        showActions: {type: Boolean, default: true},
        showHeader: {type: Boolean, default: true},
        doubleClickPreview: {type: Boolean, default: false}
    },
    emits: ['update:modelValue', 'preview', 'download'],
    data() {
        return {
            selectedFiles: new Set(),
            previewVisible: false,
            previewUrl: '',
            previewType: ''
        };
    },
    computed: {
        fileList() {
            const list = toArray(this.modelValue);
            if (!list || list.length === 0) return mapFiles(MOCK_FILES);
            return mapFiles(list);
        },
        allSelected() {
            return this.fileList.length > 0 && this.selectedFiles.size === this.fileList.length;
        }
    },
    methods: {
        toggleSelect(id) {
            const s = new Set(this.selectedFiles);
            s.has(id) ? s.delete(id) : s.add(id);
            this.selectedFiles = s;
        },
        toggleSelectAll() {
            if (this.allSelected) {
                this.selectedFiles = new Set();
            } else {
                this.selectedFiles = new Set(this.fileList.map(f => f.id));
            }
        },
        handlePreview(file) {
            this.$emit('preview', file);
            if (file.type === 'image') {
                this.previewUrl = file.url;
                this.previewType = 'image';
                this.previewVisible = true;
            } else if (file.type === 'pdf') {
                if (file.url) window.open(file.url, '_blank');
            } else {
                this.handleDownload(file);
            }
        },
        handleDownload(file) {
            this.$emit('download', file);
            if (file.url) downloadFile(file.url, file.name);
        },
        handleBatchDownload() {
            const files = this.fileList.filter(f => this.selectedFiles.has(f.id));
            files.forEach((file, i) => setTimeout(() => downloadFile(file.url, file.name), i * 200));
        },
        handleDownloadAll() {
            this.fileList.forEach((file, i) => setTimeout(() => downloadFile(file.url, file.name), i * 200));
        },
        handleClosePreview() {
            this.previewVisible = false;
            this.previewUrl = '';
            this.previewType = '';
        }
    },
    render() {
        const thStyle = {padding: '8px 12px', textAlign: 'left', background: '#fafafa', fontWeight: '500', color: '#606266', fontSize: '14px', borderBottom: '1px solid #ebeef5'};
        const tdStyle = {padding: '8px 12px', color: '#606266', fontSize: '14px', borderBottom: '1px solid #ebeef5'};

        return (
            <div class="_fc-file-list" style="width:100%;background:#fff;">
                {this.showHeader && (
                    <div style="display:flex;justify-content:flex-end;padding:8px 12px;borderBottom:1px solid #ebeef5;">
                        {this.showBatchDownload && (
                            <ElButton size="small" disabled={this.selectedFiles.size === 0} onClick={this.handleBatchDownload}>
                                <span style="display:inline-flex;align-items:center;margin-right:4px;">{h(DownloadIcon)}</span>
                                批量下载 ({this.selectedFiles.size})
                            </ElButton>
                        )}
                        {this.showDownloadAll && (
                            <ElButton type="primary" size="small" style="margin-left:8px;" onClick={this.handleDownloadAll}>
                                <span style="display:inline-flex;align-items:center;margin-right:4px;">{h(DownloadIcon)}</span>
                                下载全部
                            </ElButton>
                        )}
                    </div>
                )}
                <table style="width:100%;borderCollapse:collapse;tableLayout:fixed;">
                    <thead>
                        <tr>
                            <th style={{...thStyle, width: '50px', textAlign: 'center'}}>
                                <input type="checkbox" checked={this.allSelected} onChange={this.toggleSelectAll} />
                            </th>
                            <th style={thStyle}>文件名</th>
                            {this.showSize && <th style={{...thStyle, width: '100px', textAlign: 'center'}}>大小</th>}
                            {this.showOperator && <th style={{...thStyle, width: '100px', textAlign: 'center'}}>上传人</th>}
                            {this.showActions && <th style={{...thStyle, width: '120px', textAlign: 'center'}}>操作</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {this.fileList.map((file, idx) => (
                            <tr key={file.id} style={{background: idx % 2 === 1 ? '#fafafa' : '#fff'}}
                                onDblclick={() => this.doubleClickPreview && this.handlePreview(file)}>
                                <td style={{...tdStyle, width: '50px', textAlign: 'center'}}>
                                    <input type="checkbox" checked={this.selectedFiles.has(file.id)}
                                        onChange={() => this.toggleSelect(file.id)} />
                                </td>
                                <td style={{...tdStyle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                    {file.name}
                                </td>
                                {this.showSize && <td style={{...tdStyle, width: '100px', textAlign: 'center'}}>{file.sizeText}</td>}
                                {this.showOperator && <td style={{...tdStyle, width: '100px', textAlign: 'center'}}>{file.operator || '-'}</td>}
                                {this.showActions && (
                                    <td style={{...tdStyle, width: '120px', textAlign: 'center'}}>
                                        <div style="display:flex;justify-content:center;gap:8px;">
                                            <span style="display:inline-flex;width:24px;justify-content:center;">
                                                {file.type === 'image' ? (
                                                    <button style="border:none;background:none;color:#409eff;cursor:pointer;padding:4px;"
                                                        title="预览" onClick={() => this.handlePreview(file)}>
                                                        {h(ViewIcon)}
                                                    </button>
                                                ) : null}
                                            </span>
                                            {this.showDownload && (
                                                <button style="border:none;background:none;color:#409eff;cursor:pointer;padding:4px;"
                                                    title="下载" onClick={() => this.handleDownload(file)}>
                                                    {h(DownloadIcon)}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {this.previewVisible && (
                    <ElDialog modelValue={this.previewVisible} title="图片预览" width="800px" onClose={this.handleClosePreview}>
                        {this.previewType === 'image' && (
                            <div style="display:flex;justify-content:center;padding:20px;">
                                <img src={this.previewUrl} alt="预览" style="max-width:100%;height:auto;" />
                            </div>
                        )}
                    </ElDialog>
                )}
            </div>
        );
    }
});
