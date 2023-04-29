import { Logger } from '@aws-lambda-powertools/logger';

const awsLambdaPowertoolsVersion = '1.5.1';

const defaultValues = {
    environment: process.env.ENVIRONMENT || 'N/A',
};

const logger = new Logger({
    persistentLogAttributes: {
        ...defaultValues,
        logger: {
            name: '@aws-lambda-powertools/logger',
            version: awsLambdaPowertoolsVersion,
        },
    },
});

export { logger };
