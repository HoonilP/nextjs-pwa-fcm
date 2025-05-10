'use client';

// JWT
import { jwtDecode } from 'jwt-decode';

// React
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
import { JwtData } from '@/types';

type UserContextType = {
	userRole: number;
	username: string;
};

const defaultValue: UserContextType = {
	userRole: 9999,
	username: 'admin',
};

export const UserContext = createContext<UserContextType>(defaultValue);

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
	const [userRole, setUserRole] = useState(0);
	const [username, setUsername] = useState('');

	useEffect(() => {
		const fetchToken = async () => {
			try {
				const res = await fetch('/api/auth/accessToken');
				const data = await res.json();
				if (data.token === 'admin') {
					setUserRole(9999);
					setUsername('ADMIN');
					return;
				}
				if (data.token) {
					const decoded: JwtData = jwtDecode(data.token);
					setUserRole(decoded.role);
					setUsername(decoded.username);
				}
			} catch (err) {
				console.error("Failed to decode token:", err);
			}
		};

		fetchToken();
	}, []);

	return (
		<UserContext.Provider value={{ userRole, username }}>
			{children}
		</UserContext.Provider>
	);
}