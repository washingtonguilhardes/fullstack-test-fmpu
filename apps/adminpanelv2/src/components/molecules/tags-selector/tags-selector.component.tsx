'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { IBadgeInputDto, IBadgeOutputDto } from '@driveapp/contracts/dtos';

import { Chip } from '@/components/atoms/chip/chip.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateBadge, useSearchBadgesQuery } from '@/graphql/badges';
import { cn } from '@/lib/utils';
import { debounce } from '@mui/material';
import Popover from '@mui/material/Popover';
import {
  IconArrowLeft,
  IconCheck,
  IconLoader,
  IconPlus,
  IconX,
} from '@tabler/icons-react';

interface TagsSelectorProps {
  title: string;
  description: string;
  tags?: IBadgeOutputDto[];
  onTagsChange?: (tags: IBadgeOutputDto[]) => void;
}

const colors = [
  ['red-300', '#374151'],
  ['orange-300', '#3F83F8'],
  ['amber-300', '#0E9F6E'],
  ['emerald-300', '#FACA15'],
  ['blue-300', '#6875F5'],
  ['indigo-300', '#6875F5'],
  ['purple-300', '#7E3AF2'],
  ['pink-300', '#F17EB8'],
];

const TagSelectorItem = ({
  tag,
  isSelected = false,
  onAddTag,
  onRemoveTag,
  className,
}: {
  tag: string;
  isSelected?: boolean;
  onAddTag: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  className?: string;
}) => {
  return (
    <div
      key={tag}
      className={cn(
        'flex gap-2 items-center border-2 border-gray-300 rounded-xl px-2 py-1 cursor-pointer transition-all duration-300 w-full opacity-80',
        isSelected ? 'border-green-500 opacity-100' : 'border-gray-300',
        className,
      )}
      onClick={() => (isSelected ? onRemoveTag?.(tag) : onAddTag(tag))}
    >
      <span>
        {isSelected ? (
          <IconCheck size={16} className="text-green-500" />
        ) : (
          <IconPlus size={16} />
        )}
      </span>
      <span>{tag}</span>
    </div>
  );
};

function NewTagForm(props: { onAddTag: (tag: IBadgeOutputDto) => void }) {
  const { onAddTag } = props;
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      newTag: '',
      newTagColor: '',
    },
  });

  const { createBadgeCall, loading, error } = useCreateBadge();

  const onSubmit = async (data: any) => {
    const badge: IBadgeInputDto = {
      text: data.newTag,
      color: data.newTagColor,
    };
    const result = await createBadgeCall({
      variables: {
        badge,
      },
    });
    onAddTag({
      guid: result.data?.createBadge ?? '',
      text: badge.text,
      color: badge.color,
    });
  };

  const newTagColor = watch('newTagColor');

  React.useEffect(() => {
    if (!newTagColor) {
      setValue('newTagColor', colors[0]?.[0] ?? '');
    }
  }, [newTagColor]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mb-4 ">
        <input type="hidden" name="newTagColor" value={newTagColor} />
        {colors.map(([name = '', hex = '']) => {
          const isSelected = newTagColor === name;
          return (
            <label
              key={`color-${name}`}
              className={cn(
                'group flex gap-2 items-center justify-center cursor-pointer rounded-md px-2 py-1 opacity-70 hover:opacity-100 transition-all duration-300 w-full h-[48px]',
                `bg-[var(--color-${name})]`,
                isSelected && 'opacity-100',
              )}
              style={{
                backgroundColor: `var(--color-${name})`,
                color: `var(--color-${name?.replace('300', '900')})`,
                border: `1px solid  currentColor`,
              }}
              role="button"
              onClick={() => setValue('newTagColor', name)}
              tabIndex={0}
            >
              <div
                key={`color-${name}`}
                className="w-4 h-4  rounded-full size-8 transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? 'currentColor' : `rgba(0, 0, 0, 0.2)`,
                }}
              />
              {isSelected ? (
                <input
                  type="text"
                  placeholder="New tag name"
                  className="w-full h-full border-none outline-none bg-accent/10 rounded-md p-2"
                  required
                  {...register('newTag')}
                  onFocus={e =>
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                />
              ) : (
                <span className="w-full flex items-center justify-center text-xs  h-[48px]" />
              )}
            </label>
          );
        })}
      </div>
      {error && (
        <div className="text-red-500 text-center max-w-[200px] mx-auto overflow-hidden mb-[10px]">
          {error.message}
        </div>
      )}

      <Button
        type="submit"
        className="w-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed data-[loading=true]:opacity-50 data-[loading=true]:cursor-alias"
        disabled={loading}
        data-loading={loading}
      >
        Create new tag
        {loading && <IconLoader size={16} className="animate-spin text-white" />}
      </Button>
    </form>
  );
}

