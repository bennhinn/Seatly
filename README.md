# Environment Variables Setup

To configure the environment for the Seatly application, please make sure to set up the following environment variables:

## Frontend Environment Variables

The frontend requires specific variables to function properly. Below are the details:

| Variable Name             | Description                                      | Example Value                    |
|---------------------------|--------------------------------------------------|----------------------------------|
| `REACT_APP_API_URL`      | The base URL for API requests from the frontend. | `https://api.seatly.com`        |
| `REACT_APP_AUTH_TOKEN`   | The token used to authorize requests.            | `your_auth_token_here`          |

Ensure you use the correct variable names in your .env file. Make sure to prefix all frontend variables with `REACT_APP_`.

## Additional Setup Instructions

1. **Create a `.env` file** in the root of your project if it doesn't exist.
2. **Add the required variables** listed above, and their corresponding values.
3. Save the `.env` file.

Ensure that you restart your development server after making these changes to see the effects.

By following these instructions, you will set up the necessary environment variables for both frontend and backend to work seamlessly together.

If you need further assistance, please refer to the documentation or reach out to the support team.