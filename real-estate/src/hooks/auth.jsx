import { createContext, useReducer, useContext, useEffect } from 'react';

import { $fetch } from '../fetch.js';

import { auth } from '../config/default';
import { getCookie } from '../utils';
// import { fetchPrincipal } from '../auth';
// import { getPersonnelDepartmentId } from '../actions/account';

const AuthenticationContext = createContext({});

export const useAuth = () => useContext(AuthenticationContext);

export default function AuthenticationContextProvider({ children }) {
	const [principal, setPrincipal] = useReducer((principal, nextPrincipal) =>
			principal === null ? nextPrincipal : { ...principal, ...nextPrincipal },
			null);

	useEffect(() => {
		const doFetch = async () => {
			const token = getCookie(auth.tokenName);

			if (token == null) {
				setPrincipal(null);
				return;
			}

			let [res, err] = await $fetch(`/api/account`, {
				header: {
					'Accpet': 'application/json'
				}
			}, token);

			if (err) {
				setPrincipal(null);
				return;
			}

			if (res.ok) {
				res = await res.json();
				
				setPrincipal({ ...res, token });
				return;
			}

			setPrincipal(null);
		};

		doFetch();
	}, []);

	return <AuthenticationContext.Provider value={{ principal, setPrincipal }}>
		{ children }
	</AuthenticationContext.Provider>;
}