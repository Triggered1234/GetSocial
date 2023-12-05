import React from 'react'
import card1 from './card1.jpg';
import card2 from './card2.jpg';
import card3 from './card3.jpg';
import { motion } from 'framer-motion';
type Props = {}

function About({}: Props) {
  return (
    <div className="relative h-screen flex flex-col justify-start items-center text-center top-10">
        <h1 className="text-4xl text-gray-500">About Get Social</h1>
        <div className="relative flex flex-row justify-evenly items-center top-24 gap-x-2 max-w-full overflow-x-hidden">
          <motion.div
          className="w-[40%]"
           initial={{
            x:-200,
            opacity:0
           }}
           transition={{
            duration: 1,
            type: "spring",
           }}
           whileInView={{
            x:0,
            opacity:1,
            type:"spring",
          }}>
            <p className="text-2xl text-gray-500 text-left">Get Social is a one-of-a-kind online party card game designed to bring people together for epic game nights and celebrations. Whether you're hosting a virtual party or gathering in person, our game is the perfect addition to any social event.</p>
          </motion.div>
          <div className="w-[40%] flex flex-row relative items-center justify-center h-80">
            <motion.img 
            className="rounded-md border-gray-500 border-2 -rotate-12 w-[120px] z-0"
            initial={{
              x:200,
              rotate:-12,
              opacity:0,
             }}
             transition={{
              duration: 1.2,
              type: "spring",
             }}
             whileInView={{
              x:0,
              opacity:1,
              type:"spring",
            }}
             
            src={card1} ></motion.img>
            <motion.img src={card2} 
            initial={{
              x:200,
              opacity:0,
             }}
             whileInView={{
              x:0,
              opacity:1,
              type:"spring",
            }}
             transition={{
              duration: 1.2,
              type: "spring",
             }}
            className="rounded-md border-gray-500 border-2 rotate-4 w-[130px] z-10 -ml-4"></motion.img>
            <motion.img 
            initial={{
              x:200,
              opacity:0,
              rotate:12,
             }}
             whileInView={{
              x:0,
              opacity:1,
              type:"spring",
            }}
             transition={{
              duration: 1.2,
              type: "spring",
             }}
            
            src={card3} className="rounded-md border-gray-500 border-2 rotate-12 w-[120px] z-0 -ml-4"></motion.img>
        </div>


        </div>
    </div>
  )
}

export default About