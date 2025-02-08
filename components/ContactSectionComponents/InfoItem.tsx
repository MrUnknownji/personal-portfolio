import React from "react";
import { FiMail, FiPhone, FiMapPin, FiArrowRight } from "react-icons/fi";

interface InfoItemProps {
  type: string;
  title: string;
  value: string;
  onClick?: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case "email":
      return <FiMail className="w-6 h-6 text-primary" />;
    case "phone":
      return <FiPhone className="w-6 h-6 text-primary" />;
    case "location":
      return <FiMapPin className="w-6 h-6 text-primary" />;
    default:
      return null;
  }
};

const InfoItem: React.FC<InfoItemProps> = ({ type, title, value, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`info-item flex items-center space-x-4 p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 ${
        onClick
          ? "cursor-pointer hover:bg-gray-800/70 transition-colors duration-300"
          : ""
      }`}
    >
      {getIcon(type)}
      <div className="flex-1">
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-gray-400">{value}</p>
      </div>
      {onClick && <FiArrowRight className="w-5 h-5 text-primary" />}
    </div>
  );
};

export default InfoItem;
