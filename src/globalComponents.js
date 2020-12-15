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
import Whiteboard from './components/programs/whiteboard/Whiteboard.vue'


import FileSelector from './components/programs/modal/FileSelector.vue'

import MenuStacks from './components/board/menu/Stacks.vue'
import MenuLogin from './components/board/menu/Login.vue'
import MenuRegister from './components/board/menu/Register.vue'
import MenuResetPassword from './components/board/menu/ResetPassword.vue'
import MenuStudents from './components/board/menu/Students.vue'
import MenuPersonal from './components/board/menu/Personal.vue'
import MenuInvite from './components/board/menu/Invite.vue'
import MenuStudentDashboard from './components/board/menu/StudentDashboard.vue'
import MenuHelp from './components/board/menu/Help.vue'

Vue.component('image-viewer', ImageViewer);
Vue.component('pdf-viewer', PdfViewer);
Vue.component('text-editor', TextEditor);

Vue.component('todo-list', TodoList);
Vue.component('todo-item', TodoItem);

Vue.component('url-list', UrlList);
Vue.component('url-item', UrlItem);

Vue.component('youtube-player', YoutubePlayer);
Vue.component('whiteboard', Whiteboard);

Vue.component('file-selector', FileSelector);

Vue.component('menu-stacks', MenuStacks);
Vue.component('menu-login', MenuLogin);
Vue.component('menu-register', MenuRegister);
Vue.component('menu-reset-password', MenuResetPassword);
Vue.component('menu-students', MenuStudents);
Vue.component('menu-personal', MenuPersonal);
Vue.component('menu-invite', MenuInvite);
Vue.component('menu-student-dashboard', MenuStudentDashboard);
Vue.component('menu-help', MenuHelp);