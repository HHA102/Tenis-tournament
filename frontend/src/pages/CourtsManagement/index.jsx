import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import AddCourtModal from './AddCourtModal';
import axiosClient from '../../utils/axiosClient';

const CourtsManagement = () => {
    const [open, setOpen] = useState(false);
    const [courts, setCourts] = useState([]);
    const [courtToEdit, setCourtToEdit] = useState(null);

    const handleSubmit = async (formData) => {
        console.log(formData);
        const response = await axiosClient.post('/v1/courts', formData);
        console.log(response);
        setOpen(false);
        fetchCourts();
    };

    const fetchCourts = async () => {
        const response = await axiosClient.get('/v1/courts');
        console.log(response);
        setCourts(response.data);
    }

    const handleDelete = async (id) => {
        const response = await axiosClient.delete(`/v1/courts/${id}`);
        console.log(response);
        fetchCourts();
    }

    const handleEdit = async (court) => {
        setCourtToEdit(court);
        setOpen(true);
    }

    useEffect(() => {
        fetchCourts();
    }, []);

    return (
        <div>
            <h1 className='text-2xl font-bold'>Courts Management</h1>
            <Button variant="contained" onClick={() => setOpen(true)}>Add Court</Button>
            <AddCourtModal open={open} onClose={() => {
                setOpen(false)
                setCourtToEdit(null)
            }} onSubmit={handleSubmit} courtToEdit={courtToEdit} />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead className='bg-gray-100'>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Surface</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courts.map((court) => (
                            <TableRow key={court._id}>
                                <TableCell>{court.name}</TableCell>
                                <TableCell>{court.location}</TableCell>
                                <TableCell>{court.surface}</TableCell>
                                <TableCell>{court.status}</TableCell>
                                <TableCell className='flex flex-row gap-2 justify-end'>
                                    <Button variant="contained" color="primary" onClick={() => handleEdit(court)}>Edit</Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(court._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default CourtsManagement;
