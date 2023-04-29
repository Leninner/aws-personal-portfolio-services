import { APIGatewayProxyResult } from 'aws-lambda';
import { logger } from '../common/powertools';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';
const dynamoClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

interface IProject {
    id: number;
    name: string;
    description: string;
    image: string;
    stack?: string[];
    livePreview?: string;
    sourceCode?: string;
}

export const postProject = async (projectBody: IProject): Promise<APIGatewayProxyResult> => {
    try {
        const uuid = randomUUID();
        logger.appendKeys({ uuid });

        const params = {
            Item: {
                ...projectBody,
                id: uuid,
                created: Date.now(),
            },
            TableName: `projects`,
        };

        await documentClient.send(new PutCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
