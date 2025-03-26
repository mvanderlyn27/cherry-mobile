import { Book, Chapter } from "@/types/app";

export type CategoryData = {
  name: string;
  books: Book[];
};

export const categoryData: CategoryData[] = [
  {
    name: "Romance",
    books: Array.from({ length: 10 }, (_, i) => ({
      id: `r${i + 1}`,
      title: [
        "Love in Paris",
        "Sunset Dreams",
        "Winter's Kiss",
        "Summer Romance",
        "Moonlight Dance",
        "Heart's Desire",
        "Ocean's Promise",
        "Autumn Love",
        "Spring Awakening",
        "Starlit Romance",
      ][i],
      author: ["Jane Doe", "John Smith", "Emily Rose", "Michael Chen", "Sarah Wilson", 
               "David Lee", "Anna Brown", "James Wright", "Lisa Park", "Robert Kim"][i],
      lang: "en",
      placeholder: null,
      cover_url: `https://picsum.photos/200/${300 + i}`,
      preview_text:
        "On the night of turning 18, you were sold by your parents to the most powerful werewolf family in the city. You are forced to mate with the alpha of the group—Lukas, who's known for murdering his brides...",
      price: 25 + Math.floor(Math.random() * 20),
      reading_time: 60 + Math.floor(Math.random() * 60),
      reader_count: Math.floor(Math.random() * 100000) + 1000, // Add random reader count between 1,000 and 101,000
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    })),
  },
  {
    name: "Mystery",
    books: Array.from({ length: 10 }, (_, i) => ({
      id: `m${i + 1}`,
      title: [
        "The Hidden Clue",
        "Midnight Detective",
        "The Last Witness",
        "Silent Shadows",
        "Dark Secrets",
        "The Missing Key",
        "Deadly Puzzle",
        "Cold Case",
        "Final Evidence",
        "Mystery Manor",
      ][i],
      author: ["Agatha Chen", "Sherlock Brown", "Nancy Drew", "Arthur Blake", "Patricia Wells",
               "Raymond Black", "Mary Holmes", "Richard Castle", "Jessica Fletcher", "Hercule White"][i],
      lang: "en",
      placeholder: null,
      cover_url: `https://picsum.photos/200/${310 + i}`,
      preview_text: "A thrilling mystery that will keep you guessing...",
      price: 30 + Math.floor(Math.random() * 20),
      reading_time: 90 + Math.floor(Math.random() * 60),
      reader_count: Math.floor(Math.random() * 100000) + 1000, // Add random reader count between 1,000 and 101,000
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    })),
  },
  {
    name: "Fantasy",
    books: Array.from({ length: 10 }, (_, i) => ({
      id: `f${i + 1}`,
      title: [
        "Dragon's Quest",
        "The Crystal Sword",
        "Realm of Magic",
        "Ancient Spells",
        "The Lost Kingdom",
        "Wizard's Path",
        "Mythical Beasts",
        "Enchanted Forest",
        "The Last Sorcerer",
        "Portal to Dreams",
      ][i],
      author: ["J.R. Blackwood", "Merlin Grey", "Luna Silverstar", "Drake Fireforge", "Aria Nightshade",
               "Storm Ravenclaw", "Sage Moonweaver", "Crystal Starling", "Phoenix Wright", "River Shadowmend"][i],
      lang: "en",
      placeholder: null,
      cover_url: `https://picsum.photos/200/${320 + i}`,
      preview_text: "An epic fantasy adventure in a magical world...",
      price: 35 + Math.floor(Math.random() * 20),
      reading_time: 120 + Math.floor(Math.random() * 60),
      reader_count: Math.floor(Math.random() * 100000) + 1000, // Add random reader count between 1,000 and 101,000
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    })),
  },
  {
    name: "Sci-Fi",
    books: Array.from({ length: 10 }, (_, i) => ({
      id: `s${i + 1}`,
      title: [
        "Space Odyssey",
        "Time Paradox",
        "Quantum Dreams",
        "Android Heart",
        "Stellar Wars",
        "Neural Link",
        "Cosmic Journey",
        "Future's Edge",
        "Digital Horizon",
        "Galaxy's End",
      ][i],
      author: ["Isaac Clarke", "Nova Sterling", "Orion Wells", "Tesla Knight", "Cosmos Jones",
               "Aurora Blake", "Vector Prime", "Nebula Smith", "Quantum Wright", "Galaxy Rose"][i],
      lang: "en",
      placeholder: null,
      cover_url: `https://picsum.photos/200/${330 + i}`,
      preview_text: "A journey through space and time...",
      price: 35 + Math.floor(Math.random() * 20),
      reading_time: 100 + Math.floor(Math.random() * 60),
      reader_count: Math.floor(Math.random() * 100000) + 1000, // Add random reader count between 1,000 and 101,000
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    })),
  },
  {
    name: "Horror",
    books: Array.from({ length: 10 }, (_, i) => ({
      id: `h${i + 1}`,
      title: [
        "Haunted House",
        "Midnight Terror",
        "Dark Whispers",
        "The Cursed",
        "Shadow's Edge",
        "Ancient Evil",
        "Night Stalker",
        "Demon's Door",
        "Ghost Stories",
        "The Possession",
      ][i],
      author: ["Edgar Blackwood", "Stephen Night", "Raven Crow", "Mary Shelley", "Howard Phillips",
               "Crimson King", "Blair Woods", "Salem Wright", "Dante Shadow", "Victor Graves"][i],
      lang: "en",
      placeholder: null,
      cover_url: `https://picsum.photos/200/${340 + i}`,
      preview_text: "A spine-chilling tale of horror and suspense...",
      price: 30 + Math.floor(Math.random() * 20),
      reading_time: 80 + Math.floor(Math.random() * 60),
      reader_count: Math.floor(Math.random() * 100000) + 1000, // Add random reader count between 1,000 and 101,000
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted: false,
    })),
  },
];

