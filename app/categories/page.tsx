import CategoryCard from '@/modules/categories/ui/components/CategoryCard'
import CategorytCard from '@/modules/categories/ui/components/CategorytCard'

export default function page() {
  return (
    <div className='bg-background h-screen w-full px-12 py-1'>
      <p className='text-3xl ml-1 font-semibold'>Categories</p>
      <h1 className='text-sm ml-1 mb-3 font-light text-muted-foreground'>Organize your subscriptions and set budget limits for each category</h1>
      <div className='flex flex-row gap-8 mb-6'>
        <CategorytCard/>
        <CategorytCard/>
        <CategorytCard/>
      </div>
      {/* <div className='h-[22%] w-full'></div> */}
      <div className='flex flex-col gap-3'>
      <div className='flex flex-row gap-8'>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
      </div>
      <div className='flex flex-row gap-8'>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
      </div>
      <div className='flex flex-row gap-8'>
        <CategoryCard/>
        <CategoryCard/>
        <CategoryCard/>
      </div>
      </div>
    </div>
  )
}
