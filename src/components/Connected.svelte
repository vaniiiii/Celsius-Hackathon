<script lang="ts">
    import { username } from "@stores/store";
</script>

{#if $username.length > 0} 
    <slot />
{/if}