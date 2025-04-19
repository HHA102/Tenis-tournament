import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import eventEmitter from '../../utils/eventEmitter';
import { organizerMenu } from '../../assets/metadata/organizerMenu';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
const drawerWidth = 320;

export default function DrawerMenuLayout({ children }) {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = eventEmitter.on("openDrawer", () => {
            setOpen(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = eventEmitter.on("closeDrawer", () => {
            setOpen(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const pathname = window.location.pathname;
        const activeItem = organizerMenu.find(item => item.path === pathname);
        setActiveItem(activeItem);
    }, []);

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
                    },
                }}
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
            >
                <List>
                    {organizerMenu.map((item, index) => (
                        <ListItem key={item.name} disablePadding>
                            {/* check if the item is active*/}
                            <ListItemButton selected={activeItem?.name === item.name} onClick={() => {
                                setOpen(false);
                                navigate(item.path);
                            }}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {children}
        </Box>
    );
}
