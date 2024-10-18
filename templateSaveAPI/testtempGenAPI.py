import unittest
from unittest.mock import patch, Mock
from templateSaveAPI.testtempGenAPI import lambda_handler

class TestLambdaHandler(unittest.TestCase):

    @patch('templateSaveAPI.testtempGenAPI.requests.post')
    def test_lambda_handler_success(self, mock_post):
        event = {'promt': 'test prompt'}
        context = {}
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'result': 'success'}
        mock_post.return_value = mock_response

        result = lambda_handler(event, context)

        self.assertEqual(result['statusCode'], 200)
        self.assertEqual(result['body'], {'result': 'success'})
        mock_post.assert_called_once_with(
            "https://x7edkhpsp5.execute-api.us-east-1.amazonaws.com/stage/modelapi",
            json={'promt': 'test prompt'}
        )

    @patch('templateSaveAPI.testtempGenAPI.requests.post')
    def test_lambda_handler_failure(self, mock_post):
        event = {'promt': 'test prompt'}
        context = {}
        mock_response = Mock()
        mock_response.status_code = 400
        mock_response.json.return_value = {'error': 'bad request'}
        mock_post.return_value = mock_response

        result = lambda_handler(event, context)

        self.assertEqual(result['statusCode'], 400)
        self.assertEqual(result['body'], {'error': 'bad request'})
        mock_post.assert_called_once_with(
            "https://x7edkhpsp5.execute-api.us-east-1.amazonaws.com/stage/modelapi",
            json={'promt': 'test prompt'}
        )

if __name__ == '__main__':
    unittest.main()