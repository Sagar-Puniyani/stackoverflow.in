import env from "@/app/env";

import {
    Avatars,
    Databases,
    Client,
    Storage,
    Users
} from 'node-appwrite';

let client = new Client();

client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.AppwriteKey) // Your secret API key
    ;


const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);

export {
    client,
    users,
    avatars,
    databases,
    storage
}
