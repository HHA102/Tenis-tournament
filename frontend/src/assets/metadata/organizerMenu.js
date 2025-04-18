import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import StadiumIcon from '@mui/icons-material/Stadium';
import SettingsIcon from '@mui/icons-material/Settings';

export const organizerMenu = [
    {
        name: "Tournaments Management",
        icon: <EmojiEventsIcon />,
        path: "/organizer-dashboard"
    },
    {
        name: "Applications Management",
        icon: <PeopleIcon />,
        path: "/applications"
    },
    {
        name: "Courts Management",
        icon: <StadiumIcon />,
        path: "/courts"
    },
    {
        name: "Settings",
        icon: <SettingsIcon />,
        path: "/settings"
    }
]
