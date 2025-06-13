import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  X, 
  Star, 
  Eye, 
  RotateCcw, 
  Download, 
  Image as ImageIcon,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

const ImageUploadManager = ({ images = [], onImagesChange, maxImages = 10, maxSizePerImage = 5 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Compress image function
  const compressImage = useCallback((file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Validate file
  const validateFile = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = maxSizePerImage * 1024 * 1024; // Convert MB to bytes

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPEG, PNG, or WebP images.';
    }

    if (file.size > maxSize) {
      return `File size too large. Maximum size is ${maxSizePerImage}MB.`;
    }

    return null;
  }, [maxSizePerImage]);

  // Process files
  const processFiles = useCallback(async (files) => {
    setUploading(true);
    setErrors([]);
    const newErrors = [];
    const processedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if we've reached max images
      if (images.length + processedImages.length >= maxImages) {
        newErrors.push(`Maximum ${maxImages} images allowed`);
        break;
      }

      // Validate file
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
        continue;
      }

      try {
        // Compress image
        const compressedFile = await compressImage(file);
        
        // Create image object
        const imageUrl = URL.createObjectURL(compressedFile);
        const imageObj = {
          id: Date.now() + i,
          file: compressedFile,
          url: imageUrl,
          name: file.name,
          size: compressedFile.size,
          isPrimary: images.length === 0 && processedImages.length === 0, // First image is primary
          originalSize: file.size
        };

        processedImages.push(imageObj);
      } catch (error) {
        newErrors.push(`${file.name}: Failed to process image`);
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (processedImages.length > 0) {
      onImagesChange([...images, ...processedImages]);
    }

    setUploading(false);
  }, [images, maxImages, validateFile, compressImage, onImagesChange]);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, [processFiles]);

  // Handle file input change
  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(Array.from(e.target.files));
    }
  }, [processFiles]);

  // Remove image
  const removeImage = useCallback((imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // If removed image was primary, make first image primary
    if (updatedImages.length > 0) {
      const removedImage = images.find(img => img.id === imageId);
      if (removedImage?.isPrimary) {
        updatedImages[0].isPrimary = true;
      }
    }

    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  // Set primary image
  const setPrimaryImage = useCallback((imageId) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  // Reorder images
  const reorderImages = useCallback((fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-lg font-medium text-gray-700">Processing images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-emerald-100 rounded-full">
              <Upload className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                Support: JPEG, PNG, WebP • Max {maxSizePerImage}MB per image • Up to {maxImages} images
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Choose Images</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h4 className="font-medium text-red-800">Upload Errors</h4>
          </div>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">
              Uploaded Images ({images.length}/{maxImages})
            </h4>
            <div className="text-sm text-gray-500">
              Drag to reorder • Click star to set as primary
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  reorderImages(fromIndex, index);
                }}
              >
                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="flex items-center space-x-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Primary</span>
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <button
                        onClick={() => setPreviewImage(image)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setPrimaryImage(image.id)}
                        className={`p-2 rounded-full transition-colors ${
                          image.isPrimary 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-white hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Set as primary"
                      >
                        <Star className={`w-4 h-4 ${image.isPrimary ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {formatFileSize(image.size)}
                    </span>
                    {image.originalSize > image.size && (
                      <span className="text-xs text-emerald-600 font-medium">
                        Compressed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
              <p className="font-medium">{previewImage.name}</p>
              <p className="text-sm opacity-75">{formatFileSize(previewImage.size)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadManager;
