import { watch, onWatcherCleanup, ref } from "vue";

export const useWebviewListener = (h?: (data: any) =>  void) => {
  const loading = ref(false)
  const init = ref(false)
  const handleMsg = (event: MessageEvent) => {
    loading.value = false;
    if (h) {
      h(event.data)
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
