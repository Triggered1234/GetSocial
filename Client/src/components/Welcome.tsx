import React from 'react'
import { motion } from 'framer-motion'
type Props = {}

function Welcome({}: Props) {
  return (
    <motion.div 
    initial={{
      x:-5000
     }}
     transition={{
      duration: 2,
      repeat: 0,
      type: "spring"
     }}
     animate={{
      x:0
     }}
    className="relative flex flex-col md:flex-col text-center md:text-left
    px-10 justify-evenly mx-28 items-center overflow-hidden xl:flex-col self-center
    top-24">
        <h1 className="text-gray-500 text-4xl text-center mt-12">Welcome to the ultimate online party card game that guarantees hours of laughter, suspense, and unforgettable moments with your friends and family!</h1>
        <a href="#about">
        <button className="p-3 bg-[#CCC8AA] text-gray-500 rounded-full mt-10">Learn More</button>
        </a>
        </motion.div>
        
  )
}

export default Welcome