import React from 'react';

import HomePageGuest from './HomePageGuest';
import HomePageUser from './HomePageUser';
import HomePageMerchant from './HomePageMerchant';
import HomePageAdmin from './HomePageAdmin';

const HomeRouter = ({ currentUser, openLoginModal }) => {

    if (!currentUser) {
        console.log("Guest");
        return <HomePageGuest openLoginModal={openLoginModal} />;
    }

    const role = currentUser.role || 'NO_ROLE';
    console.log("Role detected:", role);

    switch (role) {
        case 'ROLE_ADMIN':
            console.log("Admin");
            return <HomePageAdmin currentUser={currentUser} />;
        case 'ROLE_MERCHANT':
            console.log("Merchant");
            return <HomePageMerchant currentUser={currentUser} />;
        default:
            console.log("Regular User (fallback)");
            return <HomePageUser currentUser={currentUser} openLoginModal={openLoginModal} />;
    }
};

export default HomeRouter;