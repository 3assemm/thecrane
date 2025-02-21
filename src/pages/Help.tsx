import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calculator, FileText, Eye, Download, Printer, 
  QrCode, Table, Search, LayoutDashboard, Edit, Trash2,
  Share2, Crown, User, Shield, Languages, Sun, Moon,
  Filter, SortAsc, Mail, MessageCircle, Smartphone,
  BarChart2, Calendar, Clock, Info, HelpCircle, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Help = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Filter sections based on search
  const filterContent = (content: string) => {
    if (!searchTerm) return true;
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction to NPCrane.com',
      icon: Info,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            NPCrane.com is a professional crane size calculator designed to help construction professionals 
            and engineers determine the appropriate crane specifications for their lifting operations. Our platform 
            provides accurate calculations, comprehensive load charts, and detailed reports to ensure safe and 
            efficient crane operations.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Key Features</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Accurate crane size calculations</li>
              <li>Comprehensive load charts</li>
              <li>Multiple crane comparison</li>
              <li>Professional report generation</li>
              <li>Mobile-friendly interface</li>
              <li>Bilingual support (English/Arabic)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Before You Begin</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Create an account or log in</li>
              <li>Verify your email address</li>
              <li>Choose your preferred language</li>
              <li>Select your preferred units</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold">Account Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-semibold">Free Account</span>
              </div>
              <ul className="list-disc list-inside text-sm">
                <li>10 free calculations</li>
                <li>Basic report generation</li>
                <li>Access to crane database</li>
                <li>Email support</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">Premium Account</span>
              </div>
              <ul className="list-disc list-inside text-sm">
                <li>Unlimited calculations</li>
                <li>Advanced reporting features</li>
                <li>Priority support</li>
                <li>Custom branding</li>
                <li>Bulk export options</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-red-500" />
                <span className="font-semibold">Admin Account</span>
              </div>
              <ul className="list-disc list-inside text-sm">
                <li>Full system access</li>
                <li>User management</li>
                <li>Database management</li>
                <li>System analytics</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'calculator',
      title: 'Using the Calculator',
      icon: Calculator,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Step-by-Step Guide</h3>
            <ol className="list-decimal list-inside space-y-6">
              <li>
                <span className="font-semibold">Enter Building Details:</span>
                <div className="ml-6 mt-2 space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Building Height</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enter the total height of the building or obstruction in meters
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Crane Edge Distance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Measure from crane center to building edge in meters
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Lift Radius</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Distance from crane center to lift point in meters
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <span className="font-semibold">Specify Load Requirements:</span>
                <div className="ml-6 mt-2 space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Required Load</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Weight of the item to be lifted in tons
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Lift Tackle Weight</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Weight of lifting equipment in tons
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <span className="font-semibold">Review Results:</span>
                <div className="ml-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Total Load</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Combined weight of load and tackle
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Boom Angle</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Required angle for safe lifting
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Min Boom Length</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Minimum required boom length
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-2">Min Vertical Height</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Minimum vertical clearance needed
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Example Calculation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Input Values</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Building Height: 20m</li>
                  <li>Crane Edge Distance: 10m</li>
                  <li>Lift Radius: 15m</li>
                  <li>Required Load: 2T</li>
                  <li>Lift Tackle: 0.5T</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Results</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Total Load: 2.5T</li>
                  <li>Boom Angle: 53.1°</li>
                  <li>Min Boom Length: 25.1m</li>
                  <li>Min Vertical Height: 20.1m</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'crane-tables',
      title: 'Understanding Crane Tables',
      icon: Table,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Load Chart Matrix</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Color Coding</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-200 rounded"></div>
                      <span>Meets requirements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-200 rounded"></div>
                      <span>Insufficient capacity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <span>Not applicable</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Reading the Chart</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Rows show radius values</li>
                    <li>Columns show boom lengths</li>
                    <li>Cells show capacity in tons</li>
                    <li>Highlighted cells match criteria</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Filtering & Sorting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Filter Options</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Manufacturer</li>
                  <li>Model number</li>
                  <li>Capacity range</li>
                  <li>Boom length range</li>
                  <li>Maximum radius</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sorting Features</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Sort by any column</li>
                  <li>Toggle ascending/descending</li>
                  <li>Multi-column sorting</li>
                  <li>Save sort preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'qr-scanner',
      title: 'QR Code Features',
      icon: QrCode,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Using QR Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Scanning QR Codes</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Open QR scanner from dashboard</li>
                  <li>Allow camera access</li>
                  <li>Point camera at QR code</li>
                  <li>View calculation instantly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Generating QR Codes</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Available in HTML reports</li>
                  <li>Download as PNG image</li>
                  <li>Print with reports</li>
                  <li>Share via messaging</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      title: 'Reports & Documentation',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">HTML Report</span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Interactive diagrams</li>
                <li>Shareable format</li>
                <li>Print-friendly layout</li>
                <li>Mobile responsive</li>
                <li>QR code integration</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-5 h-5 text-green-500" />
                <span className="font-semibold">PDF Export</span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Professional format</li>
                <li>Company branding</li>
                <li>Digital signatures</li>
                <li>Secure sharing</li>
                <li>Archive support</li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">Sharing Options</span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Email reports</li>
                <li>WhatsApp sharing</li>
                <li>QR code generation</li>
                <li>Link sharing</li>
                <li>Access control</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Report Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Project Information</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Project name and location</li>
                  <li>Date and time</li>
                  <li>Client details</li>
                  <li>Company logos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Technical Details</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Calculation results</li>
                  <li>Load charts</li>
                  <li>Technical diagrams</li>
                  <li>Safety notes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Dashboard Features',
      icon: LayoutDashboard,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Managing Calculations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Actions</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>View calculation details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-yellow-500" />
                    <span>Edit calculation parameters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-green-500" />
                    <span>Download reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Printer className="w-4 h-4 text-purple-500" />
                    <span>Print reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Delete calculations</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Filtering & Search</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Filter by date range</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-green-500" />
                    <span>Search by project name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-purple-500" />
                    <span>Filter by crane type</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4 text-yellow-500" />
                    <span>Sort by any column</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Statistics & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Usage Stats</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Total calculations</li>
                  <li>Monthly usage</li>
                  <li>Popular cranes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Project Insights</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Project distribution</li>
                  <li>Load patterns</li>
                  <li>Crane preferences</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Export Options</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>CSV export</li>
                  <li>PDF reports</li>
                  <li>Data backup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pro-tips',
      title: 'Pro Tips',
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Efficiency Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Calculations</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Save frequently used configurations</li>
                  <li>Use QR codes for quick access</li>
                  <li>Compare multiple cranes side by side</li>
                  <li>Export reports in bulk</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Organization</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Use consistent project naming</li>
                  <li>Add detailed project notes</li>
                  <li>Archive completed projects</li>
                  <li>Regular data backups</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Safety First</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Always include safety margins</li>
                  <li>Double-check measurements</li>
                  <li>Consider wind conditions</li>
                  <li>Verify ground conditions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Documentation</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Keep detailed records</li>
                  <li>Include site photos</li>
                  <li>Document special conditions</li>
                  <li>Maintain revision history</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className={`w-6 h-6 ${isRTL ? 'transform rotate-180' : ''}`} />
            <span>{t('help.backToCalculator')}</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-12"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Table of Contents */}
          <nav className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section) => (
                filterContent(section.title) && (
                  <motion.a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.title}</span>
                  </motion.a>
                )
              ))}
            </div>
          </nav>

          {/* Sections */}
          {sections.map((section) => (
            filterContent(section.title) && (
              <motion.section
                key={section.id}
                id={section.id}
                className="scroll-mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <section.icon className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold dark:text-white">{section.title}</h2>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {typeof section.content === 'string' ? (
                    <p className="text-gray-600 dark:text-gray-400">{section.content}</p>
                  ) : (
                    section.content
                  )}
                </div>
              </motion.section>
            )
          ))}
        </motion.div>
      </div>
    </div>
  );
};
