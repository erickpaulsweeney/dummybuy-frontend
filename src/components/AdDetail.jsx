import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from "@mui/icons-material/Delete";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

const theme = createTheme();

export default function AdDetail() {
    const { id } = useParams();
    const [curr, setCurr] = useState(null);
    const [details, setDetails] = useState(null);
    const [displayDelete, setDisplayDelete] = useState(false);
    const [displayOffer, setDisplayOffer] = useState(false);
    const navigate = useNavigate();

    const handleClickOpenDelete = () => {
        setDisplayDelete(true);
    };

    const handleClickCloseDelete = () => {
        setDisplayDelete(false);
    };

    const handleClickOpenOffer = () => {
        setDisplayOffer(true);
    };

    const handleClickCloseOffer = () => {
        setDisplayOffer(false);
    };

    const refreshToken = async () => {
        console.log(JSON.parse(localStorage.getItem("userDetails")))
        try {
            const response = await fetch("http://localhost:8000/category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: localStorage.getItem("userDetails"),
            });
            const data = await response.json();
            if (response.status !== 200) {
                alert(data.message);
                return false;
            } else {
                alert(data.message);
                localStorage.setItem("userDetails", JSON.stringify({
                    ...curr,
                    access_token: data.access_token,
                }));
                setCurr({
                    ...curr,
                    access_token: data.access_token,
                })
                return true;
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const fetchAd = async () => {
        try {
            const response = await fetch(`http://localhost:8000/ads/${id}`, {
                headers: { Authorization: `Bearer ${curr.access_token}` },
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 403) {
                const fetchToken = await refreshToken();
                if (!fetchToken) {
                    alert("Something wrong happened. Please login again.");
                    navigate("/login");
                }
            }
            setDetails(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/ads/${details._id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${curr.access_token}` },
                }
            );
            const data = await response.json();
            if (response.status === 403) {
                const fetchToken = await refreshToken();
                if (!fetchToken) {
                    alert("Something wrong happened. Please login again.");
                    navigate("/login");
                }
            }
            alert(data.message);
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleOffer = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/ads/${details._id}/buy`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${curr.access_token}`,
                    },
                    body: JSON.stringify({ buyerId: curr.data.id }),
                }
            );
            const data = await response.json();
            if (response.status === 403) {
                const fetchToken = await refreshToken();
                if (!fetchToken) {
                    alert("Something wrong happened. Please login again.");
                    navigate("/login");
                }
            }
            alert(data.message);
            handleClickCloseOffer();
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCloseAd = async (buyerId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/ads/${details._id}/close/${buyerId}`,
                { method: "POST", Authorization: `Bearer ${curr.access_token}` }
            );
            const data = await response.json();
            if (response.status === 403) {
                const fetchToken = await refreshToken();
                if (!fetchToken) {
                    alert("Something wrong happened. Please login again.");
                    navigate("/login");
                }
            }
            alert(data.message);
            return;
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchAd();
        // eslint-disable-next-line
    }, [curr]);

    useEffect(() => {
        setCurr(JSON.parse(localStorage.getItem("userDetails")));
        // eslint-disable-next-line
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {details && (
                <Container
                    maxWidth="md"
                    sx={{ minHeight: "90vh", pt: "20px", pb: "20px" }}
                >
                    <Typography variant="h3" align="center" p="10px" pt="30px">
                        {details.title}
                    </Typography>
                    <Divider sx={{ pt: "10px", pb: "10px" }}>
                        <Chip
                            variant="filled"
                            color="primary"
                            label={details.category}
                        />
                    </Divider>
                    <Typography variant="h5" align="center" p="10px" pb="20px">
                        {details.description} for ${details.price}
                    </Typography>
                    <Stack spacing={1} alignItems="center" mb="20px">
                        <Typography variant="button">Seller</Typography>
                        <Chip label={`${details.seller.name}`} color="info" />
                    </Stack>
                    <Stack spacing={1} alignItems="center" mb="20px">
                        {!details.buyer && (
                            <>
                                <Typography variant="button">
                                    Interested Buyers
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    divider={
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                        />
                                    }
                                >
                                    {details.interestedBuyers.length > 0 &&
                                        details.interestedBuyers.map((el) => (
                                            <Chip
                                                label={`${el.name}`}
                                                color="success"
                                                variant="outlined"
                                                onClick={() =>
                                                    details.seller._id ===
                                                    curr.data.id
                                                        ? handleCloseAd(el._id)
                                                        : null
                                                }
                                            />
                                        ))}

                                    {details.interestedBuyers.length === 0 && (
                                        <Typography
                                            variant="overline"
                                            align="center"
                                            width="100%"
                                        >
                                            No offers yet
                                        </Typography>
                                    )}
                                </Stack>
                            </>
                        )}

                        {details.buyer && (
                            <>
                                <Typography variant="button">Buyer</Typography>
                                {console.log(details.interestedBuyers)}
                                {details.interestedBuyers.map((el) =>
                                    el._id === details.buyer ? (
                                        <Chip
                                            label={`${el.name}`}
                                            color="success"
                                        />
                                    ) : null
                                )}
                            </>
                        )}
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={2}
                        p="10px"
                        justifyContent="center"
                        divider={<Divider orientation="vertical" flexItem />}
                    >
                        {details && curr && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                disabled={details.seller._id !== curr.data.id}
                                onClick={handleClickOpenDelete}
                            >
                                Delete
                            </Button>
                        )}
                        {details && curr && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<TouchAppIcon />}
                                disabled={
                                    details.seller._id === curr.data.id ||
                                    Boolean(details.buyer) ||
                                    details.interestedBuyers.some(
                                        (el) => el.name === curr.data.name
                                    )
                                }
                                onClick={handleClickOpenOffer}
                            >
                                Offer
                            </Button>
                        )}
                    </Stack>
                </Container>
            )}

            <Dialog open={displayDelete} onClose={handleClickCloseDelete}>
                <DialogTitle>
                    Are you sure you want to delete this advert?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Agreeing will lead to the permanent deletion of your
                        advert. Restoration would be impossible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCloseDelete}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={displayOffer} onClose={handleClickCloseOffer}>
                <DialogTitle>
                    Are you sure you want to place an offer on this advert?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Agreeing will lead to the permanent inclusion of your
                        interest in the advert. Retraction of your offer would
                        be impossible in order to prevent artificial increase of
                        advert demand.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickCloseOffer}>Cancel</Button>
                    <Button onClick={handleOffer}>Offer</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
