import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Splat, Loader } from '@react-three/drei'
import { client, urlFor } from './sanity'

function Overlay({ posts }) {
  const [filter, setFilter] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [selectedPost, setSelectedPost] = useState(null)

  const bioItem = posts.find(p => p.category === 'bio')

  const filtered = !filter 
    ? [] 
    : posts
        .filter(p => p.category !== 'resume' && p.category !== 'bio') 
        .filter(p => filter === 'all' ? true : p.category === filter)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (selectedPost) {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <div style={modalHeaderStyle}>
            <button onClick={() => setSelectedPost(null)} style={backBtnStyle}>Close</button>
            <div style={{ fontSize: '0.9rem', color: '#aaa', fontWeight: 'bold' }}>{selectedPost.category.toUpperCase()}</div>
          </div>
          <div style={{ padding: '30px', overflowY: 'auto', flexGrow: 1 }}>
            <h1 style={{ color: 'white', fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '0 0 20px 0', lineHeight: '1.2' }}>{selectedPost.title}</h1>
            {selectedPost.mainImage && (
              <div style={{ width: '100%', maxHeight: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '30px' }}>
                <img src={urlFor(selectedPost.mainImage).url()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#e0e0e0', whiteSpace: 'pre-line', marginBottom: '40px' }}>
              {selectedPost.description}
            </p>
            {selectedPost.file && (
              <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
                <h3 style={{ color: 'white', marginBottom: '15px' }}>Document Viewer</h3>
                <iframe src={selectedPost.file.url} title="PDF Viewer" style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px', background: 'white' }} />
              </div>
            )}
            {selectedPost.link && (
              <div style={{ marginTop: '30px' }}>
                <a href={selectedPost.link} target="_blank" style={fullBtnStyle}>Visit External Link</a>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (filter === 'bio') {
    return (
      <div style={modalOverlayStyle}>
        <div style={{ ...modalContentStyle, maxWidth: '800px' }}> 
          <div style={modalHeaderStyle}>
            <button onClick={() => setFilter(null)} style={backBtnStyle}>Close</button>
            <div style={{ fontSize: '0.9rem', color: '#aaa', fontWeight: 'bold' }}>ABOUT ME</div>
          </div>

          <div style={{ padding: '40px', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.2)', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
               <img 
                 src={bioItem?.mainImage ? urlFor(bioItem.mainImage).url() : "/profile.jpg"} 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                 onError={(e) => {e.target.src = "/profile.jpg"}}
               />
            </div>

            <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', margin: '0 0 10px 0' }}>Minseo Kim</h1>
            <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600', margin: '0 0 30px 0', opacity: 0.9 }}>
              Graphics AI Researcher
            </p>

            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#e0e0e0', maxWidth: '600px', whiteSpace: 'pre-line', marginBottom: '40px' }}>
              {bioItem ? bioItem.description : "Please upload a 'Bio' post in Sanity."}
            </div>

            {(bioItem?.file || posts.find(p=>p.category==='resume')?.file) && (
              <a 
                href={bioItem?.file ? bioItem.file.url : posts.find(p=>p.category==='resume')?.file.url} 
                target="_blank" 
                style={resumeLargeBtnStyle}
              >
              Resume / CV
              </a>
            )}

          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: isMobile ? '20px' : '40px', pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ pointerEvents: 'auto', marginBottom: '20px', maxWidth: '800px', flexShrink: 0 }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ color: 'white', margin: '0', fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Minseo Kim</h1>
          <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '1.1rem', opacity: 0.7 }}>Graphics AI Researcher</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}> 
          <button onClick={() => setFilter('bio')} style={menuBtnStyle(filter === 'bio')}>
            BIO
          </button>
          {['all', 'project', 'paper', 'study note'].map(type => (
            <button 
              key={type} onClick={() => setFilter(filter === type ? null : type)}
              style={menuBtnStyle(filter === type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', paddingRight: '10px', pointerEvents: 'auto', maxHeight: isMobile ? 'calc(100vh - 250px)' : 'calc(100vh - 200px)', width: '100%', maxWidth: '700px' }}>
        {filter && filtered.length === 0 && <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>No items found in {filter}.</div>}

        {filtered.map((post) => (
          <div key={post._id} onClick={() => setSelectedPost(post)} style={listItemStyle(isMobile)}
               onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {post.mainImage && (
              <div style={{ flexShrink: 0, width: isMobile ? '100%' : '140px', height: isMobile ? '160px' : '100px', borderRadius: '8px', overflow: 'hidden', background: '#333' }}>
                <img src={urlFor(post.mainImage).width(400).url()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ flexGrow: 1, width: '100%' }}>
              <h3 style={{ color: 'white', margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{post.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#ccc', margin: '0 0 10px 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#4dabf7', fontWeight: 'bold' }}>Read More</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const modalOverlayStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '20px', pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.8)', zIndex: 2000 }
const modalContentStyle = { width: '100%', maxWidth: '900px', height: '100%', background: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'auto', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }
const modalHeaderStyle = { padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a' }
const backBtnStyle = { background: 'transparent', border: 'none', color: 'white', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }
const fullBtnStyle = { display: 'inline-block', padding: '12px 24px', borderRadius: '8px', background: '#339af0', color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }
const resumeLargeBtnStyle = { display: 'inline-block', padding: '15px 40px', borderRadius: '40px', background: 'white', color: 'black', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 5px 20px rgba(255,255,255,0.2)', transition: 'transform 0.2s', cursor: 'pointer' }
const menuBtnStyle = (isActive) => ({ cursor: 'pointer', padding: '8px 18px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', fontSize: '0.85rem', background: isActive ? 'white' : 'rgba(255,255,255,0.1)', color: isActive ? 'black' : 'white', backdropFilter: 'blur(5px)', transition: 'all 0.3s ease' })
const listItemStyle = (isMobile) => ({ background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'start', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'transform 0.2s', cursor: 'pointer' })

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
          <group position={[0.5, 1.3, 0]} scale={[0.5, 0.5, 0.5]}>
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