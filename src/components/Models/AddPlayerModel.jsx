import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiX, FiUpload, FiUser, FiCamera } from "react-icons/fi";
import InputField from "../common/InputField";

const AddPlayerModel = ({
  isOpen,
  onClose,
  onAddPlayer,
  player,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    jerseyNumber: "",
    parentEmail: "",
  });

  const [playerImage, setPlayerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (player) {
      setFormData({
        firstName: player.firstName || "",
        lastName: player.lastName || "",
        position: player.position || "",
        jerseyNumber: player.jerseyNumber ? player.jerseyNumber.toString() : "",
        parentEmail: player.parentEmail || "",
      });
      setImagePreview(player.playerimage || null);
      setPlayerImage(null);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        position: "",
        jerseyNumber: "",
        parentEmail: "",
      });
      setPlayerImage(null);
      setImagePreview(null);
      setErrors({});
    }
  }, [player, isOpen]);

  // Clean up camera stream when component unmounts or camera is closed
  useEffect(() => {
    return () => {
      if (cameraStream) {
        stopCamera();
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      setCameraError("");
      
      // Stop any existing stream
      if (cameraStream) {
        stopCamera();
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', // Use front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });
      
      setCameraStream(stream);
      setShowCamera(true);
      
      // Wait for the next render cycle to ensure video element is available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
            setCameraError("Cannot play camera stream");
          });
        }
      }, 100);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      let errorMessage = 'Cannot access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported in this browser.';
      } else {
        errorMessage += 'Please check camera permissions.';
      }
      
      setCameraError(errorMessage);
      setErrors(prev => ({ 
        ...prev, 
        playerImage: errorMessage 
      }));
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop();
      });
      setCameraStream(null);
    }
    setShowCamera(false);
    setCameraError("");
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && cameraStream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure video is ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setCameraError("Camera not ready. Please wait a moment.");
        return;
      }

      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `player-photo-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });

          setPlayerImage(file);
          
          // Create preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target.result);
          };
          reader.readAsDataURL(blob);

          // Close camera
          stopCamera();
          setErrors(prev => ({ ...prev, playerImage: '' }));
        } else {
          setCameraError("Failed to capture image. Please try again.");
        }
      }, 'image/jpeg', 0.8);
    } else {
      setCameraError("Camera not ready. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, playerImage: 'Please select a valid image (JPEG, PNG, GIF, WebP)' }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, playerImage: 'Image size must be less than 5MB' }));
        return;
      }

      setPlayerImage(file);
      setErrors(prev => ({ ...prev, playerImage: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPlayerImage(null);
    setImagePreview(null);
    setErrors(prev => ({ ...prev, playerImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    else if (formData.firstName.length > 50)
      newErrors.firstName = "First name too long";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length > 50)
      newErrors.lastName = "Last name too long";

    if (!formData.jerseyNumber) {
      newErrors.jerseyNumber = "Jersey number is required";
    } else if (isNaN(formData.jerseyNumber)) {
      newErrors.jerseyNumber = "Must be a number";
    } else {
      const jerseyNum = parseInt(formData.jerseyNumber);
      if (jerseyNum < 0 || jerseyNum > 99) {
        newErrors.jerseyNumber = "Must be between 0-99";
      }
    }

    if (formData.parentEmail && !/^\S+@\S+\.\S+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = "Invalid email format";
    }

    if (formData.position && formData.position.length > 30) {
      newErrors.position = "Position too long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);

    const playerData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      position: formData.position.trim() || null,
      jerseyNumber: parseInt(formData.jerseyNumber),
      parentEmail: formData.parentEmail.trim() || null,
    };

    // Create FormData to handle file upload
    const formDataToSend = new FormData();
    
    // Append all player data
    Object.keys(playerData).forEach(key => {
      if (playerData[key] !== null && playerData[key] !== undefined) {
        formDataToSend.append(key, playerData[key]);
      }
    });

    // Append image if selected
    if (playerImage) {
      formDataToSend.append('playerimage', playerImage);
    }

    try {
      await onAddPlayer(formDataToSend);
    } catch (error) {
      console.error('Error adding player:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // Stop camera if active
    if (cameraStream) {
      stopCamera();
    }
    setShowCamera(false);
    setErrors({});
    setPlayerImage(null);
    setImagePreview(null);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  const isSubmitting = isLoading || isUploading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800/80 custom-scrollbar backdrop-blur-sm rounded-xl w-full max-w-md border border-gray-700 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {player ? "Edit Player" : "Add New Player"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Player Image Upload */}
              <div>
                <label className="block mb-2 font-medium text-white">
                  Player Image
                </label>
                <div className="flex items-center gap-4">
                  {/* Image Preview */}
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Player preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          disabled={isSubmitting}
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center">
                        <FiUser size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Upload Options */}
                  <div className="flex-1 space-y-2">
                    {/* File Upload */}
                    <label className={`flex items-center justify-center w-full h-10 border border-gray-600 rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <FiUpload className="w-4 h-4 text-gray-400" />
                        )}
                        <p className="text-sm text-gray-400">
                          {isSubmitting ? 'Uploading...' : 'Upload from device'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                      />
                    </label>

                    {/* Camera Capture */}
                    <button
                      type="button"
                      onClick={startCamera}
                      className={`flex items-center justify-center gap-2 w-full h-10 border border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      <FiCamera className="w-4 h-4" />
                      <span className="text-sm">
                        {isSubmitting ? 'Please wait...' : 'Take photo with camera'}
                      </span>
                    </button>
                  </div>
                </div>
                {errors.playerImage && (
                  <p className="text-red-400 text-sm mt-1">{errors.playerImage}</p>
                )}
              </div>

              {/* Camera Modal */}
              {showCamera && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-800 rounded-xl w-full max-w-md">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">Take Photo</h3>
                      <button
                        onClick={stopCamera}
                        className="text-gray-400 hover:text-white"
                        disabled={isSubmitting}
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      {/* Camera Feed */}
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 object-cover"
                          onLoadedMetadata={() => console.log("Video metadata loaded")}
                          onCanPlay={() => console.log("Video can play")}
                        />
                        {cameraError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                            <p className="text-red-400 text-center px-4">{cameraError}</p>
                          </div>
                        )}
                      </div>
                      
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {cameraError ? (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                          <p className="text-red-300 text-sm">{cameraError}</p>
                          <button
                            onClick={startCamera}
                            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                            disabled={isSubmitting}
                          >
                            Try Again
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3 mt-4">
                          <button
                            type="button"
                            onClick={captureImage}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                            disabled={isSubmitting}
                          >
                            <FiCamera size={18} />
                            Capture Photo
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div>
                <label className="block mb-2 font-medium text-white">
                  First Name*
                </label>
                <InputField
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  required={true}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-white">
                  Last Name*
                </label>
                <InputField
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  required={true}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-white">
                  Jersey Number*
                </label>
                <InputField
                  type="string"
                  name="jerseyNumber"
                  placeholder="Enter jersey number (0-99)"
                  value={formData.jerseyNumber}
                  onChange={(e) => handleInputChange('jerseyNumber', e.target.value)}
                  error={errors.jerseyNumber}
                  required={true}
                  disabled={isSubmitting}
                  style={{ appearance: 'textfield' }}
                  onWheel={(e) => e.target.blur()} 
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-white">
                  Position
                </label>
                <InputField
                  type="text"
                  name="position"
                  placeholder="Enter position (e.g., Forward, Midfielder)"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  error={errors.position}
                  required={false}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-white">
                  Parent/Guardian Email
                </label>
                <InputField
                  type="email"
                  name="parentEmail"
                  placeholder="Enter parent/guardian email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                  error={errors.parentEmail}
                  required={false}
                  disabled={isSubmitting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-[#9AEA62] hover:bg-[#8bd95a] rounded text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      {player ? 'Updating...' : 'Adding...'}
                    </div>
                  ) : (
                    player ? 'Update Player' : 'Add Player'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddPlayerModel;