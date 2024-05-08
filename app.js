const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configure AWS SDK with your credentials
AWS.config.update({
    region: 'YOUR_SNS_REGION', // Change this to your desired region
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
  });

// Create an instance of the SNS service
const sns = new AWS.SNS();

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Send OTP using AWS SNS
  sns.publish({
    Message: `Your OTP is: ${otp}`,
    PhoneNumber: phoneNumber,
    MessageAttributes: {
      'AWS.SNS.SMS.SMSType': {
        DataType: 'String',
        StringValue: 'Transactional' // Use 'Transactional' or 'Promotional' based on your use case
      }
    }
  }, (err, data) => {
    if (err) {
      console.error('Failed to send OTP:', err);
      res.status(500).json({ error: 'Failed to send OTP' });
    } else {
      console.log('OTP sent successfully');
      res.status(200).json({ message: 'OTP sent successfully' });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
