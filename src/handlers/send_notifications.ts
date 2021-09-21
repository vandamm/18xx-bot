import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Event', event);

  return { statusCode: 200, body: 'OK' };
};
