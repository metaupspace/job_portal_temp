'use client'
import React, { useState } from 'react';
import Tag from './Tag';

interface TagData {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary';
}

interface TagContainerProps {
  tags?: TagData[];
  allowMultiple?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  className?: string;
}

const TagContainer: React.FC<TagContainerProps> = ({
  tags = [
    { id: 'uiux', label: 'UI/UX Design' ,variant: 'primary' },
    { id: 'web', label: 'Website Development', variant: 'secondary' },
    { id: 'mobile', label: 'Mobile App' ,variant: 'secondary' },
    { id: 'automation', label: 'Automation', variant: 'secondary' },
    { id: 'Custom', label: 'Custom Software', variant: 'secondary' },
  ],
  allowMultiple = true,
  onSelectionChange,
  className = ''
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(['uiux']); // Default healthcare selected

  const handleTagClick = (tagId: string) => {
    let newSelection: string[];

    if (allowMultiple) {
      // Multiple selection mode
      if (selectedTags.includes(tagId)) {
        newSelection = selectedTags.filter(id => id !== tagId);
      } else {
        newSelection = [...selectedTags, tagId];
      }
    } else {
      // Single selection mode
      newSelection = [tagId];
    }

    setSelectedTags(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.id);
        const variant = isSelected ? 'primary' : 'secondary';
        
        return (
          <Tag
            key={tag.id}
            variant={variant}
            onClick={() => handleTagClick(tag.id)}
            className="select-none"
          >
            {tag.label}
          </Tag>
        );
      })}
    </div>
  );
};

export default TagContainer;
