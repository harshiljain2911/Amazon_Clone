import axios from 'axios';

const testSendOtp = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/send-otp', {
      email: 'test_node_fix@example.com'
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testSendOtp();
