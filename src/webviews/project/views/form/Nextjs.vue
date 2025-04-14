<template>
  <t-form :data="formData" @submit="onSubmit">
    <t-form-item name="name" label="名称">
      <t-input v-model="formData.name"></t-input>
    </t-form-item>
    <t-form-item name="path" label="路径">
      <t-input v-model="formData.path"></t-input>
    </t-form-item>
    <t-form-item name="cli" label="nuxt cli">
      <t-input v-model="formData.cli"></t-input>
    </t-form-item>
    <t-form-item name="ts" label="typescript">
      <t-checkbox v-model="formData.ts" />
    </t-form-item>
    <t-form-item name="next_app_router" label="AppRouter">
      <t-checkbox v-model="formData.next_app_router" />
    </t-form-item>
    <t-form-item name="template" label="模板名称" help="注意:如果输入模板从github拉取很慢">
      <t-input v-model="formData.template" />
    </t-form-item>
    <t-form-item>
      <t-space>
        <t-button theme="default" @click="cancel">取消</t-button>
        <t-button theme="primary" type="submit" :loading="loading">创建</t-button>
      </t-space>
    </t-form-item>
  </t-form>
</template>

<script lang="ts" setup>
import { reactive} from "vue";
import { type ProjectForm } from "../../../../types";
import useVscodeStore from "../../../../webviews/project/store/useVscode";
import { ProjectCommand } from "../../../../config";
import { useWebviewListener } from "../../vscode/useWebviewListener";
import { useNav } from "../../vscode/useNav";

const vscode = useVscodeStore();

const { navToCreate } = useNav();
const { loading } = useWebviewListener()
const formData = reactive<ProjectForm>({
  cli: "npx create-next-app",
  path: "~/vscodeProjects/nextjs/demo",
  name: "nextjs",
  next_app_router: true,
  ts: true
});
const onSubmit = () => {
  const command = `${formData.cli} ${formData.path!.split("/").pop()} ${formData.template ? `-e ${formData.template}` : ''} --yes --tailwind --eslint ${
    formData.ts ? "--ts" : "--js"
} ${formData.next_app_router ? "--app" : ""} --turbopack=false --skip-install --src-dir --import-alias "@/*"`;
  // 使用 VS Code API 发送命令到插件后端
  loading.value = true;
  vscode.postMessage({
    command: ProjectCommand.Cli,
    payload: {
      command,
      path: formData.path,
      name: formData.name,
      ts: formData.ts,
    },
  });

  console.log("CLI Command:", command);
};
const cancel = () => {
  if( loading.value ) {
    vscode.postMessage({
      command: ProjectCommand.Cancel,
    });
  } else {
    navToCreate()
  }
}
</script>
