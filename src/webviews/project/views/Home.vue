<template>
  <div class="home">
    <t-layout>
      <t-aside width="180px">
        <t-menu theme="dark" v-model="active" width="180px">
          <template #logo>
            <img height="28" src="@/assets/logo.png?inline" alt="logo" />
            web小助手
          </template>
          <t-menu-item value="Home"> 项目 </t-menu-item>
          <template #operations>
            <p>v1.0</p>
            <p class="breakline">
              欢迎使用,有任何问题可以联系 719675210@qq.com
            </p>
          </template>
        </t-menu>
      </t-aside>
      <t-content>
        <MainContent>
          <t-space direction="vertical">
            <t-row justify="space-between">
              <t-col>
                <t-input v-model="keyword" placeholder="搜索项目" />
              </t-col>
              <t-col>
                <t-space>
                  <t-button
                    theme="primary"
                    @click="router.push({ name: 'Create' })"
                  >
                    创建项目
                  </t-button>
                </t-space>
              </t-col>
            </t-row>
            <t-table
              :loading="loading"
              :data="filterList"
              :columns="columns"
              :pagination="{
                ...pagination,
                total: data.total,
                showJumper: true,
                showSizeChanger: true,
              }"
              @page-change="
                pagination.current = $event.current;
                pagination.pageSize = $event.pageSize;
              "
              row-key="name"
              hover
              @row-click="({ row }) => openProject(row.target)"
            >
              <template #name="{ row }">
                <t-typography-title level="h5">
                  {{ row.name }}
                </t-typography-title>
                <t-typography-text theme="secondary">
                  {{ row.target }}
                </t-typography-text>
              </template>
              <template #createdAt="{ row }">
                {{ formatDateTime(row.createdAt) }}
              </template>
              <template #action="{ row }">
                <t-button
                  size="small"
                  variant="text"
                  ghost
                  @click.prevent="copyTarget(row.target)"
                >
                  复制路径
                </t-button>
                <t-button
                  size="small"
                  variant="text"
                  ghost
                  @click.prevent="openTarget(row.target)"
                >
                  打开文件夹
                </t-button>
              </template>
            </t-table>
          </t-space>
        </MainContent>
      </t-content>
    </t-layout>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, watchEffect } from "vue";
import MainContent from "../components/MainContent.vue";
import { useRoute, useRouter } from "vue-router";
import useVscodeStore from "../../../webviews/project/store/useVscode";
import { ProjectCommand } from "../../../config";
import { useWebviewListener } from "../vscode/useWebviewListener";
import { ProjectData } from "../../../types";
import { formatDateTime } from "../utils";

const router = useRouter();
const keyword = ref<string>();
const active = ref<string>();
const route = useRoute();
watchEffect(() => {
  active.value = route.name as string;
});

// 表格数据
const data = ref<{ total: number; list: ProjectData[] }>({
  total: import.meta.env.DEV ? 1 : 0,
  list: import.meta.env.DEV ? [{ name: "dev" }] : [],
});

const { loading } = useWebviewListener((ret: ProjectData[]) => {
  data.value.list = ret;
  data.value.total = ret.length;
});
// 打开项目
const openProject = (target) => {
  vscode.postMessage({
    command: ProjectCommand.OpenProject,
    payload: {
      target,
    },
  });
};
// 复制项目路径
const copyTarget = (target) => {
  navigator.clipboard
    .writeText(target)
    .then(() => {
      MessagePlugin.success("复制成功");
    })
    .catch((err) => {
      MessagePlugin.error(err);
    });
};
// 打开项目文件夹
const openTarget = (target) => {
  vscode.postMessage({
    command: ProjectCommand.OpenOSFolder,
    payload: {
      target,
    },
  });
};
const columns = ref([
  { colKey: "name", title: "项目名称" },
  // { colKey: "target", title: "路径" },
  { colKey: "createdAt", title: "创建时间" },
  {
    colKey: "action",
    title: "操作",
  },
]);
const pagination = ref({
  current: 1,
  pageSize: 10,
});
const vscode = useVscodeStore();
if (!import.meta.env.DEV) {
  loading.value = true;
}
vscode.postMessage({
  command: ProjectCommand.ListProjects,
  payload: {
    keyword: keyword.value,
    ...pagination.value,
  },
});
const filterList = computed(() => {
  if (!keyword.value) {
    return data.value.list;
  } else {
    return data.value.list.filter((item) => {
      return item.name.includes(keyword.value!);
    });
  }
});
watch(keyword, () => {
  pagination.value.current = 1;
  data.value.total = filterList.value.length;
});

vscode.updateTitle("项目管理");
</script>

<style scoped>
.breakline {
  word-wrap: break-word;
  white-space: wrap;
  word-break: break-all;
}
</style>
