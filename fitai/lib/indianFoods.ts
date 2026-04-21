// Indian food database — IFCT (Indian Food Composition Tables) values per 100g
// Pure data — no logic, no framework imports

export interface IndianFood {
  id: string;
  name: string;
  nameHindi: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'ingredient' | 'beverage';
  caloriesPer100g: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  dietType: ('veg' | 'egg' | 'non-veg' | 'vegan')[];
  typicalServingG: number;
  costPerServingInr: number;
}

export const indianFoods: IndianFood[] = [

  // ─── DAL & LEGUMES (cooked) ────────────────────────────────────────────────
  { id: 'dal-toor',    name: 'Toor Dal (cooked)',          nameHindi: 'तूर दाल',     category: 'lunch',     caloriesPer100g: 116, proteinG: 6.8,  carbsG: 19.8, fatG: 0.4,  fiberG: 2.2,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 12 },
  { id: 'dal-moong',   name: 'Moong Dal (cooked)',         nameHindi: 'मूंग दाल',    category: 'lunch',     caloriesPer100g: 104, proteinG: 7.6,  carbsG: 17.1, fatG: 0.4,  fiberG: 4.1,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 10 },
  { id: 'dal-masoor',  name: 'Masoor Dal (cooked)',        nameHindi: 'मसूर दाल',    category: 'lunch',     caloriesPer100g: 116, proteinG: 9.0,  carbsG: 19.6, fatG: 0.4,  fiberG: 3.2,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 10 },
  { id: 'dal-chana',   name: 'Chana Dal (cooked)',         nameHindi: 'चना दाल',     category: 'lunch',     caloriesPer100g: 164, proteinG: 8.9,  carbsG: 27.8, fatG: 2.7,  fiberG: 5.3,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 12 },
  { id: 'rajma',       name: 'Rajma (cooked)',             nameHindi: 'राजमा',       category: 'lunch',     caloriesPer100g: 127, proteinG: 8.7,  carbsG: 22.8, fatG: 0.5,  fiberG: 6.4,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 18 },
  { id: 'chole',       name: 'Chole / Chana (cooked)',     nameHindi: 'छोले',        category: 'lunch',     caloriesPer100g: 164, proteinG: 8.9,  carbsG: 27.4, fatG: 2.6,  fiberG: 7.6,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 15 },
  { id: 'dal-urad',    name: 'Urad Dal / Black Dal (cooked)', nameHindi: 'उड़द दाल', category: 'dinner',    caloriesPer100g: 118, proteinG: 8.5,  carbsG: 20.2, fatG: 0.6,  fiberG: 1.8,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 14 },

  // ─── GRAINS ────────────────────────────────────────────────────────────────
  { id: 'rice-basmati', name: 'Basmati Rice (cooked)',     nameHindi: 'बासमती चावल', category: 'lunch',    caloriesPer100g: 130, proteinG: 2.7,  carbsG: 28.2, fatG: 0.2,  fiberG: 0.3,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 15 },
  { id: 'rice-brown',   name: 'Brown Rice (cooked)',       nameHindi: 'ब्राउन चावल', category: 'lunch',    caloriesPer100g: 123, proteinG: 2.6,  carbsG: 25.6, fatG: 0.9,  fiberG: 1.8,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 18 },
  { id: 'jeera-rice',   name: 'Jeera Rice',                nameHindi: 'जीरा चावल',   category: 'lunch',    caloriesPer100g: 148, proteinG: 3.0,  carbsG: 30.5, fatG: 2.1,  fiberG: 0.4,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 18 },
  { id: 'roti',         name: 'Roti / Chapati (whole wheat)', nameHindi: 'रोटी',     category: 'lunch',    caloriesPer100g: 240, proteinG: 8.5,  carbsG: 43.2, fatG: 3.8,  fiberG: 4.6,  dietType: ['veg','vegan'], typicalServingG: 40,  costPerServingInr: 4  },
  { id: 'paratha',      name: 'Plain Paratha',             nameHindi: 'पराठा',       category: 'breakfast', caloriesPer100g: 275, proteinG: 6.4,  carbsG: 36.2, fatG: 11.4, fiberG: 3.1,  dietType: ['veg'],         typicalServingG: 80,  costPerServingInr: 12 },
  { id: 'naan',         name: 'Naan',                      nameHindi: 'नान',         category: 'dinner',    caloriesPer100g: 277, proteinG: 8.5,  carbsG: 49.4, fatG: 5.5,  fiberG: 1.8,  dietType: ['veg'],         typicalServingG: 90,  costPerServingInr: 20 },
  { id: 'bhatura',      name: 'Bhatura',                   nameHindi: 'भटूरा',       category: 'breakfast', caloriesPer100g: 315, proteinG: 7.0,  carbsG: 46.9, fatG: 11.2, fiberG: 1.3,  dietType: ['veg'],         typicalServingG: 80,  costPerServingInr: 15 },
  { id: 'poha',         name: 'Poha (cooked)',             nameHindi: 'पोहा',        category: 'breakfast', caloriesPer100g: 130, proteinG: 2.2,  carbsG: 28.5, fatG: 0.6,  fiberG: 0.5,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 15 },
  { id: 'upma',         name: 'Upma (cooked)',             nameHindi: 'उपमा',        category: 'breakfast', caloriesPer100g: 135, proteinG: 3.1,  carbsG: 22.5, fatG: 3.8,  fiberG: 2.1,  dietType: ['veg','vegan'], typicalServingG: 200, costPerServingInr: 18 },
  { id: 'oats',         name: 'Oats (cooked)',             nameHindi: 'ओट्स',        category: 'breakfast', caloriesPer100g: 71,  proteinG: 2.5,  carbsG: 12.0, fatG: 1.5,  fiberG: 1.7,  dietType: ['veg','vegan'], typicalServingG: 250, costPerServingInr: 20 },
  { id: 'quinoa',       name: 'Quinoa (cooked)',           nameHindi: 'क्विनोआ',     category: 'lunch',     caloriesPer100g: 120, proteinG: 4.4,  carbsG: 21.3, fatG: 1.9,  fiberG: 2.8,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 35 },

  // ─── VEGETABLES (cooked curries & sabzi) ───────────────────────────────────
  { id: 'aloo-sabzi',   name: 'Aloo Sabzi',               nameHindi: 'आलू सब्जी',   category: 'lunch',     caloriesPer100g: 143, proteinG: 1.8,  carbsG: 20.5, fatG: 6.0,  fiberG: 1.7,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 20 },
  { id: 'palak-paneer', name: 'Palak Paneer',             nameHindi: 'पालक पनीर',   category: 'dinner',    caloriesPer100g: 145, proteinG: 7.2,  carbsG: 7.4,  fatG: 9.8,  fiberG: 2.1,  dietType: ['veg'],         typicalServingG: 200, costPerServingInr: 45 },
  { id: 'mixed-veg',    name: 'Mixed Vegetable Curry',    nameHindi: 'मिक्स सब्जी', category: 'lunch',     caloriesPer100g: 95,  proteinG: 2.3,  carbsG: 11.2, fatG: 4.8,  fiberG: 2.4,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 25 },
  { id: 'bhindi-fry',   name: 'Bhindi Fry',               nameHindi: 'भिंडी फ्राई', category: 'lunch',     caloriesPer100g: 119, proteinG: 2.5,  carbsG: 10.4, fatG: 7.5,  fiberG: 3.2,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 22 },
  { id: 'baingan-bharta', name: 'Baingan Bharta',         nameHindi: 'बैंगन भर्ता', category: 'dinner',    caloriesPer100g: 103, proteinG: 2.2,  carbsG: 9.4,  fatG: 6.2,  fiberG: 3.8,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 20 },
  { id: 'gobi-sabzi',   name: 'Gobi Sabzi',               nameHindi: 'गोभी सब्जी',  category: 'lunch',     caloriesPer100g: 96,  proteinG: 2.1,  carbsG: 9.8,  fatG: 5.5,  fiberG: 2.8,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 18 },
  { id: 'lauki-sabzi',  name: 'Lauki Sabzi',              nameHindi: 'लौकी सब्जी',  category: 'lunch',     caloriesPer100g: 65,  proteinG: 1.2,  carbsG: 7.2,  fatG: 3.4,  fiberG: 1.8,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 15 },
  { id: 'karela-sabzi', name: 'Karela Sabzi',             nameHindi: 'करेला सब्जी', category: 'lunch',     caloriesPer100g: 88,  proteinG: 2.3,  carbsG: 8.9,  fatG: 4.8,  fiberG: 4.2,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 18 },
  { id: 'tinda-sabzi',  name: 'Tinda Sabzi',              nameHindi: 'टिंडा सब्जी', category: 'lunch',     caloriesPer100g: 72,  proteinG: 1.1,  carbsG: 8.4,  fatG: 3.6,  fiberG: 2.1,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 14 },

  // ─── PANEER & DAIRY ────────────────────────────────────────────────────────
  { id: 'paneer-raw',   name: 'Paneer (raw)',             nameHindi: 'पनीर',         category: 'ingredient', caloriesPer100g: 265, proteinG: 18.3, carbsG: 1.2,  fatG: 20.8, fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 80,  costPerServingInr: 32 },
  { id: 'paneer-bhurji', name: 'Paneer Bhurji',          nameHindi: 'पनीर भुर्जी', category: 'breakfast',  caloriesPer100g: 242, proteinG: 14.6, carbsG: 5.4,  fatG: 18.8, fiberG: 0.8,  dietType: ['veg'],         typicalServingG: 150, costPerServingInr: 55 },
  { id: 'paneer-tikka', name: 'Paneer Tikka',            nameHindi: 'पनीर टिक्का', category: 'snack',      caloriesPer100g: 225, proteinG: 15.8, carbsG: 6.2,  fatG: 15.2, fiberG: 0.5,  dietType: ['veg'],         typicalServingG: 150, costPerServingInr: 65 },
  { id: 'curd',         name: 'Curd / Dahi',             nameHindi: 'दही',          category: 'ingredient', caloriesPer100g: 98,  proteinG: 3.1,  carbsG: 3.4,  fatG: 8.0,  fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 150, costPerServingInr: 15 },
  { id: 'milk-full',    name: 'Milk Full Fat',           nameHindi: 'दूध (फुल फैट)', category: 'beverage',  caloriesPer100g: 67,  proteinG: 3.2,  carbsG: 4.4,  fatG: 4.0,  fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 200, costPerServingInr: 12 },
  { id: 'milk-toned',   name: 'Milk Toned',              nameHindi: 'टोंड दूध',     category: 'beverage',  caloriesPer100g: 46,  proteinG: 3.2,  carbsG: 4.6,  fatG: 1.5,  fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 200, costPerServingInr: 10 },
  { id: 'buttermilk',   name: 'Buttermilk / Chaas',      nameHindi: 'छाछ',          category: 'beverage',  caloriesPer100g: 40,  proteinG: 3.3,  carbsG: 5.0,  fatG: 0.9,  fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 200, costPerServingInr: 8  },
  { id: 'lassi-sweet',  name: 'Lassi (sweet)',           nameHindi: 'लस्सी',        category: 'beverage',  caloriesPer100g: 97,  proteinG: 3.5,  carbsG: 16.1, fatG: 2.5,  fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 250, costPerServingInr: 25 },
  { id: 'ghee',         name: 'Ghee',                    nameHindi: 'घी',           category: 'ingredient', caloriesPer100g: 900, proteinG: 0.0,  carbsG: 0.0,  fatG: 99.7, fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 5,   costPerServingInr: 5  },

  // ─── NON-VEG ───────────────────────────────────────────────────────────────
  { id: 'chicken-breast-grilled', name: 'Chicken Breast (grilled)', nameHindi: 'चिकन ब्रेस्ट', category: 'dinner', caloriesPer100g: 165, proteinG: 31.0, carbsG: 0.0,  fatG: 3.6,  fiberG: 0.0,  dietType: ['non-veg'], typicalServingG: 150, costPerServingInr: 80  },
  { id: 'chicken-curry', name: 'Chicken Curry',          nameHindi: 'चिकन करी',     category: 'dinner',    caloriesPer100g: 175, proteinG: 14.7, carbsG: 3.2,  fatG: 11.6, fiberG: 0.5,  dietType: ['non-veg'], typicalServingG: 200, costPerServingInr: 90  },
  { id: 'butter-chicken', name: 'Butter Chicken',        nameHindi: 'बटर चिकन',     category: 'dinner',    caloriesPer100g: 190, proteinG: 14.0, carbsG: 7.8,  fatG: 11.9, fiberG: 0.8,  dietType: ['non-veg'], typicalServingG: 200, costPerServingInr: 100 },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken',   nameHindi: 'तंदूरी चिकन',  category: 'dinner',    caloriesPer100g: 159, proteinG: 27.4, carbsG: 3.4,  fatG: 4.7,  fiberG: 0.4,  dietType: ['non-veg'], typicalServingG: 200, costPerServingInr: 110 },
  { id: 'fish-curry',   name: 'Fish Curry',              nameHindi: 'मछली करी',     category: 'dinner',    caloriesPer100g: 128, proteinG: 16.5, carbsG: 3.8,  fatG: 5.4,  fiberG: 0.3,  dietType: ['non-veg'], typicalServingG: 200, costPerServingInr: 90  },
  { id: 'fish-tandoori', name: 'Fish Tandoori',         nameHindi: 'तंदूरी मछली',  category: 'dinner',    caloriesPer100g: 142, proteinG: 24.2, carbsG: 2.8,  fatG: 3.9,  fiberG: 0.2,  dietType: ['non-veg'], typicalServingG: 150, costPerServingInr: 95  },
  { id: 'mutton-curry', name: 'Mutton Curry',            nameHindi: 'मटन करी',      category: 'dinner',    caloriesPer100g: 225, proteinG: 18.5, carbsG: 4.2,  fatG: 15.5, fiberG: 0.3,  dietType: ['non-veg'], typicalServingG: 200, costPerServingInr: 140 },
  { id: 'egg-boiled',   name: 'Egg (boiled)',            nameHindi: 'उबला अंडा',    category: 'breakfast', caloriesPer100g: 155, proteinG: 12.6, carbsG: 1.1,  fatG: 10.6, fiberG: 0.0,  dietType: ['egg'],     typicalServingG: 50,  costPerServingInr: 8   },
  { id: 'egg-omelette', name: 'Egg Omelette',            nameHindi: 'ऑमलेट',        category: 'breakfast', caloriesPer100g: 185, proteinG: 13.4, carbsG: 2.4,  fatG: 13.8, fiberG: 0.0,  dietType: ['egg'],     typicalServingG: 100, costPerServingInr: 18  },
  { id: 'egg-bhurji',   name: 'Egg Bhurji',              nameHindi: 'अंडा भुर्जी',  category: 'breakfast', caloriesPer100g: 175, proteinG: 12.2, carbsG: 5.8,  fatG: 12.4, fiberG: 0.8,  dietType: ['egg'],     typicalServingG: 150, costPerServingInr: 25  },
  { id: 'prawns-curry', name: 'Prawns Curry',            nameHindi: 'झींगा करी',    category: 'dinner',    caloriesPer100g: 143, proteinG: 20.4, carbsG: 4.2,  fatG: 4.8,  fiberG: 0.3,  dietType: ['non-veg'], typicalServingG: 200, costPerServingInr: 120 },

  // ─── SOUTH INDIAN ──────────────────────────────────────────────────────────
  { id: 'idli',         name: 'Idli (2 pcs)',             nameHindi: 'इडली',         category: 'breakfast', caloriesPer100g: 116, proteinG: 3.9,  carbsG: 23.8, fatG: 0.5,  fiberG: 0.8,  dietType: ['veg','vegan'], typicalServingG: 80,  costPerServingInr: 20 },
  { id: 'dosa-plain',   name: 'Plain Dosa',               nameHindi: 'सादा डोसा',   category: 'breakfast', caloriesPer100g: 168, proteinG: 3.5,  carbsG: 26.5, fatG: 5.1,  fiberG: 0.6,  dietType: ['veg','vegan'], typicalServingG: 85,  costPerServingInr: 25 },
  { id: 'dosa-masala',  name: 'Masala Dosa',              nameHindi: 'मसाला डोसा',  category: 'breakfast', caloriesPer100g: 185, proteinG: 3.8,  carbsG: 26.2, fatG: 6.8,  fiberG: 1.2,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 45 },
  { id: 'uttapam',      name: 'Uttapam',                  nameHindi: 'उत्तपम',       category: 'breakfast', caloriesPer100g: 175, proteinG: 4.8,  carbsG: 25.8, fatG: 5.9,  fiberG: 1.4,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 35 },
  { id: 'sambar',       name: 'Sambar',                   nameHindi: 'सांभर',        category: 'breakfast', caloriesPer100g: 55,  proteinG: 2.8,  carbsG: 8.2,  fatG: 1.2,  fiberG: 2.4,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 10 },
  { id: 'coconut-chutney', name: 'Coconut Chutney',       nameHindi: 'नारियल चटनी', category: 'breakfast', caloriesPer100g: 195, proteinG: 2.8,  carbsG: 7.4,  fatG: 17.8, fiberG: 3.8,  dietType: ['veg','vegan'], typicalServingG: 50,  costPerServingInr: 8  },
  { id: 'rasam',        name: 'Rasam',                    nameHindi: 'रसम',          category: 'lunch',     caloriesPer100g: 35,  proteinG: 1.2,  carbsG: 5.8,  fatG: 0.8,  fiberG: 0.8,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 8  },
  { id: 'medu-vada',    name: 'Medu Vada',                nameHindi: 'मेदू वड़ा',    category: 'breakfast', caloriesPer100g: 287, proteinG: 9.8,  carbsG: 34.5, fatG: 12.8, fiberG: 2.6,  dietType: ['veg','vegan'], typicalServingG: 60,  costPerServingInr: 20 },

  // ─── SNACKS ────────────────────────────────────────────────────────────────
  { id: 'samosa',       name: 'Samosa (1 pc)',            nameHindi: 'समोसा',        category: 'snack',     caloriesPer100g: 252, proteinG: 5.1,  carbsG: 31.8, fatG: 11.6, fiberG: 1.8,  dietType: ['veg'],         typicalServingG: 85,  costPerServingInr: 12 },
  { id: 'pakora',       name: 'Pakora / Bhajia',         nameHindi: 'पकोड़ा',       category: 'snack',     caloriesPer100g: 268, proteinG: 7.2,  carbsG: 29.8, fatG: 13.4, fiberG: 2.4,  dietType: ['veg'],         typicalServingG: 80,  costPerServingInr: 15 },
  { id: 'bhelpuri',     name: 'Bhelpuri',                 nameHindi: 'भेलपुरी',     category: 'snack',     caloriesPer100g: 156, proteinG: 4.2,  carbsG: 26.8, fatG: 4.1,  fiberG: 1.8,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 25 },
  { id: 'dhokla',       name: 'Dhokla',                   nameHindi: 'ढोकला',        category: 'snack',     caloriesPer100g: 160, proteinG: 5.6,  carbsG: 25.4, fatG: 4.2,  fiberG: 1.4,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 20 },
  { id: 'khakhra',      name: 'Khakhra',                  nameHindi: 'खाखरा',        category: 'snack',     caloriesPer100g: 374, proteinG: 11.2, carbsG: 65.8, fatG: 6.4,  fiberG: 8.2,  dietType: ['veg','vegan'], typicalServingG: 30,  costPerServingInr: 8  },
  { id: 'sprouts-chaat', name: 'Sprouts Chaat',          nameHindi: 'अंकुरित चाट', category: 'snack',     caloriesPer100g: 145, proteinG: 9.8,  carbsG: 22.4, fatG: 2.1,  fiberG: 4.8,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 20 },
  { id: 'chana-chaat',  name: 'Chana Chaat',             nameHindi: 'चना चाट',      category: 'snack',     caloriesPer100g: 180, proteinG: 8.5,  carbsG: 28.2, fatG: 4.2,  fiberG: 5.6,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 22 },
  { id: 'roasted-chana', name: 'Roasted Chana',          nameHindi: 'भुना चना',     category: 'snack',     caloriesPer100g: 364, proteinG: 22.5, carbsG: 52.0, fatG: 5.3,  fiberG: 16.5, dietType: ['veg','vegan'], typicalServingG: 30,  costPerServingInr: 6  },
  { id: 'chakli',       name: 'Chakli',                   nameHindi: 'चकली',         category: 'snack',     caloriesPer100g: 483, proteinG: 9.2,  carbsG: 63.5, fatG: 21.4, fiberG: 5.8,  dietType: ['veg'],         typicalServingG: 30,  costPerServingInr: 10 },
  { id: 'glucose-biscuit', name: 'Glucose Biscuits',     nameHindi: 'ग्लूकोज बिस्किट', category: 'snack', caloriesPer100g: 421, proteinG: 7.8,  carbsG: 75.4, fatG: 9.8,  fiberG: 0.8,  dietType: ['veg'],         typicalServingG: 30,  costPerServingInr: 8  },

  // ─── FRUITS ────────────────────────────────────────────────────────────────
  { id: 'banana',       name: 'Banana',                   nameHindi: 'केला',         category: 'snack',     caloriesPer100g: 89,  proteinG: 1.1,  carbsG: 22.8, fatG: 0.3,  fiberG: 2.6,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 8  },
  { id: 'apple',        name: 'Apple',                    nameHindi: 'सेब',          category: 'snack',     caloriesPer100g: 52,  proteinG: 0.3,  carbsG: 13.8, fatG: 0.2,  fiberG: 2.4,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 25 },
  { id: 'papaya',       name: 'Papaya',                   nameHindi: 'पपीता',        category: 'snack',     caloriesPer100g: 43,  proteinG: 0.5,  carbsG: 11.0, fatG: 0.1,  fiberG: 1.7,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 12 },
  { id: 'guava',        name: 'Guava',                    nameHindi: 'अमरूद',        category: 'snack',     caloriesPer100g: 68,  proteinG: 2.6,  carbsG: 14.3, fatG: 0.9,  fiberG: 5.4,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 10 },
  { id: 'orange',       name: 'Orange',                   nameHindi: 'संतरा',        category: 'snack',     caloriesPer100g: 47,  proteinG: 0.9,  carbsG: 11.8, fatG: 0.1,  fiberG: 2.4,  dietType: ['veg','vegan'], typicalServingG: 130, costPerServingInr: 15 },
  { id: 'watermelon',   name: 'Watermelon',               nameHindi: 'तरबूज',        category: 'snack',     caloriesPer100g: 30,  proteinG: 0.6,  carbsG: 7.6,  fatG: 0.2,  fiberG: 0.4,  dietType: ['veg','vegan'], typicalServingG: 200, costPerServingInr: 12 },
  { id: 'mango',        name: 'Mango',                    nameHindi: 'आम',           category: 'snack',     caloriesPer100g: 60,  proteinG: 0.8,  carbsG: 15.0, fatG: 0.4,  fiberG: 1.6,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 20 },
  { id: 'grapes',       name: 'Grapes',                   nameHindi: 'अंगूर',        category: 'snack',     caloriesPer100g: 67,  proteinG: 0.6,  carbsG: 17.2, fatG: 0.4,  fiberG: 0.9,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 20 },

  // ─── NUTS & SEEDS ──────────────────────────────────────────────────────────
  { id: 'almonds',      name: 'Almonds (10 pcs ~12g)',    nameHindi: 'बादाम',        category: 'snack',     caloriesPer100g: 579, proteinG: 21.2, carbsG: 21.6, fatG: 49.9, fiberG: 12.5, dietType: ['veg','vegan'], typicalServingG: 20,  costPerServingInr: 18 },
  { id: 'cashews',      name: 'Cashews (10 pcs ~15g)',    nameHindi: 'काजू',         category: 'snack',     caloriesPer100g: 553, proteinG: 18.2, carbsG: 30.2, fatG: 43.8, fiberG: 3.3,  dietType: ['veg','vegan'], typicalServingG: 20,  costPerServingInr: 22 },
  { id: 'peanuts',      name: 'Peanuts (roasted)',        nameHindi: 'मूंगफली',      category: 'snack',     caloriesPer100g: 585, proteinG: 25.8, carbsG: 16.1, fatG: 49.2, fiberG: 8.5,  dietType: ['veg','vegan'], typicalServingG: 30,  costPerServingInr: 6  },
  { id: 'walnuts',      name: 'Walnuts',                  nameHindi: 'अखरोट',        category: 'snack',     caloriesPer100g: 654, proteinG: 15.2, carbsG: 13.7, fatG: 65.2, fiberG: 6.7,  dietType: ['veg','vegan'], typicalServingG: 20,  costPerServingInr: 20 },
  { id: 'chia-seeds',   name: 'Chia Seeds',               nameHindi: 'चिया बीज',    category: 'ingredient', caloriesPer100g: 486, proteinG: 16.5, carbsG: 42.1, fatG: 30.7, fiberG: 34.4, dietType: ['veg','vegan'], typicalServingG: 10,  costPerServingInr: 8  },
  { id: 'flax-seeds',   name: 'Flax Seeds',               nameHindi: 'अलसी',        category: 'ingredient', caloriesPer100g: 534, proteinG: 18.3, carbsG: 28.9, fatG: 42.2, fiberG: 27.3, dietType: ['veg','vegan'], typicalServingG: 10,  costPerServingInr: 5  },

  // ─── BEVERAGES ─────────────────────────────────────────────────────────────
  { id: 'tea-milk-sugar', name: 'Chai (milk + sugar)',    nameHindi: 'चाय',          category: 'beverage',  caloriesPer100g: 35,  proteinG: 1.1,  carbsG: 5.8,  fatG: 0.8,  fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 150, costPerServingInr: 8  },
  { id: 'black-tea',    name: 'Black Tea (no milk)',      nameHindi: 'काली चाय',    category: 'beverage',  caloriesPer100g: 2,   proteinG: 0.1,  carbsG: 0.4,  fatG: 0.0,  fiberG: 0.0,  dietType: ['veg','vegan'], typicalServingG: 200, costPerServingInr: 5  },
  { id: 'coffee-milk',  name: 'Coffee (milk, no sugar)',  nameHindi: 'कॉफी',         category: 'beverage',  caloriesPer100g: 42,  proteinG: 1.3,  carbsG: 5.5,  fatG: 1.7,  fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 150, costPerServingInr: 10 },
  { id: 'green-tea',    name: 'Green Tea',                nameHindi: 'हरी चाय',     category: 'beverage',  caloriesPer100g: 2,   proteinG: 0.2,  carbsG: 0.4,  fatG: 0.0,  fiberG: 0.0,  dietType: ['veg','vegan'], typicalServingG: 200, costPerServingInr: 5  },
  { id: 'coconut-water', name: 'Coconut Water',          nameHindi: 'नारियल पानी', category: 'beverage',  caloriesPer100g: 19,  proteinG: 0.7,  carbsG: 3.7,  fatG: 0.2,  fiberG: 1.1,  dietType: ['veg','vegan'], typicalServingG: 250, costPerServingInr: 20 },
  { id: 'protein-shake', name: 'Whey Protein Shake',     nameHindi: 'प्रोटीन शेक', category: 'beverage',  caloriesPer100g: 130, proteinG: 22.0, carbsG: 8.5,  fatG: 1.8,  fiberG: 0.0,  dietType: ['veg'],         typicalServingG: 300, costPerServingInr: 55 },

  // ─── MISCELLANEOUS ─────────────────────────────────────────────────────────
  { id: 'tofu',         name: 'Tofu',                     nameHindi: 'टोफू',         category: 'ingredient', caloriesPer100g: 76,  proteinG: 8.1,  carbsG: 1.9,  fatG: 4.8,  fiberG: 0.3,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 25 },
  { id: 'soya-chunks',  name: 'Soya Chunks (cooked)',     nameHindi: 'सोया चंक्स',   category: 'lunch',     caloriesPer100g: 149, proteinG: 17.8, carbsG: 15.2, fatG: 0.5,  fiberG: 3.2,  dietType: ['veg','vegan'], typicalServingG: 100, costPerServingInr: 12 },
  { id: 'mushroom-curry', name: 'Mushroom Curry',         nameHindi: 'मशरूम करी',   category: 'dinner',    caloriesPer100g: 98,  proteinG: 3.2,  carbsG: 8.4,  fatG: 5.8,  fiberG: 1.8,  dietType: ['veg','vegan'], typicalServingG: 150, costPerServingInr: 35 },
  { id: 'peanut-butter', name: 'Peanut Butter (1 tbsp)', nameHindi: 'मूंगफली मक्खन', category: 'ingredient', caloriesPer100g: 588, proteinG: 25.1, carbsG: 20.1, fatG: 50.4, fiberG: 6.0,  dietType: ['veg','vegan'], typicalServingG: 16,  costPerServingInr: 12 },
  { id: 'honey',        name: 'Honey (1 tsp)',            nameHindi: 'शहद',          category: 'ingredient', caloriesPer100g: 304, proteinG: 0.3,  carbsG: 82.4, fatG: 0.0,  fiberG: 0.2,  dietType: ['veg'],         typicalServingG: 7,   costPerServingInr: 5  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function searchFoods(query: string): IndianFood[] {
  const q = query.toLowerCase();
  return indianFoods.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.nameHindi.includes(q) ||
    f.id.includes(q)
  );
}

export function getFoodById(id: string): IndianFood | undefined {
  return indianFoods.find(f => f.id === id);
}

export function filterByDiet(dietPref: string): IndianFood[] {
  switch (dietPref) {
    case 'vegan':      return indianFoods.filter(f => f.dietType.includes('vegan'));
    case 'veg':        return indianFoods.filter(f => f.dietType.includes('veg'));
    case 'jain':       return indianFoods.filter(f => f.dietType.includes('veg') || f.dietType.includes('vegan'));
    case 'eggetarian': return indianFoods.filter(f => f.dietType.some(d => d === 'veg' || d === 'egg' || d === 'vegan'));
    default:           return indianFoods; // non-veg: all foods
  }
}

export function macrosForServing(food: IndianFood, quantityG: number) {
  const ratio = quantityG / 100;
  return {
    calories: Math.round(food.caloriesPer100g * ratio),
    proteinG: Math.round(food.proteinG * ratio * 10) / 10,
    carbsG:   Math.round(food.carbsG   * ratio * 10) / 10,
    fatG:     Math.round(food.fatG     * ratio * 10) / 10,
  };
}
