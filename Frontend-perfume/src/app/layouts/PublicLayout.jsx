import { Outlet } from 'react-router-dom';
import PublicHeader from '../../shared/components/PublicHeader';

export default function PublicLayout() {
    return (
        <>
            <PublicHeader />
            <Outlet />
        </>
    );
}
