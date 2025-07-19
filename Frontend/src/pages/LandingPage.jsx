import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Award } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import products from "@/data/products";
import heroBackground from "@/assets/hero-background.jpg";

const Heading = ({ primary, accent }) => (
  <h2 className="text-4xl font-display font-bold mb-4">
    <span className="text-warm-white">{primary} </span>
    <span className="text-gold">{accent}</span>
  </h2>
);

const LandingPage = () => {
  return (
    <div className="bg-rich-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-rich-black">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBackground})`,
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-warm-white mb-4">
            Timeless
            <br />
            <span className="gold-gradient-text">Elegance</span>
          </h1>
          <p className="text-xl md:text-2xl text-warm-white/80 mb-8">
            Discover the latest trends in fashion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/women"
              className="bg-gold text-rich-black px-8 py-4 font-medium tracking-wider hover:bg-gold/90 transition-all duration-300"
            >
              EXPLORE WOMEN
            </Link>
            <Link
              to="/men"
              className="border border-gold text-gold px-8 py-4 font-medium tracking-wider hover:bg-gold hover:text-rich-black transition-all duration-300"
            >
              EXPLORE MEN
            </Link>
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="py-24 bg-rich-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading primary="Curated" accent="Collections" />
            <p className="text-lg text-warm-white/70">
              Handpicked luxury for the discerning individual
            </p>
          </div>
          <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
            {[
              {
                name: "WOMEN",
                path: "/women",
                image:
                  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
              },
              {
                name: "MEN",
                path: "/men",
                image:
                  "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80",
              },
              {
                name: "TRENDING",
                path: "/trending",
                image:
                  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
              },
              {
                name: "NEW ARRIVALS",
                path: "/new-arrivals",
                image:
                  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
              },
            ].map((collection) => (
              <Link
                key={collection.name}
                to={collection.path}
                className="group flex-shrink-0 w-80"
              >
                <div className="relative aspect-[3/2] bg-gray-900 rounded-xl overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rich-black/80 via-rich-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-display font-bold text-warm-white mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-gold text-sm flex items-center">
                      Explore <ArrowRight className="w-3 h-3 ml-1" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-rich-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading primary="Trusted by" accent="Connoisseurs" />
            <p className="text-lg text-warm-white/70">
              What our distinguished clientele says about ELYSIAN
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophia Laurent",
                title: "Fashion Director, Vogue Paris",
                quote:
                  "ELYSIAN curates pieces that transcend trends. Each item is a masterpiece of craftsmanship.",
              },
              {
                name: "Marcus Chen",
                title: "CEO, Luxury Holdings",
                quote:
                  "The attention to detail and personalized service makes ELYSIAN my go-to for luxury fashion.",
              },
              {
                name: "Isabella Rossi",
                title: "Style Icon & Influencer",
                quote:
                  "Every ELYSIAN piece in my wardrobe has become a cherished heirloom of modern luxury.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-center border border-gold/20"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-5 h-5 text-gold fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-warm-white/90 mb-4 italic">
                  "{t.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold text-warm-white">{t.name}</p>
                  <p className="text-sm text-warm-white/70">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-rich-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading primary="Elite" accent="Services" />
            <p className="text-lg text-warm-white/70">
              Exclusive services tailored for our distinguished clientele
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Personal Stylist",
                description:
                  "Dedicated fashion consultants for your unique style",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "VIP Preview",
                description:
                  "Early access to new collections before public release",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "White Glove Delivery",
                description: "Premium delivery service with presentation setup",
              },
              {
                icon: <ArrowRight className="w-8 h-8" />,
                title: "Lifetime Care",
                description:
                  "Complimentary maintenance and alterations for life",
              },
            ].map((s, i) => (
              <div
                key={i}
                // Added transform hover:-translate-y-2 for the pop-up effect
                className="text-center p-6 bg-gray-900 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-gold mb-4">{s.icon}</div>
                <h3 className="text-xl font-display font-medium text-warm-white mb-2">
                  {s.title}
                </h3>
                <p className="text-warm-white/70 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers
      <section className="py-24 bg-rich-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading primary="Best" accent="Sellers" />
            <p className="text-lg text-warm-white/70">
              Our most coveted pieces this season
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {products
              .filter((p) => p.bestseller)
              .slice(0, 4)
              .map((product) => (
                <div
                  key={product.id}
                  className="group transform transition-transform duration-300 hover:-translate-y-1"
                >
                  <ProductCard product={product} />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gold font-medium">
                      BESTSELLER
                    </span>
                    <span className="text-xs text-warm-white/70">⭐ 4.9</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section> */}

      {/* Newsletter */}
      <section className="py-24 bg-rich-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Heading primary="Join The" accent="Elite" />
          <p className="text-xl text-warm-white/70 mb-8">
            Get exclusive access to luxury drops, private previews, and VIP
            events
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.email@elysian.com"
              className="flex-1 bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold"
            />
            <button className="bg-gold text-rich-black px-6 py-3 font-medium tracking-wider hover:bg-gold/90 transition-colors">
              JOIN ELITE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
