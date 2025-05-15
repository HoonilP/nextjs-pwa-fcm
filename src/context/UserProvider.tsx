'use client';

// JWT
import { jwtDecode } from 'jwt-decode';

// React
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
import { JwtData, userRoleEnum } from '@/types';

type UserContextType = {
	userRole: userRoleEnum;
	username: string;
	userId: string;
};

const defaultValue: UserContextType = {
	userRole: userRoleEnum.ROLE_ADMIN,
	username: 'Administrator',
	userId: 'ADMIN',
};

export const UserContext = createContext<UserContextType>(defaultValue);

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
	const [userRole, setUserRole] = useState<userRoleEnum>(userRoleEnum.ROLE_ADMIN);
	const [username, setUsername] = useState('');
	const [userId, setUserId] = useState('');

	useEffect(() => {
		const fetchToken = async () => {
			try {
				const res = await fetch('/api/auth/accessToken');
				const data = await res.json();
				if (data.token === 'admin') {
					setUserRole(userRoleEnum.ROLE_ADMIN);
					setUserId('ADMIN');
					setUsername('Administrator');
					return;
				}
				if (data.token) {
					const decoded: JwtData = jwtDecode(data.token);
					console.log(`Context: ${decoded}`)
					setUserRole(decoded.role);
					setUsername(decoded.username);
					setUserId(decoded.studentId);
				}
			} catch (err) {
				console.error("Failed to decode token:", err);
			}
		};

		fetchToken();
	}, []);

	return (
		<UserContext.Provider value={{ userRole, username, userId }}>
			{children}
		</UserContext.Provider>
	);
}