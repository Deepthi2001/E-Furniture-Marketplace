import React, { useState } from 'react';
import { TextField, Button, Typography, Card, CardContent, Grid, FormControl, InputLabel, Input, FormHelperText } from '@mui/material';
// import { TextField, Button, Typography, Card, CardContent, Grid, FormControl, InputLabel, Input, FormHelperText } from '@mui/material';
import { APIEndPoints, LOCAL_STORAGE } from "../utils/config";

function AddProduct() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        location: '',
        img: '',
    });

    const [imageError, setImageError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();

    //         reader.onloadend = () => {
    //             setFormData({ ...formData, img: reader.result }); // Store base64 image data or you can upload the file
    //         };

    //         reader.readAsDataURL(file); // Read the file as base64 string (image)
    //     }
    // };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const fileType = file.type;
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

            // Validate file type
            if (!validImageTypes.includes(fileType)) {
                setImageError('Please select a valid image file (JPEG, PNG, GIF).');
                return;
            }

            // Reset error and store the image file
            setImageError('');
            setFormData({ ...formData, img: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a POST request to the backend to add a new product
                const res = await fetch(`${APIEndPoints.ADDPRODUCT}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json",Authorization: localStorage.getItem(LOCAL_STORAGE.TOKEN), }, // Send JSON data
				body: JSON.stringify(formData), // Convert formData to JSON
              });
            
    
            // Check if the response is not successful (status code outside 200–299 range)
            if (!res.ok) {
                throw new Error(`Failed to add product: ${res.statusText}`);
            }
    
            // // Parse the response JSON to get the created product data
            const data = await res.json();
            console.log("Product added successfully:", data);
    
            // // Reset the form after successful submission
            setFormData({
                title: '',
                description: '',
                category: '',
                price: '',
                location: '',
                img: '',
            });
            
            // Optional: Display success message or handle success state
            alert("Product added successfully!");    
            

        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <Grid container justifyContent="center" style={{ marginTop: '2rem' }}>
            <Card style={{ maxWidth: 600, padding: '20px 5px' }}>
                <CardContent>
                    <Typography gutterBottom variant="h5">
                        Add a New Product
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="title"
                            label="Product Title"
                            variant="outlined"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            name="description"
                            label="Product Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            name="category"
                            label="Category (e.g., Sofa, Table)"
                            variant="outlined"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            type="number"
                            name="price"
                            label="Price"
                            variant="outlined"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            name="location"
                            label="Location"
                            variant="outlined"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        
                        
                        {/* <Grid item xs={10}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ marginTop: '10px' }}
                            />
                            {formData.img && (
                                <img src={formData.img} alt="Product Preview" style={{ width: '100px', marginTop: '10px' }} />
                            )}
                        </Grid> */}
                        
                        <FormControl fullWidth style={{ marginTop: '1rem' }} error={Boolean(imageError)}>
                            <InputLabel htmlFor="product-image" style={{ marginLeft:"-10px", fontSize: "12px" }}>Upload Product Image</InputLabel>
                            <Input
                                id="product-image"
                                type="file"
                                accept="image/*"
                                style={{ paddingTop:"20px" }}
                                onChange={handleImageChange}
                                required
                            />
                            {imageError && <FormHelperText>{imageError}</FormHelperText>}
                        </FormControl>

                        {formData.img && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={formData.img}
                                    alt="Product Preview"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Typography variant="body2" style={{ marginTop: '5px' }}>
                                    Image Preview
                                </Typography>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '1rem' }}
                        >
                            Add Product
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default AddProduct;
