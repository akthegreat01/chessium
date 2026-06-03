import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export const alt = 'Chessium - Master Every Move'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const logoData = fs.readFileSync(path.join(process.cwd(), 'public/logo.png'))
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right bottom, #141416, #0a0a0b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          top: -300,
          right: -100,
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(129,182,76,0.15) 0%, rgba(20,20,22,0) 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -200,
          left: -200,
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(129,182,76,0.1) 0%, rgba(20,20,22,0) 70%)',
          borderRadius: '50%',
        }} />
        
        <img src={logoSrc} height={200} style={{ marginBottom: 40 }} />
        
        <h1
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: 'white',
            fontFamily: 'sans-serif',
            margin: 0,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          Chessium
        </h1>
        <p
          style={{
            fontSize: 36,
            color: '#a0a0a8',
            fontFamily: 'sans-serif',
            margin: 0,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Analyze. Learn. Improve.
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}
