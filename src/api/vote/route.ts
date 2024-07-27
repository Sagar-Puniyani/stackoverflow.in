import { db, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request :NextRequest) {
    try {
        // grab the data 
        const {votedById, voteStatus, type, typeId} = await request.json();
        
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

        if (response.documents.length > 0){

        }
        // that case prev vote does exists or vote status changed

        if (response.documents[0]?.voteStatus  !== voteStatus){

        }

        const [upvote , downvote ] = await Promise.all([
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
            {data : {
                document : null,
                voteResult : upvote.total = downvote.total 
            },
                message: "vote handled",
        },
            {status : 200}
        )

    } catch (error: any ) {
        return NextResponse.json(
            {
                error : error?.message || "Error in Voting"
            },
            {
                status : error?.status || error?.code || 500
            }
        )
    }
}