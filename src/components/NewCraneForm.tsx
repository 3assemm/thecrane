import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface NewCraneFormProps {
  onSuccess: () => void;
}

export const NewCraneForm: React.FC<NewCraneFormProps> = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    manufacturer: '',
    model: '',
    capacity: '',
    minBoomLength: '',
    maxBoomLength: '',
    maxRadius: '',
    minRadius: ''
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
      toast.error('Only administrators can add cranes');
      return;
    }

    setSubmitting(true);
    try {
      const craneId = `${formData.manufacturer.toLowerCase()}-${formData.model.toLowerCase()}`
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create model document
      const modelData = {
        craneId,
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

      await setDoc(doc(db, 'models', craneId), modelData);

      // Create load chart document
      const loadChartData = {
        craneId,
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

      await setDoc(doc(db, 'loadCharts', craneId), loadChartData);

      toast.success('Crane added successfully');
      setFormData({
        manufacturer: '',
        model: '',
        capacity: '',
        minBoomLength: '',
        maxBoomLength: '',
        maxRadius: '',
        minRadius: ''
      });
      onSuccess();
    } catch (error) {
      toast.error('Failed to add crane');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={submitting}
          className="bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Adding...' : 'Add Crane'}
        </motion.button>
      </div>
    </form>
  );
};
