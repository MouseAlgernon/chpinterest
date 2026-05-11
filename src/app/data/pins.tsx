const pins  = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc4MzM4MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Mountain Vista",
    category: "Nature",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc4MzExNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Gourmet Burger",
    category: "Food",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzYxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Modern Architecture",
    category: "Architecture",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzc4MzExNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Fashion Trends",
    category: "Fashion",
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc4MzM4MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Coastal Beauty",
    category: "Nature",
  },
  {
    id: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc4MzExNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Sweet Pancakes",
    category: "Food",
  },
  {
    id: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzYxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "White Minimalism",
    category: "Architecture",
  },
  {
    id: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzc4MzExNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Clothing Collection",
    category: "Fashion",
  },
  {
    id: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1611307742746-43cbea512c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc4MzM4MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Mountain Cabin",
    category: "Nature",
  },
  {
    id: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc4MzExNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Fresh Fruits",
    category: "Food",
  },
  {
    id: 11,
    imageUrl:
      "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzYxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Curved Design",
    category: "Architecture",
  },
  {
    id: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzc4MzExNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Streetwear Style",
    category: "Fashion",
  },
  {
    id: 13,
    imageUrl:
      "https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc4MzM4MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Blue Waters",
    category: "Nature",
  },
  {
    id: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1556761223-4c4282c73f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc4MzExNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Pasta Perfection",
    category: "Food",
  },
  {
    id: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1527576539890-dfa815648363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzYxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Geometric Forms",
    category: "Architecture",
  },
  {
    id: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzc4MzExNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Park Fashion",
    category: "Fashion",
  },
  {
    id: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1621846846625-f0bde2eb7c3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc4MzM4MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Rocky Shore",
    category: "Nature",
  },
  {
    id: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc4MzExNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Double Burgers",
    category: "Food",
  },
  {
    id: 19,
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzYxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "City Skyline",
    category: "Architecture",
  },
  {
    id: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzc4MzExNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Maroon Elegance",
    category: "Fashion",
  },
  {
    id: 21,
    imageUrl:
      "https://images.unsplash.com/photo-1500622944204-b135684e99fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc4MzM4MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Aerial Mountains",
    category: "Nature",
  },
  {
    id: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1552611052-33e04de081de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc4MzExNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Ramen Bowl",
    category: "Food",
  },
  {
    id: 23,
    imageUrl:
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzYxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Modern Cement",
    category: "Architecture",
  },
  {
    id: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1541377182189-74e4a4ea12e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzc4MzExNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Summer Slippers",
    category: "Fashion",
  },
  {
    id: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1615118265620-d8decf628275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzc4MzM4MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Lake Vista",
    category: "Nature",
  },
  {
    id: 26,
    imageUrl:
      "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc4MzExNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Syrup Stack",
    category: "Food",
  },
  {
    id: 27,
    imageUrl:
      "https://images.unsplash.com/photo-1548248823-ce16a73b6d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzYxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Abstract Curves",
    category: "Architecture",
  },
  {
    id: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1648322032202-73cb85f354be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzc4MzExNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Purple Fashion",
    category: "Fashion",
  },
  {
    id: 29,
    imageUrl:
      "https://images.unsplash.com/photo-1610552050890-fe99536c2615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMHx8bmF0dXJlJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3ODMzODI0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Green Fields",
    category: "Nature",
  },
  {
    id: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzc4MzExNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Pasta Plate",
    category: "Food",
  },
  {
    id: 31,
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc4MzYxOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "White Building",
    category: "Architecture",
  },
  {
    id: 32,
    imageUrl:
      "https://images.unsplash.com/photo-1648322032206-888c91d99616?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxmYXNoaW9uJTIwc3R5bGV8ZW58MXx8fHwxNzc4MzExNDkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Sneaker Style",
    category: "Fashion",
  },
];
export default pins;