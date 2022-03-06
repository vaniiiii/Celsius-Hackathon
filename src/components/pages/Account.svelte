<script lang="ts">
    import { get_user_profile } from "../../libs/web3";
    import { onMount } from "svelte";
    import { username } from "@stores/store";

    let link;

    onMount( async ()=> {
        link = await get_user_profile();
    })
</script>

<h1>My profile</h1>
<div class="wrapper">
    <div class="profile">
        <img src={link} alt="Me">
        <div class="about">
            <p>address:</p>
            <h2>{$username}</h2>
        </div>
    </div>
</div>

<style lang="scss">
    @use "../../scss" as imports;
    
    .profile {
        position: relative;
        height: 30vh;
        padding: 12px 64px;
        gap: 32px;
        display: flex;
    }

    img {
        aspect-ratio: 1/1;
        height: 320px;
        width: 320px;
        object-fit: cover;
        background-color: imports.$bg-color-alt;  
        border-radius: 32px;
    }

    .wrapper {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
    }   
</style>
