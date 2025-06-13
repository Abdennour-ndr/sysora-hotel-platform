import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Image, Eye, RefreshCw } from 'lucide-react';

const ImageDiagnostic = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diagnostics, setDiagnostics] = useState([]);

  useEffect(() => {
    fetchRoomsAndDiagnose();
  }, []);

  const fetchRoomsAndDiagnose = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysora_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const roomsData = data.data?.rooms || [];
        setRooms(roomsData);
        
        // Run diagnostics
        const diagnosticResults = await runDiagnostics(roomsData);
        setDiagnostics(diagnosticResults);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const runDiagnostics = async (roomsData) => {
    const results = [];

    // Check 1: Rooms with images in database
    const roomsWithImages = roomsData.filter(room => room.images && room.images.length > 0);
    results.push({
      test: 'Rooms with images in database',
      status: roomsWithImages.length > 0 ? 'success' : 'warning',
      message: `${roomsWithImages.length} rooms have images in database`,
      details: roomsWithImages.map(room => ({
        roomNumber: room.number,
        imageCount: room.images.length,
        images: room.images
      }))
    });

    // Check 2: Image accessibility
    for (const room of roomsWithImages) {
      for (const image of room.images) {
        try {
          const imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/image/${image.filename}`;
          const imageResponse = await fetch(imageUrl);
          
          results.push({
            test: `Image accessibility - Room ${room.number}`,
            status: imageResponse.ok ? 'success' : 'error',
            message: imageResponse.ok 
              ? `Image ${image.filename} is accessible` 
              : `Image ${image.filename} is not accessible (${imageResponse.status})`,
            details: {
              roomNumber: room.number,
              filename: image.filename,
              url: imageUrl,
              status: imageResponse.status,
              isPrimary: image.isPrimary
            }
          });
        } catch (error) {
          results.push({
            test: `Image accessibility - Room ${room.number}`,
            status: 'error',
            message: `Error checking image ${image.filename}: ${error.message}`,
            details: {
              roomNumber: room.number,
              filename: image.filename,
              error: error.message
            }
          });
        }
      }
    }

    // Check 3: Image URL format
    roomsWithImages.forEach(room => {
      room.images.forEach(image => {
        const hasRequiredFields = image.filename && image.originalName && image.path;
        results.push({
          test: `Image data structure - Room ${room.number}`,
          status: hasRequiredFields ? 'success' : 'error',
          message: hasRequiredFields 
            ? `Image ${image.filename} has correct data structure`
            : `Image data is incomplete`,
          details: {
            roomNumber: room.number,
            imageData: image,
            hasFilename: !!image.filename,
            hasOriginalName: !!image.originalName,
            hasPath: !!image.path
          }
        });
      });
    });

    return results;
  };

  const testImageLoad = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-lg">Running diagnostics...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Image System Diagnostics</h1>
                <p className="text-gray-600">Checking image upload and display functionality</p>
              </div>
            </div>
            <button
              onClick={fetchRoomsAndDiagnose}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {diagnostics.map((diagnostic, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${getStatusColor(diagnostic.status)}`}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(diagnostic.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{diagnostic.test}</h3>
                    <p className="text-gray-700 mt-1">{diagnostic.message}</p>
                    
                    {diagnostic.details && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                          View Details
                        </summary>
                        <div className="mt-2 p-3 bg-white rounded border">
                          <pre className="text-xs text-gray-600 overflow-auto">
                            {JSON.stringify(diagnostic.details, null, 2)}
                          </pre>
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {diagnostics.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No diagnostic results available</p>
            </div>
          )}
        </div>

        {/* Quick Image Test */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Image Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms
              .filter(room => room.images && room.images.length > 0)
              .slice(0, 6)
              .map(room => (
                <div key={room._id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Room {room.number}</h4>
                  <div className="space-y-2">
                    {room.images.slice(0, 2).map((image, index) => {
                      const imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms/image/${image.filename}`;
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`Room ${room.number}`}
                              className="w-full h-full object-cover"
                              onLoad={() => console.log(`✅ Image loaded: ${image.filename}`)}
                              onError={() => console.log(`❌ Image failed: ${image.filename}`)}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{image.filename}</p>
                            <p className="text-xs text-gray-500">
                              {image.isPrimary ? 'Primary' : 'Secondary'}
                            </p>
                          </div>
                          <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDiagnostic;
