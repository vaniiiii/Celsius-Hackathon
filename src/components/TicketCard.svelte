<script lang="ts">
    import Card from "./Card.svelte";

    export let ticket: any = {};
</script>

<div class="wrapper">
    <Card>
        <div class="ticket" >
            <h1>{ticket.name}</h1>
            <img alt={ticket.name} src={ticket.image} />
            <span>{ticket.category}</span>
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
  .ticket {
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
</style>