<template>
  <t-form :data="formData" @submit="onSubmit" @reset="onReset">
    <t-form-item name="name" label="名称">
      <t-input v-model="formData.name"></t-input>
    </t-form-item>
    <t-form-item name="path" label="路径">
      <t-input v-model="formData.path"></t-input>
    </t-form-item>
    <t-form-item name="cli" label="nuxt cli">
      <t-input v-model="formData.cli"></t-input>
    </t-form-item>
    <!-- <t-form-item name="ts" label="typescript">
      <t-checkbox v-model="formData.ts" />
    </t-form-item> -->
    <t-form-item>
      <t-button theme="default" @click="cancel">取消</t-button>
      <t-button theme="primary" type="submit" :loading="loading">创建</t-button>
    </t-form-item>
  </t-form>
</template>

<script lang="ts" setup>
import { reactive} from "vue";
import { useRouter } from "vue-router";
import { type ProjectForm } from "../../../../types";
import useVscodeStore from "../../../../webviews/project/store/useVscode";
import { ProjectCommand } from "../../../../config";
import { useWebviewListener } from "../../vscode/useWebviewListener";

const vscode = useVscodeStore();

const router = useRouter();
const { loading } = useWebviewListener()
const formData = reactive<ProjectForm>({
  cli: "npx create-react-app",
  path: "~/vscodeProjects/nuxts/demo",
  name: "nuxt",
});
const onSubmit = () => {
  const command = `${formData.cli} --template ${
    formData.template
  } ${formData.path!.split("/").pop()}  .`;
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
const onReset = () => {
  router.back();
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
