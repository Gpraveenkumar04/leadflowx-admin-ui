import React from 'react';

interface BulkActionsProps {
  selectedItems: string[];
  onApprove: () => void;
  onReject: () => void;
  onReassign: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedItems, onApprove, onReject, onReassign }) => (
  <div className="bulk-actions">
    <p className="text-sm text-gray-500">Selected Items: {selectedItems.length}</p>
    <div className="flex space-x-4 mt-2">
      <button className="btn btn-success" onClick={onApprove} disabled={selectedItems.length === 0}>
        Approve
      </button>
      <button className="btn btn-danger" onClick={onReject} disabled={selectedItems.length === 0}>
        Reject
      </button>
      <button className="btn btn-primary" onClick={onReassign} disabled={selectedItems.length === 0}>
        Reassign
      </button>
    </div>
  </div>
);

export default BulkActions;
