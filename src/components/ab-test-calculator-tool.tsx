"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FlaskConical, BarChart2, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

// Abramowitz & Stegun normal CDF approximation (error < 7.5e-8)
function normCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422820 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.319381530 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - p : p;
}

const CONFIDENCE_LEVELS = [
  { label: "90%", value: 0.9, zCritical: 1.645 },
  { label: "95%", value: 0.95, zCritical: 1.96 },
  { label: "99%", value: 0.99, zCritical: 2.576 },
] as const;

interface TestResult {
  controlRate: number;
  variantRate: number;
  relativeLift: number;
  zScore: number;
  pValue: number;
  isSignificant: boolean;
  confidenceLevel: number;
  evidenceStrength: "Strong" | "Moderate" | "Weak";
}

function toInt(val: string) {
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

export function AbTestCalculatorTool() {
  const [controlVisitors, setControlVisitors] = useState("1000");
  const [controlConversions, setControlConversions] = useState("50");
  const [variantVisitors, setVariantVisitors] = useState("1000");
  const [variantConversions, setVariantConversions] = useState("65");
  const [confidence, setConfidence] = useState<0.9 | 0.95 | 0.99>(0.95);
  const [result, setResult] = useState<TestResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const reset = useCallback(() => {
    setControlVisitors("1000");
    setControlConversions("50");
    setVariantVisitors("1000");
    setVariantConversions("65");
    setConfidence(0.95);
    setResult(null);
    setErrors([]);
  }, []);

  const calculate = useCallback(() => {
    const n1 = toInt(controlVisitors);
    const c1 = toInt(controlConversions);
    const n2 = toInt(variantVisitors);
    const c2 = toInt(variantConversions);

    const errs: string[] = [];
    if (n1 === null || n1 <= 0) errs.push("Control visitors must be a positive integer.");
    if (c1 === null || c1 < 0) errs.push("Control conversions must be 0 or greater.");
    if (n2 === null || n2 <= 0) errs.push("Variant visitors must be a positive integer.");
    if (c2 === null || c2 < 0) errs.push("Variant conversions must be 0 or greater.");
    if (n1 !== null && c1 !== null && c1 > n1)
      errs.push("Control conversions cannot exceed control visitors.");
    if (n2 !== null && c2 !== null && c2 > n2)
      errs.push("Variant conversions cannot exceed variant visitors.");

    if (errs.length > 0) {
      setErrors(errs);
      setResult(null);
      return;
    }

    setErrors([]);

    const p1 = c1! / n1!;
    const p2 = c2! / n2!;
    const pooledP = (c1! + c2!) / (n1! + n2!);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1! + 1 / n2!));
    const zScore = se === 0 ? 0 : (p2 - p1) / se;
    const pValue = 2 * (1 - normCDF(Math.abs(zScore)));
    const relativeLift = p1 === 0 ? 0 : ((p2 - p1) / p1) * 100;

    const level = CONFIDENCE_LEVELS.find((l) => l.value === confidence)!;
    const absZ = Math.abs(zScore);
    const isSignificant = absZ >= level.zCritical;
    const evidenceStrength: "Strong" | "Moderate" | "Weak" =
      absZ >= level.zCritical
        ? "Strong"
        : absZ >= level.zCritical * 0.75
        ? "Moderate"
        : "Weak";

    ToolEvents.toolUsed("calculate");

    setResult({
      controlRate: p1 * 100,
      variantRate: p2 * 100,
      relativeLift,
      zScore,
      pValue,
      isSignificant,
      confidenceLevel: confidence * 100,
      evidenceStrength,
    });
  }, [controlVisitors, controlConversions, variantVisitors, variantConversions, confidence]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Card */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FlaskConical className="h-5 w-5 text-brand" />
            Enter Experiment Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control + Variant inputs */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Control */}
            <div className="space-y-3 p-4 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-brand/30 text-brand bg-brand/10 text-xs"
                >
                  Control
                </Badge>
                <span className="text-xs text-muted-foreground">Original version</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Visitors</label>
                <Input
                  type="number"
                  min="1"
                  value={controlVisitors}
                  onChange={(e) => setControlVisitors(e.target.value)}
                  placeholder="e.g. 1000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Conversions</label>
                <Input
                  type="number"
                  min="0"
                  value={controlConversions}
                  onChange={(e) => setControlConversions(e.target.value)}
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            {/* Variant */}
            <div className="space-y-3 p-4 rounded-xl border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-brand-accent/30 text-brand-accent bg-brand-accent/10 text-xs"
                >
                  Variant
                </Badge>
                <span className="text-xs text-muted-foreground">Test version</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Visitors</label>
                <Input
                  type="number"
                  min="1"
                  value={variantVisitors}
                  onChange={(e) => setVariantVisitors(e.target.value)}
                  placeholder="e.g. 1000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Conversions</label>
                <Input
                  type="number"
                  min="0"
                  value={variantConversions}
                  onChange={(e) => setVariantConversions(e.target.value)}
                  placeholder="e.g. 65"
                />
              </div>
            </div>
          </div>

          {/* Confidence Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Confidence Level</label>
            <div className="flex gap-2">
              {CONFIDENCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setConfidence(level.value)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    confidence === level.value
                      ? "bg-brand text-white border-brand shadow-sm shadow-brand/25"
                      : "border-border/50 bg-muted/20 hover:border-brand/40 hover:text-brand"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive space-y-1">
              {errors.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={calculate}
              size="lg"
              className="flex-1 bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/25 text-base"
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Calculate Significance
            </Button>
            <Button
              onClick={reset}
              size="lg"
              variant="outline"
              className="px-4"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Verdict Banner */}
          <div
            className={`rounded-2xl p-5 border ${
              result.isSignificant
                ? "bg-brand/10 border-brand/30"
                : "bg-muted/40 border-border/50"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.isSignificant ? (
                <CheckCircle2 className="h-6 w-6 text-brand mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <div>
                <h3 className="text-lg font-bold">
                  {result.isSignificant
                    ? `Statistically Significant — ${result.confidenceLevel}% Confidence`
                    : `Not Statistically Significant at ${result.confidenceLevel}% Confidence`}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.isSignificant
                    ? `The difference between control and variant is real with ${result.confidenceLevel}% confidence. You can safely ship the variant.`
                    : `The observed difference could be due to chance. Collect more data before making a decision.`}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Control CVR" value={`${result.controlRate.toFixed(2)}%`} icon="🎯" />
            <MetricCard
              label="Variant CVR"
              value={`${result.variantRate.toFixed(2)}%`}
              icon="🚀"
              highlight={result.relativeLift > 0}
            />
            <MetricCard
              label="Relative Lift"
              value={`${result.relativeLift >= 0 ? "+" : ""}${result.relativeLift.toFixed(1)}%`}
              icon={result.relativeLift >= 0 ? "📈" : "📉"}
              highlight={result.relativeLift > 0}
            />
            <MetricCard
              label="P-Value"
              value={result.pValue < 0.001 ? "<0.001" : result.pValue.toFixed(4)}
              icon="🔬"
              highlight={result.isSignificant}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <MetricCard label="Z-Score" value={result.zScore.toFixed(4)} icon="📊" large />
            <MetricCard
              label="Evidence Strength"
              value={result.evidenceStrength}
              icon={
                result.evidenceStrength === "Strong"
                  ? "💪"
                  : result.evidenceStrength === "Moderate"
                  ? "⚡"
                  : "🌱"
              }
              large
              highlight={result.evidenceStrength === "Strong"}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  highlight,
  large,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border text-center transition-colors ${
        highlight ? "bg-brand/10 border-brand/30" : "bg-muted/30 border-border/50"
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div
        className={`font-bold mb-1 ${large ? "text-2xl" : "text-lg"} ${
          highlight ? "text-brand" : ""
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
