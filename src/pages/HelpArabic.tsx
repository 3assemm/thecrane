import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, User, Crown, Shield, Calculator,
  Table, QrCode, FileText, Download, Share2, LayoutDashboard,
  AlertCircle, Eye, Edit, Printer, Trash2, Calendar,
  Filter, SortAsc, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HelpArabic = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="transform rotate-180 w-6 h-6" />
            <span>العودة إلى الحاسبة</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-12"
          dir="rtl"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في مواضيع المساعدة..."
              className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white text-right"
            />
          </div>

          {/* Table of Contents */}
          <nav className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4 dark:text-white">المحتويات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#introduction" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                مقدمة عن NPCrane.com
              </a>
              <a href="#getting-started" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                البدء
              </a>
              <a href="#calculator" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                استخدام الحاسبة
              </a>
              <a href="#crane-tables" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                فهم جداول الرافعات
              </a>
              <a href="#qr-features" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                ميزات رمز QR
              </a>
              <a href="#reports" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                التقارير والتوثيق
              </a>
              <a href="#dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                ميزات لوحة التحكم
              </a>
              <a href="#pro-tips" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                نصائح احترافية
              </a>
            </div>
          </nav>

          {/* Introduction Section */}
          <section id="introduction" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">مقدمة عن NPCrane.com</h2>
            <p className="text-gray-600 dark:text-gray-400">
              حاسبة احترافية لحجم الرافعات مصممة لمساعدة المهندسين ومحترفي البناء في تحديد مواصفات الرافعة المناسبة لعمليات الرفع. منصتنا توفر حسابات دقيقة، وجداول حمولة شاملة، وتقارير مفصلة لضمان عمليات رفع آمنة وفعالة.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">المميزات الرئيسية</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>حسابات دقيقة لحجم الرافعة</li>
                <li>جداول حمولة شاملة</li>
                <li>مقارنة متعددة للرافعات</li>
                <li>إنشاء تقارير احترافية</li>
                <li>واجهة متوافقة مع الأجهزة المحمولة</li>
                <li>دعم اللغتين (العربية/الإنجليزية)</li>
              </ul>
            </div>
          </section>

          {/* Getting Started Section */}
          <section id="getting-started" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">البدء</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">قبل البدء</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>إنشاء حساب أو تسجيل الدخول</li>
                <li>تأكيد البريد الإلكتروني</li>
                <li>اختيار اللغة المفضلة</li>
                <li>اختيار وحدات القياس</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold">أنواع الحسابات</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">الحساب المجاني</span>
                </div>
                <ul className="list-disc list-inside text-sm">
                  <li>10 حسابات مجانية</li>
                  <li>إنشاء تقارير أساسية</li>
                  <li>الوصول إلى قاعدة بيانات الرافعات</li>
                  <li>دعم البريد الإلكتروني</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">الحساب المميز</span>
                </div>
                <ul className="list-disc list-inside text-sm">
                  <li>حسابات غير محدودة</li>
                  <li>ميزات تقارير متقدمة</li>
                  <li>دعم ذو أولوية</li>
                  <li>علامة تجارية مخصصة</li>
                  <li>خيارات تصدير متعددة</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">حساب المسؤول</span>
                </div>
                <ul className="list-disc list-inside text-sm">
                  <li>وصول كامل للنظام</li>
                  <li>إدارة المستخدمين</li>
                  <li>إدارة قاعدة البيانات</li>
                  <li>تحليلات النظام</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section id="calculator" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">استخدام الحاسبة</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">دليل خطوة بخطوة</h3>
              <ol className="list-decimal list-inside space-y-6">
                <li>
                  <span className="font-semibold">إدخال تفاصيل المبنى:</span>
                  <div className="mr-6 mt-2 space-y-2">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">ارتفاع المبنى</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        أدخل الارتفاع الكلي للمبنى أو العائق بالأمتار
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">مسافة حافة الرافعة</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        قياس المسافة من مركز الرافعة إلى حافة المبنى بالأمتار
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">نصف قطر الرفع</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        المسافة من مركز الرافعة إلى نقطة الرفع بالأمتار
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <span className="font-semibold">تحديد متطلبات الحمولة:</span>
                  <div className="mr-6 mt-2 space-y-2">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">الحمولة المطلوبة</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        وزن العنصر المراد رفعه بالأطنان
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">وزن معدات الرفع</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        وزن معدات الرفع بالأطنان
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <span className="font-semibold">مراجعة النتائج:</span>
                  <div className="mr-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">الحمولة الكلية</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        الوزن الإجمالي للحمولة ومعدات الرفع
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">زاوية الذراع</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        الزاوية المطلوبة للرفع الآمن
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">الحد الأدنى لطول الذراع</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        الطول الأدنى المطلوب للذراع
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h4 className="font-medium mb-2">الحد الأدنى للارتفاع العمودي</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        الخلوص العمودي الأدنى المطلوب
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">مثال حساب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">قيم الإدخال</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>ارتفاع المبنى: 20م</li>
                    <li>مسافة حافة الرافعة: 10م</li>
                    <li>نصف قطر الرفع: 15م</li>
                    <li>الحمولة المطلوبة: 2طن</li>
                    <li>معدات الرفع: 0.5طن</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">النتائج</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>الحمولة الكلية: 2.5طن</li>
                    <li>زاوية الذراع: 53.1°</li>
                    <li>الحد الأدنى لطول الذراع: 25.1م</li>
                    <li>الحد الأدنى للارتفاع العمودي: 20.1م</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Crane Tables Section */}
          <section id="crane-tables" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">فهم جداول الرافعات</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">جدول الحمولة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">قراءة الجدول</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>الصفوف تمثل قيم نصف القطر</li>
                    <li>الأعمدة تمثل أطوال الذراع</li>
                    <li>الخلايا تظهر السعة بالأطنان</li>
                    <li>الخلايا المميزة تطابق المعايير</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">التصفية والفرز</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>تصفية حسب الشركة المصنعة</li>
                    <li>تصفية حسب رقم الموديل</li>
                    <li>تصفية حسب نطاق السعة</li>
                    <li>تصفية حسب نطاق طول الذراع</li>
                    <li>تصفية حسب نصف القطر الأقصى</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* QR Features Section */}
          <section id="qr-features" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">ميزات رمز QR</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">مسح رموز QR</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>فتح ماسح رمز QR من لوحة التحكم</li>
                    <li>السماح بالوصول إلى الكاميرا</li>
                    <li>توجيه الكاميرا نحو رمز QR</li>
                    <li>عرض الحساب فوراً</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">إنشاء رموز QR</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>متوفر في تقارير HTML</li>
                    <li>تحميل كصورة PNG</li>
                    <li>طباعة مع التقارير</li>
                    <li>مشاركة عبر الرسائل</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Reports Section */}
          <section id="reports" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">التقارير والتوثيق</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">تقرير HTML</span>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>رسوم بيانية تفاعلية</li>
                  <li>تنسيق قابل للمشاركة</li>
                  <li>تخطيط مناسب للطباعة</li>
                  <li>متوافق مع الأجهزة المحمولة</li>
                  <li>دمج رمز QR</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">تصدير PDF</span>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>تنسيق احترافي</li>
                  <li>علامة تجارية للشركة</li>
                  <li>توقيعات رقمية</li>
                  <li>مشاركة آمنة</li>
                  <li>دعم الأرشفة</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">خيارات المشاركة</span>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>مشاركة عبر البريد الإلكتروني</li>
                  <li>مشاركة عبر واتساب</li>
                  <li>إنشاء رمز QR</li>
                  <li>مشاركة الروابط</li>
                  <li>التحكم في الوصول</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Dashboard Section */}
          <section id="dashboard" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">ميزات لوحة التحكم</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">إدارة الحسابات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">الإجراءات</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>عرض تفاصيل الحساب</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Edit className="w-4 h-4 text-yellow-500" />
                      <span>تعديل معلمات الحساب</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-green-500" />
                      <span>تحميل التقارير</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-purple-500" />
                      <span>طباعة التقارير</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>حذف الحسابات</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">التصفية والبحث</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>تصفية حسب التاريخ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-green-500" />
                      <span>البحث باسم المشروع</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-purple-500" />
                      <span>تصفية حسب نوع الرافعة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4 text-yellow-500" />
                      <span>الفرز حسب أي عمود</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">الإحصائيات والتحليلات</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">إحصائيات الاستخدام</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>إجمالي الحسابات</li>
                    <li>الاستخدام الشهري</li>
                    <li>الرافعات الشائعة</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">تحليلات المشاريع</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>توزيع المشاريع</li>
                    <li>أنماط الحمولة</li>
                    <li>تفضيلات الرافعات</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">خيارات التصدير</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>تصدير CSV</li>
                    <li>تقارير PDF</li>
                    <li>نسخ احتياطية للبيانات</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Pro Tips Section */}
          <section id="pro-tips" className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">نصائح احترافية</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">نصائح للكفاءة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">الحسابات</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>حفظ التكوينات المستخدمة بشكل متكرر</li>
                    <li>استخدام رموز QR للوصول السريع</li>
                    <li>مقارنة رافعات متعددة جنباً إلى جنب</li>
                    <li>تصدير التقارير بشكل جماعي</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">التنظيم</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>استخدام تسمية متناسقة للمشاريع</li>
                    <li>إضافة ملاحظات تفصيلية للمشروع</li>
                    <li>أرشفة المشاريع المكتملة</li>
                    <li>نسخ احتياطية منتظمة للبيانات</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">أفضل الممارسات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">السلامة أولاً</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>دائماً تضمين هوامش الأمان</li>
                     <li>التحقق المزدوج من القياسات</li>
                    <li>مراعاة ظروف الرياح</li>
                    <li>التحقق من ظروف الأرض</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">التوثيق</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>حفظ سجلات تفصيلية</li>
                    <li>تضمين صور الموقع</li>
                    <li>توثيق الظروف الخاصة</li>
                    <li>الحفاظ على سجل المراجعات</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};
