import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Seo } from "@/components/seo/Seo";

export default function About() {
  return (
    <div className="space-y-4">
      <Seo title="About • AI Load Forecasting" description="About this mobile app and project inspiration." />
      <h1 className="sr-only">About</h1>
      <Card className="elevated-card">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            This app brings AI Load Forecasting to mobile with a clean, modern interface inspired by the web project.
            Explore forecasts, upload datasets, and learn more about the approach.
          </p>
          <p className="text-sm text-muted-foreground">
            Source inspiration: <a className="underline" href="https://github.com/Souvonik/AI_LOADFORECASTING" target="_blank" rel="noreferrer">AI_LOADFORECASTING</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
