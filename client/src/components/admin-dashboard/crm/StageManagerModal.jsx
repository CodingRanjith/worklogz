import React, { useEffect, useState } from 'react';
import { FiX, FiPlus, FiArrowUp, FiArrowDown, FiTrash2, FiSave } from 'react-icons/fi';

const emptyStage = { name: '', color: '#6366f1', description: '' };

const StageManagerModal = ({
  isOpen,
  onClose,
  stages = [],
  pipelineType,
  onCreateStage,
  onUpdateStage,
  onDeleteStage,
  onReorderStages,
  busyStageId,
}) => {
  const [localStages, setLocalStages] = useState([]);
  const [newStage, setNewStage] = useState(emptyStage);
  const [isOrderDirty, setIsOrderDirty] = useState(false);

  useEffect(() => {
    setLocalStages(stages.map(stage => ({ ...stage })));
    setIsOrderDirty(false);
  }, [stages, isOpen]);

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= localStages.length) return;

    const updated = [...localStages];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setLocalStages(updated);
    setIsOrderDirty(true);
  };

  const handleStageChange = (id, field, value) => {
    setLocalStages(prev => prev.map(stage => (
      stage._id === id ? { ...stage, [field]: value } : stage
    )));
  };

  const handleStageBlur = (stage) => {
    if (!stage.name.trim()) return;
    if (stage.name === stages.find(item => item._id === stage._id)?.name && stage.color === stages.find(item => item._id === stage._id)?.color) {
      return;
    }
    onUpdateStage(stage._id, {
      name: stage.name.trim(),
      color: stage.color,
      description: stage.description,
    });
  };

  const handleAddStage = (e) => {
    e.preventDefault();
    if (!newStage.name.trim()) {
      return;
    }
    onCreateStage({ ...newStage, pipelineType });
    setNewStage(emptyStage);
  };

  const handleReorderSave = () => {
    if (!isOrderDirty) return;
    onReorderStages({
      pipelineType,
      stageOrder: localStages.map(stage => stage._id),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 py-6">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Manage Stages</h2>
            <p className="text-xs text-gray-500">Pipeline: {pipelineType === 'course' ? 'Course CRM' : 'Internship CRM'}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
            title="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-4 space-y-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Existing Stages</h3>
            {localStages.length === 0 && (
              <p className="text-sm text-gray-500">No stages yet. Add one below.</p>
            )}
            <div className="space-y-3">
              {localStages.map((stage, index) => (
                <div
                  key={stage._id}
                  className="flex flex-col rounded-xl border border-gray-200 bg-gray-50/80 p-4 shadow-sm md:flex-row md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMove(index, -1)}
                      className="rounded-md border border-gray-200 p-2 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 disabled:hover:text-gray-400"
                      disabled={index === 0}
                      title="Move up"
                    >
                      <FiArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      className="rounded-md border border-gray-200 p-2 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-30 disabled:hover:text-gray-400"
                      disabled={index === localStages.length - 1}
                      title="Move down"
                    >
                      <FiArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
                      <div>
                        <label className="text-xs font-medium text-gray-500">Stage Name</label>
                        <input
                          value={stage.name}
                          onChange={(e) => handleStageChange(stage._id, 'name', e.target.value)}
                          onBlur={() => handleStageBlur(stage)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">Colour</label>
                        <div className="mt-1 flex items-center gap-3">
                          <input
                            type="color"
                            value={stage.color || '#6366f1'}
                            onChange={(e) => {
                              handleStageChange(stage._id, 'color', e.target.value);
                              handleStageBlur({ ...stage, color: e.target.value });
                            }}
                            className="h-10 w-16 rounded border border-gray-200"
                          />
                          <span className="text-xs text-gray-500">{stage.color || '#6366f1'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Description</label>
                      <textarea
                        rows={2}
                        value={stage.description || ''}
                        onChange={(e) => handleStageChange(stage._id, 'description', e.target.value)}
                        onBlur={() => handleStageBlur(stage)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end md:mt-0">
                    <button
                      onClick={() => onDeleteStage(stage)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                      title="Delete stage"
                      disabled={busyStageId === stage._id}
                    >
                      <FiTrash2 className="mr-1 inline h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isOrderDirty && localStages.length > 1 && (
              <div className="flex justify-end">
                <button
                  onClick={handleReorderSave}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <FiSave className="h-4 w-4" />
                  Save Stage Order
                </button>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50/80 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Add New Stage</h3>
            <p className="text-xs text-gray-500">Create a new pipeline step and it will appear at the end of this pipeline.</p>
            <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_auto]" onSubmit={handleAddStage}>
              <input
                type="text"
                value={newStage.name}
                onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Stage name"
              />
              <input
                type="color"
                value={newStage.color}
                onChange={(e) => setNewStage(prev => ({ ...prev, color: e.target.value }))}
                className="h-11 w-full rounded border border-gray-200"
                title="Pick stage colour"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <FiPlus className="h-4 w-4" />
                Add Stage
              </button>
            </form>
          </section>
        </div>

        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StageManagerModal;
