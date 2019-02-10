const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region:"us-east-1"});

exports.handler = function(event, ctx, callback){


console.log("bodyjson====="+JSON.stringify(event));
	var params = {
    		TableName: "phonebook",
    	    KeyConditionExpression: "#phone = :phone",
            ExpressionAttributeNames:{
                "#phone": "phone"
            },
            ExpressionAttributeValues: {
                ":phone":event.params.querystring.phone
            }
		};
	docClient.query(params,function(err, data){
		if(err){
			callback(err,null);
		}else{
			callback(null,data.Items[0].match);
		}
		
	});

}
