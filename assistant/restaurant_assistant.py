import os
import json
import openai
import signal
import sys
from dotenv import load_dotenv
import requests
from requests.exceptions import RequestException
import pygame
import tempfile
import speech_recognition as sr
import threading
import time

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

# Initialize ElevenLabs API
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Default to "Rachel" voice

# Initialize pygame for audio playback
pygame.mixer.init()

# Initialize speech recognition
recognizer = sr.Recognizer()

# Load environment variables
FIREBASE_API_KEY = os.getenv('FIREBASE_API_KEY')
FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')

# Collection names from your Firebase setup
MENU_COLLECTION = "production__menu"
DISCOUNT_COLLECTION = "production__discount"
CATEGORY_IMAGE_COLLECTION = "production__category_images"
INDEX_CATEGORY_COLLECTION = "production__index"
INDEX_DISCOUNT_COLLECTION = "production__discount_index"

# Chat history storage
conversation_history = []

# Store menu data globally to avoid redundant formatting
global_menu_data = None
global_system_prompt = None

def fetch_menu_data():
    """Fetch menu data from Firebase using REST API (client-side approach)"""
    try:
        # Firestore REST API endpoint for the menu collection
        menu_url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/{MENU_COLLECTION}"
        
        # Add API key for authentication
        params = {"key": FIREBASE_API_KEY}
        
        # Fetch menu items
        menu_response = requests.get(menu_url, params=params)
        menu_response.raise_for_status()
        menu_data = menu_response.json()
        
        menu_items = []
        if 'documents' in menu_data:
            for doc in menu_data['documents']:
                # Extract document ID from the path
                doc_id = doc['name'].split('/')[-1]
                
                # Extract fields from Firestore format
                fields = doc.get('fields', {})
                
                # Get price value and log it
                price_field = fields.get('price', {})
                price_value = 0
                if 'doubleValue' in price_field:
                    price_value = float(price_field.get('doubleValue', 0))
                elif 'integerValue' in price_field:
                    price_value = float(price_field.get('integerValue', 0))
                elif 'stringValue' in price_field:
                    try:
                        price_value = float(price_field.get('stringValue', '0'))
                    except ValueError:
                        pass
                
                # Convert Firestore field format to Python dict
                item = {
                    'id': doc_id,
                    'name': fields.get('name', {}).get('stringValue', ''),
                    'name_arab': fields.get('name_arab', {}).get('stringValue', ''),
                    'category': fields.get('category', {}).get('stringValue', ''),
                    'category_arab': fields.get('category_arab', {}).get('stringValue', ''),
                    'calories': fields.get('calories', {}).get('stringValue', ''),
                    'price': price_value,
                    'description': fields.get('description', {}).get('stringValue', ''),
                    'description_arab': fields.get('description_arab', {}).get('stringValue', ''),
                    'imageURL': fields.get('imageURL', {}).get('stringValue', ''),
                }
                
                # Handle optional index field
                if 'index' in fields:
                    if 'integerValue' in fields['index']:
                        item['index'] = int(fields['index'].get('integerValue', 0))
                    elif 'doubleValue' in fields['index']:
                        item['index'] = int(fields['index'].get('doubleValue', 0))
                
                menu_items.append(item)
        
        # Fetch discounts
        discount_url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/{DISCOUNT_COLLECTION}"
        discount_response = requests.get(discount_url, params=params)
        discount_response.raise_for_status()
        discount_data = discount_response.json()
        
        # Process discounts
        discounts = {}
        if 'documents' in discount_data:
            for doc in discount_data['documents']:
                doc_id = doc['name'].split('/')[-1]
                fields = doc.get('fields', {})
                
                item_id = fields.get('itemId', {}).get('stringValue', '')
                
                # Get rate value and log it
                rate_field = fields.get('rate', {})
                rate_value = 0
                if 'doubleValue' in rate_field:
                    rate_value = float(rate_field.get('doubleValue', 0))
                elif 'integerValue' in rate_field:
                    rate_value = float(rate_field.get('integerValue', 0))
                elif 'stringValue' in rate_field:
                    try:
                        rate_value = float(rate_field.get('stringValue', '0'))
                    except ValueError:
                        pass
                
                if item_id and rate_value > 0:
                    discounts[item_id] = {
                        'id': doc_id,
                        'rate': rate_value
                    }
        
        # Apply discounts to menu items
        for item in menu_items:
            if item['id'] in discounts:
                discount = discounts[item['id']]
                item['discountId'] = discount['id']
                item['discountPercentage'] = discount['rate']
                item['discountedPrice'] = item['price'] - (item['price'] * discount['rate'] / 100)
            else:
                item['discountId'] = ''
                item['discountPercentage'] = 0
                item['discountedPrice'] = item['price']
        
        # Fetch category images
        category_images_url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/{CATEGORY_IMAGE_COLLECTION}"
        category_images_response = requests.get(category_images_url, params=params)
        category_images_response.raise_for_status()
        category_images_data = category_images_response.json()
        
        category_images = {}
        if 'documents' in category_images_data and category_images_data['documents']:
            doc = category_images_data['documents'][0]
            fields = doc.get('fields', {})
            
            # Extract all fields from the category images document
            for field_name, field_value in fields.items():
                if 'stringValue' in field_value:
                    category_images[field_name] = field_value['stringValue']
        
        # Group items by category
        categories = {}
        for item in menu_items:
            category_name = item['category']
            if category_name not in categories:
                categories[category_name] = {
                    'title': category_name,
                    'title_arab': item['category_arab'],
                    'items': [],
                    'imageURL': category_images.get(category_name, item.get('imageURL', ''))
                }
            categories[category_name]['items'].append(item)
        
        # Get discounted items
        discounted_items = [item for item in menu_items if item['discountPercentage'] > 0]
        
        result = {
            'categories': list(categories.values()),
            'discountedItems': discounted_items,
            'menuItems': menu_items
        }
        
        return result
    
    except RequestException:
        return get_sample_menu_data()

