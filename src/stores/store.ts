import { type Writable } from "svelte/store";
import { local_store } from './local_store';

export const username: Writable<string> = local_store("username", "");