import React, { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import "./styles/Settings.scss";

const SettingPageV1 = () => {
  const [activeTab, setActiveTab] = useState("notification");
  const [settings, setSettings] = useState({
    emailNotification: true,
    newsAndUpdates: true,
    notificationChannels: false,
    feedbackNotifications: true,
    moreActivity: true,
    integrationAlerts: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "notification", label: "Notification" },
    { id: "transaction", label: "Transaction Report" },
    { id: "payment", label: "Payment" },
    { id: "language", label: "Language" },
  ];

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <SettingsIcon size={28} />
        <h1 className="settings-title">Setting</h1>
      </div>

      {/* Tab Navigation */}
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? "settings-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="settings-content">
        {activeTab === "notification" && <NotificationSettings settings={settings} onToggle={handleToggle} />}
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "transaction" && <TransactionSettings />}
        {activeTab === "payment" && <PaymentSettings />}
        {activeTab === "language" && <LanguageSettings />}
      </div>
    </div>
  );
};

// ============================================================================
// NOTIFICATION SETTINGS TAB
// ============================================================================
const NotificationSettings = ({ settings, onToggle }) => {
  return (
    <div className="settings-section">
      {/* Section Header */}
      <div className="section-header">
        <h2 className="section-title">Notification</h2>
        <p className="section-desc">
          Get notification what's happening right now, you can turn off at any time
        </p>
      </div>

      {/* Email Notification */}
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-item__content">
            <h3 className="setting-item__title">Email Notification</h3>
            <p className="setting-item__desc">
              Substance can send you email notification for any new direct messages.
            </p>
          </div>
          <Toggle checked={settings.emailNotification} onChange={() => onToggle("emailNotification")} />
        </div>

        {/* News and Update Setting */}
        <div className="setting-item setting-item--checkbox">
          <Checkbox
            checked={settings.newsAndUpdates}
            onChange={() => onToggle("newsAndUpdates")}
            label="News and Update Setting"
            description="The latest news about the latest , new leads, or significant changes in sales and marketing metrics."
          />
        </div>

        {/* Notification Channels */}
        <div className="setting-item setting-item--checkbox">
          <Checkbox
            checked={settings.notificationChannels}
            onChange={() => onToggle("notificationChannels")}
            label="Notification Channels"
            description="Choose preferred notification channels, including email, SMS, mobile app, or desktop notifications, to receive updates conveniently across different platforms."
          />
        </div>

        {/* Feedback Notifications */}
        <div className="setting-item setting-item--checkbox">
          <Checkbox
            checked={settings.feedbackNotifications}
            onChange={() => onToggle("feedbackNotifications")}
            label="Feedback Notifications"
            description="Receive notifications for customer feedback, reviews, or surveys to promptly address customer concerns, identify improvement opportunities, and maintain a positive brand reputation."
          />
        </div>
      </div>

      {/* More Activity */}
      <div className="setting-group">
        <div className="setting-item">
          <div className="setting-item__content">
            <h3 className="setting-item__title">More Activity</h3>
            <p className="setting-item__desc">
              Substance can send you email notification for any new direct messages.
            </p>
          </div>
          <Toggle checked={settings.moreActivity} onChange={() => onToggle("moreActivity")} />
        </div>

        {/* Integration Alerts */}
        <div className="setting-item setting-item--checkbox">
          <Checkbox
            checked={settings.integrationAlerts}
            onChange={() => onToggle("integrationAlerts")}
            label="Integration Alerts"
            description="Configure integration alerts with other tools or platforms used by the sales and marketing team, such as CRM systems, marketing automation platforms, or analytics tools, to receive cross-platform notifications."
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PLACEHOLDER TABS
// ============================================================================
const GeneralSettings = () => (
  <div className="settings-section">
    <div className="section-header">
      <h2 className="section-title">General</h2>
      <p className="section-desc">Manage your general account settings</p>
    </div>
    <div className="placeholder-content">
      <p>General settings content goes here</p>
    </div>
  </div>
);

const TransactionSettings = () => (
  <div className="settings-section">
    <div className="section-header">
      <h2 className="section-title">Transaction Report</h2>
      <p className="section-desc">View and manage your transaction reports</p>
    </div>
    <div className="placeholder-content">
      <p>Transaction report settings content goes here</p>
    </div>
  </div>
);

const PaymentSettings = () => (
  <div className="settings-section">
    <div className="section-header">
      <h2 className="section-title">Payment</h2>
      <p className="section-desc">Manage your payment methods and billing</p>
    </div>
    <div className="placeholder-content">
      <p>Payment settings content goes here</p>
    </div>
  </div>
);

const LanguageSettings = () => (
  <div className="settings-section">
    <div className="section-header">
      <h2 className="section-title">Language</h2>
      <p className="section-desc">Choose your preferred language</p>
    </div>
    <div className="placeholder-content">
      <p>Language settings content goes here</p>
    </div>
  </div>
);

// ============================================================================
// TOGGLE COMPONENT
// ============================================================================
const Toggle = ({ checked, onChange }) => (
  <div className="toggle" onClick={onChange}>
    <div className={`toggle__track ${checked ? "toggle__track--on" : ""}`}>
      <div className="toggle__thumb"></div>
    </div>
    <span className="toggle__label">{checked ? "On" : "Off"}</span>
  </div>
);

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================
const Checkbox = ({ checked, onChange, label, description }) => (
  <div className="checkbox-item">
    <div className="checkbox" onClick={onChange}>
      <div className={`checkbox__box ${checked ? "checkbox__box--checked" : ""}`}>
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
    <div className="checkbox-item__content">
      <h4 className="checkbox-item__title">{label}</h4>
      <p className="checkbox-item__desc">{description}</p>
    </div>
  </div>
);

export default SettingPageV1;