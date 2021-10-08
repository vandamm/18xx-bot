import { SecretsManager } from 'aws-sdk';

const client = new SecretsManager({ region: 'eu-north-1' });

export async function getSecret(name: string): Promise<string> {
  const data = await client.getSecretValue({ SecretId: name }).promise();

  if ('SecretString' in data) {
    return data.SecretString;
  } else {
    return Buffer.from(data.SecretBinary as any, 'base64').toString('ascii');
  }
}
