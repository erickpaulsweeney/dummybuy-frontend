import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, Outlet } from "react-router-dom";

const theme = createTheme();

export default function Layout() {
    const [user, setUser] = useState(null);
    const [display, setDisplay] = useState(false);
    const navigate = useNavigate();
    // console.log(user)

    const handleClickOpen = () => {
        setDisplay(true);
    }

    const handleClickClose = () => {
        setDisplay(false);
    }

    useEffect(() => {
        const data = localStorage.getItem("userDetails");
        console.log(data);
        if (data === null) {
            navigate("/login");
        } else setUser(JSON.parse(data));
        // eslint-disable-next-line
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar sx={{ gap: "20px" }}>
                    <Tooltip title="Home">
                        <Link
                            href="/"
                            color="inherit"
                            underline="none"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <Icon sx={{ fontSize: "30px" }}>home</Icon>
                        </Link>
                    </Tooltip>

                    <Typography
                        variant="h5"
                        fontWeight="500"
                        noWrap
                        sx={{ flexGrow: "1" }}
                    >
                        DummyBuy
                    </Typography>
                    <Typography>
                        You are signed in as {user && user.name}
                    </Typography>
                    <Button
                        variant="text"
                        sx={{ color: "white" }}
                        onClick={handleClickOpen}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Dialog open={display} onClose={handleClickClose}>
                <DialogTitle>Are you sure you want to logout?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClickClose}>Cancel</Button>
                    <Button onClick={() => {
                            localStorage.removeItem("userDetails");
                            navigate("/login")
                        }}>Logout</Button>
                </DialogActions>
            </Dialog>
            <Outlet />
        </ThemeProvider>
    );
}
