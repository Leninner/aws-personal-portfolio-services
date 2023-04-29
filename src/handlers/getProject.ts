import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({});

export const getProjects = async (): Promise<APIGatewayProxyResult> => {
    try {
        const params = {
            TableName: 'projects',
        };
        const command = new ScanCommand(params);
        const response = await client.send(command);
        const parsedResponse = response?.Items?.map((item) => unmarshall(item));

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: parsedResponse,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
