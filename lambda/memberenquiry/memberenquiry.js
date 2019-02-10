const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region:"us-east-1"});

exports.handler = function(event, ctx, callback){


console.log("bodyjson====="+JSON.stringify(event));
        var params = {
                TableName: "maf_table",
            KeyConditionExpression: "#mafid = :mafid",
            ExpressionAttributeNames:{
                "#mafid": "MAFID"
            },
            ExpressionAttributeValues: {
                ":mafid":event.params.querystring.mafid
            }
                };
        docClient.query(params,function(err, data){
                if(err){
                        callback(err,null);
                }else{
                        var jsondata = {};
                        var itemdata = data.Items[0];
                        jsondata['FirstName'] = itemdata.FirstName;
                        jsondata['LastName'] = itemdata.LastName;
                        jsondata['DOB'] = itemdata.DOB;
                        jsondata['MAFID'] = itemdata.MAFID;
                        jsondata['Gender'] = itemdata.Gender;
                        var engraving = {};
                        var engravings = [];
                        if('Engraving1' in itemdata){
                            engraving['Engraving1'] = itemdata.Engraving1;
                            engraving['RecentEngravingDate'] = itemdata['1RecentEngravingDate'];
                            engravings.push(engraving);
                        }
                        if( 'Engraving2' in itemdata){
                            var engraving = {};
                            engraving['Engraving'] = itemdata.Engraving2;
                            engraving['RecentEngravingDate'] = itemdata['2RecentEngravingDate'];
                            engravings.push(engraving);
                        }
                        if( 'Engraving3' in itemdata){
                            var engraving = {};
                            engraving['Engraving'] = itemdata.Engraving3;
                            engraving['RecentEngravingDate'] = itemdata['3RecentEngravingDate'];
                            engravings.push(engraving);
                        }
                        jsondata['Engraving'] = engravings;
                        
                        
                        var phone = {};
                        var phones = [];
                        if('HomePhone' in itemdata && itemdata.HomePhone.trim().length > 0){
                           phone['Type'] = 'HomePhone';
                           phone['Number'] = itemdata.HomePhone;
                           phones.push(phone);
                        }
                        if('MobilePhone' in itemdata && itemdata.MobilePhone.trim().length > 0){
                           phone = {};
                           phone['Type'] = 'MobilePhone';
                           phone['Number'] = itemdata.MobilePhone;
                           phones.push(phone);
                        }
                        if('OtherPhone' in itemdata && itemdata.OtherPhone.trim().length > 0){
                           phone = {};
                           phone['Type'] = 'OtherPhone';
                           phone['Number'] = itemdata.OtherPhone;
                           phones.push(phone);
                        }
                        if('PreferredPhone' in itemdata && itemdata.PreferredPhone.trim().length > 0){
                           phone = {};
                           phone['Type'] = 'PreferredPhone';
                           phone['Number'] = itemdata.PreferredPhone;
                           phones.push(phone);
                        }
                        if('WorkPhone' in itemdata && itemdata.WorkPhone.trim().length > 0){
                           phone = {};
                           phone['Type'] = 'WorkPhone';
                           phone['Number'] = itemdata.WorkPhone;
                           phones.push(phone);
                        }
                        if('AssistantPhone' in itemdata && itemdata.AssistantPhone.trim().length > 0){
                           phone = {};
                           phone['Type'] = 'AssistantPhone';
                           phone['Number'] = itemdata.AssistantPhone;
                           phones.push(phone);
                        }
                        jsondata['Phone'] = phones;
                        
                        
                        callback(null,jsondata);
                }

        });

}
