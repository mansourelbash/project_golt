"use client";

import {
  Search,
  Building,
  UserCheck,
  Home,
} from "lucide-react";
import { motion } from "@/lib/motion";

const steps = [
  {
    icon: Search,
    title: "Search",
    description:
      "Browse thousands of properties using our advanced search filters to find your perfect match.",
    color: "bg-blue-100 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Building,
    title: "Tour",
    description:
      "Schedule viewings online or contact agents directly to see properties in person.",
    color: "bg-amber-100 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: UserCheck,
    title: "Connect",
    description:
      "Work with trusted agents and sellers to negotiate the best deal for your dream home.",
    color: "bg-green-100 dark:bg-green-900/20",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: Home,
    title: "Move In",
    description:
      "Complete paperwork, finalize your purchase or rental, and enjoy your new property.",
    color: "bg-purple-100 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How EstateHub Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Your journey to finding the perfect property is simple and straightforward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

type StepCardProps = {
  step: {
    icon: any;
    title: string;
    description: string;
    color: string;
    textColor: string;
  };
  index: number;
};

function StepCard({ step, index }: StepCardProps) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center"
    >
      <div className={`${step.color} p-4 rounded-full mb-6`}>
        <Icon className={`h-8 w-8 ${step.textColor}`} />
      </div>
      <div className="relative mb-8 flex items-center justify-center">
        <span className="text-4xl font-bold text-muted-foreground/20">
          {index + 1}
        </span>
        <h3 className="text-xl font-semibold absolute">{step.title}</h3>
      </div>
      <p className="text-muted-foreground">{step.description}</p>
    </motion.div>
  );
}