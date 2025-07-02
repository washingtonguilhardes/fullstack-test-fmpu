# Artifact Cards - Grid View

This directory contains the components for displaying files in a grid view format, providing an alternative to the traditional table view.

## Components

### ArtifactCardComponent
A card component that displays individual file information in a visually appealing format.

**Features:**
- File type icons (folder, image, document, video, audio, archive, etc.)
- File size formatting
- Status and visibility badges
- Hover effects with action menu
- Responsive design

**Props:**
- `file: FileEntity` - The file entity to display

### ArtifactGridComponent
A grid layout component that arranges file cards in a responsive grid.

**Features:**
- Responsive grid layout (1-6 columns based on screen size)
- Empty state handling
- Consistent spacing and alignment

**Props:**
- `files: FileEntity[]` - Array of file entities to display

## Usage

The grid view is integrated into the main `ArtifactListComponent` and can be toggled using the view toggle buttons in the header.

### View Toggle
Users can switch between table and grid views using the toggle buttons:
- Table view: Traditional data table format
- Grid view: Card-based grid layout

### File Actions
Each card supports the following actions:
- Download
- Share
- Rename
- Delete

Actions are accessible through the dropdown menu that appears on hover.

## File Type Icons

The component automatically determines the appropriate icon based on file extension:

- **Folders**: Blue folder icon
- **Images** (jpg, jpeg, png, gif, svg, webp): Green photo icon
- **Documents** (pdf, doc, docx, txt): Red document icon
- **Videos** (mp4, avi, mov, wmv): Purple video icon
- **Audio** (mp3, wav, flac): Orange music icon
- **Archives** (zip, rar, 7z): Gray archive icon
- **Other files**: Gray file icon

## Responsive Design

The grid layout adapts to different screen sizes:
- Mobile (sm): 1-2 columns
- Tablet (md): 3 columns
- Desktop (lg): 4 columns
- Large desktop (xl): 5 columns
- Extra large (2xl): 6 columns

## Integration

The grid view is fully integrated with the existing file management system:
- Uses the same file actions components
- Maintains consistent state management
- Supports all existing functionality (upload, delete, rename, etc.)