def get_sample_menu_data():
    """Return sample menu data if Firebase fetch fails"""
    sample_data = {
        'categories': [
            {
                'title': 'Appetizers',
                'title_arab': 'المقبلات',
                'items': [
                    {
                        'id': 'app1',
                        'name': 'Hummus',
                        'name_arab': 'حمص',
                        'description': 'Creamy chickpea dip with tahini and olive oil',
                        'description_arab': 'حمص كريمي مع طحينة وزيت زيتون',
                        'price': 8.99,
                        'discountedPrice': 8.99,
                        'discountPercentage': 0,
                        'calories': '250',
                        'imageURL': 'https://example.com/hummus.jpg'
                    },
                    {
                        'id': 'app2',
                        'name': 'Mozzarella Sticks',
                        'name_arab': 'أصابع الموزاريلا',
                        'description': 'Breaded mozzarella with marinara sauce',
                        'description_arab': 'جبنة موزاريلا مغطاة بالبقسماط مع صلصة مارينارا',
                        'price': 9.99,
                        'discountedPrice': 7.99,
                        'discountPercentage': 20,
                        'discountId': 'disc1',
                        'calories': '450',
                        'imageURL': 'https://example.com/mozzarella.jpg'
                    }
                ]
            },
            {
                'title': 'Main Courses',
                'title_arab': 'الأطباق الرئيسية',
                'items': [
                    {
                        'id': 'main1',
                        'name': 'Grilled Salmon',
                        'name_arab': 'سلمون مشوي',
                        'description': 'Fresh salmon with lemon butter sauce and vegetables',
                        'description_arab': 'سلمون طازج مع صلصة الليمون والزبدة والخضروات',
                        'price': 24.99,
                        'discountedPrice': 19.99,
                        'discountPercentage': 20,
                        'discountId': 'disc2',
                        'calories': '520',
                        'imageURL': 'https://example.com/salmon.jpg'
                    },
                    {
                        'id': 'main2',
                        'name': 'Beef Tenderloin',
                        'name_arab': 'لحم بقري',
                        'description': 'Premium cut beef with mashed potatoes and gravy',
                        'description_arab': 'لحم بقري فاخر مع البطاطس المهروسة والمرق',
                        'price': 29.99,
                        'discountedPrice': 29.99,
                        'discountPercentage': 0,
                        'calories': '680',
                        'imageURL': 'https://example.com/beef.jpg'
                    }
                ]
            },
            {
                'title': 'Desserts',
                'title_arab': 'الحلويات',
                'items': [
                    {
                        'id': 'des1',
                        'name': 'Chocolate Cake',
                        'name_arab': 'كيكة الشوكولاتة',
                        'description': 'Rich chocolate cake with ganache',
                        'description_arab': 'كيكة شوكولاتة غنية مع غاناش',
                        'price': 8.99,
                        'discountedPrice': 8.99,
                        'discountPercentage': 0,
                        'calories': '450',
                        'imageURL': 'https://example.com/chocolate.jpg'
                    }
                ]
            }
        ],
        'discountedItems': [
            {
                'id': 'app2',
                'name': 'Mozzarella Sticks',
                'name_arab': 'أصابع الموزاريلا',
                'description': 'Breaded mozzarella with marinara sauce',
                'description_arab': 'جبنة موزاريلا مغطاة بالبقسماط مع صلصة مارينارا',
                'price': 9.99,
                'discountedPrice': 7.99,
                'discountPercentage': 20,
                'discountId': 'disc1',
                'calories': '450',
                'imageURL': 'https://example.com/mozzarella.jpg'
            },
            {
                'id': 'main1',
                'name': 'Grilled Salmon',
                'name_arab': 'سلمون مشوي',
                'description': 'Fresh salmon with lemon butter sauce and vegetables',
                'description_arab': 'سلمون طازج مع صلصة الليمون والزبدة والخضروات',
                'price': 24.99,
                'discountedPrice': 19.99,
                'discountPercentage': 20,
                'discountId': 'disc2',
                'calories': '520',
                'imageURL': 'https://example.com/salmon.jpg'
            }
        ]
    }
    
    # Add menuItems for completeness
    sample_data['menuItems'] = []
    for category in sample_data['categories']:
        sample_data['menuItems'].extend(category['items'])
    
    return sample_data

