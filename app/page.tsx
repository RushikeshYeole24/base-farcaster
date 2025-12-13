import GameContainer from '@/components/game/GameContainer'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const APP_URL = 
    process.env.NEXT_PUBLIC_URL || 
    process.env.NEXT_PUBLIC_VERCEL_URL || 
    'http://localhost:3000';

  const frame = {
    version: 'next',
    imageUrl: `${APP_URL}/images/base.png`,
    button: {
      title: 'Play Bureau of Magical Things',
      action: {
        type: 'launch_frame',
        name: 'Bureau of Magical Things',
        url: APP_URL,
        splashImageUrl: `${APP_URL}/images/splash.png`,
        splashBackgroundColor: '#1e1b4b',
      },
    },
  }

  return {
    title: 'Bureau of Magical Things',
    openGraph: {
      title: 'Bureau of Magical Things',
      description: 'Mobile-first onchain web game - Respond to magical incidents as a Bureau Field Initiate',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <GameContainer />
}
