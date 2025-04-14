<template>
    <div class="spaced-container">
        <slot />
    </div>
</template>

<script>
export default {
    name: "SpacedContainer",
};
</script>

<style scoped>
.spaced-container {
    padding: 20px;
    height: 100vh;
}
</style>