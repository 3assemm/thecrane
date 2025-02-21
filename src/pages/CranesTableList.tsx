import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Table, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LoadChartMatrix } from '../components/LoadChartMatrix';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface CraneModel {
  craneId: string;
  manufacturer: string;
  model: string;
  capacity: number;
  specifications: {
    maxCapacity: number;
    minBoomLength: number;
    maxBoomLength: number;
    maxRadius: number;
    minRadius: number;
  };
}

export const CranesTableList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cranes, setCranes] = useState<CraneModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrane, setSelectedCrane] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    manufacturer: '',
    model: '',
    capacity: '',
    maxBoomLength: ''
  });

  useEffect(() => {
    const fetchCranes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'models'));
        const cranesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          craneId: doc.id
        })) as CraneModel[];
        
        // Sort by manufacturer and model
        cranesData.sort((a, b) => {
          const mfgCompare = a.manufacturer.localeCompare(b.manufacturer);
          return mfgCompare !== 0 ? mfgCompare : a.model.localeCompare(b.model);
        });
        
        setCranes(cranesData);
      } catch (error) {
        toast.error('Failed to fetch cranes data');
      } finally {
        setLoading(false);
      }
    };

    fetchCranes();
  }, []);

  const filteredCranes = cranes.filter(crane => {
    const matchManufacturer = crane.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase());
    const matchModel = crane.model.toLowerCase().includes(filters.model.toLowerCase());
    const matchCapacity = !filters.capacity || crane.capacity >= Number(filters.capacity);
    const matchBoomLength = !filters.maxBoomLength || crane.specifications.maxBoomLength >= Number(filters.maxBoomLength);
    
    return matchManufacturer && matchModel && matchCapacity && matchBoomLength;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('tables.backToCalculator')}</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            {t('tables.title')}
          </h2>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                value={filters.manufacturer}
                onChange={(e) => setFilters(prev => ({ ...prev, manufacturer: e.target.value }))}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                placeholder="Filter by manufacturer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Model
              </label>
              <input
                type="text"
                value={filters.model}
                onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                placeholder="Filter by model"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Capacity (T)
              </label>
              <input
                type="number"
                value={filters.capacity}
                onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                placeholder="Min capacity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Boom Length (m)
              </label>
              <input
                type="number"
                value={filters.maxBoomLength}
                onChange={(e) => setFilters(prev => ({ ...prev, maxBoomLength: e.target.value }))}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                placeholder="Min boom length"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredCranes.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No cranes available
            </p>
          ) : (
            <div className="space-y-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Manufacturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Max Boom Length
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCranes.map((crane) => (
                      <tr key={crane.craneId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {crane.manufacturer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {crane.model}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {crane.capacity}T
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {crane.specifications.maxBoomLength}m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedCrane(crane.craneId)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            View Table
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedCrane(crane.craneId)}
                            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 transition-colors"
                          >
                            <Table className="w-4 h-4" />
                            Table
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedCrane && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold dark:text-white">
                      Load Chart
                    </h3>
                    <button
                      onClick={() => setSelectedCrane(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Close
                    </button>
                  </div>
                  <LoadChartMatrix
                    craneId={selectedCrane}
                    calculationResults={{
                      totalLoad: 0,
                      minBoomLength: 0,
                      liftRadius: 0
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
