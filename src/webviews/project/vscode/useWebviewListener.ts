import { watch, onWatcherCleanup, ref } from "vue";
import { ProjectCommand } from "../../../config";

export const useWebviewListener = (h?: (data: any) =>  void) => {
  const loading = ref(false)
  const init = ref(false)
  const handleMsg = (event: MessageEvent) => {
    if (event.data.command === ProjectCommand.Cancel) {
      loading.value = false;
    } else if (event.data.command === ProjectCommand.ListProjects) {
      loading.value = false
      if (h) {
        h(event.data.payload)
      }
    }
  };
  watch(
    init,
    () => {
      window.addEventListener("message", handleMsg);
      onWatcherCleanup(() => {
        window.removeEventListener("message", handleMsg);
      });
    },
    {
      immediate: true,
    }
  );
  
  return {
    loading,
    handleMsg
  }
};
