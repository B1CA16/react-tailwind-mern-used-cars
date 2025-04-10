import React from 'react';
import { FaWrench, FaLightbulb, FaClipboardCheck } from 'react-icons/fa';
import TipCard from './TipCard';

const TipsAndMaintenance = () => {
  const tips = [
    {
      icon: <FaClipboardCheck size={24} className="text-yellow-400" />,
      title: 'How to Choose the Right Car',
      description: 'Consider your needs, budget, and research different makes and models. Always check the vehicle’s history and get a pre-purchase inspection if possible.',
    },
    {
      icon: <FaWrench size={24} className="text-yellow-400" />,
      title: 'Car Maintenance Tips',
      description: 'Keep your car in top shape with regular oil changes, brake checks, and tire rotations. Preventive maintenance can save you from costly repairs down the line.',
    },
    {
      icon: <FaLightbulb size={24} className="text-yellow-400" />,
      title: 'Negotiation Tips',
      description: 'Research the market value of the car you’re interested in before negotiating. Be prepared to discuss all aspects of the sale, including any additional costs.',
    },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto px-6 sm:px-16">
        <h2 className="text-3xl font-bold text-center mb-8">Car Buying and Maintenance Tips</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {tips.map((tip, index) => (
            <TipCard key={index} tip={tip} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TipsAndMaintenance;
