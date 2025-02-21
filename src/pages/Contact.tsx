import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, Globe, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Contact = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/15712016349', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className={`w-6 h-6 ${isRTL ? 'transform rotate-180' : ''}`} />
            <span>Back to Calculator</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8"
        >
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Contact Us</h1>

          <div className="space-y-8">
            <p className="text-gray-600 dark:text-gray-400">
              If you need to:
            </p>

            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 ml-4">
              <li>purchase Premium account</li>
              <li>add a crane table</li>
              <li>add a crane chart</li>
              <li>request a clarification</li>
            </ul>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone/WhatsApp</p>
                  <p className="text-lg font-medium dark:text-white">+1 (571) 201-6349</p>
                </div>
                <button
                  onClick={handleWhatsAppClick}
                  className="ml-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <a 
                    href="mailto:newprojects@newprojectsllc.us"
                    className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    newprojects@newprojectsllc.us
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    NPCrane.com is part of NEWPROJECTS
                  </p>
                </div>
                <a 
                  href="https://www.newprojectsllc.us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  www.newprojectsllc.us
                </a>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">Thank You</p>
                <p className="font-medium dark:text-white">NPCrane Team</p>
                <a 
                  href="https://www.npcrane.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  www.npcrane.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
