<script lang="ts">
  import { get_user_items } from "../../libs/web3";
  import ItemCard from "../ItemCard.svelte";
  import type { Item } from "../../libs/types";

  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import Modal from "@components/modals/Modal.svelte";

  let filtered: Item[],
    items: Item[] = [];

  const loadData = async () => {
    try {
      items = await get_user_items();
      items = items === null ? [] : items;
      filtered = items;
      return items;
    } catch (e) {
      throw e;
    }
  };

  enum Sorting {
    Name = "Name",
    Price = "Price",
    Date = "Date",
  }

  interface Filters {
    search: string;
    sorting: Sorting;
    sort_order: boolean;
  }

  const default_filters: Filters = Object.freeze({
    search: "",
    sorting: Sorting.Name,
    sort_order: false,
  });

  let filters: Filters = { ...default_filters };
  const set_filters = (filters: Filters, items: Item[]) => {
    const { search } = filters;
    filtered = items
      .filter((item: Item) => {
        if (
          search.length != 0 &&
          `${item.name}`.toLowerCase().indexOf(search.toLowerCase()) === -1
        )
          return false;
        return true;
      })
      .sort((f1: Item, f2: Item): number => {
        const order = filters.sort_order ? -1 : 1;
        switch (filters.sorting) {
          case Sorting.Name:
            return (f1.name < f2.name ? -1 : 1) * order;
          default:
            return 0;
        }
      });
  };
  $: set_filters(filters, items);
  const clear_filters = () => (filters = { ...default_filters });
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 1000),
    fallback() {
      return {
        duration: 300,
        easing: quintOut,
        css: (t) => `opacity: ${t}`,
      };
    },
  });
</script>

<div class="explore">
  <div class="page explore">
    <div class="wrapper">
      <h1>My Items</h1>
      <p>Non-fungible items are unique digital files. And in a novel asset market, these items offer a level of exclusivity. This has the power to launch the NFT revolution in valuable item buying and sale.</p>
      <a href="#items">Explore</a>
    </div>

    <img alt="My Items" src="/images/items.svg">
  </div>

  <div id="items">
    <div>
      <div class="filters">
        <h2>Sort</h2>
        <span>
          <select bind:value={filters.sorting} id="sort" name="sort">
            {#each Object.entries(Sorting) as sort}
              <option value={sort[1]}>{sort[1]}</option>
            {/each}
          </select>
          <button
            aria-label="reverse order"
            class="sort-order"
            class:rotated={filters.sort_order}
            on:click={() => (filters.sort_order = !filters.sort_order)}
          />
        </span>
        <h2>Search</h2>
        <input
          bind:value={filters.search}
          placeholder="Search term"
          type="text"
        />
        <button class="reset" on:click={clear_filters}>Reset</button>
      </div>
    </div>
    <div class="items">
      {#await loadData()}
        <span>Loading...</span>
      {:then items}
        <div class="cards">
          {#if items.length === 0}
            Currently you have no items
          {:else if items.length === 0}
            You have no items that match selected filters
          {/if}

          {#each filtered as item (item.image)}
            <div
              animate:flip={{ duration: 750 }}
              in:receive={{ key: item.image }}
              out:send={{ key: item.image }}
            >
              <ItemCard {item} />
            </div>
          {/each}
        </div>
      {:catch e}
        Error loading items: {e}
      {/await}
    </div>
  </div>
</div>
<Modal />

<style lang="scss">
  @use "../../scss" as imports;

  $padding: 16px;
  #items {
    display: grid;
    grid-template-columns: 300px 1fr;
    padding-top: 0;
    & > div:nth-child(2) {
      min-height: 100vh;
    }
  }

  .items {
    padding-top: 2 * $padding;
  }

  .filters {
    position: sticky;
    top: 0;
    padding: $padding 0;
    display: flex;
    flex-direction: column;
    align-items: start;
    max-height: 100vh;
    overflow-y: auto;
  }

  h2:not(:first-child) {
    margin-top: 0.75rem;
  }

  span {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }

  .sort-order {
    height: 2em;
    aspect-ratio: 1/1;
    background-color: imports.$alt-color;
    border-radius: 50%;
    position: relative;
    display: grid;
    transition: transform 0.2s ease-in-out;
    &:hover {
      background-color: desaturate(imports.$alt-color, 30%);
    }
    &.rotated {
      transform: rotate(180deg);
    }
    &:after {
      content: "";
      background: url("/icons/up.svg");
      background-size: contain;
    }
  }
  @include imports.input-text;
  @include imports.select;

  .reset {
    @include imports.button;
    margin-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    color: black;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .page {
    @include imports.page;

    a {
      @include imports.call-to-action;
    }

    // button.secondary {
    //   @include imports.call-to-action-secondary;
    // }
  }

  .explore {
    .wrapper {
      left: 32px;
    }

    img {
      right: 0;
      padding-right: 5%;
    }
  }
</style>
