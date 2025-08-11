import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Seo } from "@/components/seo/Seo";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <Seo title="Upload • AI Load Forecasting" description="Upload your CSV to generate forecasts on mobile." />
      <h1 className="sr-only">Upload CSV</h1>
      <Card className="elevated-card">
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button
            variant="hero"
            disabled={!file}
            onClick={() =>
              toast({ title: "Uploaded", description: file ? `${file.name} ready for forecasting` : "No file" })
            }
          >
            Process File
          </Button>
          {file && (
            <p className="text-sm text-muted-foreground">Selected: {file.name}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
