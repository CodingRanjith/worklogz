import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { FiPlus, FiEdit2 } from 'react-icons/fi';
import LeadCard from './LeadCard';

const StageColumn = ({
  stage,
  leads,
  onAddLead,
  onEditLead,
  onEditStage,
}) => {
  return (
    <div className="flex-shrink-0 w-72 sm:w-80 h-full">
      <div className="flex flex-col h-full">
        <div
          className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
          style={{ borderTopColor: stage.color || '#6366f1', borderTopWidth: 4 }}
        >
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
            <p className="text-xs text-gray-500">{leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddLead(stage)}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              <FiPlus className="w-3.5 h-3.5" />
              Add
            </button>
            <button
              onClick={() => onEditStage(stage)}
              className="rounded-md p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
              title="Edit stage"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Droppable droppableId={stage._id} type="lead">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 min-h-[120px] space-y-2 rounded-xl border border-dashed ${snapshot.isDraggingOver ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200 bg-gray-50'} p-2 pt-3 transition overflow-y-auto`}
            >
              {leads.map((lead, index) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  index={index}
                  onEdit={onEditLead}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default StageColumn;
