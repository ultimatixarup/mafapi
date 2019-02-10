import re
import json
import traceback
import boto3
from botocore.exceptions import ClientError

s3_resource = boto3.resource('s3')

s3_client = boto3.client('s3')

dynamodb_client = boto3.resource('dynamodb',region_name='us-east-1')

table_name = 'maf_table'

def lambda_handler():
    bucket_name = "maf-internal-s3";
    #key = "Sample_DB_Dataset_v1.txt";
    key = "SFProd_to_AWS.txt"
    obj = s3_client.get_object(Bucket=bucket_name,Key=key);
    data = obj['Body'].read().decode("utf-8")
    rows = data.split('\n')
    print("row=",rows[0])
    headers = rows[0].split('|')
    print("Headers",headers)

    table = dynamodb_client.Table(table_name)
    phoneTable = dynamodb_client.Table('phonebook')

    with table.batch_writer() as batch:
        i=0
        for row in rows:
            if i == 0:
                i=i+1
                continue
            else:
                i=i+1
                columns = row.split('|')
                print("PROCESSING MEMBER ID - ",columns[0] , "RECORD NUMBER=", i)
                datamap = {}
                for x in range(columns.__len__()):
                 #   print("in columns loop")
                  if x<19:
                    datamap[headers[x]]=columns[x] if (columns[x] and columns[x]!='\\N') else ' '
                    if "Phone" in headers[x] and columns[x] and columns[x] != '\\N' and columns[x] != '(123) 456-7890':
                        response = phoneTable.get_item(
                            Key={
                                'phone': columns[x]
                            }
                        )
                        data = {}

                        if 'Item' in response:
                            item = response['Item']

                            if item:
                                data = item['match'] + [{
                                    'type': headers[x],
                                    'mafid':columns[headers.index('MAFID')],
                                    'dob': columns[headers.index('DOB')]
                                }]

                        else:
                            data = [{
                                'type': headers[x],
                                'mafid':columns[headers.index('MAFID')],
                                'dob': columns[headers.index('DOB')]
                            }]
                        try:
                          phoneTable.put_item(Item={
                            'phone': columns[x],
                            'match': data
                          })
                        except ClientError as ex:
                          print("COULD NOT RIGHT PHONE RECORD:", ex, "DATA=",data, "PHONE=",columns[x])
                try:
                    batch.put_item(Item=datamap)
                except ClientError as ex:
                    print("COULD NOT RIGHT:", ex, "DATA=",datamap)


lambda_handler()