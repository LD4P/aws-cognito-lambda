var aws = require('aws-sdk');

var ses = new aws.SES();

exports.handler = (event, context, callback) => {
    console.log(event);

    if (event.request.userAttributes.email) {
    // Pull another attribute if you want
            sendEmail("sinopia_admin@stanford.edu",
            "The following Sinopia user has been created:\n\nUsername: "+event.userName+"\nEmail: <"+event.request.userAttributes.email+">\nSub: "+event.request.userAttributes.sub+"\n\n(AWSrequestID for logging purposes = "+context.awsRequestId+")\n"
            , function(status) {
            callback(null, event);
        });
    } else {
        // Nothing to do, the user's email ID is unknown
        console.log("Failed");
        callback(null, event);
    }
};

function sendEmail(to, body, completedCallback) {
    var eParams = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Data: body
                }
            },
            Subject: {
                Data: "Sinopia User Registration in "+process.env.ENVIRONMENT+" environment"
            }
        },
        Source: "sinopia_admin@stanford.edu"
    };

    var email = ses.sendEmail(eParams, function(err, data){
        if (err) {
            console.log(err);
        } else {
            console.log("===EMAIL SENT===");
        }
        completedCallback('Email sent');
    });
    console.log("EMAIL CODE END");
};
