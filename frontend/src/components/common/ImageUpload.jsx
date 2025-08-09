import React, { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadService } from '../../services/uploadService';

const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  type = 'profile', 
  className = '',
  size = 'md' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size
    const maxSize = type === 'profile' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for profile, 10MB for quiz
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await uploadService.uploadImage(file, type);
      onImageChange(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer overflow-hidden bg-gray-50 flex items-center justify-center group`}
        onClick={handleClick}
      >
        {preview ? (
          <img 
            src={preview || "/placeholder.svg"} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            {uploading ? (
              <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-6 w-6"></div>
            ) : (
              <>
                {type === 'profile' ? (
                  <User className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                )}
                <p className="text-xs text-gray-500">Click to upload</p>
              </>
            )}
          </div>
        )}

        {/* Overlay on hover */}
        {preview && !uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* Remove button */}
      {preview && !uploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveImage();
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload instructions */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        {type === 'profile' ? 'Max 5MB' : 'Max 10MB'} • JPEG, PNG, WebP
      </p>
    </div>
  );
};

export default ImageUpload;
