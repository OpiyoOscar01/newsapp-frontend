import { type Article, type Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'World',
    slug: 'world',
    description: 'Global news and international affairs',
    color: 'bg-red-500'
  },
  {
    id: '2',
    name: 'Business',
    slug: 'business',
    description: 'Financial markets and business news',
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest in tech and innovation',
    color: 'bg-blue-500'
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports news and updates',
    color: 'bg-orange-500'
  },
  {
    id: '5',
    name: 'Health',
    slug: 'health',
    description: 'Health and wellness news',
    color: 'bg-purple-500'
  },
  {
    id: '6',
    name: 'Science',
    slug: 'science',
    description: 'Scientific discoveries and research',
    color: 'bg-indigo-500'
  }
];

export const articles: Article[] = [
  // World News
  {
    id: '1',
    title: 'Global Climate Summit Reaches Historic Agreement',
    summary: 'World leaders unite on comprehensive climate action plan with binding commitments for carbon neutrality by 2050.',
    content: `In a landmark decision that marks a turning point in global climate policy, representatives from 195 countries have reached a historic agreement at the Global Climate Summit. The comprehensive plan includes binding commitments for achieving carbon neutrality by 2050, with intermediate targets for 2030 and 2040.

The agreement, which took three weeks of intensive negotiations, establishes a new framework for international cooperation on climate change. Key provisions include mandatory reporting on emissions reductions, financial support for developing nations, and technology transfer agreements.

"This is the most significant climate agreement since the Paris Accord," said Dr. Maria Santos, lead climate negotiator. "We've moved beyond promises to concrete, measurable actions with real accountability mechanisms."

The plan allocates $500 billion over the next decade for renewable energy infrastructure in developing countries and establishes a global carbon pricing mechanism. Critics argue the timeline may be too ambitious, while environmental groups say it doesn't go far enough.

Implementation begins immediately, with the first progress review scheduled for next year. The success of this agreement could determine the planet's climate future for generations to come.`,
    author: 'Sarah Johnson',
    publishedAt: '2024-03-15T10:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg',
    category: 'world',
    readTime: 4,
    tags: ['climate', 'environment', 'politics', 'international']
  },
  {
    id: '2',
    title: 'International Trade Relations Show Signs of Recovery',
    summary: 'New bilateral agreements between major economies signal improving global trade relationships after years of tension.',
    content: `Global trade relations are showing promising signs of recovery as major economies announce new bilateral agreements and reduce trade barriers. The latest development comes as the US and China finalize a comprehensive trade framework that addresses key concerns from both nations.

The new agreements focus on technology transfer, intellectual property protection, and fair competition practices. Trade volumes between the participating countries have increased by 15% in the past quarter, the highest growth rate in three years.

European Union officials have also announced similar agreements with Asian markets, creating new opportunities for businesses and consumers alike. The deals are expected to reduce costs for everyday goods while promoting innovation and job creation.

"We're seeing a fundamental shift towards cooperation rather than confrontation in international trade," explained economist Dr. Robert Chen. "This collaborative approach benefits everyone involved."

However, some concerns remain about the long-term sustainability of these agreements, particularly regarding environmental standards and labor practices. Ongoing monitoring and adjustment mechanisms have been built into the frameworks to address these challenges.`,
    author: 'Michael Rodriguez',
    publishedAt: '2024-03-14T14:20:00Z',
    imageUrl: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg',
    category: 'world',
    readTime: 3,
    tags: ['trade', 'economy', 'international', 'politics']
  },
  {
    id: '3',
    title: 'Humanitarian Crisis Response Efforts Intensify',
    summary: 'International organizations coordinate massive relief operation as millions face displacement due to natural disasters.',
    content: `International humanitarian organizations are coordinating an unprecedented relief effort as natural disasters across multiple regions have displaced over 2 million people in the past month. The coordinated response involves 40 countries and dozens of NGOs working together to provide emergency aid.

The crisis began with severe flooding in Southeast Asia, followed by drought conditions in East Africa, and culminated with a major earthquake that struck a densely populated urban area. The simultaneous nature of these disasters has stretched global relief capacity to its limits.

"We're dealing with multiple emergencies at once, which requires innovative approaches to resource allocation and logistics," said Amanda Foster, Director of International Relief Operations. "The solidarity shown by the international community has been remarkable."

Emergency shelters have been established for over 500,000 people, while medical teams provide critical healthcare services. Food and water distribution networks are being expanded to reach remote areas where infrastructure has been damaged or destroyed.

The estimated cost of the relief operation exceeds $2 billion, with funding coming from government contributions, private donations, and corporate partnerships. Long-term reconstruction efforts are already being planned to help affected communities rebuild stronger and more resilient infrastructure.`,
    author: 'Lisa Thompson',
    publishedAt: '2024-03-13T08:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/6995251/pexels-photo-6995251.jpeg',
    category: 'world',
    readTime: 5,
    tags: ['humanitarian', 'disaster', 'relief', 'international']
  },

  // Business News
  {
    id: '4',
    title: 'Tech Giants Report Record Quarterly Earnings',
    summary: 'Major technology companies exceed analyst expectations with strong growth in cloud services and AI investments.',
    content: `The world's largest technology companies have reported record-breaking quarterly earnings, driven primarily by robust growth in cloud computing services and artificial intelligence investments. The results have exceeded Wall Street expectations and boosted market confidence in the tech sector.

Leading the charge, several major tech firms reported revenue growth of over 20% year-over-year, with cloud services contributing the largest share of new revenue. AI-related products and services have also shown exceptional growth, with some companies reporting 300% increases in AI service adoption.

"The acceleration of digital transformation across industries continues to drive demand for our services," said Jennifer Walsh, CEO of a major cloud provider. "We're seeing unprecedented investment in AI capabilities from businesses of all sizes."

The strong earnings have been attributed to several factors: increased enterprise spending on digital infrastructure, growing consumer demand for connected devices, and the expansion of AI applications across various sectors. However, some analysts warn that the current growth rates may not be sustainable long-term.

Investment in research and development has also reached new highs, with companies allocating billions of dollars toward quantum computing, advanced AI, and next-generation communication technologies. These investments are expected to drive future growth and maintain competitive advantages.`,
    author: 'David Park',
    publishedAt: '2024-03-15T16:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg',
    category: 'business',
    readTime: 4,
    tags: ['earnings', 'technology', 'AI', 'cloud computing']
  },
  {
    id: '5',
    title: 'Renewable Energy Sector Attracts Massive Investment',
    summary: 'Green energy projects receive $200 billion in funding as investors shift focus to sustainable technologies.',
    content: `The renewable energy sector has attracted a record $200 billion in investment this year, marking a significant shift in investor priorities toward sustainable technologies. The funding spans solar, wind, hydroelectric, and emerging energy storage technologies.

Private equity firms, institutional investors, and sovereign wealth funds are leading the charge, recognizing both the environmental necessity and the strong return potential of clean energy projects. Government policies supporting renewable energy adoption have created favorable investment conditions.

"We're witnessing a fundamental transformation in how energy markets operate," explained Dr. Rachel Green, energy market analyst. "The economics of renewable energy have reached a tipping point where they're not just environmentally responsible, but also the most profitable option."

Solar energy projects have received the largest share of investment, followed by offshore wind farms and battery storage facilities. New technologies like floating solar panels and vertical wind turbines are also attracting significant funding for research and development.

The investment boom is creating thousands of jobs across manufacturing, installation, and maintenance of renewable energy systems. Several regions are emerging as global hubs for clean energy production, attracting additional investment in supporting infrastructure.

Major corporations are also announcing commitments to power their operations entirely with renewable energy, creating a stable demand base that further encourages investment in the sector.`,
    author: 'Emily Chen',
    publishedAt: '2024-03-14T11:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg',
    category: 'business',
    readTime: 4,
    tags: ['renewable energy', 'investment', 'sustainability', 'environment']
  },
  {
    id: '6',
    title: 'Cryptocurrency Market Shows Signs of Maturation',
    summary: 'Digital assets gain institutional acceptance as regulatory frameworks provide clearer guidelines for investors.',
    content: `The cryptocurrency market is showing signs of maturation as institutional investors increase their exposure to digital assets and regulatory frameworks become more defined. Major financial institutions are now offering cryptocurrency services to their clients, marking a significant shift in market perception.

Recent regulatory announcements have provided clearer guidelines for cryptocurrency operations, reducing uncertainty that has historically limited institutional participation. Several countries have introduced comprehensive frameworks that balance innovation with consumer protection.

"We're seeing the cryptocurrency market evolve from a speculative asset class to a legitimate part of the financial ecosystem," said Marcus Thompson, head of digital assets at a major investment firm. "The infrastructure and regulatory clarity needed for institutional adoption are finally in place."

Trading volumes have stabilized, and market volatility has decreased compared to previous years. Major corporations are adding cryptocurrencies to their treasury reserves, while pension funds and insurance companies are beginning to allocate small portions of their portfolios to digital assets.

The development of central bank digital currencies (CBDCs) by various countries is also contributing to the legitimization of digital assets. These government-backed digital currencies are expected to coexist with existing cryptocurrencies rather than replace them.

New applications beyond simple value transfer are emerging, including decentralized finance (DeFi) platforms, non-fungible tokens (NFTs) for digital ownership, and blockchain-based supply chain management systems.`,
    author: 'Alex Kumar',
    publishedAt: '2024-03-13T13:20:00Z',
    imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
    category: 'business',
    readTime: 5,
    tags: ['cryptocurrency', 'regulation', 'institutional investment', 'blockchain']
  },

  // Technology News
  {
    id: '7',
    title: 'Breakthrough in Quantum Computing Achieved',
    summary: 'Scientists demonstrate quantum supremacy in practical applications, opening new possibilities for drug discovery and cryptography.',
    content: `Researchers have achieved a major breakthrough in quantum computing, demonstrating quantum supremacy in practical applications that could revolutionize drug discovery, cryptography, and complex problem-solving. The achievement represents years of research and significant technological advancement.

The breakthrough involves a new quantum processor capable of performing calculations that would take classical computers thousands of years to complete. The system has successfully solved complex molecular modeling problems in minutes, opening new possibilities for pharmaceutical research.

"This is a watershed moment for quantum computing," said Dr. Sarah Martinez, lead researcher on the project. "We've moved from theoretical possibility to practical application, which will accelerate progress across multiple scientific fields."

The quantum system uses advanced error correction techniques to maintain coherence for extended periods, a critical requirement for practical applications. The technology could enable the discovery of new materials, optimization of financial portfolios, and advancement of artificial intelligence algorithms.

Several major technology companies and research institutions are now racing to scale up quantum computing capabilities. Government funding for quantum research has increased dramatically, recognizing the strategic importance of the technology.

Applications in cryptography are particularly significant, as quantum computers could both break current encryption methods and enable new forms of secure communication. This dual capability is driving investment in quantum-safe security protocols.

The timeline for widespread commercial adoption remains uncertain, but experts predict that specialized quantum computing services will become available within the next five years.`,
    author: 'Dr. James Wilson',
    publishedAt: '2024-03-15T09:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/2424660/pexels-photo-2424660.jpeg',
    category: 'technology',
    readTime: 5,
    tags: ['quantum computing', 'breakthrough', 'science', 'research']
  },
  {
    id: '8',
    title: 'Artificial Intelligence Transforms Healthcare Diagnosis',
    summary: 'AI-powered diagnostic tools show 95% accuracy in early disease detection, potentially saving millions of lives worldwide.',
    content: `Artificial intelligence diagnostic tools have achieved 95% accuracy in early disease detection across multiple medical conditions, representing a significant advancement in healthcare technology. The AI systems can identify diseases weeks or months before traditional methods, potentially saving millions of lives worldwide.

The breakthrough comes from training AI models on vast datasets of medical images, patient records, and diagnostic outcomes. Machine learning algorithms can now detect subtle patterns in medical scans that human doctors might miss, particularly in the early stages of diseases like cancer, heart disease, and neurological conditions.

"AI is not replacing doctors, but rather augmenting their capabilities," explained Dr. Maria Gonzalez, chief of digital health innovation. "These tools give physicians unprecedented insight into patient conditions, allowing for earlier intervention and better outcomes."

The technology has been successfully deployed in several major hospitals, where it's being used alongside traditional diagnostic methods. Early results show a 40% improvement in early-stage cancer detection and a 30% reduction in diagnostic errors.

Privacy and security measures have been built into the AI systems to protect patient data while enabling the machine learning capabilities. Regulatory approval processes are being streamlined to accelerate the deployment of proven AI diagnostic tools.

Training programs are being developed to help healthcare professionals effectively use AI diagnostic tools. The integration of AI into medical education is also being expanded to prepare the next generation of healthcare providers.

Cost reduction is another significant benefit, as AI-powered diagnostics can reduce the need for expensive tests and procedures while improving accuracy and speed of diagnosis.`,
    author: 'Dr. Amanda Foster',
    publishedAt: '2024-03-14T15:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/3844581/pexels-photo-3844581.jpeg',
    category: 'technology',
    readTime: 4,
    tags: ['AI', 'healthcare', 'diagnosis', 'medical technology']
  },
  {
    id: '9',
    title: 'Next-Generation Internet Infrastructure Unveiled',
    summary: 'Revolutionary fiber optic technology promises internet speeds 100 times faster than current standards.',
    content: `A revolutionary fiber optic technology has been unveiled that promises internet speeds up to 100 times faster than current standards, potentially transforming how we work, communicate, and access information. The breakthrough could enable new applications in virtual reality, autonomous vehicles, and remote collaboration.

The new technology uses advanced photonic processors and innovative fiber optic cables that can transmit data at previously unimaginable speeds. Laboratory tests have achieved download speeds of 100 gigabits per second, with upload speeds matching this performance.

"This isn't just about faster internet," said Dr. Robert Kim, lead engineer on the project. "These speeds enable entirely new categories of applications that weren't possible before, from real-time holographic communication to instant transfer of massive datasets."

The technology addresses current bottlenecks in internet infrastructure that limit the performance of cloud computing, streaming services, and remote work applications. Early adopters include research institutions, financial firms, and technology companies that require ultra-fast data transmission.

Deployment of the new infrastructure has begun in select metropolitan areas, with plans for nationwide rollout over the next five years. The investment required is substantial, but telecommunications companies are committing billions of dollars to upgrade their networks.

Consumer applications include seamless 8K video streaming, instantaneous file transfers, and lag-free online gaming. Business applications span real-time data analytics, cloud computing, and remote collaboration tools that feel as responsive as in-person interactions.

The environmental impact of the new technology is also positive, as the improved efficiency reduces energy consumption per bit of data transmitted compared to current infrastructure.`,
    author: 'Lisa Park',
    publishedAt: '2024-03-13T12:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg',
    category: 'technology',
    readTime: 4,
    tags: ['internet', 'fiber optic', 'infrastructure', 'speed']
  },

  // Sports News
  {
    id: '10',
    title: 'Olympic Games Preparation Enters Final Phase',
    summary: 'Athletes from around the world complete final training as host city puts finishing touches on venues and infrastructure.',
    content: `With just months remaining until the Olympic Games, athletes from around the world are completing their final training phases while the host city puts finishing touches on venues and infrastructure. The anticipation is building for what promises to be one of the most memorable Olympic Games in recent history.

Training facilities are operating at full capacity as athletes fine-tune their performances and adapt to local conditions. National teams have established training camps in the host country, taking advantage of world-class facilities and expert coaching staff.

"The level of preparation this year has been exceptional," said Olympic coordinator Jennifer Walsh. "Athletes are arriving in peak condition, and the competition is expected to be incredibly close across all events."

New venues showcase cutting-edge architecture and sustainable design principles. The Olympic Village features eco-friendly accommodations and state-of-the-art dining and recreation facilities. Transportation systems have been upgraded to handle the influx of visitors while minimizing environmental impact.

Security preparations are comprehensive, with international cooperation ensuring the safety of athletes, officials, and spectators. Advanced technology is being deployed to monitor venues and surrounding areas while maintaining the open, celebratory atmosphere that defines the Olympic experience.

Ticket sales have exceeded expectations, with many events already sold out. Broadcasting partnerships will bring the games to a global audience of billions, with innovative camera angles and immersive technologies providing unprecedented viewing experiences.

Cultural events and celebrations are planned throughout the games, showcasing the host country's heritage while embracing the international spirit of Olympic competition.`,
    author: 'Mark Johnson',
    publishedAt: '2024-03-15T18:20:00Z',
    imageUrl: 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg',
    category: 'sports',
    readTime: 4,
    tags: ['Olympics', 'training', 'athletes', 'preparation']
  },
  {
    id: '11',
    title: 'Professional League Announces Expansion Plans',
    summary: 'Major sports league reveals ambitious growth strategy with new teams and international partnerships.',
    content: `A major professional sports league has announced ambitious expansion plans that include new teams, international partnerships, and innovative fan engagement initiatives. The growth strategy aims to broaden the sport's global appeal while maintaining competitive balance.

The expansion will add four new teams over the next three years, selected from a competitive bidding process that evaluated market potential, facility quality, and ownership stability. The new teams will be located in rapidly growing metropolitan areas with strong sports traditions.

"This expansion represents our commitment to growing the sport and bringing it to new communities," explained league commissioner Sarah Davis. "We're confident these new markets will embrace our teams and contribute to the league's continued success."

International partnerships include exhibition games in Europe and Asia, youth development programs, and broadcasting agreements that will make games available to millions of new fans worldwide. The league is also exploring the possibility of establishing permanent international divisions.

New revenue streams are being developed through digital platforms, merchandise innovations, and enhanced stadium experiences. Technology investments include virtual reality viewing options and interactive fan experiences that bring spectators closer to the action.

Player development programs are being expanded to identify and nurture talent from diverse backgrounds and geographic regions. Scholarships and training facilities will support young athletes who might not otherwise have access to elite coaching and competition.

The expansion is expected to create thousands of jobs and generate significant economic impact in the new markets. Construction of new facilities will incorporate sustainable design principles and community engagement initiatives.`,
    author: 'Tom Rodriguez',
    publishedAt: '2024-03-14T16:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    category: 'sports',
    readTime: 4,
    tags: ['expansion', 'professional league', 'growth', 'international']
  },
  {
    id: '12',
    title: 'Youth Sports Programs See Record Participation',
    summary: 'Community sports initiatives report 40% increase in youth participation, promoting health and social development.',
    content: `Community sports programs across the country are reporting record participation levels, with youth enrollment increasing by 40% over the past year. The growth reflects increased recognition of sports' benefits for physical health, social development, and academic performance.

The surge in participation spans multiple sports and age groups, from elementary school children trying organized sports for the first time to teenagers competing in advanced leagues. Programs have expanded to accommodate the increased demand while maintaining quality coaching and safe playing environments.

"Sports provide young people with valuable life skills beyond physical fitness," said Maria Santos, director of youth development. "They learn teamwork, discipline, goal-setting, and resilience – skills that benefit them throughout their lives."

Investment in facilities and equipment has increased to support the growing programs. New partnerships with local businesses and organizations provide funding for scholarships, ensuring that financial barriers don't prevent participation.

Coaching education programs have been expanded to train volunteers and professionals in age-appropriate instruction, safety protocols, and positive youth development. Emphasis is placed on creating inclusive environments where all young people can participate regardless of skill level.

The programs are having measurable impacts on participants' academic performance, with studies showing improved grades and school attendance among youth involved in organized sports. Social benefits include increased self-confidence and stronger peer relationships.

Long-term goals include establishing pathways for talented athletes to pursue advanced competition while ensuring that recreational participants continue to enjoy sports throughout their lives. The success of these programs is creating models that other communities are adopting nationwide.`,
    author: 'Jennifer Kim',
    publishedAt: '2024-03-13T14:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    category: 'sports',
    readTime: 4,
    tags: ['youth sports', 'participation', 'community', 'development']
  },

  // Health News
  {
    id: '13',
    title: 'New Treatment Shows Promise for Rare Diseases',
    summary: 'Gene therapy breakthrough offers hope for patients with previously untreatable genetic conditions.',
    content: `A groundbreaking gene therapy treatment has shown remarkable promise in treating rare genetic diseases that previously had no effective treatments. Clinical trials have demonstrated significant improvement in patient outcomes, offering new hope for families affected by these conditions.

The therapy uses advanced gene editing techniques to correct defective genes responsible for rare diseases. Early results show that the treatment can halt disease progression and, in some cases, reverse existing damage. The approach targets the root cause of genetic diseases rather than just managing symptoms.

"This represents a paradigm shift in how we approach rare diseases," said Dr. Michael Chen, lead researcher on the project. "We're not just treating symptoms anymore – we're correcting the underlying genetic defects that cause these conditions."

The treatment has been tested on several rare diseases affecting fewer than 200,000 people each. Success rates have exceeded 80% in early trials, with patients showing sustained improvement months after treatment. Side effects have been minimal and manageable.

Regulatory agencies are fast-tracking approval processes for these treatments, recognizing the urgent need for effective therapies for rare diseases. Patient advocacy groups have been instrumental in supporting research and advocating for accelerated access.

Manufacturing and distribution challenges are being addressed to ensure that treatments can reach patients worldwide. Partnerships with specialized facilities and logistics companies are being established to handle the complex requirements of gene therapy production.

Cost considerations are significant, but innovative funding models are being developed to ensure patient access. Insurance coverage frameworks are being established, and patient assistance programs are being created to support families facing financial challenges.

The success of these treatments is spurring investment in research for other rare diseases, with hundreds of potential therapies now in development.`,
    author: 'Dr. Rachel Foster',
    publishedAt: '2024-03-15T11:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg',
    category: 'health',
    readTime: 5,
    tags: ['gene therapy', 'rare diseases', 'treatment', 'breakthrough']
  },
  {
    id: '14',
    title: 'Mental Health Support Systems Expand Nationwide',
    summary: 'Comprehensive mental health initiatives provide accessible care and reduce stigma around mental health treatment.',
    content: `A comprehensive expansion of mental health support systems is providing accessible care to millions of people while working to reduce stigma around mental health treatment. The initiatives include new funding for community programs, telehealth services, and workplace mental health resources.

The expansion addresses the growing recognition that mental health is as important as physical health, with one in four adults experiencing mental health challenges each year. New programs focus on early intervention, crisis support, and long-term care coordination.

"We're creating a system where seeking mental health support is as normal and accessible as getting treatment for a physical injury," explained Dr. Lisa Thompson, national mental health coordinator. "The goal is to remove barriers and provide help when and where people need it."

Telehealth platforms have made mental health services available in underserved areas where specialists were previously unavailable. Online therapy sessions, mental health apps, and virtual support groups are expanding access while maintaining privacy and convenience.

Workplace mental health programs are being implemented across various industries, recognizing that employee wellbeing directly impacts productivity and job satisfaction. Companies are providing mental health days, on-site counseling services, and stress management resources.

School-based programs are teaching children and teenagers about mental health from an early age, building resilience and providing tools for managing stress and emotions. Peer support programs and crisis intervention services are being integrated into educational settings.

Training programs for healthcare providers, teachers, and community leaders are increasing the number of people equipped to recognize mental health challenges and provide appropriate support. Cultural competency training ensures that services meet the needs of diverse communities.

Public awareness campaigns are changing conversations about mental health, encouraging people to seek help and supporting those who are struggling.`,
    author: 'Dr. Amanda Wilson',
    publishedAt: '2024-03-14T09:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/3958464/pexels-photo-3958464.jpeg',
    category: 'health',
    readTime: 4,
    tags: ['mental health', 'support systems', 'accessibility', 'stigma reduction']
  },
  {
    id: '15',
    title: 'Nutrition Research Reveals New Dietary Guidelines',
    summary: 'Comprehensive study of global eating patterns leads to updated recommendations for optimal health and longevity.',
    content: `A comprehensive analysis of global eating patterns and health outcomes has led to updated dietary guidelines that emphasize the importance of diverse, minimally processed foods for optimal health and longevity. The research involved over 100,000 participants across multiple countries and cultures.

The new guidelines shift focus from individual nutrients to overall eating patterns, recognizing that foods work synergistically to promote health. The research found that traditional diets rich in vegetables, fruits, whole grains, and lean proteins consistently produced the best health outcomes.

"The evidence overwhelmingly supports eating patterns that our ancestors would recognize as food," said Dr. Maria Rodriguez, lead nutrition researcher. "Highly processed foods, regardless of their marketing claims, consistently show negative health associations."

Key findings include the importance of meal timing, with regular eating schedules supporting better metabolic health. The research also highlighted the benefits of cooking at home and eating meals with others, which contribute to both physical and mental wellbeing.

Cultural food traditions were found to be particularly important, as they often represent thousands of years of adaptation to local environments and available ingredients. The guidelines encourage people to embrace their cultural food heritage while incorporating healthy principles.

Environmental sustainability is integrated into the new recommendations, recognizing that healthy diets for people should also be healthy for the planet. Plant-forward eating patterns are emphasized while still allowing for animal products in moderation.

Implementation strategies include education programs, policy changes to improve food access, and community initiatives that make healthy eating more convenient and affordable. Healthcare providers are being trained to provide nutrition counseling based on the new guidelines.

The research is ongoing, with plans to study how genetic factors, gut microbiome composition, and individual health conditions might influence optimal dietary patterns for different people.`,
    author: 'Dr. James Park',
    publishedAt: '2024-03-13T10:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    category: 'health',
    readTime: 4,
    tags: ['nutrition', 'dietary guidelines', 'research', 'health outcomes']
  },

  // Science News
  {
    id: '16',
    title: 'Space Exploration Mission Discovers Earth-Like Planet',
    summary: 'Advanced telescope array identifies potentially habitable exoplanet with water signatures and stable atmosphere.',
    content: `An advanced telescope array has identified a potentially habitable exoplanet with clear water signatures and a stable atmosphere, representing one of the most Earth-like worlds ever discovered outside our solar system. The planet, located 40 light-years away, offers new insights into the possibility of life beyond Earth.

The discovery was made using a combination of space-based and ground-based telescopes that analyzed the planet's atmosphere as it passed in front of its host star. Spectral analysis revealed water vapor, oxygen, and other compounds that suggest conditions suitable for life as we know it.

"This is the closest thing to a twin Earth that we've found," said Dr. Sarah Martinez, lead astronomer on the project. "The planet orbits within the habitable zone of its star, has a similar size to Earth, and shows atmospheric conditions that could support liquid water on its surface."

The planet completes an orbit around its star every 365 days, remarkably similar to Earth's year. Its star is slightly smaller and cooler than our Sun, but the planet orbits closer, receiving a similar amount of energy. Computer models suggest surface temperatures that would allow liquid water to exist.

Advanced instruments are being developed to study the planet in greater detail, including searching for biosignatures that might indicate the presence of life. The James Webb Space Telescope and other next-generation instruments will focus on this system in upcoming observation campaigns.

The discovery has implications for understanding how common potentially habitable worlds might be in our galaxy. Current estimates suggest there could be billions of Earth-like planets in the Milky Way, though most are too distant for detailed study with current technology.

Future missions to study such planets might include large space-based telescopes and even interstellar probes, though such missions would require technological advances and international cooperation on an unprecedented scale.`,
    author: 'Dr. Robert Kim',
    publishedAt: '2024-03-15T13:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg',
    category: 'science',
    readTime: 5,
    tags: ['space exploration', 'exoplanet', 'habitability', 'astronomy']
  },
  {
    id: '17',
    title: 'Ocean Research Reveals New Marine Species',
    summary: 'Deep-sea exploration uncovers dozens of previously unknown species, highlighting ocean biodiversity and conservation needs.',
    content: `A comprehensive deep-sea exploration mission has uncovered dozens of previously unknown marine species, highlighting the incredible biodiversity of ocean depths and the urgent need for marine conservation. The discoveries include unique fish, coral species, and microscopic organisms that have adapted to extreme deep-sea conditions.

The research expedition used advanced submersibles and remote-operated vehicles to explore depths exceeding 6,000 meters in previously unstudied ocean regions. The extreme conditions at these depths, including crushing pressure, near-freezing temperatures, and complete darkness, have led to remarkable evolutionary adaptations.

"Every dive reveals something new," said Dr. Maria Santos, marine biologist leading the expedition. "These ecosystems are incredibly complex and diverse, yet they remain largely unexplored. Each new species we discover helps us understand evolution and adaptation in extreme environments."

Among the most significant discoveries is a new species of bioluminescent fish that produces its own light through chemical reactions. The adaptation appears to help the fish communicate with potential mates and navigate in the darkness of the deep ocean.

Several new coral species were found thriving in cold, deep-water environments without sunlight, deriving energy from chemical processes rather than photosynthesis. These discoveries expand our understanding of how life can exist in seemingly inhospitable conditions.

Microscopic organisms found in deep-sea sediments show unique metabolic processes that could have applications in biotechnology and medicine. Some produce compounds that could be useful in developing new antibiotics or other pharmaceuticals.

The research also revealed the vulnerability of deep-sea ecosystems to human activities, including deep-sea mining, pollution, and climate change. Many of the newly discovered species exist in very limited areas and could be easily threatened by environmental disruption.

Conservation efforts are being developed to protect these unique ecosystems before they are damaged by industrial activities. International cooperation is essential, as these areas often exist in international waters beyond any single country's jurisdiction.`,
    author: 'Dr. Emily Chen',
    publishedAt: '2024-03-14T12:00:00Z',
    imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
    category: 'science',
    readTime: 4,
    tags: ['marine biology', 'deep sea', 'new species', 'conservation']
  },
  {
    id: '18',
    title: 'Renewable Energy Breakthrough in Solar Efficiency',
    summary: 'New photovoltaic technology achieves record-breaking 47% efficiency in converting sunlight to electricity.',
    content: `Researchers have achieved a record-breaking 47% efficiency in converting sunlight to electricity using revolutionary photovoltaic technology, potentially transforming the renewable energy landscape. The breakthrough represents a significant improvement over current commercial solar panels, which typically achieve 20-22% efficiency.

The new technology uses a multi-junction solar cell design that captures different wavelengths of light using multiple layers of specialized materials. Each layer is optimized for specific portions of the solar spectrum, allowing the cell to harvest energy from a much broader range of sunlight.

"This efficiency breakthrough brings us closer to the theoretical limits of solar energy conversion," explained Dr. Jennifer Walsh, lead materials scientist. "At these efficiency levels, solar power becomes competitive with fossil fuels in virtually all applications, even without subsidies."

The technology incorporates advanced materials including perovskites and quantum dots, which have unique properties that enhance light absorption and energy conversion. Manufacturing processes have been developed that can produce these materials at scale while maintaining their beneficial properties.

Laboratory testing has confirmed the efficiency gains under various conditions, including different light intensities, temperatures, and weather conditions. The cells maintain high performance even in partial shade or cloudy conditions, addressing common limitations of traditional solar panels.

Commercial applications could include rooftop solar installations, large-scale solar farms, and portable power systems. The higher efficiency means that smaller installations can generate the same amount of power, reducing installation costs and space requirements.

Environmental benefits are significant, as the technology could accelerate the adoption of solar power and reduce reliance on fossil fuels. Life-cycle analyses show that the new solar cells have a lower environmental impact per unit of energy produced compared to current technology.

Timeline for commercial availability is estimated at 3-5 years, as the technology undergoes further testing and manufacturing processes are scaled up. Early applications are likely to focus on high-value markets where the efficiency gains justify higher initial costs.`,
    author: 'Dr. Alex Kumar',
    publishedAt: '2024-03-13T15:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg',
    category: 'science',
    readTime: 4,
    tags: ['solar energy', 'efficiency', 'renewable energy', 'breakthrough']
  }
];

export const getArticlesByCategory = (category: string, limit?: number): Article[] => {
  const filtered = articles.filter(article => article.category === category);
  return limit ? filtered.slice(0, limit) : filtered;
};

export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};

export const getRelatedArticles = (currentArticle: Article, limit: number = 3): Article[] => {
  return articles
    .filter(article => 
      article.id !== currentArticle.id && 
      (article.category === currentArticle.category || 
       article.tags.some(tag => currentArticle.tags.includes(tag)))
    )
    .slice(0, limit);
};

export const searchArticles = (query: string): Article[] => {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.summary.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};