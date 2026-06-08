import type { Category } from '../constants/categories'

const KEYWORD_MAP: Record<Category, string[]> = {
  Food: [
    'jollibee', 'mcdo', "mcdonald's", 'mcdonald', 'chowking', 'mang inasal',
    'greenwich', 'kfc', 'burger king', 'wendy', 'pizza hut', 'shakeys', 'yellow cab',
    'starbucks', 'coffee', 'milk tea', 'boba', 'restaurant', 'food', 'kain', 'ulam',
    'grocery', 'palengke', 'supermarket', 'puregold', 'savemore', 'sm supermarket',
    'mercury drug food', 'snack', 'lunch', 'dinner', 'breakfast', 'merienda',
    'carinderia', 'tindahan', 'jollijeep', 'fishball', 'isaw', 'bbq',
  ],
  Transport: [
    'grab', 'angkas', 'lrt', 'mrt', 'bus', 'jeep', 'jeepney', 'tricycle', 'trike',
    'taxi', 'uber', 'fare', 'gasoline', 'gas', 'petron', 'shell', 'caltex',
    'toll', 'slex', 'nlex', 'skyway', 'parking', 'mrt3', 'lrt2', 'lrt1',
    'transpo', 'transport', 'commute', 'pamasahe',
  ],
  Shopping: [
    'sm', 'robinsons', 'ayala', 'divisoria', 'ukay', 'lazada', 'shopee',
    'tiktok shop', 'zalora', 'h&m', 'uniqlo', 'zara', 'national bookstore',
    'bookstore', 'clothes', 'shoes', 'bag', 'mall', 'department store',
    'bibilhin', 'pamimili', 'palengke', 'tiangge',
  ],
  Bills: [
    'meralco', 'maynilad', 'manila water', 'globe', 'smart', 'pldt', 'converge',
    'sky cable', 'cignal', 'netflix', 'spotify', 'youtube premium', 'icloud',
    'electric', 'water bill', 'internet', 'wifi', 'load', 'kuryente',
    'tubig', 'rent', 'condo', 'association dues',
  ],
  Health: [
    'mercury drug', 'watsons', 'rose pharmacy', 'generika', 'drugstore',
    'hospital', 'clinic', 'doctor', 'check up', 'medicine', 'gamot',
    'vitamins', 'supplement', 'dental', 'optical', 'laboratory', 'lab test',
    'philhealth', 'hmo', 'health insurance',
  ],
  Entertainment: [
    'cinema', 'sm cinema', 'ayala cinemas', 'netflix', 'spotify', 'steam',
    'playstation', 'xbox', 'game', 'concert', 'event', 'bars', 'club',
    'karaoke', 'videoke', 'bowling', 'billiards', 'arcade', 'escape room',
    'theme park', 'travel', 'hotel', 'resort', 'beach',
  ],
  Others: [],
}

export function keywordCategorize(description: string): Category {
  const lower = description.toLowerCase()
  for (const [category, keywords] of Object.entries(KEYWORD_MAP) as [Category, string[]][]) {
    if (category === 'Others') continue
    for (const kw of keywords) {
      if (lower.includes(kw)) return category
    }
  }
  return 'Others'
}
