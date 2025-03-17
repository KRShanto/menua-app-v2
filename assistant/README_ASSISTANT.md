# Restaurant AI Assistant

A Python-based AI assistant that acts as a restaurant server, using OpenAI's GPT-4o model. The assistant has knowledge of your restaurant's menu items and discounts, and can engage in natural conversations with customers.

## Features

- 🤖 AI-powered restaurant server named Alex
- 🍽️ Full access to your restaurant's menu from Firebase
- 💰 Awareness of special discounts and promotions
- 💬 Maintains conversation history for context
- 🌐 Bilingual support (English and Arabic menu items)
- 🔄 Fallback to sample menu data if Firebase connection fails

## Requirements

- Python 3.8+
- OpenAI API key
- Firebase project (optional, can use sample data)

## Installation

1. Clone this repository or download the files.

2. Install the required dependencies:

```bash
pip install openai python-dotenv firebase-admin
```

3. Create a `.env` file based on the `.env.example` template:

```bash
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Set up Firebase (optional):
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Generate a service account key from Project Settings > Service Accounts
   - Save the JSON file as `firebase-credentials.json` in the project directory
   - Or specify the path in the `.env` file: `FIREBASE_SERVICE_ACCOUNT_PATH=path/to/your/credentials.json`

## Usage

Run the assistant:

```bash
python restaurant_assistant.py
```

### Commands

- Type your questions or requests as if talking to a server
- Type `clear` to start a new conversation
- Type `exit` to quit the program

### Example Conversations

```
You: Hi, what's on the menu today?

Alex (Server): Hello and welcome to our restaurant! We have a variety of delicious options on our menu today.

For appetizers, we have Hummus and our special Mozzarella Sticks which are currently 20% off.

Our main courses include Grilled Salmon, which is also on special with 20% off, and our premium Beef Tenderloin.

For dessert, we offer a rich Chocolate Cake.

Would you like me to tell you more about any specific dish or would you like to hear about our specials today?
```

```
You: What are your specials today?

Alex (Server): Today we have two fantastic specials I'd be happy to tell you about:

1. Mozzarella Sticks - Now only $7.99 (Save $2.00 - 20% off!)
   These are breaded mozzarella sticks served with our house marinara sauce. They're crispy on the outside and perfectly melty on the inside!

2. Grilled Salmon - Now only $19.99 (Save $5.00 - 20% off!)
   This is fresh salmon grilled to perfection, served with our signature lemon butter sauce and seasonal vegetables.

Both are customer favorites and at a great value today. Would you like to try either of these specials, or do you have any questions about them?
```

## Customization

You can modify the `create_system_prompt` function in `restaurant_assistant.py` to change the personality or behavior of the AI server.

## Troubleshooting

- **API Key Issues**: Ensure your OpenAI API key is valid and has sufficient credits
- **Firebase Connection**: If you encounter Firebase connection issues, the system will automatically fall back to sample menu data
- **Model Errors**: If you see errors related to the model, try reducing `max_tokens` in the `chat_with_assistant` function

## License

This project is licensed under the MIT License - see the LICENSE file for details. 