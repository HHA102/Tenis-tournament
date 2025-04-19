import { Box, Button, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const AddCourtModal = ({ open, onClose, onSubmit, courtToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        surface: 'hard'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            name: '',
            location: '',
            surface: 'hard'
        });
    };
    const handleClose = () => {
        onClose?.();
    };

    useEffect(() => {
        if (courtToEdit) {
            setFormData(courtToEdit);
        }
    }, [courtToEdit]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2">Add Court</Typography>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 justify-center items-center'>
                        <TextField
                            label="Court Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Court Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            fullWidth
                        />
                        <InputLabel id="surface-select-label">Surface</InputLabel>
                        <Select
                            labelId="surface-select-label"
                            id="surface-select"
                            value={formData.surface}
                            label="Surface"
                            name="surface"
                            onChange={handleChange}
                        >
                            <MenuItem value={'hard'}>Hard</MenuItem>
                            <MenuItem value={'clay'}>Clay</MenuItem>
                            <MenuItem value={'grass'}>Grass</MenuItem>
                            <MenuItem value={'artificial'}>Artificial</MenuItem>
                        </Select>
                        <Button type="submit" variant="contained">Add Court</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    )
}

export default AddCourtModal;
