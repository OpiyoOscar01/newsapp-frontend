import NewsCard from "../components/widgets/NewsCard";

export default function NewsCardDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">NewsCard Component Demo</h1>
      
      {/* Example usage with all props - Vertical Layout */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Vertical Layout (Mobile-first)</h2>
        <NewsCard
          image_url="https://images.pexels.com/photos/4148472/pexels-photo-4148472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          title="Breaking: Major Technology Breakthrough Announced"
          description="Scientists have discovered a revolutionary new method that could change the way we approach renewable energy, promising more efficient solar panels."
          author="Jane Smith"
          source="Tech Today"
          published_at="2024-01-15T14:30:00Z"
          category="Technology"
          layout="vertical"
        />
      </div>

      {/* Horizontal layout example */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Horizontal Layout (Desktop)</h2>
        <NewsCard
          image_url="https://images.pexels.com/photos/4604846/pexels-photo-4604846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          title="Championship Finals Set for This Weekend"
          description="Two powerhouse teams will face off in what promises to be the most exciting match of the season."
          author="Mike Johnson"
          source="Sports Network"
          published_at="2024-01-15T10:00:00Z"
          category="Sports"
          layout="horizontal"
        />
      </div>

      {/* Minimal example (only required fields) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Minimal Example (Required Fields Only)</h2>
        <NewsCard
          image_url="https://images.pexels.com/photos/13043109/pexels-photo-13043109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          title="Important Update on Local Weather Conditions"
          published_at="2024-01-15T08:00:00Z"
          description="Weather services issue advisory for changing conditions across the region."
          category="Weather"
        />
      </div>

      {/* Grid layout demo */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Grid Layout Demo</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewsCard
            image_url="https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            title="Electric Vehicle Sales Surge"
            description="EV adoption rates reach new heights as infrastructure expands."
            author="Alex Chen"
            source="Auto News"
            published_at="2024-01-14T16:20:00Z"
            category="Automotive"
          />
          
          <NewsCard
            image_url="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            title="AI Revolution in Healthcare"
            description="Machine learning algorithms show promising results in early disease detection."
            author="Dr. Sarah Wilson"
            source="Medical Tribune"
            published_at="2024-01-14T12:15:00Z"
            category="Health"
          />
          
          <NewsCard
            image_url="https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            title="Stock Market Reaches New Highs"
            description="Technology sector leads gains as investors remain optimistic about future growth."
            author="Mark Thompson"
            source="Financial Times"
            published_at="2024-01-14T09:30:00Z"
            category="Finance"
          />
        </div>
      </div>
    </div>
  );
}
