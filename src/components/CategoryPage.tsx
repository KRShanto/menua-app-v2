"use client"

import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface MenuItem {
  id: string
  name: string
  calories: number
  price: number
  likes: number
  image: string
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Chicken of Cream Soup",
    calories: 310,
    price: 20,
    likes: 10,
    image: "/placeholder.svg"
  },
  {
    id: "2", 
    name: "Lentil Soup",
    calories: 220,
    price: 15,
    likes: 15,
    image: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Chicken Corn Soup",
    calories: 270,
    price: 18,
    likes: 7,
    image: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Hot & Sour Soup",
    calories: 90,
    price: 20,
    likes: 8,
    image: "/placeholder.svg"
  }
]

export default function FoodMenu() {
  return (
    <div className="w-full max-w-md mx-auto space-y-2 p-4">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 bg-zinc-900 rounded-lg p-2 relative overflow-hidden group"
        >
          <div className="relative h-16 w-16 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="rounded-md object-cover"
             
            />
            <div className="absolute top-0 left-0 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-br-md">
              25% OFF
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium">{item.name}</h3>
            <p className="text-zinc-400 text-sm">{item.calories} Calories</p>
            <div className="text-zinc-400 text-sm">SR {item.price}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-zinc-400">
              <Heart className="w-4 h-4 fill-current text-red-500" />
              <span className="text-sm">{item.likes}</span>
            </div>
            <Button
              variant="ghost"
              className="h-8 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
            >
              Add +
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

