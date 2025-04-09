
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-insurance-yellow-light py-16 sm:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-insurance-yellow"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              delay: Math.random() * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: Math.random() * 5 + 5,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-insurance-black sm:text-6xl">
              Insurance Made <span className="text-insurance-yellow-dark">Simple</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-insurance-black-light">
              FlexiQuote helps insurance brokers create, manage, and track domestic fire and burglary policy quotes with ease.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/quotes/new">
              <Button size="lg" className="group bg-insurance-black text-white hover:bg-insurance-black-light">
                Create a Quote
                <ArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/quotes" className="text-sm font-semibold leading-6 text-insurance-black-light hover:text-insurance-black">
              View All Quotes <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
