import { Card, CardContent } from '@/components/ui/card';

export function LinkedInEmbed() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex justify-center bg-gray-50 dark:bg-gray-800/50 py-6">
          <iframe
            src="https://www.linkedin.com/embed/feed/update/urn:li:share:7346257966334959617?collapsed=1"
            height="669"
            width="504"
            frameBorder="0"
            allowFullScreen={true}
            title="LinkedIn post"
            className="rounded-lg shadow-lg max-w-full"
            style={{ maxWidth: '100%' }}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}
