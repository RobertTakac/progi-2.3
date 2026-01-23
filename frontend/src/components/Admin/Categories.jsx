import { useState, useEffect } from 'react';
import { getAllCategories, newCategory, deleteCategory } from "../../services/apiService";
import { DialogActions, DialogContent } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

function NewCatModal(props) {
    const { handleClose, open, loading, handleSubmit, newCat, setNewCat } = props;

    const updateCatField = (field) => (e) => {
        setNewCat({ ...newCat, [field]: e.target.value });
    }

    return (
        <Dialog onClose={handleClose} open={open} fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Stvori novu kategoriju</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        name="name"
                        label="Ime"
                        value={newCat.name}
                        onChange={updateCatField("name")}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="description"
                        label="Opis"
                        value={newCat.description}
                        onChange={updateCatField("description")}
                        fullWidth
                        multiline
                        rows={3}
                        required
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Odustani
                    </Button>

                    <Button type="submit" color="primary" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress /> : "Spremi"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

const emptyCat = {
    name: "",
    description: ""
}

const Categories = () => {
    const [newCat, setNewCat] = useState(emptyCat);
    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchCats = async () => {
        setLoading(true);

        try {
            const data = await getAllCategories();
            setAllCats(data);
        } catch (err) {
            toast.error(err);
        }

        setLoading(false);
    }

    const handleNewCat = () => {
        setNewCat(emptyCat);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setNewCat(emptyCat);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await newCategory(newCat);
        } catch (err) {
            toast.error(err);
        }

        handleClose();
        await fetchCats();
        setLoading(false);
    }

    const handleDelete = async (id) => {
        setLoading(true);

        try {
            await deleteCategory(id);
        } catch (err) {
            toast.error("Brisanje nije uspjelo! Vjerojatno neka ponuda ovisi o ovoj kategoriji!");
        }

        await fetchCats();
        setLoading(false);
    }

    useEffect(() => {
        fetchCats();
    }, []);

    return (
        <Box>
            <List>
                {allCats?.map((currCat) => {
                    return (
                        <ListItem key={currCat.id} disablePadding>
                            <ListItemText primary={currCat.name} secondary={currCat.description} />
                            <IconButton aria-label="delete" color="primary" onClick={() => handleDelete(currCat.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    );
                })}
            </List>

            {(!allCats || allCats.length === 0) && <p className="no-ads-text">Nema kategorija.</p>}

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            <Button variant="outlined" onClick={handleNewCat}>Stvori novu kategoriju</Button>
            <NewCatModal open={open} handleClose={handleClose} loading={loading} handleSubmit={handleSubmit}
                newCat={newCat} setNewCat={setNewCat} />
        </Box>
    );
};

export default Categories;