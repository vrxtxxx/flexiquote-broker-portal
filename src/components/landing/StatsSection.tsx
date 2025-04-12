
import { motion } from "framer-motion";
import { Clock, Shield, PieChart, Users } from "lucide-react";

const stats = [
  { id: 1, name: 'Broker Quotes Generated', value: '10,000+', icon: PieChart },
  { id: 2, name: 'Broker Time Saved', value: '75%', icon: Clock },
  { id: 3, name: 'Policy Types', value: '2', icon: Shield },
  { id: 4, name: 'Active Brokers', value: '500+', icon: Users },
];

const StatsSection = () => {
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
    <div className="bg-insurance-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by insurance brokers
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Our platform is built specifically for insurance brokers managing domestic fire and burglary policies.
          </p>
        </motion.div>
        
        <motion.dl 
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat) => (
            <motion.div 
              key={stat.id} 
              className="flex flex-col gap-y-3 border-l border-white/10 pl-6"
              variants={itemVariants}
            >
              <dt className="text-sm leading-6 text-gray-300 flex items-center gap-2">
                <stat.icon className="h-5 w-5 text-insurance-yellow" />
                {stat.name}
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight">
                <span className="text-insurance-yellow">{stat.value}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </div>
  );
};

export default StatsSection;
