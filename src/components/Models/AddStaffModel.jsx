import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import InputField from "../common/InputField";

const AddStaffModel = ({ isOpen, onClose, onAddStaff, staff, isLoading = false }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    staffEmail: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing a staff member or reset when adding a new one
  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.firstName || "",
        lastName: staff.lastName || "",
        staffEmail: staff.staffEmail || "",
        role: staff.role || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        staffEmail: "",
        role: "",
      });
      setErrors({});
    }
  }, [staff, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (formData.firstName.length > 50) newErrors.firstName = 'First name too long';
    
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (formData.lastName.length > 50) newErrors.lastName = 'Last name too long';
    
    if (formData.staffEmail && !/^\S+@\S+\.\S+$/.test(formData.staffEmail)) {
      newErrors.staffEmail = 'Invalid email format';
    }
    
    if (formData.role && formData.role.length > 30) {
      newErrors.role = 'Role too long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAddStaff({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      staffEmail: formData.staffEmail.trim() || null,
      role: formData.role.trim() || null
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl max-w-md w-full border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {staff ? 'Edit Staff' : 'Add New Staff'}
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-white">First Name*</label>
              <InputField
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                required={true}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white">Last Name*</label>
              <InputField
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                required={true}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-white">Email</label>
            <InputField
              type="email"
              name="staffEmail"
              placeholder="Enter staff email"
              value={formData.staffEmail}
              onChange={(e) => handleInputChange('staffEmail', e.target.value)}
              error={errors.staffEmail}
              required={true}
              disabled={isLoading}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 font-medium text-white">Role</label>
            <InputField
              type="text"
              name="role"
              placeholder="Enter role (optional)"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              error={errors.role}
              required={false}
              disabled={isLoading}
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
              disabled={isLoading}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-6 py-2 bg-[#9AEA62] hover:bg-[#8bd95a] rounded text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  {staff ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                staff ? 'Update Staff' : 'Add Staff'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddStaffModel;