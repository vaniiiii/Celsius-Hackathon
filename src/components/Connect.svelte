<script lang="ts">
    import { connect } from "@requests/user";
</script>

<button on:click={() => connect()}><slot /></button>

<style>
    button {
        display: contents;
    }
</style>