def format_menu_for_context(menu_data):
    """Format menu data for the AI context"""
    context = "RESTAURANT MENU:\n\n"
    
    # Add categories and items
    for category in menu_data['categories']:
        context += f"CATEGORY: {category['title']} ({category['title_arab']})\n"
        
        for item in category['items']:
            discount_info = f" (SPECIAL DISCOUNT: {item['discountPercentage']}% OFF - NOW ${item['discountedPrice']:.2f})" if item['discountPercentage'] > 0 else ""
            context += f"- {item['name']} ({item['name_arab']}): ${item['price']:.2f}{discount_info}\n"
            context += f"  Description: {item['description']}\n"
            context += f"  Calories: {item['calories']}\n"
        
        context += "\n"
    
    # Add special section for discounted items
    if menu_data['discountedItems']:
        context += "TODAY'S SPECIALS (DISCOUNTED ITEMS):\n"
        for item in menu_data['discountedItems']:
            savings = item['price'] - item['discountedPrice']
            context += f"- {item['name']}: ${item['discountedPrice']:.2f} (Save ${savings:.2f} - {item['discountPercentage']}% off!)\n"
            context += f"  Description: {item['description']}\n"
        
        context += "\n"
    
    return context

def create_system_prompt(menu_data):
    """Create the system prompt with menu information"""
    menu_context = format_menu_for_context(menu_data)
    
    system_prompt = f"""You are an AI assistant acting as a friendly and helpful restaurant server named Rachel.
You have a warm, welcoming personality and are knowledgeable about all menu items.

{menu_context}

CONVERSATION STYLE GUIDELINES:
1. Keep responses brief and conversational, like a real server would speak
2. Break up long responses into shorter sentences
3. When listing menu items, mention only 2-3 relevant items at a time
4. If there are more options, ask if the customer would like to hear more
5. Use natural transitions like "We also have..." or "Would you like to hear about..."
6. Avoid listing prices unless specifically asked
7. For specials, focus on 1-2 highlights rather than listing all discounted items

Example responses:
- "Today's special is our Grilled Salmon with lemon butter sauce. Would you like to hear more about it?"
- "For appetizers, I'd recommend our Hummus or Mozzarella Sticks. We also have other options if those don't interest you."
- "Let me tell you about our most popular dessert - it's our rich Chocolate Cake with ganache."

When customers ask about specials, highlight just 1-2 discounted items initially.
If asked for recommendations, suggest 2-3 items maximum at a time.
Be conversational and personable, as if you're actually speaking to customers at a restaurant.
If asked about items not on the menu, politely explain they're not available and suggest one alternative.
Always maintain a positive, helpful attitude and keep responses concise.

IMPORTANT: Only respond to questions related to the restaurant, menu items, food, dining experience, or restaurant services.
If asked about any off-topic subjects (politics, news, personal advice, technology, etc.), respond with:
"I'm not sure about that, but I'd be happy to tell you about our menu or help with your dining experience."
"""
    return system_prompt

