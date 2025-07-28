import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/tonnages',
                    name: 'tonnages',
                    component: () => import('@/views/pages/TonnagesView.vue')
                },
                {
                    path: '/todo',
                    name: 'todo',
                    component: () => import('@/views/pages/TodoView.vue')
                },
                {
                    path: '/postit',
                    name: 'postit',
                    component: () => import('@/views/pages/PostitView.vue')
                },
            ]
        }
    ]
});

export default router;
