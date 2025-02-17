import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../../../store/useStore.js';
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const SignUpForm = () => {
    const[name,setName] = useState("");
    const[email,setEmail] = useState("");
    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");

    const{signup,isSigningUp}=useAuthStore();
    const validateForm=()=>{
        if(!name.trim()) return toast.error("Full name is required");
        if(!email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
        if (!password) return toast.error("Password is required");
        if (password.length < 6) return toast.error("Password must be at least 6 characters");
        return true;
    }
    const handleSignUp =(e)=>{
        e.preventDefault();
        const success =validateForm();
        if(success===true) signup({name,email,username,password});
    }
    return (
		<form onSubmit={handleSignUp} className='flex flex-col gap-4'>
			<input
				type='text'
				placeholder='Full name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password (6+ characters)'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit' disabled={isSigningUp} className='btn btn-primary w-full text-white'>
				{isSigningUp ? <Loader className='size-5 animate-spin' /> : "Agree & Join"}
			</button>
		</form>
  )
}

export default SignUpForm