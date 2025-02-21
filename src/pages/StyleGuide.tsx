import React from 'react';
    import { motion } from 'framer-motion';
    import { useTranslation } from 'react-i18next';
    import {
      Calculator,
      RotateCcw,
      Mail,
      ArrowUpDown,
      Weight,
      ArrowLeftRight,
      QrCode,
      CheckCircle2,
      AlertTriangle,
      XCircle,
      Clock,
      User,
      Crown,
      Shield,
      HelpCircle,
      Table,
      FileText,
      Download,
      Share2,
      LayoutDashboard,
      Edit,
      Trash2,
      Printer,
      Phone,
      Globe,
      MessageCircle,
      Camera,
      Filter,
      SortAsc,
      Calendar,
      Palette
    } from 'lucide-react';
    import { Link } from 'react-router-dom';

    const ColorSwatch = ({ color, name }: { color: string; name: string }) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-md" style={{ backgroundColor: color }} />
        <div className="space-y-1">
          <p className="font-semibold dark:text-white">{name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{color}</p>
        </div>
      </div>
    );

    const TypographySample = ({
      variant,
      text,
      className
    }: {
      variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
      text: string;
      className?: string;
    }) => {
      const Tag = variant;
      return <Tag className={`dark:text-white ${className}`}>{text}</Tag>;
    };

    const ButtonSample = ({
      variant,
      text,
      disabled
    }: {
      variant: 'primary' | 'secondary' | 'disabled';
      text: string;
      disabled?: boolean;
    }) => {
      let className = 'py-2 px-4 rounded-lg font-semibold transition-colors';
      if (variant === 'primary') {
        className += ' bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white hover:bg-yellow-500 dark:hover:bg-yellow-600';
      } else if (variant === 'secondary') {
        className += 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600';
      } else {
        className += 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 opacity-50 cursor-not-allowed';
      }

      return (
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          disabled={disabled}
          className={className}
        >
          {text}
        </motion.button>
      );
    };

    const InputSample = ({ type, placeholder }: { type: string; placeholder: string }) => (
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white pl-3 pr-3 py-2"
        />
      </div>
    );

    const CardSample = ({ children }: { children: React.ReactNode }) => (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {children}
      </div>
    );

    const IconSample = ({ icon: Icon, name }: { icon: any; name: string }) => (
      <div className="flex items-center gap-2">
        <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400">{name}</span>
      </div>
    );

    const AlertSample = ({ type, message }: { type: 'success' | 'error' | 'warning'; message: string }) => {
      let className = 'p-4 rounded-lg';
      let icon = null;
      if (type === 'success') {
        className += ' bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        icon = <CheckCircle2 className="w-5 h-5 mr-2" />;
      } else if (type === 'error') {
        className += ' bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        icon = <XCircle className="w-5 h-5 mr-2" />;
      } else {
        className += ' bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        icon = <AlertTriangle className="w-5 h-5 mr-2" />;
      }

      return (
        <div className={`flex items-center ${className}`}>
          {icon}
          {message}
        </div>
      );
    };

    const LoadingSample = () => (
      <div className="flex items-center justify-center py-4">
        <Clock className="w-6 h-6 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );

    export const StyleGuide: React.FC = () => {
      const { t } = useTranslation();

      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
          <div className="container mx-auto max-w-5xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
            >
              <h1 className="text-3xl font-bold mb-8 dark:text-white">Interactive Style Guide</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                This page showcases the different components, colors, typography, and other design elements used in the application.
              </p>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Colors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ColorSwatch color="#FCD34D" name="Primary Yellow" />
                  <ColorSwatch color="#6B7280" name="Text Gray" />
                  <ColorSwatch color="#FFFFFF" name="Background White" />
                  <ColorSwatch color="#000000" name="Text Black" />
                  <ColorSwatch color="#4B5563" name="Dark Gray" />
                  <ColorSwatch color="#F59E0B" name="Accent Orange" />
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Typography</h2>
                <div className="space-y-4">
                  <TypographySample variant="h1" text="Heading 1" className="text-4xl font-bold" />
                  <TypographySample variant="h2" text="Heading 2" className="text-3xl font-semibold" />
                  <TypographySample variant="h3" text="Heading 3" className="text-2xl font-semibold" />
                  <TypographySample variant="h4" text="Heading 4" className="text-xl font-semibold" />
                  <TypographySample variant="h5" text="Heading 5" className="text-lg font-semibold" />
                  <TypographySample variant="h6" text="Heading 6" className="text-base font-semibold" />
                  <TypographySample variant="p" text="Body text. This is a sample paragraph to demonstrate the body text style." />
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Buttons</h2>
                <div className="flex items-center gap-4">
                  <ButtonSample variant="primary" text="Primary Button" />
                  <ButtonSample variant="secondary" text="Secondary Button" />
                  <ButtonSample variant="disabled" text="Disabled Button" disabled />
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Input Fields</h2>
                <div className="space-y-4">
                  <InputSample type="text" placeholder="Text Input" />
                  <InputSample type="number" placeholder="Number Input" />
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CardSample>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Card Title</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is a sample card with some content.
                    </p>
                  </CardSample>
                  <CardSample>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Another Card</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is another sample card with different content.
                    </p>
                  </CardSample>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Icons</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <IconSample icon={Calculator} name="Calculator" />
                  <IconSample icon={RotateCcw} name="RotateCcw" />
                  <IconSample icon={Mail} name="Mail" />
                  <IconSample icon={ArrowUpDown} name="ArrowUpDown" />
                  <IconSample icon={Weight} name="Weight" />
                  <IconSample icon={ArrowLeftRight} name="ArrowLeftRight" />
                  <IconSample icon={QrCode} name="QrCode" />
                  <IconSample icon={CheckCircle2} name="CheckCircle2" />
                  <IconSample icon={AlertTriangle} name="AlertTriangle" />
                  <IconSample icon={XCircle} name="XCircle" />
                  <IconSample icon={Clock} name="Clock" />
                  <IconSample icon={User} name="User" />
                  <IconSample icon={Crown} name="Crown" />
                  <IconSample icon={Shield} name="Shield" />
                  <IconSample icon={HelpCircle} name="HelpCircle" />
                  <IconSample icon={Table} name="Table" />
                  <IconSample icon={FileText} name="FileText" />
                  <IconSample icon={Download} name="Download" />
                  <IconSample icon={Share2} name="Share2" />
                  <IconSample icon={LayoutDashboard} name="LayoutDashboard" />
                  <IconSample icon={Edit} name="Edit" />
                  <IconSample icon={Trash2} name="Trash2" />
                  <IconSample icon={Printer} name="Printer" />
                  <IconSample icon={Phone} name="Phone" />
                  <IconSample icon={Globe} name="Globe" />
                  <IconSample icon={MessageCircle} name="MessageCircle" />
                  <IconSample icon={Camera} name="Camera" />
                  <IconSample icon={Filter} name="Filter" />
                  <IconSample icon={SortAsc} name="SortAsc" />
                  <IconSample icon={Calendar} name="Calendar" />
                  <IconSample icon={Palette} name="Palette" />
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Alerts</h2>
                <div className="space-y-4">
                  <AlertSample type="success" message="This is a success alert." />
                  <AlertSample type="error" message="This is an error alert." />
                  <AlertSample type="warning" message="This is a warning alert." />
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Loading Indicator</h2>
                <LoadingSample />
              </div>
            </motion.div>
          </div>
        </div>
      );
    };
