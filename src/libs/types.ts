export type Item = {
    collection: string,
    id: string,
    name: string,
    image: string,
    avatar_image: string,
    category: string
}

export type ItemSell = {
    collection: string,
    id: string,
    name: string,
    image: string,
    avatar_image: string,
    category: string,
    price: string
}

export type Ticket = {
    name: string,
    image: string,
    category: string
}

export type ProfilePicture = {
    head_contract: string,
    head_index: string,
    head_link: string;
    hand_contract: string,
    hand_index: string,
    hand_link: string;
}