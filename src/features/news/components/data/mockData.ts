import {type  Category,type Article } from "../../types";

/**
 * Mock data for categories and articles
 * Using realistic Pexels.com images for demonstration
 */

export const categories: Category[] = [
  {
    id: '1',
    name: 'Technology',
    description: 'Latest news in tech, AI, and digital innovation',
    imageUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'technology',
    articleCount: 24
  },
  {
    id: '2',
    name: 'Business',
    description: 'Market trends, startups, and corporate news',
    imageUrl: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'business',
    articleCount: 18
  },
  {
    id: '3',
    name: 'Sports',
    description: 'Sports updates, scores, and athlete stories',
    imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'sports',
    articleCount: 32
  },
  {
    id: '4',
    name: 'Health',
    description: 'Health tips, medical breakthroughs, and wellness',
    imageUrl: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'health',
    articleCount: 15
  },
  {
    id: '5',
    name: 'Science',
    description: 'Scientific discoveries and research findings',
    imageUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'science',
    articleCount: 21
  },
  {
    id: '6',
    name: 'Entertainment',
    description: 'Movies, music, celebrities, and pop culture',
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'entertainment',
    articleCount: 28
  },
  {
    id: '7',
    name: 'World News',
    description: 'Global events and international affairs',
    imageUrl: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'world-news',
    articleCount: 45
  },
  {
    id: '8',
    name: 'Travel',
    description: 'Travel guides, destinations, and adventures',
    imageUrl: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'travel',
    articleCount: 19
  }
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Healthcare',
    slug: 'future-ai-healthcare',
    category: 'Technology',
    categoryId: '1',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedDate: '2024-10-10',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    excerpt: 'Exploring how AI is revolutionizing medical diagnosis, treatment planning, and patient care across the healthcare industry.',
    content: `
      <p>Artificial Intelligence is transforming healthcare at an unprecedented pace, offering new possibilities for diagnosis, treatment, and patient care. From machine learning algorithms that can detect cancer in medical images to AI-powered drug discovery platforms, the integration of intelligent systems is reshaping the medical landscape.</p>
      
      <h2>AI in Medical Diagnosis</h2>
      <p>One of the most promising applications of AI in healthcare is in medical diagnosis. Deep learning models can now analyze medical images with accuracy that often surpasses human specialists. For instance, Google's DeepMind has developed AI systems that can diagnose over 50 eye diseases with 94% accuracy.</p>
      
      <h2>Personalized Treatment Plans</h2>
      <p>AI algorithms can analyze vast amounts of patient data to create personalized treatment plans. By considering genetic information, medical history, lifestyle factors, and real-time health metrics, AI can help doctors tailor treatments to individual patients.</p>
      
      <h2>Drug Discovery and Development</h2>
      <p>Traditional drug discovery can take 10-15 years and cost billions of dollars. AI is accelerating this process by predicting molecular behavior, identifying potential drug candidates, and optimizing clinical trial designs.</p>
      
      <h2>Challenges and Considerations</h2>
      <p>While the potential is enormous, there are important challenges to address, including data privacy, regulatory approval, and ensuring AI systems are transparent and unbiased. The healthcare industry must navigate these challenges carefully to realize AI's full potential.</p>
    `,
    readTime: 5,
    tags: ['AI', 'Healthcare', 'Technology', 'Medicine']
  },
  {
    id: '2',
    title: 'Sustainable Business Practices: The New Competitive Advantage',
    slug: 'sustainable-business-practices',
    category: 'Business',
    categoryId: '2',
    imageUrl: 'https://images.pexels.com/photos/9800031/pexels-photo-9800031.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedDate: '2024-10-09',
    author: {
      name: 'Michael Rodriguez',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    excerpt: 'How companies are turning environmental responsibility into business success through innovative sustainable practices.',
    content: `
      <p>In today's business landscape, sustainability is no longer just a moral imperative—it's a strategic advantage. Companies that embrace sustainable practices are discovering new revenue streams, reducing costs, and building stronger relationships with customers and stakeholders.</p>
      
      <h2>The Business Case for Sustainability</h2>
      <p>Research shows that companies with strong sustainability practices outperform their peers financially. The Harvard Business School found that sustainable companies have 4.8% higher returns on equity and 2.9% higher profit margins than their less sustainable counterparts.</p>
      
      <h2>Innovation Through Constraints</h2>
      <p>Environmental constraints often drive innovation. Companies like Patagonia and Interface have turned sustainability challenges into opportunities for product innovation and operational efficiency.</p>
      
      <h2>Consumer Demand and Brand Loyalty</h2>
      <p>Modern consumers, especially millennials and Gen Z, are increasingly choosing brands based on their values. A Nielsen study found that 73% of global consumers would pay more for products from sustainable brands.</p>
      
      <h2>The Path Forward</h2>
      <p>Successful sustainable business transformation requires commitment from leadership, employee engagement, and integration of sustainability into core business strategy. Companies that start this journey early will have a significant competitive advantage.</p>
    `,
    readTime: 4,
    tags: ['Sustainability', 'Business Strategy', 'Environment', 'Innovation']
  },
  {
    id: '3',
    title: 'Olympic Dreams: The Science Behind Peak Athletic Performance',
    slug: 'olympic-science-peak-performance',
    category: 'Sports',
    categoryId: '3',
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedDate: '2024-10-08',
    author: {
      name: 'Coach Amanda Thompson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    excerpt: 'Exploring the cutting-edge science and technology that helps Olympic athletes achieve peak performance.',
    content: `
      <p>Olympic athletes represent the pinnacle of human physical achievement. Behind their extraordinary performances lies a complex web of scientific principles, advanced technology, and meticulous training methodologies that push the boundaries of what's possible.</p>
      
      <h2>Sports Science Revolution</h2>
      <p>Modern sports science combines biomechanics, physiology, psychology, and nutrition to optimize athletic performance. Motion capture technology analyzes movement patterns with millimeter precision, while physiological monitoring tracks every aspect of an athlete's response to training.</p>
      
      <h2>Technology in Training</h2>
      <p>From underwater treadmills to altitude simulation chambers, technology has revolutionized athletic training. Virtual reality systems help athletes visualize perfect technique, while wearable sensors provide real-time feedback on performance metrics.</p>
      
      <h2>Nutrition and Recovery</h2>
      <p>Precision nutrition tailored to individual genetic profiles and training demands can provide marginal gains that make the difference between gold and silver. Recovery technologies like cryotherapy, compression therapy, and sleep optimization have become crucial components of elite training programs.</p>
      
      <h2>Mental Performance</h2>
      <p>Sports psychology has evolved from basic motivation techniques to sophisticated mental training programs. Neurofeedback, meditation apps, and cognitive behavioral therapy help athletes develop the mental resilience needed for Olympic competition.</p>
    `,
    readTime: 6,
    tags: ['Olympics', 'Sports Science', 'Performance', 'Technology']
  },
  {
    id: '4',
    title: 'Breakthrough in Gene Therapy Offers Hope for Rare Diseases',
    slug: 'gene-therapy-breakthrough-rare-diseases',
    category: 'Health',
    categoryId: '4',
    imageUrl: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedDate: '2024-10-07',
    author: {
      name: 'Dr. Jennifer Park',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    excerpt: 'Revolutionary gene therapy treatments are showing remarkable success in treating previously incurable genetic disorders.',
    content: `
      <p>A groundbreaking gene therapy trial has shown remarkable results in treating patients with severe genetic disorders, offering new hope for millions affected by rare diseases worldwide. The treatment represents a significant milestone in precision medicine.</p>
      
      <h2>The Science Behind Gene Therapy</h2>
      <p>Gene therapy works by introducing healthy copies of genes into patients' cells to correct defective genes responsible for disease. Recent advances in CRISPR technology and viral vector delivery systems have made these treatments more precise and effective than ever before.</p>
      
      <h2>Clinical Trial Results</h2>
      <p>In a recent Phase III trial involving 120 patients with Leber congenital amaurosis, a rare inherited blindness, 85% of participants showed significant improvement in vision after receiving the gene therapy treatment. Many patients who were completely blind can now navigate independently.</p>
      
      <h2>Expanding Applications</h2>
      <p>Beyond rare genetic disorders, researchers are exploring gene therapy applications for cancer, heart disease, and neurodegenerative conditions. Early trials for treating sickle cell disease and beta-thalassemia have shown particularly promising results.</p>
      
      <h2>Challenges and Future Outlook</h2>
      <p>While results are encouraging, challenges remain including high treatment costs, potential side effects, and manufacturing scalability. However, as technology advances and costs decrease, gene therapy may become a standard treatment option for many genetic conditions.</p>
    `,
    readTime: 5,
    tags: ['Gene Therapy', 'Rare Diseases', 'Medical Breakthrough', 'CRISPR']
  },
  {
    id: '5',
    title: 'Mars Mission Update: New Discoveries from Perseverance Rover',
    slug: 'mars-perseverance-rover-discoveries',
    category: 'Science',
    categoryId: '5',
    imageUrl: 'https://images.pexels.com/photos/23764/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200',
    publishedDate: '2024-10-06',
    author: {
      name: 'Dr. Alex Morgan',
      avatar: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    excerpt: 'Latest findings from NASA\'s Perseverance rover reveal compelling evidence of ancient microbial life on Mars.',
    content: `
      <p>NASA's Perseverance rover has made groundbreaking discoveries that could fundamentally change our understanding of life in the universe. New analysis of rock samples collected from Jezero Crater provides the strongest evidence yet of ancient microbial life on Mars.</p>
      
      <h2>The Discovery</h2>
      <p>The rover's sophisticated instruments detected organic molecules and mineral formations that on Earth are associated with biological processes. These biosignatures were found in sedimentary rocks that formed in what was once a river delta, billions of years ago.</p>
      
      <h2>Scientific Significance</h2>
      <p>The presence of preserved organic matter in multiple rock samples suggests that Mars once had conditions suitable for life. The discovery of carbonate minerals and sulfate deposits indicates that ancient Mars had a more stable climate and liquid water for extended periods.</p>
      
      <h2>Sample Return Mission</h2>
      <p>The most promising samples have been cached for future return to Earth through a joint NASA-ESA mission planned for the 2030s. Advanced laboratory analysis on Earth will provide definitive answers about whether these signatures represent ancient Martian life.</p>
      
      <h2>Implications for Astrobiology</h2>
      <p>These findings support the hypothesis that life may be more common in the universe than previously thought. If confirmed, it would represent the first discovery of extraterrestrial life and revolutionize our understanding of biology and our place in the cosmos.</p>
    `,
    readTime: 7,
    tags: ['Mars', 'Space Exploration', 'Astrobiology', 'NASA']
  },
  {
    id: '6',
    title: 'Streaming Wars: How Content Strategy is Reshaping Entertainment',
    slug: 'streaming-wars-content-strategy',
    category: 'Entertainment',
    categoryId: '6',
    imageUrl: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedDate: '2024-10-05',
    author: {
      name: 'Emma Williams',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    excerpt: 'An in-depth look at how streaming platforms are competing through original content and innovative distribution strategies.',
    content: `
      <p>The entertainment landscape has been transformed by the streaming revolution, with platforms investing billions in original content to capture and retain subscribers. This shift is fundamentally changing how content is created, distributed, and consumed.</p>
      
      <h2>The Content Arms Race</h2>
      <p>Netflix, Amazon Prime, Disney+, HBO Max, and Apple TV+ are spending unprecedented amounts on original programming. In 2024, these platforms are expected to invest over $50 billion globally in content creation, driving a golden age of television and film production.</p>
      
      <h2>Data-Driven Content Creation</h2>
      <p>Streaming platforms leverage viewer data to inform content decisions, from casting choices to plot development. This data-driven approach has led to more targeted programming and higher success rates for original content.</p>
      
      <h2>Global Content Strategy</h2>
      <p>International content has become a key differentiator, with series like "Squid Game," "Money Heist," and "The Queen's Gambit" achieving global success. Platforms are investing in local content production worldwide to attract diverse audiences.</p>
      
      <h2>The Future of Entertainment</h2>
      <p>As competition intensifies, we can expect continued innovation in content formats, interactive storytelling, and personalized viewing experiences. The winners will be those who can combine compelling content with superior user experience and global reach.</p>
    `,
    readTime: 6,
    tags: ['Streaming', 'Entertainment', 'Content Strategy', 'Digital Media']
  }
];

/**
 * Helper functions for data manipulation
 */
export const getCategoriesPaginated = (page: number, perPage: number = 6) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return categories.slice(startIndex, endIndex);
};

export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};

export const getArticlesByCategoryId = (categoryId: string): Article[] => {
  return articles.filter(article => article.categoryId === categoryId);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getTotalCategoryPages = (perPage: number = 6): number => {
  return Math.ceil(categories.length / perPage);
};