import os
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Chat history storage
conversation_history = []

def get_menu_data():
    """Return sample menu data"""
    return {
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
"""
    return system_prompt

def chat_with_assistant(user_input):
    """Chat with the AI assistant"""
    global conversation_history
    
    # Fetch menu data if this is the first interaction
    if not conversation_history:
        menu_data = get_menu_data()
        system_prompt = create_system_prompt(menu_data)
        conversation_history.append({"role": "system", "content": system_prompt})
    
    # Add user message to history
    conversation_history.append({"role": "user", "content": user_input})
    
    # Get response from OpenAI
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=conversation_history,
            temperature=0.7,
            max_tokens=500
        )
        
        # Extract assistant's reply
        assistant_reply = response.choices[0].message.content
        
        # Add assistant's reply to history
        conversation_history.append({"role": "assistant", "content": assistant_reply})
        
        return assistant_reply
    
    except Exception as e:
        error_message = f"Sorry, I encountered an error: {str(e)}"
        conversation_history.append({"role": "assistant", "content": error_message})
        return error_message

def clear_conversation():
    """Clear the conversation history"""
    global conversation_history
    conversation_history = []
    menu_data = get_menu_data()
    system_prompt = create_system_prompt(menu_data)
    conversation_history.append({"role": "system", "content": system_prompt})
    return "Conversation history cleared."

def main():
    """Main function to run the assistant"""
    print("Restaurant AI Assistant (Server Alex)")
    print("Type 'exit' to quit or 'clear' to start a new conversation")
    
    while True:
        user_input = input("\nYou: ")
        
        if user_input.lower() == 'exit':
            print("Thank you for visiting our restaurant! Have a great day!")
            break
        elif user_input.lower() == 'clear':
            clear_conversation()
            print("Started a new conversation.")
            continue
        
        response = chat_with_assistant(user_input)
        print(f"\nAlex (Server): {response}")

if __name__ == "__main__":
    main() 