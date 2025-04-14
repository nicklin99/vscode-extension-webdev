import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Create from '../views/Create.vue'; // 新增导入
import VueForm from '../views/form/Vue.vue';
import ViteForm from '../views/form/Vite.vue';
// import ReactForm from '../views/form/React.vue';
import NuxtForm from '../views/form/Nuxt.vue';
import NextjsForm from '../views/form/Nextjs.vue';
import NodejsForm from '../views/form/Nodejs.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/create', // 新增创建项目路由
    name: 'Create',
    component: Create,
    redirect: { name: 'ViteForm'},
    children: [
      {
        path: 'vue',
        name: 'VueForm',
        component: VueForm,
      },
      {
        path: 'vite',
        name: 'ViteForm',
        component: ViteForm,
      },
      // {
      //   path: 'react',
      //   name: 'ReactForm',
      //   component: ReactForm,
      // },
      {
        path: 'nuxt',
        name: 'NuxtForm',
        component: NuxtForm,
      },
      {
        path: 'nextjs',
        name: 'NextjsForm',
        component: NextjsForm,
      },
      {
        path: 'nodejs',
        name: 'NodejsForm',
        component: NodejsForm,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;