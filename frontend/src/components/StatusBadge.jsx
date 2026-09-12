import React from 'react';

export const StatusBadge = ({ status, text, className = '' }) => {
  const getBadgeStyle = (statusVal) => {
    switch (statusVal) {
      case 'booked':
        return 'badge-amber-light border border-amber-300';
      case 'checked_in':
        return 'bg-amber-200 text-amber-950 border border-amber-400';
      case 'in_inspection':
        return 'badge-red-light border border-red-300 animate-pulse';
      case 'weighment_completed':
        return 'badge-green-light border border-green-300';
      case 'completed':
      case 'paid':
      case 'processed':
        return 'bg-gov-green text-white';
      case 'approved':
        return 'badge-red-light border border-red-300';
      case 'pending_approval':
      case 'pending':
        return 'badge-amber-light border border-amber-300';
      case 'cancelled':
      case 'failed':
        return 'bg-gov-gray text-gov-muted border border-gov-border';
      default:
        return 'badge-red-light border border-red-200';
    }
  };

  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-heading inline-flex items-center space-x-1 ${getBadgeStyle(
        status
      )} ${className}`}
    >
      <span>{text || status}</span>
    </span>
  );
};

export default StatusBadge;
