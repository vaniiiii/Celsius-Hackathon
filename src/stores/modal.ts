import {writable, type Writable } from "svelte/store";

export const modal_open: Writable<boolean> = writable<boolean>(false);