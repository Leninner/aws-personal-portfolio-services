import { APIGatewayProxyEventBase, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logger } from './common/powertools';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import { HTTP_METHODS } from './constants/appEnums';
import { postProject } from './handlers/postProject';
import { getProjects } from './handlers/getProject';
import { updateProject } from './handlers/updateProject';

export interface IProject {
    id: number;
    title: string;
    description: string;
    image: string;
    stack?: string[];
    livePreview?: string;
    sourceCode?: string;
}

const lambdaHandler = async (event: APIGatewayProxyEventBase<IProject>): Promise<APIGatewayProxyResult> => {
    logger.info('[MANAE PROJECTS] Lambda invoked', { details: { ...event } });
    const { httpMethod } = event;

    switch (httpMethod) {
        case HTTP_METHODS.POST:
            return postProject(event.body as unknown as IProject);
        case HTTP_METHODS.GET:
            return getProjects();
        case HTTP_METHODS.PUT:
            return updateProject(event.body as unknown as IProject);
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'invalid http method',
                }),
            };
    }
};

export const handler = middy(lambdaHandler)
    .use(injectLambdaContext(logger))
    .use(httpHeaderNormalizer())
    .use(httpJsonBodyParser())
    .use(httpErrorHandler())
    .use(cors());
