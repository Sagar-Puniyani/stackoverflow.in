import {db} from '../name';
import { databases } from './config';

import createAnswerCollection from './answer.collection';
import createQuestionCollection from './question.collection';
import createCommentCollection from './comment.collection';
import createVoteCollection from './vote.collection';


export default async function GetOrCreateDB() {
    try {
        await databases.get(db);
        console.log("Database is Connected");
        
    } catch (error) {
        try {
            await databases.create(db,db);

            // create All collections
            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection()
            ])

            console.log("Collection are created");
            console.log("Database connected");
            

        } catch (error) {
            console.log("Error in creating Databases or Collections", error);
        }
    }

    return databases;
}