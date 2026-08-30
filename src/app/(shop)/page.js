import CategoryGrid from "@/app/(shop)/components/Home/CategoryGrid";
import Collection from "@/app/(shop)/components/Home/Collection";
import CollectionSecond from "@/app/(shop)/components/Home/CollectionSecond";
import FaqInsight from "@/app/(shop)/components/Home/FaqInsight";
import FeaturedProducts from "@/app/(shop)/components/Home/FeaturedProducts";
import Hero from "@/app/(shop)/components/Home/Hero";
import NewArrivalWithCollection from "@/app/(shop)/components/Home/NewArrivalWithCollection";
import OurStory from "@/app/(shop)/components/Home/OurStory";
import Testimonials from "@/app/(shop)/components/Home/Testimonials";
import RecentlyViewed from "./components/Home/RecentlyViewed";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen justify-center">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <NewArrivalWithCollection />
      <Collection />
      <FaqInsight />
      <Testimonials />
      <CollectionSecond />
      <OurStory />
      <RecentlyViewed/>
    </main>
  );
}