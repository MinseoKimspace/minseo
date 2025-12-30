// frontend/src/App.jsx
import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Splat, Loader } from '@react-three/drei'
import { client, urlFor } from './sanity'

function Overlay({ posts }) {
  const [filter, setFilter] = useState('all')
  
  // 필터링 로직
  const filtered = filter === 'all' ? posts : posts.filter(p => p.category === filter)

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '40px', pointerEvents: 'none' }}>
      
      {/* 헤더 영역 */}
      <header style={{ pointerEvents: 'auto', marginBottom: '20px', color: 'white' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem', fontWeight: '700' }}>Minseo Kim</h1>
        <p style={{ margin: '0 0 20px 0', opacity: 0.7 }}>Graphics AI Researcher</p>
        
        {/* 버튼 영역 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {['all', 'project', 'paper', 'study note'].map(type => (
            <button 
              key={type} 
              onClick={() => setFilter(type)}
              style={{ 
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: 'bold',
                background: filter === type ? 'white' : 'rgba(255,255,255,0.2)',
                color: filter === type ? 'black' : 'white',
                transition: '0.3s'
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* 리스트 영역 */}
      <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', pointerEvents: 'auto', paddingBottom: '10px' }}>
        {/* 데이터가 없을 때 안내 메시지 띄우기 */}
        {filtered.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.5)' }}>
            No {filter} items found yet.
          </div>
        )}

        {filtered.map((post) => (
          <div key={post._id} style={{ 
            background: 'rgba(0,0,0,0.6)', // 배경 좀 더 진하게
            backdropFilter: 'blur(10px)', 
            padding: '20px', 
            borderRadius: '12px', 
            minWidth: '280px', 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.1)' 
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
      {/* [카메라 위치 수정] 
        position: [x, y, z] -> [0, 1, 4] 로 낮췄습니다. (신발 정면 눈높이)
        fov: 45 (광각 왜곡 줄임)
      */}
      <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <group 
            position={[0, 1, 0]}   // 1. 위치: y를 -1로 내려서 중앙으로
            rotation={[0, 0, 0]}    // 2. 회전: 필요하면 조절
            scale={[0.5, 0.5, 0.5]} // 3. 크기: x, y, z 모두 0.5배로 축소 (숫자 하나만 쓰지 말고 배열로!)
          >
            <Splat src="/test.splat" />
          </group>
        </Suspense>
        
        {/* [시선 고정] 
          target={[0, 0.5, 0]} -> 카메라가 (0,0,0) 바닥이 아니라 약간 위(신발 중심)를 바라보게 함 
        */}
        <OrbitControls target={[0, 0.5, 0]} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <Loader />
      <Overlay posts={posts} />
    </div>
  )
}