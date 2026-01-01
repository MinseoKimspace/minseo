import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Splat, Loader } from '@react-three/drei'
import { client, urlFor } from './sanity'

function Overlay({ posts }) {
  const [filter, setFilter] = useState(null)
  
  const resumeItem = posts.find(p => p.category === 'resume')

  const filtered = !filter 
    ? [] 
    : posts
        .filter(p => p.category !== 'resume') 
        .filter(p => filter === 'all' ? true : p.category === filter)

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '40px', pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
      
      {resumeItem && resumeItem.file && (
        <a 
          href={`${resumeItem.file.url}?dl=`} target="_blank"
          style={{
            position: 'absolute', 
            top: '40px', right: '40px',
            pointerEvents: 'auto',
            background: 'white', color: 'black', padding: '10px 24px', borderRadius: '30px', 
            textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}
        >
          📄 Resume
        </a>
      )}

      <header style={{ pointerEvents: 'auto', marginBottom: '20px', color: 'white', maxWidth: '800px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '30px' }}>
          <img 
            src="/profile.jpg" 
            alt="Profile" 
            onError={(e) => {e.target.style.display='none'}} 
            style={{ 
              width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', 
              border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 0 20px rgba(255,255,255,0.3)'
            }} 
          />
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.1' }}>Minseo Kim</h1>
            <p style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: '600', color: '#e0e0e0' }}>Graphics AI Researcher @ Georgia Tech</p>
            <p style={{ margin: '0', fontSize: '0.95rem', opacity: 0.7, lineHeight: '1.5' }}>
              Interested in Modern Computer Graphics and AI.
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {['all', 'project', 'paper', 'study note'].map(type => (
            <button 
              key={type} 
              onClick={() => setFilter(filter === type ? null : type)}
              style={{ 
                cursor: 'pointer', padding: '8px 18px', borderRadius: '25px', 
                border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', fontSize: '0.85rem',
                background: filter === type ? 'white' : 'rgba(255,255,255,0.1)',
                color: filter === type ? 'black' : 'white', 
                backdropFilter: 'blur(5px)', transition: 'all 0.3s ease'
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div style={{ 
        display: 'flex',          
        flexDirection: 'column',  
        gap: '15px',              
        overflowY: 'auto',        
        paddingRight: '10px',
        pointerEvents: 'auto',
        maxHeight: 'calc(100vh - 280px)', 
        width: '100%',            
        maxWidth: '700px',
      }}>
        
        {filter && filtered.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>
            No items found in {filter}.
          </div>
        )}

        {filtered.map((post) => (
          <div key={post._id} style={{ 
            background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(15px)', 
            padding: '20px', borderRadius: '12px', 
            color: 'white', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', 
            gap: '20px',
            alignItems: 'start',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
          }}>
            {post.mainImage && (
              <div style={{ flexShrink: 0, width: '140px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: '#333' }}>
                <img src={urlFor(post.mainImage).width(300).url()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{post.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#ccc', margin: '0 0 12px 0', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                {post.description}
              </p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {post.file && <a href={`${post.file.url}?dl=`} target="_blank" style={btnStyle}>📎 PDF</a>}
                {post.link && <a href={post.link} target="_blank" style={btnStyle}>🔗 Link</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const btnStyle = {
  padding: '6px 12px', borderRadius: '6px',
  background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', 
  fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.15)',
  transition: 'background 0.2s', display: 'inline-block'
}

export default function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    client.fetch(`*[_type == "portfolio"] | order(_createdAt desc) {
      _id, title, category, description, mainImage, link, "file": file.asset->{url}
    }`).then(setPosts).catch(console.error)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <group position={[0, 1.3, 0]} scale={[0.5, 0.5, 0.5]}>
            <Splat src="/test.splat" />
          </group>
        </Suspense>
        <OrbitControls target={[0, 0.5, 0]} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <Loader />
      <Overlay posts={posts} />
    </div>
  )
}