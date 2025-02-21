import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ArrowUpDown } from 'lucide-react';
import { Column } from '@tanstack/react-table';

interface DraggableColumnHeaderProps {
  column: Column<any, any>;
  title: string;
}

export const DraggableColumnHeader: React.FC<DraggableColumnHeaderProps> = ({
  column,
  title,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2"
      {...attributes}
    >
      <div
        {...listeners}
        className="cursor-move hover:text-yellow-500 transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <button
        className="flex items-center gap-1"
        onClick={() => column.toggleSorting()}
      >
        {title}
        <ArrowUpDown className="w-4 h-4" />
      </button>
    </div>
  );
};