function AddNewTagForm(props: {
  onNewTags: (tags: IBadgeOutputDto[]) => void;
  currentTags: IBadgeOutputDto[];
}) {
  const { onNewTags, currentTags } = props;
  const { badges, loading, handleFilterChange } = useSearchBadgesQuery();

  const [selectedBadges, setSelectedBadges] = useState<IBadgeOutputDto[]>(currentTags);
  const [addingNewTag, setAddingNewTag] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAddingNewTag(false);
    setSelectedBadges([]);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const debounceSearch = useCallback(
    debounce((value: string) => {
      handleFilterChange('text', value);
    }, 1000),
    [],
  );

  const onRemoveTag = (tag: IBadgeOutputDto) => {
    setSelectedBadges(v => v.filter(t => t.guid !== tag.guid));
  };

  const onAddTag = (tag: IBadgeOutputDto) => {
    setSelectedBadges(v => [...v.filter(t => t.guid !== tag.guid), tag]);
  };

  return (
    <>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        variant="outline"
        className="rounded-full border-dotted border-2 border-gray-300"
      >
        <IconPlus size={16} />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{ overflow: 'hidden' }}
      >
        <div className="w-full h-full flex justify-between items-center p-2 ">
          <div className="flex gap-2 items-center">
            {addingNewTag && (
              <Button variant="ghost" onClick={() => setAddingNewTag(false)}>
                <IconArrowLeft size={16} />
              </Button>
            )}
          </div>
          <Button variant="ghost" onClick={handleClose}>
            <IconX size={16} />
          </Button>
        </div>
        <AnimatePresence mode="wait">
          {!addingNewTag && (
            <motion.div
              className="flex flex-col gap-2 p-4  min-w-[300px] min-h-[300px]"
              initial="enter"
              animate="enter"
              exit="exit"
              variants={{
                hidden: { opacity: 0, x: -100, y: 0 },
                enter: { opacity: 1, x: 0, y: 0 },
                exit: { opacity: 0, x: -100, y: 0 },
              }}
              transition={{ type: 'linear' }}
              key="tab-selector"
            >
              <div className="flex  gap-2 items-center relative">
                <AnimatePresence mode="sync">
                  <Input
                    className="mb-3 flex-1"
                    placeholder="Search for a tag "
                    onChange={e => debounceSearch(e.target.value)}
                    disabled={loading}
                    onBlur={e => {
                      if (!e.target.value) return;
                      e.target.value = '';
                    }}
                  />
                  {loading && (
                    <motion.div className="flex justify-center items-center absolute right-[8px] top-[6px]">
                      <IconLoader size={24} className="animate-spin text-gray-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-2 flex-wrap max-w-2xs mb-2 overflow-y-auto max-h-70 min-h-20">
                {badges.data.map(badge => (
                  <TagSelectorItem
                    tag={badge.text}
                    isSelected={selectedBadges.map(b => b.guid).includes(badge.guid)}
                    onAddTag={() => onAddTag(badge)}
                    onRemoveTag={() => onRemoveTag(badge)}
                    key={`select-${badge.guid}`}
                  />
                ))}
              </div>
              <div className="flex gap-2 flex-wrap max-w-2xs mb-2">
                <TagSelectorItem
                  tag="Add new tag"
                  isSelected={false}
                  onAddTag={() => setAddingNewTag(true)}
                  className={cn(
                    'border-2 border-dotted border-gray-300 rounded-md px-2 py-1 cursor-pointer',
                    'transition-all duration-300 w-full opacity-80 mb-4',
                    'hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:opacity-100',
                  )}
                />
                {selectedBadges.map(tag => (
                  <Chip
                    key={tag.guid}
                    label={tag.text}
                    onDelete={() => onRemoveTag(tag)}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  disabled={!selectedBadges.length}
                  onClick={() => {
                    setAnchorEl(null);
                    setSelectedBadges([]);
                    onNewTags(selectedBadges);
                  }}
                  className="w-full"
                >
                  Add selected tags
                </Button>
              </div>
            </motion.div>
          )}
          {addingNewTag && (
            <motion.div
              className="flex flex-col gap-2 p-4 min-w-[300px] min-h-[300px]"
              initial="hidden"
              animate="enter"
              exit="exit"
              variants={{
                hidden: { opacity: 0, x: 100, y: 0 },
                enter: { opacity: 1, x: 0, y: 0 },
                exit: { opacity: 0, x: 100, y: 0 },
              }}
              transition={{ type: 'linear' }}
              key="new-tag"
            >
              <NewTagForm
                onAddTag={tag => {
                  setSelectedBadges(v => [tag, ...v]);
                  setAddingNewTag(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Popover>
    </>
  );
}

export function TagsSelector(props: TagsSelectorProps) {
  const { title, description, tags = [], onTagsChange } = props;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm text-gray-500">{description}</div>
      <div className="flex gap-2 items-start">
        <AddNewTagForm
          currentTags={tags}
          onNewTags={newTags => {
            onTagsChange?.([...tags, ...newTags]);
          }}
        />
        <div className="flex-4 flex gap-2 flex-wrap">
          {tags.map(tag => (
            <Chip
              key={`preview-${tag.guid}`}
              label={tag.text}
              onDelete={() => {
                onTagsChange?.(tags.filter(t => t.guid !== tag.guid));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
