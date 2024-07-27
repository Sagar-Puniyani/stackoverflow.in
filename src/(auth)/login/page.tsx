"use client";

import { useAuthStore } from '@/store/Auth';
import React from 'react'

function LoginPage() {

    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleForm = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // collect data 
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        // validate 

        if (!email || !password ){
            setError(() => "Fill out All the fields");
            return;
        }


        // login in store 

        setIsLoading(() => true);
        setError("");
        
        const logInresponse = await login(email.toString(), password.toString());
        
        if (logInresponse.error) {
            setError(() => logInresponse.error!.message);
            
        }
    }
    
    setIsLoading(() => false);
    return (
        <div></div>
    )
}

export default LoginPage
