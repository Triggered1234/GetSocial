import React from 'react'
import Description1 from './Description1.jpg';
import { motion } from 'framer-motion';
type Props = {}

function Description({}: Props) {
  return (
    <div className="relative flex flex-row items-center justify-evenly text-center justify-items-center h-screen">
        <motion.img 
        initial={{
          x:-200,
          opacity:0
         }}
         transition={{
          duration: 2,
          type: "spring",
         }}
         whileInView={{
          x:0,
          opacity:1,
          type:"spring",
        }}
        src={Description1} className='rounded-md w-[50%] top-12'></motion.img>
        <motion.div 
        initial={{
          x:200,
          opacity:0
         }}
         transition={{
          duration: 2,
          type: "spring",
         }}
         whileInView={{
          x:0,
          opacity:1,
          type:"spring",
        }}
        className="relative flex flex-col items-center justify-center text-center gap-y-5 w-[40%]"> 
        <h1 className='text-4xl text-gray-500'>
            With new gamemodes being constantly developed and 1000+ questions per gamemode you and your friends will never get bored!
        </h1>
        <h1 className='text-2xl text-gray-500'>Select a set from our card sets and start enhancing your social experience</h1>
        </motion.div>
        
    </div>
  )
}

export default Description