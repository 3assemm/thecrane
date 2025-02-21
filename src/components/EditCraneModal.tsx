import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface EditCraneModalProps {
  crane: {
    craneId: string;
    manufacturer: string;
    model: string;
    capacity: number;
    specifications: {
      maxBoomLength: number;
      minBoomLength: number;
      maxRadius: number;
      minRadius: number;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditCraneModal: React.FC<EditCraneModalProps> = ({
  crane,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    manufacturer: crane.manufacturer,
    model: crane.model,
    capacity: crane.capacity.toString(),
    minBoomLength: crane.specifications.minBoomLength.toString(),
    maxBoomLength: crane.specifications.maxBoomLength.toString(),
    maxRadius: crane.specifications.maxRadius.toString(),
    minRadius: crane.specifications.minRadius.toString()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.email === '3assem@gmail.com') {
      toast.error('Only administrators can edit cranes');
      return;
    }

    setSubmitting(true);
    try {
      // Update model document
      const modelData = {
        craneId: crane.craneId,
        manufacturer: formData.manufacturer,
        model: formData.model,
        capacity: Number(formData.capacity),
        specifications: {
          maxCapacity: Number(formData.capacity),
          minBoomLength: Number(formData.minBoomLength),
          maxBoomLength: Number(formData.maxBoomLength),
          maxRadius: Number(formData.maxRadius),
          minRadius: Number(formData.minRadius)
        },
        createdBy: currentUser.email,
        updatedAt: new Date().toISOString(),
        searchableCapacity: Math.floor(Number(formData.capacity)),
        searchableRadius: Math.floor(Number(formData.maxRadius)),
        searchableBoomLength: Math.floor(Number(formData.maxBoomLength))
      };

      await setDoc(doc(db, 'models', crane.craneId), modelData, { merge: true });

      // Update load chart document
      const loadChartData = {
        craneId: crane.craneId,
        points: [
          {
            radius: Number(formData.minRadius),
            capacity: Number(formData.capacity),
            boomLength: Number(formData.minBoomLength)
          }
        ],
        createdBy: currentUser.email,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'loadCharts', crane.craneId), loadChartData, { merge: true });

      toast.success('Crane updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update crane');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Edit Crane: {crane.manufacturer} {crane.model}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                required
                value={formData.manufacturer}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Model
              </label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Capacity (tons)
              </label>
              <input
                type="number"
                name="capacity"
                required
                min="0"
                step="0.1"
                value={formData.capacity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Boom Length (m)
              </label>
              <input
                type="number"
                name="minBoomLength"
                required
                min="0"
                step="0.1"
                value={formData.minBoomLength}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Boom Length (m)
              </label>
              <input
                type="number"
                name="maxBoomLength"
                required
                min="0"
                step="0.1"
                value={formData.maxBoomLength}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Radius (m)
              </label>
              <input
                type="number"
                name="maxRadius"
                required
                min="0"
                step="0.1"
                value={formData.maxRadius}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Radius (m)
              </label>
              <input
                type="number"
                name="minRadius"
                required
                min="0"
                step="0.1"
                value={formData.minRadius}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={submitting}
              className="bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Crane'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
