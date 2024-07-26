import { IndexType, Permission } from 'node-appwrite';

import { db, questionCollection } from '@/models/name';
import { databases } from './config';


async function createQuestionCollection() {
    // create question collection
    await databases.createCollection(db, questionCollection,
        questionCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]
    )
    console.log("Question collection is created");

    // creating Attributes and indexes
    await Promise.all([
        databases.createStringAttribute(db, questionCollection, 'title', 100, true),
        databases.createStringAttribute(db, questionCollection, 'content', 10000, true),
        databases.createStringAttribute(db, questionCollection, 'authorId', 50, true),
        databases.createStringAttribute(db, questionCollection, 'tags', 50, true, undefined, true),
        databases.createStringAttribute(db, questionCollection, 'attachmentId', 100, false),
    ])

    console.log('Attributes are created');


    // create Indexes 
    console.log("Trying to create indexes 👀👀👀");
    
    await Promise.all([
        
        databases.createIndex(db,
            questionCollection,
            "title",
            IndexType.Fulltext,
            ["title"],
            ['ASC']),

        databases.createIndex(db,
            questionCollection,
            "content",
            IndexType.Fulltext,
            ["content"],
            ['ASC'])
    ])


}

export default createQuestionCollection;
