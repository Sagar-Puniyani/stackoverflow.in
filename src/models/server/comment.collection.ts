import {Permission } from 'node-appwrite';

import { db, commentCollection } from '@/models/name';
import { databases } from './config';


async function createCommentCollection() {
    // create comment collection
    await databases.createCollection(db, commentCollection,
        commentCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]
    )
    console.log("Comment collection is created");

    // creating Attributes 
    await Promise.all([
        databases.createStringAttribute(db, commentCollection, 'content', 10000, true),
        databases.createEnumAttribute(db, commentCollection, 'type', ["Question","Answer"], true),
        databases.createStringAttribute(db, commentCollection, 'typeId', 50, true),
        databases.createStringAttribute(db, commentCollection, 'authorId', 50, true),
    ])

    console.log('Comment Attributes are created');

}

export default createCommentCollection;
