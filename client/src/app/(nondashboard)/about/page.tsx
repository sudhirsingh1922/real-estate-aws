"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={containerVariants}
      className="bg-gradient-to-b from-white via-gray-50 to-primary-50 min-h-screen py-20 px-6 sm:px-8 lg:px-16 xl:px-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-pink-600"
        >
          About Rentiful
        </motion.h1>

        {/* Intro Text */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-14 leading-relaxed"
        >
          We make renting easier, smarter, and more human. Whether you’re a
          renter or a property manager, Rentiful gives you the tools to find
          your perfect match — fast, safe, and beautifully.
        </motion.p>

        {/* Image Banner */}
        <motion.div
          variants={itemVariants}
          className="relative w-full h-80 rounded-2xl overflow-hidden mb-16 shadow-2xl"
        >
          <Image
            src="/about-us.jpg"
            alt="Our Mission"
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
          />
        </motion.div>

        {/* Mission */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-semibold text-gray-800 text-center mb-6"
        >
          Our Mission
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-20"
        >
          We’re here to reshape the rental experience by combining cutting-edge
          technology with a human-first mindset. Rentiful is designed to empower
          both renters and property owners with simplicity, transparency, and
          trust.
        </motion.p>

        {/* Why Choose Us - Feature Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              title: "Smart Search",
              description: "AI & Mapbox-powered filters for precise results.",
              icon: "/landing-icon-wand.png",
            },
            {
              title: "Verified Listings",
              description: "Trustworthy properties and reliable managers.",
              icon: "/landing-icon-heart.png",
            },
            {
              title: "Secure Leasing",
              description: "Digital lease & safe payment gateways.",
              icon: "/landing-icon-calendar.png",
            },
            {
              title: "24/7 Support",
              description: "Get help when you need it, always.",
              icon: "/customer-service.png",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow text-center mb-32"
            >
              <div className="bg-primary-700 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Image
                  src={feature.icon}
                  width={28}
                  height={28}
                  alt={feature.title}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
