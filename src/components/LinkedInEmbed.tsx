import { useEffect } from 'react';
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
  useEffect(() => {
    // Load LinkedIn embed script
    const script = document.createElement('script');
    script.src = 'https://platform.linkedin.com/in.js';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Linkedin className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="linkedin-embed-wrapper">
          <iframe
            src="https://www.linkedin.com/embed/feed/update/urn:li:share:7346257967697866752"
            height="600"
            width="100%"
            frameBorder="0"
            allowFullScreen={true}
            title="Embedded post"
            className="rounded-lg"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}
