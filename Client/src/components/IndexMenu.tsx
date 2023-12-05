import React from 'react'
import party from './party.png';
import RegistrationForm from './RegistrationForm';
type Props = {}

function IndexMenu({}: Props) {
  return (
    <div className='h-screen w-screen overflow-x-hidden overflow-y-hidden flex flex-col'>
        <div className="h-[10%] w-[100%] flex flex-row">
            <div className="h-[100%] w-[50%] bg-black items-center text-center align-middle">
                <h1 className="text-4xl text-gray-500 relative top-[25%]">Latest release</h1>
            </div>
            <div className="h-[100%] w-[50%] bg-[#CCC8AA] items-center text-center align-middle">
                <h1 className="text-4xl text-gray-500 relative top-[25%]">Create a free account now!</h1>
            </div>
        </div>
        <div className="h-[80%] w-[100%] flex flex-row">
            <div className="h-[100%] w-[50%] bg-[#CCC8AA] flex items-center justify-center flex-col space-y-6">
                <h1 className="text-gray-500 text-center text-xl">The party pack everyone was waiting for is here! Try it out now!</h1>
                <img src={party} width="227" height="372" className="rounded-lg w-40"></img>
            </div>
            <div className="h-[100%] w-[50%] bg-black">
                <RegistrationForm/>
            </div>
        </div>
        <div className="h-[10%] w-[100%] bg-black flex flex-row">
            <div className="h-[100%] w-[50%] bg-black">

            </div>
            <div className="h-[100%] w-[50%] bg-[#CCC8AA]">
  
            </div>
        </div>
    </div>
  )
}
export default IndexMenu