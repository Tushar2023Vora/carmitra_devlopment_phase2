import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import React from 'react'
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function Header() {
    const {user,isSignedIn}=useUser();
  return (
    <div className='flex justify-between items-center shadow-sm p-5'>
        <Link to={'/home'}>
            <div className='flex items-center gap-2'>
                <span className='text-2xl font-bold text-primary'>CarMitra</span>
            </div>
        </Link>
        <ul className='hidden  md:flex gap-16'>
            <Link to={'/home'}>
                <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Home</li>
            </Link>
            <Link to={'/search'}>
                <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Search</li>
            </Link>
            <Link to={'/search/New'}>
                <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>New</li>
            </Link>
            <Link to={'/search/Old'}>
                <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Preowned</li>
            </Link>
        </ul>

        {isSignedIn?
            <div className='flex items-center gap-5'>
                <UserButton/>
                <Link to={'/profile'}>
                    <Button>Submit Listing</Button>
                </Link>
            </div>
            :
            <SignInButton mode="modal" fallbackRedirectUrl='/profile'>
            <Button>Submit Listing</Button>
            </SignInButton>
        }

    </div>
  )
}

export default Header