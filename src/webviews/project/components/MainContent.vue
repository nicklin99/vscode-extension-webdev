<template>
    <div class="container">
        <slot />
    </div>
</template>

<script>
export default {
    name: "MainContent",
};
</script>

<style scoped>
.container {
    padding: 20px;
    box-sizing: border-box;
    height: 100vh;
    overflow-y: auto;
}
</style>