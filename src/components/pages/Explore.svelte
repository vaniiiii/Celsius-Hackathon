<script lang="ts">
  import { get_items_on_sale } from "../../libs/web3";
  import ItemSellCard from "../ItemSellCard.svelte";
  import type { ItemSell } from "../../libs/types";

  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";

  let filtered: ItemSell[],
    items: ItemSell[] = [];

  const loadData = async () => {
    try {
      items = await get_items_on_sale();
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
  const set_filters = (filters: Filters, items: ItemSell[]) => {
    const { search } = filters;
    filtered = items
      .filter((item: ItemSell) => {
        if (
          search.length != 0 &&
          `${item.name}`.toLowerCase().indexOf(search.toLowerCase()) === -1
        )
          return false;
        return true;
      })
      .sort((f1: ItemSell, f2: ItemSell): number => {
        const order = filters.sort_order ? -1 : 1;
        switch (filters.sorting) {
          case Sorting.Name:
            return (f1.name < f2.name ? -1 : 1) * order;
          case Sorting.Price:
            return (f1.price < f2.price ? -1 : 1) * order;
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
      <h1>Explore</h1>
      <p>
        Welcome to the Celsius Hub marketplace, your location for transfering assets as you wish.
        <br />
        It's easy, filter what you need and start using our interoperable environment
      </p>
      <a href="#items">Explore</a>
    </div>

    <img alt="Explore" src="/images/explore.svg">
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
            Currently there are no items for sale
          {:else if items.length === 0}
            No items for sale with selected filters
          {/if}

          {#each filtered as item (item.image)}
            <div
              animate:flip={{ duration: 750 }}
              in:receive={{ key: item.image }}
              out:send={{ key: item.image }}
            >
              <ItemSellCard {item} />
            </div>
          {/each}
        </div>
      {:catch e}
        Error loading items: {e}
      {/await}
    </div>
  </div>
</div>

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

    button.secondary {
      @include imports.call-to-action-secondary;
    }
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
