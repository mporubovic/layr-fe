import Vue from 'vue'

import ImageViewer from './components/programs/ImageViewer.vue'
import PdfViewer from './components/programs/PdfViewer.vue'
import TextEditor from './components/programs/TextEditor.vue'
Vue.component('image-viewer', ImageViewer);
Vue.component('pdf-viewer', PdfViewer);
Vue.component('text-editor', TextEditor);