"use client";

import {
  Presentation,
  PopularRecipes,
  Features,
  Contact,
  Header,
  Footer,
} from "@/components/home/sections";

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <section id="presentation">
          <Presentation />
        </section>
        <section id="popular-recipe">
          <PopularRecipes />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}
