# Shared Components and Context System

This directory contains reusable components and a shared context system for file management operations.

## Components

### FileIconComponent
A reusable component that displays appropriate icons for different file types.

**Features:**
- Automatic icon selection based on file extension
- Multiple size options (sm, md, lg)
- Consistent color coding for different file types
- Support for folders and various file formats

**Props:**
- `file: FileEntity` - The file entity to display an icon for
- `size?: 'sm' | 'md' | 'lg'` - Icon size (default: 'md')
- `className?: string` - Additional CSS classes

**File Type Icons:**
- **Folders**: Blue folder icon
- **Images**: Green photo icon (jpg, jpeg, png, gif, svg, webp, bmp, tiff)
- **Documents**: Red document icon (pdf, doc, docx, txt, rtf, odt)
- **Videos**: Purple video icon (mp4, avi, mov, wmv, flv, webm, mkv)
- **Audio**: Orange music icon (mp3, wav, flac, aac, ogg, m4a)
- **Archives**: Gray archive icon (zip, rar, 7z, tar, gz, bz2)
- **Other files**: Gray file icon

### FileActionsDropdownComponent
A reusable dropdown component for file actions that integrates with the shared context.

**Features:**
- Consistent action menu across all views
- Integration with FileActionContext
- Hover effects support
- All standard file operations

**Props:**
- `file: FileEntity` - The file to perform actions on
- `className?: string` - Additional CSS classes
- `showOnHover?: boolean` - Whether to show on hover (default: false)

**Actions:**
- Download
- Share
- Rename
- Move
- Delete

## Context System

### FileActionContext
A React context that manages file actions across the entire application.

**Features:**
- Centralized state management for file actions
- Support for all file operations
- Consistent dialog handling
- Action execution tracking

**Context Value:**
- `selectedFile: FileEntity | null` - Currently selected file
- `currentAction: FileAction | null` - Current action being performed
- `isActionOpen: boolean` - Whether an action dialog is open
- `openAction: (action: FileAction, file: FileEntity) => void` - Open an action dialog
- `closeAction: () => void` - Close the current action dialog
- `executeAction: (action: FileAction, file: FileEntity) => void` - Execute an action

### FileAction Enum
Defines all available file actions:
- `RENAME` - Rename a file
- `MOVE` - Move a file to another location
- `SHARE` - Share a file
- `DELETE` - Delete a file
- `DOWNLOAD` - Download a file

## Usage

### Basic Usage
```tsx
import { FileIconComponent, FileActionsDropdownComponent } from '../shared';
import { useFileActions } from '../file-actions/file-actions.context';

function MyComponent({ file }) {
  return (
    <div>
      <FileIconComponent file={file} size="lg" />
      <FileActionsDropdownComponent file={file} showOnHover={true} />
    </div>
  );
}
```

### With Context Provider
```tsx
import { FileActionProvider } from '../file-actions/file-actions.context';

function App() {
  return (
    <FileActionProvider>
      <MyFileList />
    </FileActionProvider>
  );
}
```

### Using Actions in Components
```tsx
import { useFileActions, FileAction } from '../file-actions/file-actions.context';

function MyComponent({ file }) {
  const { openAction } = useFileActions();

  const handleRename = () => {
    openAction(FileAction.RENAME, file);
  };

  return <button onClick={handleRename}>Rename</button>;
}
```

## Integration

The shared components and context system are integrated throughout the file management interface:

1. **Table View**: Uses FileIconComponent in trigger cells and FileActionsDropdownComponent in action columns
2. **Grid View**: Uses both components in artifact cards
3. **Consistent Actions**: All file operations go through the same context system
4. **Dialog Management**: Centralized dialog handling for all file actions

## Benefits

- **Consistency**: Same icons and actions across all views
- **Maintainability**: Single source of truth for file operations
- **Reusability**: Components can be used in any view
- **Scalability**: Easy to add new actions or modify existing ones
- **Type Safety**: Full TypeScript support with proper typing
