import collection_abi from "../abis/collection.json";
import marketplace_abi from "../abis/marketplace.json";
import customization_abi from "../abis/customization.json";

import { type Item, type ItemSell, type Ticket, type ProfilePicture } from "./types";

// @ts-ignore
const marketplace_address = import.meta.env.PUBLIC_MARKETPLACE_ADDRESS;
// @ts-ignore
const collection_address = import.meta.env.PUBLIC_COLLECTION_ADDRESS;
// @ts-ignore
const tickets_address = import.meta.env.PUBLIC_TICKETS_ADDRESS;
// @ts-ignore
const customizations_address = import.meta.env.PUBLIC_CUSTOMIZATION_ADDRESS;
// @ts-ignore
const images_url = import.meta.env.PUBLIC_IMAGES;
// @ts-ignore
const ipfs_data_url = import.meta.env.PUBLIC_IPFS_DATA;

const addr0 = "0x0000000000000000000000000000000000000000";

declare global {
  interface Window {
    ethereum: any;
    marketplace: any;
    web3: any;
    collection: any;
    tickets: any;
    customization: any;
    user: string;
  }
}

export const toETH = (wei: string): string => {
  return window.web3.utils.fromWei(wei);
};

export const load_web3 = async () => {
  // @ts-ignore
  window.web3 = new Web3(window.ethereum);

  window.marketplace = new window.web3.eth.Contract(
    marketplace_abi.abi as any,
    marketplace_address
  );
  window.collection = new window.web3.eth.Contract(
    collection_abi as any,
    collection_address
  );
  window.tickets = new window.web3.eth.Contract(
    collection_abi as any,
    tickets_address
  );
  window.customization = new window.web3.eth.Contract(
    customization_abi as any,
    customizations_address
  );

  const accounts: string[] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  if (accounts.length === 0) {
    return false;
  }

  window.user = accounts[0];
};

const get_token = async (contract: any, id: string): Promise<Item> => {
  const item_uri = await contract.methods.tokenURI(id).call();
  const ipfs_response = await fetch(`${ipfs_data_url}/${item_uri}`, {
    method: "GET",
  });

  if (ipfs_response.status < 200 && ipfs_response.status >= 300) {
    throw new Error("error connecting to IPFS");
  }

  const { name, image, avatar_image, category } = await ipfs_response.json();
  return {
    name,
    image: `${ipfs_data_url}/${image}`,
    avatar_image: `${ipfs_data_url}/${avatar_image}`,
    category,
    collection: contract._address,
    id
  };
};

export const get_items_on_sale = async (): Promise<ItemSell[]> => {
  const { marketplace, collection } = window;

  const items: ItemSell[] = Array<ItemSell>();

  const count: number = await collection.methods.totalSupply().call();

  for (let index = 0; index < count; index++) {
    const on_sale = await marketplace.methods
      .isOnSale(collection._address, `${index + 1}`)
      .call();
    if (on_sale) {
      const item = await get_token(collection, `${index + 1}`);
      const price = await marketplace.methods
        .getNFTPrice(collection._address, `${index + 1}`)
        .call();
      items.push({ ...item, price: toETH(price) });
    }
  }

  return items;
};

export const get_user_items = async (): Promise<Item[]> => {
  const { collection, user } = window;

  const items: Item[] = Array<Item>();

  let tokens = await collection.methods.tokensOfOwner(user).call();

  for (const token of tokens) {
    const t = await get_token(collection, `${token}`);
    items.push(t);
  }

  return items;
};

export const sell_item = async (id: string, price: string) => {
  const { marketplace, collection, user } = window;

  await collection.methods.approve(marketplace._address, id).send({
    from: user,
  });

  await marketplace.methods
    .createSellOffer(collection._address, id, price)
    .send({
      from: user,
    });
};

export const buy_item = async (item: ItemSell) => {
  const { marketplace, user } = window;

  const price = await marketplace.methods
    .getNFTPrice(item.collection, item.id)
    .call();

  await marketplace.methods.purchaseNFT(item.collection, item.id).send({
    from: user,
    value: price
  });
};

export const get_user_tickets = async (): Promise<Ticket[]> => {
  const { tickets, user } = window;

  const items: Item[] = Array<Item>();

  const tokens = await tickets.methods.tokensOfOwner(user).call();

  for (const token of tokens) {
    items.push(await get_token(tickets, `${token}`));
  }

  return items;
};

export const get_user_preference = async (): Promise<ProfilePicture> => {
  const { customization, user } = window;

  const {
    ca0: head_contract,
    tokenId0: head_index,
    ca1: hand_contract,
    tokenId1: hand_index,
  } = await customization.methods.userAssets(user).call();

  let head_link: string;
  let hand_link: string;

  if (head_contract === addr0) {
    head_link = "";
  } else {
    const contract = new window.web3.eth.Contract(
      collection_abi as any,
      head_contract
    );
    const token = await get_token(contract, head_index);

    head_link = token.avatar_image;
  }

  if (hand_contract === addr0) {
    hand_link = "";
  } else {
    const contract = new window.web3.eth.Contract(
      collection_abi as any,
      hand_contract
    );
    const token = await get_token(contract, hand_index);

    hand_link = token.avatar_image;
  }

  return {
    head_contract,
    head_index,
    head_link,
    hand_contract,
    hand_index,
    hand_link,
  }
};

export const get_user_profile = async (): Promise<string> => {
  const old = await get_user_preference();

  const {head_link, hand_link} = old;

  return `${images_url}?background=&human=&hands=${hand_link}&top=${head_link}`;
}

export const set_user_preference = async (update: any) => {
  const { customization, user } = window;
  const old = await get_user_preference();

  const {
    head_contract,
    head_index,
    hand_contract,
    hand_index
  } = {...old, ...update as ProfilePicture};

  await customization.methods
    .setAssets(
      head_contract,
      head_index,
      hand_contract,
      hand_index)
    .send({
      from: user,
    });
};

