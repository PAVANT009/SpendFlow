import { HeroHeader } from '@/components/header'
import HeroSection from '@/components/hero-section'
import Footer from './footer'
import Solution from './Solution'


export default function LandingPage() {
  return (
    <div>
      <HeroHeader/>
      <HeroSection/>
      <Solution/>
      <Footer/>
    </div>
  )
}
