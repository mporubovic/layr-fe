import Vue from 'vue'

import ImageViewer from './components/programs/image/ImageViewer.vue'
import PdfViewer from './components/programs/PdfViewer.vue'
import TextEditor from './components/programs/TextEditor.vue'

import TodoList from './components/programs/todo/TodoList.vue'
import TodoItem from './components/programs/todo/TodoItem.vue'

import UrlList from './components/programs/url/UrlList.vue'
import UrlItem from './components/programs/url/UrlItem.vue'

import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)


import YoutubePlayer from './components/programs/youtube/YoutubePlayer.vue'


import FileSelector from './components/programs/modal/FileSelector.vue'

Vue.component('image-viewer', ImageViewer);
Vue.component('pdf-viewer', PdfViewer);
Vue.component('text-editor', TextEditor);

Vue.component('todo-list', TodoList);
Vue.component('todo-item', TodoItem);

Vue.component('url-list', UrlList);
Vue.component('url-item', UrlItem);

Vue.component('youtube-player', YoutubePlayer);

Vue.component('file-selector', FileSelector);