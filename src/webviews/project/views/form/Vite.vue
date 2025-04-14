<template>
  <t-form :data="formData" @submit="onSubmit">
    <t-form-item name="name" label="名称">
      <t-input v-model="formData.name"></t-input>
    </t-form-item>
    <t-form-item name="path" label="路径">
      <t-input v-model="formData.path"></t-input>
    </t-form-item>
    <t-form-item name="cli" label="vite cli">
      <t-input v-model="formData.cli"></t-input>
    </t-form-item>
    <t-form-item name="template" label="模板">
      <t-select v-model="formData.template" :options="templates"></t-select>
    </t-form-item>
    <t-form-item name="ts" label="typescript">
      <t-checkbox v-model="formData.ts" />
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
import { reactive } from "vue";
import { type ProjectForm } from "../../../../types";
import useVscodeStore from "../../store/useVscode";
import { ProjectCommand } from "../../../../config";
import { useWebviewListener } from "../../vscode/useWebviewListener";
import { useNav } from "../../vscode/useNav";

const vscode = useVscodeStore();
// 项目名称
// 选择框架 vue/react/vanilla/...
// variant Typescript/Javascript
const { navToCreate } = useNav();

const { loading } = useWebviewListener()
const formData = reactive<ProjectForm>({
  cli: "npx create-vite",
  template: "vanilla",
  path: "~/vscodeProjects/demo",
  name: "demo",
  ts: true
});
const templates = [
  { label: "vanilla", value: "vanilla" },
  { label: "vue", value: "vue" },
  { label: "react", value: "react" },
  { label: "svelte", value: "svelte" },
  { label: "preact", value: "preact" },
  { label: "angular", value: "angular" },
  { label: "solid", value: "solid" },
];
const onSubmit = () => {
  // 传入完整参数,避免进入交互模式
  // --overwrite 覆盖已有文件
  // --ts 使用typescript
  // --template 选择模板
  // 提取包名称, 一定要使用英文名称
  const command = `${formData.cli} ${formData.path!
    .split("/")
    .pop()} --template ${formData.template}${
    formData.ts ? "-ts" : ""
  } --overwrite .`;

  // 使用 VS Code API 发送命令到插件后端
  loading.value = true;
  vscode.postMessage({
    command: ProjectCommand.Cli,
    payload: {
      command,
      path: formData.path,
      name: formData.name,
      template: formData.template,
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
