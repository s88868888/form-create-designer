import {createApp} from 'vue';
import ELEMENT from 'element-plus';
import 'element-plus/dist/index.css';
import formCreate from '@form-create/element-ui';
import App from './App.vue';
import FcDesigner from '../src/index';
import VxeUI from 'vxe-pc-ui';
import 'vxe-pc-ui/lib/style.css';
import VxeTable from 'vxe-table';
import 'vxe-table/lib/style.css';

const app = createApp(App);

app.use(ELEMENT);
app.use(VxeUI);
app.use(VxeTable);
app.use(formCreate);
app.use(FcDesigner);

app.mount('#app')
