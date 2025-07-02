import { useState } from 'react';

import { ConfirmationDialog } from '@/components/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { IconLoader, IconCopy, IconCheck } from '@tabler/icons-react';

export interface ShareFileComponentProps {
  filename: string;
  fileId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ShareFileComponent(props: ShareFileComponentProps) {
  const { filename, fileId, open, setOpen } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [expirationDays, setExpirationDays] = useState('7');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateShare = () => {
    setIsLoading(true);
    console.log(
      'generate share for',
      fileId,
      'public:',
      isPublic,
      'expires:',
      expirationDays
    );

    // Mock API call
    setTimeout(() => {
      const mockUrl = `https://driveapp.com/share/${fileId}?expires=${expirationDays}`;
      setShareUrl(mockUrl);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <ConfirmationDialog
      title="Share File"
      description="Generate a shareable link for this file"
      message={
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">File to share</label>
            <div className="text-sm text-muted-foreground">
              <b>{filename}</b>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="public-share"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={isLoading}
              />
              <label htmlFor="public-share" className="text-sm font-medium">
                Public access (anyone with link can view)
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="expiration" className="text-sm font-medium">
              Link expiration (days)
            </label>
            <Input
              id="expiration"
              type="number"
              min="1"
              max="365"
              value={expirationDays}
              onChange={e => setExpirationDays(e.target.value)}
              placeholder="7"
              disabled={isLoading}
            />
          </div>

          {shareUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Share URL</label>
              <div className="flex space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  disabled={copied}
                >
                  {copied ? (
                    <IconCheck className="h-4 w-4" />
                  ) : (
                    <IconCopy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      confirm={
        <div className="flex space-x-2">
          {!shareUrl ? (
            <Button onClick={handleGenerateShare} disabled={isLoading}>
              {isLoading && <IconLoader className="animate-spin" />} Generate Link
            </Button>
          ) : (
            <Button onClick={() => setOpen(false)}>Done</Button>
          )}
        </div>
      }
      cancel={<Button variant="secondary">Cancel</Button>}
    />
  );
}
