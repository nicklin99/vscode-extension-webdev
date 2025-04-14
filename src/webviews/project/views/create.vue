<template>
  <div class="create">
    <t-layout>
      <t-aside width="180px">
        <t-menu theme="dark" v-model="active" width="180px">
          <template #logo>
            <img height="28" src="@/assets/logo.png?inline" alt="logo" />
            web小助手
          </template>
          <t-menu-item value="ViteForm" :to="{ name: 'ViteForm'}">Vite</t-menu-item>
          <t-menu-item value="VueForm"  :to="{name: 'VueForm'}">Vue</t-menu-item>
          <t-menu-item value="NuxtForm" :to="{name: 'NuxtForm'}">Nuxt</t-menu-item>
          <!-- <t-menu-item value="ReactForm" :to="{name: 'ReactForm'}">React</t-menu-item> -->
          <t-menu-item value="NextjsForm" :to="{name: 'NextjsForm'}">Next.js</t-menu-item>
          <t-menu-item value="NodejsForm" :to="{name: 'NodejsForm'}">Node.js</t-menu-item>
        </t-menu>
      </t-aside>
      <t-content>
        <MainContent>
          <router-view />
        </MainContent>
      </t-content>
    </t-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect } from "vue";
import MainContent from "../components/MainContent.vue";
import { useRoute } from "vue-router";
import useVscodeStore from "../../../webviews/project/store/useVscode";

const active = ref<string>();
const route = useRoute()
watchEffect(() => {
  active.value = route.name as string;
})

const vscode = useVscodeStore()
vscode.updateTitle('新建项目')
</script>
