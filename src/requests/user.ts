import { username } from "@stores/store";


export const connect = async () => {

    // @ts-ignore
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    username.set(account);

    ethereum.on('accountsChanged', async () => {
        disconnected();
    });

    // window.location.assign("/me");

    return accounts
}

export const is_connected = async (): Promise<boolean> => {
    const accounts = await connect();
    
    return `${accounts[0]}` == `${localStorage.getItem('username')}`;
}


export const disconnected = async () => {
    username.set("");
}