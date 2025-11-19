import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Linkedin } from 'lucide-react';

interface LinkedInEmbedProps {
  title?: string;
  description?: string;
}

export function LinkedInEmbed({
  title = "Publicación Destacada",
  description = "Mi último trabajo sobre clasificación LCZ en CDMX"
}: LinkedInEmbedProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Linkedin className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex justify-center bg-gray-50 dark:bg-gray-800/50 py-6">
          <iframe
            src="https://www.linkedin.com/embed/feed/update/urn:li:share:7346257966334959617?collapsed=1"
            height="669"
            width="504"
            frameBorder="0"
            allowFullScreen={true}
            title="Embedded post"
            className="rounded-lg shadow-lg max-w-full"
            style={{ maxWidth: '100%' }}
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}
