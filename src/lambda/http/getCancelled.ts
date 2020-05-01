import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const ridesTable = process.env.RIDES_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const result = await docClient.scan({
    TableName: ridesTable,
    ProjectionExpression: 'from_city_id, from_date, Car_Cancellation',
    FilterExpression: 'Car_Cancellation = :one',
    ExpressionAttributeValues : {':one' : 1}
  }).promise()

  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
