<template>
  <MainLayout>
    <t-space direction="vertical">
      <t-row justify="space-between">
        <t-col>
          <t-input v-model="keyword" placeholder="搜索项目" />
        </t-col>
        <t-col>
          <t-space>
            <t-button theme="primary" @click="navToCreateProject">
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
            @click.prevent.stop="copyTarget(row.target)"
          >
            复制路径
          </t-button>
          <t-button
            size="small"
            variant="text"
            ghost
            @click.prevent.stop="openTarget(row.target)"
          >
            打开文件夹
          </t-button>
        </template>
      </t-table>
    </t-space>
  </MainLayout>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { MainLayout } from "@/webviews/project/components/MenuLayout";
import useVscodeStore from "@/webviews/project/store/useVscode";
import { ProjectCommand } from "@/config";
import { useWebviewListener } from "@/webviews/project/vscode/useWebviewListener";
import { ProjectData } from "@/types";
import { formatDateTime } from "@/webviews/project/utils";
import { useNav } from "@/webviews/project/vscode/useNav";

const { navToCreateProject } = useNav()
const keyword = ref<string>();

// 表格数据
const data = ref<{ total: number; list: ProjectData[] }>({
  total: import.meta.env.DEV ? 1 : 0,
  list: import.meta.env.DEV ? [{ name: "dev", target: "", dirname: "", command: "", ts:true, cwd: "" }] : [],
});

const { loading } = useWebviewListener(({command, payload}: { command: string, payload: any}) => {
  if (command === ProjectCommand.ListProjects) {
    data.value.list = payload;
    data.value.total = payload.length;
  } else if (command === ProjectCommand.CreateProject) {
    navToCreateProject()
  }
});
// 打开项目
const openProject = (target: string) => {
  vscode.postMessage({
    command: ProjectCommand.OpenProject,
    payload: {
      target,
    },
  });
};
// 复制项目路径
const copyTarget = (target: string) => {
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
const openTarget = (target: string) => {
  vscode.postMessage({
    command: ProjectCommand.OpenOSFolder,
    payload: {
      target,
    },
  });
};

const columns = ref([
  { colKey: "name", title: "项目名称" },
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