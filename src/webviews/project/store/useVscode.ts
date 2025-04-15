import { defineStore } from "pinia";
import { shallowRef } from "vue";
import type {  ProjectQuery, ProjectPayload, MessageTargetPayload, MessageTitlePayload } from "../../../types";
import { ProjectCommand } from "../../../config";

const useVscodeStore = defineStore("vscode", () => {
  const vscode = shallowRef();
  const ret = {
    postMessage: (msg: { command: string; payload?: ProjectPayload | ProjectQuery | MessageTargetPayload | MessageTitlePayload}) => {
      // @ts-ignore
      if (typeof acquireVsCodeApi !== "undefined") {
        if (!vscode.value) {
            // @ts-ignore
            vscode.value = acquireVsCodeApi();
        }
        vscode.value.postMessage(msg);
      } else {
        console.log("acquireVsCodeApi is not defined")
        console.log("msg:", msg);
      }
    },
    updateTitle(title: string) {
      this.postMessage({
        command: ProjectCommand.UpdateTitle,
        payload: {
          title
        }
      })
    },
  };

  return ret;
});

export default useVscodeStore;
