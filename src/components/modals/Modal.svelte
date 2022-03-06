<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { modal_open } from "../../stores/modal";
  import Close from "../Close.svelte";
  import Card from "../Card.svelte";

  let open = false;
  let open_unsubscribe = modal_open.subscribe((val) => (open = val));
  const modal_close = () => {
    modal_open.set(false);
  };
  const escape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      modal_close();
    }
  };

  onMount(() => {
    window.addEventListener("keydown", escape);
  });

  onDestroy(() => {
    open_unsubscribe();
  });
</script>

<div class="bg" class:open on:click={modal_close}>
  <div on:click|stopPropagation={() => {}}>
    <Close click={modal_close} />
    <Card>
      <div class="wrapper">
        <h2>Land your NFT</h2>

        <span>
          <label for="amount">Amount</label>
          <input type="text" id="amount" />
        </span>

        <span>
          <label for="interest">Interest</label>
          <input type="text" id="interest" />
        </span>

        <span>
          <label for="duration">Duration</label>
          <input type="text" id="duration" />
        </span>

        <button class="right">Land</button>
      </div>
    </Card>
  </div>
</div>

<style lang="scss">
  @use "../../scss" as imports;

  div.bg {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: grid;
    place-content: center;
    z-index: 100;
    transition: opacity 0.2s;
    opacity: 1;

    & > * {
      transition: transform 0.3s;
      transform: translateY(0);
    }
  }

  div.bg:not(.open) {
    opacity: 0;
    pointer-events: none;

    & > * {
      transform: translateY(-60px);
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
  }

  .right {
    align-self: flex-end;
  }

  button {
    text-align: center;
    padding: 12px 32px;
    border-radius: 6px;
      background-color: imports.$alt-color;

    &:hover {
      background-color: imports.$alt-color-dark;
    }
  }

  label {
    display: inline;
  }

  input {
    border: 2px solid black;
  }
</style>
