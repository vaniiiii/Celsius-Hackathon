<script lang="ts">
  import Card from "./Card.svelte";
  import { modal_open } from "@stores/modal";
  import { type Item } from "../libs/types";
  import {set_user_preference} from "../libs/web3";

  export let item: Item = {} as Item;

  const update_user = () => {
    switch(item.category) {
      case "background": {
        throw new Error("Not implemented yet");
      }

      case "top": {
        set_user_preference({
          head_contract: item.collection,
          head_index: item.id
        })

        break;
      }

      case "hands": {
        set_user_preference({
          hand_contract: item.collection,
          hand_index: item.id
        })

        break;
      }

      default:
        throw new Error("Unknown item type");
    }
  }
</script>

<div class="wrapper">
  <Card>
    <div class="item">
      <h1>{item.name}</h1>
      <img alt={item.name} src={item.image} />

      <div class="buttons">
        <button on:click={() => { modal_open.set(true) }}>Land</button>
        <button class="primary" on:click={() => update_user()}>Equip</button>
      </div>
    </div>
  </Card>
</div>

<style lang="scss">
  @use "../scss/index" as imports;
  * {
    color: imports.$card-color;
  }
  .wrapper {
    transition-duration: 0.3s;
    &:hover {
      transform: scale(1.02);
    }
  }
  .item {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1 {
      width: 80%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 1.5rem;
      line-height: 1.1;
      height: calc(1.1 * 2em);
    }
    img {
      $margin: 15px;
      width: calc(100% - 2 * #{$margin});
      aspect-ratio: 1;
      margin: $margin;
      border-radius: 10px;
      object-fit: cover;
    }
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }

  button {
    text-align: center;
    padding: 12px 32px;
    border-radius: 6px;

    &:hover {
      background-color: darken(white, 10%);
    }

    &.primary {
      background-color: imports.$alt-color;

      &:hover {
        background-color: imports.$alt-color-dark;
      }
    }
  }
</style>
