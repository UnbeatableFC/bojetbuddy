import About from "../components/general/About";
import Footer from "@/components/general/footer";
import Hero from "@/components/general/hero";
import Header from "@/components/general/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
      </main>
      <Footer />
    </div>
  );
}
