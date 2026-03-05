import { HeroHeader } from '@/components/header'
import HeroSection from '@/components/hero-section'
import Footer from './footer'
import Solution from './Solution'
import PricingSection from '@/components/pricing-section'
import Faq from './faq'



export default function LandingPage() {
  return (
    <div>
      <HeroHeader/>
      <HeroSection/>
      <Solution/>
      <PricingSection/>
      <Faq/>
      <Footer/>
    </div>
  )
}
