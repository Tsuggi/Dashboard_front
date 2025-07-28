<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Menu',
        items: [
            { label: 'Tonnages', icon: 'pi pi-fw pi-chart-bar', to: '/tonnages' },
            { label: 'Todo', icon: 'pi pi-fw pi-book', to: '/todo' },
            { label: 'Postit', icon: 'pi pi-fw pi-bookmark', to: '/postit' },
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