def initialize_menu_data():
    """Initialize menu data and system prompt at startup"""
    global global_menu_data, global_system_prompt
    
    print("Initializing menu data... Please wait.")
    try:
        global_menu_data = fetch_menu_data()
    except Exception:
        print("Could not fetch menu data from Firebase. Using sample data instead.")
        global_menu_data = get_sample_menu_data()
    
    # Create system prompt once
    global_system_prompt = create_system_prompt(global_menu_data)
    
    # Initialize conversation history with system prompt
    conversation_history.append({"role": "system", "content": global_system_prompt})
    print("Menu data initialized successfully.")

def chat_with_assistant(user_input):
    """Chat with the OpenAI assistant"""
    global conversation_history
    
    # Add user input to conversation history
    conversation_history.append({"role": "user", "content": user_input})
    
    # Get response from OpenAI
    try:
        response = openai.chat.completions.create(
            model=OPENAI_MODEL,
            messages=conversation_history,
            max_tokens=500,
            temperature=0.7
        )
        
        # Extract assistant's reply
        assistant_reply = response.choices[0].message.content
        
        # Check if the response is out of topic
        if "I'm not sure" in assistant_reply or "I don't know" in assistant_reply:
            assistant_reply = "I'm not sure about that, but feel free to ask me about our menu or services."
        
        # Add assistant's reply to conversation history
        conversation_history.append({"role": "assistant", "content": assistant_reply})
        
        return assistant_reply
    
    except Exception as e:
        error_message = f"Error communicating with OpenAI: {str(e)}"
        return error_message

def clear_conversation():
    """Clear the conversation history"""
    global conversation_history, global_system_prompt
    conversation_history = []
    
    # Re-add the system prompt (already created at startup)
    conversation_history.append({"role": "system", "content": global_system_prompt})
    return "Started a new conversation."

def handle_exit(signal, frame):
    """Handle exit gracefully with a nice goodbye message"""
    print("\n\nThank you for dining with us today! It was a pleasure serving you. We hope to see you again soon. Have a wonderful day!")
    sys.exit(0)

def text_to_speech(text):
    """Convert text to speech using ElevenLabs API and play it"""
    try:
        # ElevenLabs API endpoint
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
        
        # Headers for the API request
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        
        # Request body
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.75,
                "similarity_boost": 0.75
            }
        }
        
        # Make the API request
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        
        # Save the audio to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
            temp_file.write(response.content)
            temp_path = temp_file.name
        
        try:
            # Stop any currently playing audio
            pygame.mixer.music.stop()
            pygame.mixer.music.unload()
            
            # Play the audio
            pygame.mixer.music.load(temp_path)
            pygame.mixer.music.play()
            
            # Wait for the audio to finish playing
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
            
            # Unload the music after playing
            pygame.mixer.music.unload()
            
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_path)
            except Exception:
                pass  # Ignore errors during cleanup
        
    except Exception as e:
        print(f"\nError generating or playing speech: {str(e)}")

