import { redirect } from 'next/navigation';
import {
    getWebSession,
    sessionIsValid,
} from '../../../../lib/webSession';

export default async function AccountGuard({ children }) {
    const session = await getWebSession();

    if (!sessionIsValid(session)) {
        redirect('/login');
    }

    return children;
}