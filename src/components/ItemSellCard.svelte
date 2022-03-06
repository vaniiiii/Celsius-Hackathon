<script lang="ts">
    import Card from "./Card.svelte";
    import { buy_item } from "../libs/web3";

    export let item: any = {};
</script>

<div class="wrapper">
    <Card>
        <div class="item" >
            <h1>{item.name}</h1>
            <img alt={item.name} src={item.image} />
            <span>{item.price} ETH</span>
            <button on:click={() => buy_item(item)}>Buy</button>
        </div>
    </Card>
</div>

<style lang="scss">
  @use '../scss/index' as imports;
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

  button {
    margin-top: 8px;
    background-color: imports.$alt-color;
    padding: 12px 32px;
    border-radius: 6px;

    &:hover {
      background-color: imports.$alt-color-dark;
    }
  }
</style>