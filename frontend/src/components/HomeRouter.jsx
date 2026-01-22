import React from 'react';

import HomePageGuest from './HomePageGuest';
import HomePageUser from './HomePageUser';
import HomePageMerchant from './HomePageMerchant';
import HomePageAdmin from './HomePageAdmin';

const HomeRouter = ({ currentUser, openLoginModal }) => {

    if (!currentUser) {
        return <HomePageGuest openLoginModal={openLoginModal} />;
    }


    const role = currentUser.role || '';

    if (role === 'ROLE_ADMIN') {
        return <HomePageAdmin currentUser={currentUser} />;
    }

    if (role === 'ROLE_MERCHANT') {
        return <HomePageMerchant currentUser={currentUser} />;
    }

    // Default logged-in user
    return <HomePageUser currentUser={currentUser} openLoginModal={openLoginModal} />;
};

export default HomeRouter;