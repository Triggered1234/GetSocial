import React from 'react'
import gmstart from './gmStart.jpg';
import card1 from './card1.jpg';
import gmstartDesc from './gmStartDesc.jpg';
import knowyourfriends from './knowyourfriends.jpg';
import knowyourfriendsDesc from './knowyourfriendsDesc.jpg';
import deep from './deep.jpg';
import deepDesc from './deepDesc.jpg';
import couple from './couple.jpg';
import coupleDesc from './coupleDesc.jpg';
import party from './party.png';
import partyDesc from './partyDesc.png';
type Props = {}

function CardPacks({}: Props) {
  return (
    <div className="relative h-screen flex flex-col items-center text-center top-10">    
        <h1 className="text-4xl text-gray-500">Here's a few gamemodes</h1>
        <div className="text-2xl text-gray-500 relative flex flex-row items-start justify-evenly text-center w-screen top-20">
            <div className="w-72 relative flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-xl">Get started</h1>
            <div className="inline-block items-center justify-center">
            <img src={gmstart} width="227" height="372" className="absolute rounded-lg w-40 hover:opacity-0 hover:h-0 z-10"></img>
            <img src={gmstartDesc} width="227" height="372" className="rounded-lg w-40 z-0 opacity-90"></img>
            </div>
            </div>
            <div className="w-72 relative flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-xl">Do you know your friends?</h1>
            <div className="inline-block items-center justify-center">
            <img src={knowyourfriends} width="227" height="372" className="absolute rounded-lg w-40 hover:opacity-0 hover:h-0 z-10"></img>
            <img src={knowyourfriendsDesc} width="227" height="372" className="rounded-lg w-40 z-0 opacity-90"></img>
            </div>
            </div>
            <div className="w-72 relative flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-xl">Go deep</h1>
            <div className="inline-block items-center justify-center">
            <img src={deep} width="227" height="372" className="absolute rounded-lg w-40 hover:opacity-0 hover:h-0 z-10"></img>
            <img src={deepDesc} width="227" height="372" className="rounded-lg w-40 z-0 opacity-90"></img>
            </div>
            </div>
            <div className="w-72 relative flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-xl">For lovers</h1>
            <div className="inline-block items-center justify-center">
            <img src={couple} width="227" height="372" className="absolute rounded-lg w-40 hover:opacity-0 hover:h-0 z-10"></img>
            <img src={coupleDesc} width="227" height="372" className="rounded-lg w-40 z-0 opacity-90"></img>
            </div>
            </div>
            <div className="w-72 relative flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-xl">Party time</h1>
            <div className="inline-block items-center justify-center">
            <img src={party} width="227" height="372" className="absolute rounded-lg w-40 hover:opacity-0 hover:h-0 z-10"></img>
            <img src={partyDesc} width="227" height="372" className="rounded-lg w-40 z-0 opacity-90"></img>
            </div>
            </div> 
        </div>
    </div>
  )
}

export default CardPacks