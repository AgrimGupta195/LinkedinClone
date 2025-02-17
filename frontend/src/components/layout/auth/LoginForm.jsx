import { useState } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../../store/useStore";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
    const { login, isLoggingIn } = useAuthStore();
	const handleSubmit = (e) => {
		e.preventDefault();
		login({ username, password });
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
		</form>
	);
};
export default LoginForm;