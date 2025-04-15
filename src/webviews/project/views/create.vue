<template>
  <MainLayout>
    <template #menu>
      <t-menu-item value="ViteForm" :to="{ name: 'ViteForm'}">Vite</t-menu-item>
      <t-menu-item value="VueForm"  :to="{name: 'VueForm'}">Vue</t-menu-item>
      <t-menu-item value="NuxtForm" :to="{name: 'NuxtForm'}">Nuxt</t-menu-item>
      <t-menu-item value="NextjsForm" :to="{name: 'NextjsForm'}">Next.js</t-menu-item>
      <t-menu-item value="NodejsForm" :to="{name: 'NodejsForm'}">Node.js</t-menu-item>
    </template>
    <router-view />
  </MainLayout>
</template>

<script lang="ts" setup>
import { MainLayout } from "@/webviews/project/components/MenuLayout";
import useVscodeStore from "@/webviews/project/store/useVscode";

const vscode = useVscodeStore()
vscode.updateTitle('新建项目')
</script>
