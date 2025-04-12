
import { motion } from "framer-motion";
import { Shield, Clock, Percent, FileText } from "lucide-react";

const features = [
  {
    name: 'Comprehensive Coverage',
    description: 'Tailored protection for home and contents with our domestic fire and burglary policies.',
    icon: Shield,
  },
  {
    name: 'Quick Quotes',
    description: 'Generate accurate quotes in minutes with our advanced rating calculator.',
    icon: Clock,
  },
  {
    name: 'Competitive Rates',
    description: 'Access market-leading rates and premium discounts for your clients.',
    icon: Percent,
  },
  {
    name: 'Easy Documentation',
    description: 'Generate and manage policy documents seamlessly within the platform.',
    icon: FileText,
  },
];

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2
            className="text-base font-semibold leading-7 text-insurance-yellow-dark"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose FlexiQuote
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl font-bold tracking-tight text-insurance-black sm:text-4xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to manage insurance quotes
          </motion.p>
          <motion.p
            className="mt-6 text-lg leading-8 text-insurance-black-light"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our platform streamlines the quoting process for insurance brokers, saving time and improving accuracy.
          </motion.p>
        </div>
        
        <motion.div
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                className="relative pl-16"
                variants={itemVariants}
              >
                <dt className="text-base font-semibold leading-7 text-insurance-black">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-insurance-yellow">
                    <feature.icon className="h-6 w-6 text-insurance-black" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-insurance-black-light">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesSection;
