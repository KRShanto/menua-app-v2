import os
import json
import openai
import signal
import sys
from dotenv import load_dotenv
import requests
from requests.exceptions import RequestException

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

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
    
    system_prompt = f"""You are an AI assistant acting as a friendly and helpful restaurant server named Alex.
You have a warm, welcoming personality and are knowledgeable about all menu items.

{menu_context}

When customers ask about specials, highlight the discounted items.
If asked for recommendations, suggest popular items or personal favorites from the menu.
You can explain ingredients, preparation methods, and accommodate dietary restrictions.
Be conversational and personable, as if you're actually serving customers at a restaurant.
If asked about items not on the menu, politely explain they're not available but suggest alternatives.
Always maintain a positive, helpful attitude and thank customers for their interest.
Keep your responses concise and natural, like a real conversation. Avoid using markdown formatting.

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
            model="gpt-3.5-turbo",
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

def main():
    """Main function to run the assistant"""
    # Register signal handler for Ctrl+C
    signal.signal(signal.SIGINT, handle_exit)
    
    print("\n===== Restaurant AI Assistant =====")
    
    # Initialize menu data at startup
    initialize_menu_data()
    
    print("\nWelcome to our restaurant! I'm Alex, your virtual server.")
    print("Type 'exit' to quit or 'clear' to start a new conversation")
    
    while True:
        try:
            user_input = input("\nYou: ")
            
            if user_input.lower() == 'exit':
                print("\nThank you for dining with us today! It was a pleasure serving you. We hope to see you again soon. Have a wonderful day!")
                break
            elif user_input.lower() == 'clear':
                clear_conversation()
                print("Started a new conversation.")
                continue
            
            response = chat_with_assistant(user_input)
            print(f"\nAlex: {response}")
        
        except KeyboardInterrupt:
            handle_exit(None, None)

if __name__ == "__main__":
    main() 