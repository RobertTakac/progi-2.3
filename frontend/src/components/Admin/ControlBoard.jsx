import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';;
import ListItemText from '@mui/material/ListItemText';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import ClassIcon from '@mui/icons-material/Class';

const navigationOptions = [
    { name: "Kategorije", path: "categories", icon: <CategoryIcon/>}, 
    { name: "Upravljanje korisnicima", path: "usermanagement", icon: <AdminPanelSettingsIcon/> },
    { name: "Izvjestaji", path: "reports", icon: <ClassIcon/>}
];

const drawerWidth = 240;

const ControlBoard = ({ currentUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currRouteName, setCurrRouteName] = useState("categories");

    useEffect(() => {
        if(location.pathname === "/controlboard" || location.pathname === "/controlboard/") {
            navigate(currRouteName, { replace: true });
        }
    }, [location, navigate]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        position: 'relative'
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Divider />
                <List>
                    {navigationOptions.map(({name, path, icon}, index) => (
                        <ListItem key={name} disablePadding>
                            <ListItemButton
                                onClick={() => setCurrRouteName(path)}
                                component={Link}
                                to={path}
                                selected={currRouteName == name}
                            >
                                {icon}
                                <ListItemText primary={name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            
            <Box
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Outlet/>
            </Box>
        </Box>
    );
};

export default ControlBoard;