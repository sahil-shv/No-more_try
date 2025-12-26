import React, { useState, useEffect } from 'react';

interface HobbyPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  fileUrl?: string;
  createdAt: Date;
}

const Hobbies: React.FC = () => {
  const [posts, setPosts] = useState<HobbyPost[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'text' as HobbyPost['type']
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // TODO: Fetch hobby posts from API
    // Mock data for now
    setPosts([
      {
        id: '1',
        userId: 'user1',
        userName: 'Alex Chen',
        title: 'My latest photography walk',
        content: 'Spent the afternoon capturing autumn colors around campus. There\'s something therapeutic about focusing on composition and light.',
        type: 'text',
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Sam Rodriguez',
        title: 'Weekend coding project',
        content: 'Built a simple weather app using React. Not for any assignment - just for fun! It\'s amazing how different coding feels when there\'s no deadline.',
        type: 'text',
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Jordan Kim',
        title: 'Sketching during study breaks',
        content: 'Quick doodles help me reset between study sessions. Today\'s theme: geometric patterns inspired by my math homework.',
        type: 'text',
        createdAt: new Date(Date.now() - 10800000)
      }
    ]);
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: HobbyPost = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      type: newPost.type,
      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
      createdAt: new Date()
    };

    // TODO: Upload file to Azure Blob Storage if present
    // TODO: Save post to API
    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', type: 'text' });
    setSelectedFile(null);
    setShowCreateForm(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Determine post type based on file
      if (file.type.startsWith('image/')) {
        setNewPost(prev => ({ ...prev, type: 'image' }));
      } else if (file.type.startsWith('audio/')) {
        setNewPost(prev => ({ ...prev, type: 'audio' }));
      }
    }
  };

  const getPostIcon = (type: HobbyPost['type']) => {
    switch (type) {
      case 'image': return '📸';
      case 'audio': return '🎵';
      case 'text': return '✍️';
      default: return '📝';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div>
      <div className="card">
        <h1>Creative Community</h1>
        <p>A shared space for hobbies, creativity, and non-academic pursuits. No likes, no followers, just authentic sharing.</p>
        <div style={{ 
          background: '#e7f3ff', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginTop: '1rem' 
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Community Guidelines:</strong> This is a supportive space for sharing creative work and hobbies. 
            Be kind, authentic, and remember that everyone is learning and growing.
          </p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Share Your Creativity</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            Create Post
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="card">
          <h2>Create New Post</h2>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What are you sharing?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-textarea"
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Tell us about your hobby, project, or creative work..."
              style={{ minHeight: '120px' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Add Media (optional)</label>
            <input
              type="file"
              className="form-input"
              accept="image/*,audio/*"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
                Selected: {selectedFile.name} ({newPost.type})
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleCreatePost}>
              Share Post
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                setShowCreateForm(false);
                setSelectedFile(null);
                setNewPost({ title: '', content: '', type: 'text' });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Community Posts</h2>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
            <p>No posts yet. Be the first to share something creative!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {posts.map(post => (
              <div 
                key={post.id}
                style={{ 
                  padding: '1.5rem', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: '#4a90e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {post.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0' }}>{post.userName}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
                      {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>
                    {getPostIcon(post.type)}
                  </span>
                </div>

                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
                  {post.title}
                </h2>

                <p style={{ 
                  margin: '0 0 1rem 0', 
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {post.content}
                </p>

                {post.fileUrl && post.type === 'image' && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={post.fileUrl} 
                      alt={post.title}
                      style={{ 
                        maxWidth: '100%', 
                        height: 'auto', 
                        borderRadius: '4px',
                        border: '1px solid #e9ecef'
                      }}
                    />
                  </div>
                )}

                {post.fileUrl && post.type === 'audio' && (
                  <div style={{ marginTop: '1rem' }}>
                    <audio controls style={{ width: '100%' }}>
                      <source src={post.fileUrl} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid #e9ecef',
                  fontSize: '0.9rem',
                  color: '#6c757d'
                }}>
                  💙 Thanks for sharing your creativity with the community!
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Why Hobbies Matter</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#e7f3ff', borderRadius: '4px' }}>
            <h3>🧠 Mental Health</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Reduce academic stress</li>
              <li>Provide creative outlets</li>
              <li>Build confidence outside studies</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '4px' }}>
            <h3>🤝 Community</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Connect with like-minded peers</li>
              <li>Share authentic experiences</li>
              <li>Support each other's growth</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '4px' }}>
            <h3>🌱 Personal Growth</h3>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>Develop new skills</li>
              <li>Explore different interests</li>
              <li>Balance academic life</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ 
        background: '#fff3cd', 
        padding: '1rem', 
        borderRadius: '4px', 
        marginTop: '1rem' 
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>Note:</strong> This space intentionally avoids social media features like likes, comments, or follower counts. 
          The focus is on authentic sharing and community support, not engagement metrics.
        </p>
      </div>
    </div>
  );
};

export default Hobbies;