import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        // grab the data 
        const { votedById, voteStatus, type, typeId } = await request.json();

        // list-document
        const response = await databases.listDocuments(
            db,
            voteCollection,
            [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById),
            ]
        );

        if (response.documents.length > 0) {
            await databases.deleteDocument(db, voteCollection, response.documents[0].$id);

            // decrease the reputation 
            const QuesOrAnswerInstance = await databases.getDocument(
                db,
                type === "question" ? questionCollection : answerCollection,
                typeId
            );

            const authorPrefs = await users.getPrefs<UserPrefs>(QuesOrAnswerInstance.authorId);

            await users.updatePrefs(QuesOrAnswerInstance.authorId, {
                reputation: response.documents[0].voteStatus === "upvoted" ?
                    Number(authorPrefs.reputation) - 1 : Number(authorPrefs.reputation) + 1
            })
        }

        // that case prev vote does exists or vote status changed
        if (response.documents[0]?.voteStatus !== voteStatus) {
            await databases.createDocument(db, voteCollection, ID.unique(), 
            {
                type,
                typeId,
                voteStatus,
                votedById
            });

            // Increase and decrease the reputation 
            // decrease the reputation 
            const QuesOrAnswerInstance = await databases.getDocument(
                db,
                type === "question" ? questionCollection : answerCollection,
                typeId
            );

            const authorPrefs = await users.getPrefs<UserPrefs>(QuesOrAnswerInstance.authorId);

             // if vote was present
            if (response.documents[0]) {
                await users.updatePrefs<UserPrefs>(QuesOrAnswerInstance.authorId, {
                    reputation:
                        // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                        response.documents[0].voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) - 1
                            : Number(authorPrefs.reputation) + 1,
                });
            } else {
                await users.updatePrefs<UserPrefs>(QuesOrAnswerInstance.authorId, {
                    reputation:
                        // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                        voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) + 1
                            : Number(authorPrefs.reputation) - 1,
                });
        }

        const [upvote, downvote] = await Promise.all([
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById),
                Query.equal("voteStatus", "upvoted"),
                Query.limit(1)
            ]),
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById),
                Query.equal("voteStatus", "downvoted"),
                Query.limit(1)
            ])
        ]);


        return NextResponse.json(
            {
                data: {
                    document: null,
                    voteResult: upvote.total + downvote.total
                },
                message: "vote handled",
            },
            { status: 200 }
        )

    } 
}


    catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error in Voting"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}