// Sample chapter content for testing scrolling
export const sampleChapterContent = `
Chapter 1: The Beginning

The sun was setting over the horizon, casting long shadows across the landscape. It had been a long day, and the journey was only beginning. As I stood there, watching the colors change in the sky, I couldn't help but wonder what lay ahead.

The path before me was uncertain, filled with both promise and peril. But I had made my choice, and there was no turning back now. With a deep breath, I shouldered my pack and continued forward.

The village I had left behind was now just a distant memory, a collection of thatched roofs and familiar faces that I might never see again. But the call of adventure was too strong to ignore, and I had always known that I was destined for something more.

As night fell, I made camp beneath a large oak tree. The stars above twinkled like diamonds against the velvet sky, and for a moment, I felt at peace. Tomorrow would bring new challenges, but for now, I could rest.

Morning came all too quickly, with the first light of dawn filtering through the leaves above. I packed up my meager belongings and set off once more, following the winding path that led deeper into the unknown.

The forest grew thicker as I walked, the trees closing in around me like silent sentinels. Birds called to one another overhead, and occasionally, I caught glimpses of small animals darting through the underbrush.

By midday, I had reached a small clearing where a stream bubbled merrily over smooth stones. I stopped to refill my water skin and rest for a while, enjoying the cool shade and the gentle sound of flowing water.

It was there that I first noticed the tracks – large, unfamiliar prints pressed into the soft earth near the water's edge. Something had been here not long ago, something big. A shiver ran down my spine as I realized I might not be alone in these woods.

Cautiously, I continued on my way, now more alert to my surroundings. The forest seemed different somehow, more watchful, as if the very trees were observing my passage.

As the day wore on, the path began to climb, leading me up into the foothills of the mountains that had loomed on the horizon since I began my journey. The going was tougher now, and my legs ached with the effort of the ascent.

But with each step, I felt a growing sense of anticipation. Something was waiting for me up ahead, something important. I could feel it in my bones, a certainty that transcended rational thought.

As the sun began to set once more, I crested a ridge and saw it – a structure of some kind, half-hidden among the trees in the valley below. It was too far to make out details, but it was clearly not natural, not part of the forest that surrounded it.

With renewed energy, I made my way down the slope, eager to reach the mysterious building before darkness fell completely. Questions raced through my mind: Who had built this place? Was it abandoned, or would I find others there? And most importantly, was it connected to the purpose that had drawn me away from home?

The last rays of sunlight were fading as I approached the structure. Up close, I could see that it was an ancient temple of some kind, its stone walls weathered by centuries of exposure to the elements. Vines crept up the sides, and part of the roof had collapsed, but it still stood, a testament to the skill of its builders.

Heart pounding, I stepped through the entrance, into the shadows within. The air was cool and still, heavy with the weight of ages past. Dust motes danced in the few beams of light that penetrated the gloom, and my footsteps echoed in the silence.

The interior was larger than I had expected, with a central chamber and several smaller rooms branching off from it. Faded murals covered the walls, depicting scenes I couldn't quite make out in the dim light.

In the center of the main chamber stood an altar of sorts, a large stone table that seemed to be the focal point of the entire temple. And on that altar lay a book, its leather binding cracked with age but somehow still intact.

Drawn by a curiosity I couldn't explain, I approached the altar and reached for the book. As my fingers touched the ancient leather, a strange sensation washed over me – a feeling of connection, as if I had found something I had been searching for all my life without even knowing it.

With trembling hands, I opened the book, revealing pages filled with text in a language I had never seen before. Yet, somehow, I could understand it, the words seeming to translate themselves in my mind as I read.

"To the one who finds this tome," it began, "know that you have been chosen. The path you walk is no accident, and the journey ahead is greater than you can imagine."

I read on, my amazement growing with each passage. The book spoke of ancient powers, of a balance that had been disturbed, and of a role I was destined to play in restoring that balance.

As I reached the end of the first chapter, I knew with absolute certainty that my life had changed forever. The adventure I had sought had found me, and it was far more significant than I could have ever dreamed.

With the book carefully stowed in my pack, I made camp within the temple walls. Tomorrow, I would begin the next phase of my journey, following the guidance of the ancient text. But for tonight, I would rest, surrounded by the echoes of the past and the promise of the future.

As I drifted off to sleep, I couldn't help but wonder what challenges lay ahead. But for the first time in my life, I felt truly alive, truly purposeful. Whatever came next, I was ready to face it.

And so began my tale, a story of discovery, danger, and destiny. A story that, little did I know, would one day be told around campfires and in great halls throughout the land. But that is a tale for another time, another chapter.

For now, let us rest, as I did that night in the ancient temple, with the weight of destiny upon me and the unknown stretching out before me like an uncharted sea.
`;

// Sample chapters for the reader
export const sampleChapters: (Chapter & { content: string; is_locked: boolean })[] = [
  {
    id: "1",
    title: "The Beginning",
    book_id: "f1",
    chapter_number: 1,
    is_locked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted: false,
    text: null,
    word_count: 1200,
    content: sampleChapterContent
  },
  {
    id: "2",
    title: "The Journey",
    book_id: "f1",
    chapter_number: 2,
    is_locked: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted: false,
    text: null,
    word_count: 1100,
    content: ""
  },
  {
    id: "3",
    title: "The Challenge",
    book_id: "f1",
    chapter_number: 3,
    is_locked: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted: false,
    text: null,
    word_count: 1300,
    content: ""
  },
  {
    id: "4",
    title: "The Resolution",
    book_id: "f1",
    chapter_number: 4,
    is_locked: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted: false,
    text: null,
    word_count: 1400,
    content: ""
  }
];
