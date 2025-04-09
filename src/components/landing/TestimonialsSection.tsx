
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "../ui/button";

const testimonials = [
  {
    id: 1,
    content: "FlexiQuote has transformed how I create insurance quotes. The interface is intuitive and the premium calculations are spot on!",
    author: "Sarah Johnson",
    title: "Independent Insurance Broker",
  },
  {
    id: 2,
    content: "As someone new to the insurance industry, FlexiQuote made it easy to learn the ropes. I can create accurate quotes quickly without worrying about errors.",
    author: "Michael Chen",
    title: "Junior Insurance Agent",
  },
  {
    id: 3,
    content: "My clients are impressed with how quickly I can provide them detailed quotes. FlexiQuote has helped me close more sales in less time.",
    author: "Jessica Rivera",
    title: "Senior Insurance Consultant",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = () => {
    setCurrent((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  };

  const prev = () => {
    setCurrent((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      next();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <div className="bg-insurance-gray-light py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-insurance-black sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Users Say
          </motion.h2>
        </div>
        
        <div 
          className="mx-auto mt-16 max-w-2xl"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl bg-white p-10 shadow-xl"
              >
                <div className="absolute -top-4 -left-4 h-10 w-10 flex items-center justify-center rounded-full bg-insurance-yellow">
                  <Quote className="h-5 w-5 text-insurance-black" />
                </div>
                <blockquote className="text-xl font-semibold leading-8 text-insurance-black sm:text-2xl sm:leading-9">
                  <p>"{testimonials[current].content}"</p>
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-x-6">
                  <div className="h-12 w-12 rounded-full bg-insurance-gray-medium flex items-center justify-center text-xl font-bold text-insurance-black">
                    {testimonials[current].author.charAt(0)}
                  </div>
                  <div className="text-sm leading-6">
                    <div className="font-semibold text-insurance-black">{testimonials[current].author}</div>
                    <div className="mt-0.5 text-insurance-black-light">{testimonials[current].title}</div>
                  </div>
                </figcaption>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={prev}
                className="h-8 w-8 rounded-full border border-insurance-gray-medium hover:border-insurance-yellow hover:bg-insurance-yellow-light"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex space-x-1">
                {testimonials.map((_, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrent(idx)}
                    className={`h-2 w-2 rounded-full p-0 ${
                      idx === current 
                        ? "bg-insurance-yellow" 
                        : "bg-insurance-gray-medium hover:bg-insurance-yellow-light"
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={next}
                className="h-8 w-8 rounded-full border border-insurance-gray-medium hover:border-insurance-yellow hover:bg-insurance-yellow-light"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
