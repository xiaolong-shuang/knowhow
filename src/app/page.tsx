import { getIndustryList } from '@/lib/content'
import { HeroSection } from '@/components/home/hero-section'
import { IndustryGrid } from '@/components/home/industry-grid'
import { Rule } from '@/components/ui/rule'

export default async function HomePage() {
  const industries = await getIndustryList()

  return (
    <>
      <HeroSection />
      <Rule />
      <section className="py-11 pb-20">
        <div className="max-w-[1160px] mx-auto px-[72px] max-[1100px]:px-9 max-[768px]:px-5">
          <IndustryGrid industries={industries} />
        </div>
      </section>
    </>
  )
}
