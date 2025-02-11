import { createRouter, createWebHistory } from 'vue-router';
import Especificacao from './pages/Especificacao.vue'
import PaginaServicos from './pages/PaginaServicos.vue'
import Login from './components/login.vue';
import Suspender from './components/ui/Suspender.vue';
import Sugerir from './components/ui/Sugestao.vue';
import NotFound from './pages/NotFound.vue';
import Sucesso from './components/Sucesso.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //TIRAR DO COMENTÁRIO QUANDO A PÁGINA DO LOGIN E DO SERVIÇO ESTIVER FEITA
    {
      path: '/login',
      component: Login
    },
    {
      path: '/sucesso',
      component: Sucesso
    },
    {
      path: '/servico/:id',
      component: Especificacao,
      props: true
    },
    {
      path:'/suspender',
      component: Suspender
    },
    {
      path:'/sugerir',
      component: Sugerir
    },
    {
      path:'/paginaServicos/:id',
      component: PaginaServicos,
      props: true
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/:notFound(.*)',
      component: NotFound
    },
    
  ]
});

export default router;