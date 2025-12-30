// frontend/src/App.jsx
import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Splat, Loader } from '@react-three/drei'
import { client, urlFor } from './sanity'

function Overlay({ posts }) {
  const [filter, setFilter] = useState('all')
  
  const resumeItem = posts.find(p => p.category === 'resume')

  const filtered = posts
    .filter(p => p.category !== 'resume') 
    .filter(p => filter === 'all' ? true : p.category === filter)

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '40px', pointerEvents: 'none' }}>
      
      <header style={{ pointerEvents: 'auto', marginBottom: '20px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem', fontWeight: '700' }}>Minseo Kim</h1>
            <p style={{ margin: '0 0 20px 0', opacity: 0.7 }}>Graphics AI Researcher</p>
          </div>

          {resumeItem && resumeItem.file && (
            <a 
              href={`${resumeItem.file.asset.url}?dl=`} 
              target="_blank"
              style={{
                background: 'white', color: 'black', padding: '10px 20px', 
                borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              📄 Resume
            </a>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {['all', 'project', 'paper', 'study note'].map(type => (
            <button 
              key={type} 
              onClick={() => setFilter(type)}
              style={{ 
                cursor: 'pointer', padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: 'bold',
                background: filter === type ? 'white' : 'rgba(255,255,255,0.2)',
                color: filter === type ? 'black' : 'white', transition: '0.3s'
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', pointerEvents: 'auto', paddingBottom: '10px' }}>
        {filtered.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.5)' }}>No items found.</div>
        )}

        {filtered.map((post) => (
          <div key={post._id} style={{ 
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', 
            padding: '20px', borderRadius: '12px', minWidth: '280px', 
            color: 'white', border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            {post.mainImage && (
              <img src={urlFor(post.mainImage).width(300).url()} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
            )}
            <h3 style={{ margin: '0 0 5px 0' }}>{post.title}</h3>
            <p style={{ fontSize: '14px', color: '#ccc', margin: '0 0 10px 0' }}>{post.description}</p>
            {post.file && (
              <a href={`${post.file.asset.url}?dl=`} target="_blank" style={{ color: '#4dabf7', textDecoration: 'none', fontSize: '13px' }}>
                📎 PDF Download
              </a>
            )}
            {post.link && (
               <a href={post.link} target="_blank" style={{ color: '#4dabf7', textDecoration: 'none', fontSize: '13px', marginLeft: '10px' }}>
                🔗 Link
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    client.fetch(`*[_type == "portfolio"]{_id, title, category, description, mainImage, "file": file.asset->{url}}`)
      .then(setPosts).catch(console.error)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <group 
            position={[0, 1, 0]}
            rotation={[0, 0, 0]}
            scale={[0.5, 0.5, 0.5]}
          >
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