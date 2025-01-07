import React, { useState } from 'react';
import { io } from 'socket.io-client';

const socketCAM1 = io('http://localhost:8000/room1');

function ImageTest() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);

            // 미리보기 이미지 설정
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendImage = () => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageData = reader.result;
                socketCAM1.emit('send_image', { image: imageData });
                alert('Image sent successfully!');
            };
            reader.readAsDataURL(selectedImage);
        } else {
            alert('Please select an image first.');
        }
    };

    return (
        <div>
            <h1>Image Upload and Send Test</h1>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={sendImage}>Send Image</button>

            {preview && (
                <div>
                    <h3>Preview:</h3>
                    <img src={preview} alt="Preview" style={{ maxWidth: '300px' }} />
                </div>
            )}
        </div>
    );
}

export default ImageTest;