def listen_for_speech():
    """Listen for speech input and convert it to text"""
    with sr.Microphone() as source:
        print("\nListening... (speak now)")
        
        # Adjust for ambient noise
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        
        try:
            # Listen for audio input
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=10)
            print("Processing your speech...")
            
            # Convert speech to text
            text = recognizer.recognize_google(audio)
            return text
            
        except sr.WaitTimeoutError:
            print("\nNo speech detected within timeout period.")
            return None
        except sr.UnknownValueError:
            print("\nCould not understand the audio.")
            return None
        except sr.RequestError as e:
            print(f"\nCould not request results; {str(e)}")
            return None
        except Exception as e:
            print(f"\nError during speech recognition: {str(e)}")
            return None

def main():
    """Main function to run the assistant"""
    # Register signal handler for Ctrl+C
    signal.signal(signal.SIGINT, handle_exit)
    
    print("\n===== Restaurant AI Assistant =====")
    
    # Initialize menu data at startup
    initialize_menu_data()
    
    # Check if voice is available
    voice_enabled = bool(ELEVENLABS_API_KEY)
    if voice_enabled:
        print("\nVoice output is enabled! 🎙️")
        print("Type 'voice off' to disable voice or 'voice on' to enable it")
        print("Say 'voice off' or 'voice on' to control voice output")
        print("Say 'type' or press Enter to switch to typing mode")
    else:
        print("\nVoice output is disabled. To enable it, set ELEVENLABS_API_KEY in your .env file")
    
    print("\nWelcome to our restaurant! I'm Rachel, your virtual server.")
    print("Type 'exit' to quit or 'clear' to start a new conversation")
    print("Press Enter without typing to switch between voice and typing modes")
    
    # Voice state
    voice_active = voice_enabled
    voice_input_mode = True if voice_enabled else False
    
    while True:
        try:
            # Get user input based on mode
            if voice_input_mode and voice_enabled:
                user_input = listen_for_speech()
                if user_input:
                    print(f"\nYou said: {user_input}")
                else:
                    continue
            else:
                user_input = input("\nYou: ")
                # Empty input toggles voice input mode if voice is enabled
                if not user_input and voice_enabled:
                    voice_input_mode = not voice_input_mode
                    print(f"\nSwitched to {'voice' if voice_input_mode else 'typing'} input mode")
                    continue
            
            # Handle commands
            if user_input and user_input.lower() == 'exit':
                farewell = "Thank you for dining with us today! It was a pleasure serving you. We hope to see you again soon. Have a wonderful day!"
                print(f"\n{farewell}")
                if voice_active and voice_enabled:
                    text_to_speech(farewell)
                break
            elif user_input and user_input.lower() == 'clear':
                clear_conversation()
                print("Started a new conversation.")
                continue
            elif user_input and user_input.lower() in ['voice off', 'voice disable'] and voice_enabled:
                voice_active = False
                print("Voice output disabled.")
                continue
            elif user_input and user_input.lower() in ['voice on', 'voice enable'] and voice_enabled:
                voice_active = True
                print("Voice output enabled.")
                continue
            elif user_input and user_input.lower() == 'type':
                voice_input_mode = False
                print("\nSwitched to typing mode")
                continue
            
            # Skip empty input
            if not user_input:
                continue
            
            # Get response from assistant
            response = chat_with_assistant(user_input)
            print(f"\nRachel: {response}")
            
            # Handle voice output based on state
            if voice_active and voice_enabled:
                text_to_speech(response)
        
        except KeyboardInterrupt:
            handle_exit(None, None)

if __name__ == "__main__":
    main() 