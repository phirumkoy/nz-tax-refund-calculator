import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateTaxDue,
  calculateIETC,
  getIETCMessage,
} from "@/lib/taxCalculations";

interface Results {
  taxDue: number;
  taxDeducted: number;
  resultExclIETC: number;
  ietc: number;
  finalResult: number;
  ietcMessage: string | null;
}

const formatCurrency = (value: number): string =>
  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parseCurrencyInput = (value: string): string =>
  value.replace(/[^0-9.]/g, "");

const Index = () => {
  const [grossIncome, setGrossIncome] = useState("");
  const [taxDeducted, setTaxDeducted] = useState("");
  const [includeIETC, setIncludeIETC] = useState(false);
  const [monthsEligible, setMonthsEligible] = useState("12");
  const [receivedBenefit, setReceivedBenefit] = useState(false);
  const [receivedWfF, setReceivedWfF] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const handleCalculate = () => {
    const income = parseFloat(parseCurrencyInput(grossIncome)) || 0;
    const deducted = parseFloat(parseCurrencyInput(taxDeducted)) || 0;
    const months = Math.min(12, Math.max(0, parseInt(monthsEligible) || 0));

    const taxDue = calculateTaxDue(income);
    const resultExclIETC = Math.round((deducted - taxDue) * 100) / 100;
    const disqualified = receivedBenefit || receivedWfF;
    const ietc = includeIETC && !disqualified ? calculateIETC(income, months) : 0;
    const finalResult = Math.round((resultExclIETC + ietc) * 100) / 100;
    const ietcMessage = disqualified && includeIETC
      ? "IETC does not apply - see checked reason above."
      : getIETCMessage(income, months, includeIETC);

    setResults({ taxDue, taxDeducted: deducted, resultExclIETC, ietc, finalResult, ietcMessage });
  };

  const handleReset = () => {
    setGrossIncome("");
    setTaxDeducted("");
    setIncludeIETC(false);
    setMonthsEligible("12");
    setReceivedBenefit(false);
    setReceivedWfF(false);
    setResults(null);
  };

  const isRefund = results && results.finalResult >= 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            NZ Tax Refund Estimate Calculator (FY25/26)
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            NZ Tax Year: 1 April 2025 – 31 March 2026
          </p>
        </header>

        {/* Calculator Card */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Enter Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Gross Income */}
            <div className="space-y-2">
              <Label htmlFor="gross-income" className="text-sm font-medium">
                Total Gross Income (NZD)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                  $
                </span>
                <Input
                  id="gross-income"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(parseCurrencyInput(e.target.value))}
                  className="h-12 pl-8 text-lg"
                />
              </div>
            </div>

            {/* Tax Deducted */}
            <div className="space-y-2">
              <Label htmlFor="tax-deducted" className="text-sm font-medium">
                Total Tax Deducted (NZD)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                  $
                </span>
                <Input
                  id="tax-deducted"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={taxDeducted}
                  onChange={(e) => setTaxDeducted(parseCurrencyInput(e.target.value))}
                  className="h-12 pl-8 text-lg"
                />
              </div>
            </div>

            {/* IETC Section */}
            <div className="space-y-3">
              {/* Include IETC checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ietc"
                  checked={includeIETC}
                  onCheckedChange={(checked) => setIncludeIETC(checked === true)}
                  disabled={receivedBenefit || receivedWfF}
                />
                <Label htmlFor="ietc" className="text-sm cursor-pointer">
                  Include IETC (if eligible based on conditions below)
                </Label>
              </div>

              {/* Disqualifier checkboxes */}
              <div className="ml-6 space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="received-benefit"
                    checked={receivedBenefit}
                    onCheckedChange={(checked) => {
                      setReceivedBenefit(checked === true);
                      if (checked) setIncludeIETC(false);
                    }}
                    className="mt-0.5"
                  />
                  <Label htmlFor="received-benefit" className="text-sm cursor-pointer leading-snug">
                    I received a main benefit (e.g. Jobseeker, Supported Living) this tax year
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="received-wff"
                    checked={receivedWfF}
                    onCheckedChange={(checked) => {
                      setReceivedWfF(checked === true);
                      if (checked) setIncludeIETC(false);
                    }}
                    className="mt-0.5"
                  />
                  <Label htmlFor="received-wff" className="text-sm cursor-pointer leading-snug">
                    I or my partner received Working for Families tax credits this tax year
                  </Label>
                </div>
              </div>

              {(receivedBenefit || receivedWfF) && (
                <p className="ml-6 text-xs text-muted-foreground">
                  IETC has been excluded based on your selections above.
                </p>
              )}

              {/* IRD eligibility link */}
              <a
                href="https://www.ird.govt.nz/income-tax/income-tax-for-individuals/individual-tax-credits/independent-earner-tax-credit-ietc"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-6 inline-block text-xs text-muted-foreground underline"
              >
                Not sure if you're eligible? Check on the IRD website →
              </a>

              {includeIETC && (
                <div className="ml-6 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Note: If you were on the ME tax code, your IETC may have already been included in your take-home pay during the year.
                  </p>
                  <Label htmlFor="months" className="text-sm font-medium">
                    Months eligible for IETC (0–12)
                  </Label>
                  <Select
                    value={monthsEligible}
                    onValueChange={(value) => setMonthsEligible(value)}
                  >
                    <SelectTrigger className="h-10 w-full sm:w-32">
                      <SelectValue placeholder="Select months" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 13 }, (_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    IRD may pro-rate IETC based on the number of months you were
                    eligible during the tax year.
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleCalculate} className="flex-1">
                Calculate
              </Button>
              <Button onClick={handleReset} variant="secondary" className="flex-1">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="mb-6 space-y-4">
            <Card className="shadow-sm">
              <CardContent className="space-y-3 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax Due on Income</span>
                  <span className="font-medium">${formatCurrency(results.taxDue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Tax Deducted</span>
                  <span className="font-medium">${formatCurrency(results.taxDeducted)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-3">
                  <span className="text-muted-foreground">Result (excluding IETC)</span>
                  <span className="font-medium">
                    {results.resultExclIETC >= 0 ? "" : "-"}${formatCurrency(Math.abs(results.resultExclIETC))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`shadow-sm border-2 ${
                isRefund
                  ? "border-green-600/30 bg-green-50"
                  : "border-red-400/30 bg-red-50"
              }`}
            >
              <CardContent className="py-6 text-center">
                <p className={`text-sm font-medium ${isRefund ? "text-green-700" : "text-red-700"}`}>
                  {isRefund ? "Estimated Refund" : "Estimated Tax to Pay"}
                </p>
                <p className={`mt-1 text-3xl font-bold ${isRefund ? "text-green-700" : "text-red-700"}`}>
                  ${formatCurrency(Math.abs(results.finalResult))}
                </p>
                {results.ietcMessage && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {results.ietcMessage}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  {isRefund
                    ? "This refund will be automatically credited to your bank account linked to MyIR."
                    : "IRD will notify you of the amount owing and how to make payment."}
                </p>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
              Estimate only – final amount confirmed by IRD after assessment.
            </p>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Get a full breakdown of your pay, deductions &amp; real hourly rate
              </p>
              <a
                href="https://stan.store/bingosandco"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-4"
              >
                👉 Get your full pay breakdown with the NZ Pay Simulator →
              </a>
            </div>

            {results.ietcMessage && (
              <p className="text-center text-xs text-muted-foreground">
                {results.ietcMessage}
              </p>
            )}
          </div>
        )}

        {/* Accordions */}
        <Accordion type="multiple" className="space-y-3">
          <AccordionItem value="good-to-know" className="rounded-lg border bg-card shadow-sm px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Good to Know
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>This is an estimate only – your final result is calculated by IRD.</p>
              <p>
                Final results may differ due to IRD adjustments, including KiwiSaver
                contributions, PIE income, interest, dividends, Working for Families
                tax credits, and other tax credits or deductions.
              </p>
              <p>
                Please refer to your official IRD income tax assessment for final
                figures.
              </p>
              <p>
                Refunds are automatically credited to the bank account linked to your MyIR account. If you owe tax, IRD will send you a letter.
              </p>
              <p>
                This estimate is based on salary and wage income only. KiwiSaver, PIE income, interest (RWT), and Working for Families may affect your final IRD assessment.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="what-affects" className="rounded-lg border bg-card shadow-sm px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              What affects your result?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <ul className="list-disc ml-5 space-y-1.5">
                <li>KiwiSaver contributions</li>
                <li>Student loan repayments</li>
                <li>Working for Families tax credits</li>
                <li>Secondary income sources</li>
                <li>PIE income and interest (RWT)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-it-works" className="rounded-lg border bg-card shadow-sm px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              How This Calculator Works
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <ol className="list-decimal ml-5 space-y-1.5">
                <li>Your total gross income is used to determine the tax owed based on New Zealand's progressive tax brackets for FY25/26.</li>
                <li>The tax you have already paid (tax deducted) is subtracted from the tax owed to determine any over- or under-payment.</li>
                <li>If you have selected the IETC option, the Independent Earner Tax Credit is calculated based on your income level (applicable between $24,000 and $70,000).</li>
                <li>The IETC is pro-rated by the number of months you were eligible during the tax year.</li>
                <li>The final result shows whether you are likely to receive a refund or have tax to pay.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-to-find" className="rounded-lg border bg-card shadow-sm px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              How to Find Your Numbers in MyIR
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-4">
              <a
                href="https://myir.ird.govt.nz/_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline text-muted-foreground"
              >
                Log into MyIR
              </a>

              <div className="space-y-2">
                <p className="font-medium text-foreground">Finding your total gross income</p>
                <ol className="list-decimal ml-5 space-y-1.5">
                  <li>Log into MyIR at myir.ird.govt.nz</li>
                  <li>Click "Income summary"</li>
                  <li>Under "Income period", select "Last income tax year" (1 April 2025 – 31 March 2026)</li>
                  <li>Under "Summary by type", click "View breakdown" next to Salary, wages, benefits and taxable pensions</li>
                  <li>Enter the figure shown under "Total gross amount"</li>
                </ol>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-foreground">Finding your total tax deducted</p>
                <ol className="list-decimal ml-5 space-y-1.5">
                  <li>Follow steps 1–4 above</li>
                  <li>Enter the figure shown under "Total tax deducted"</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          For official information, visit{" "}
          <a
            href="https://www.ird.govt.nz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            ird.govt.nz
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Index;