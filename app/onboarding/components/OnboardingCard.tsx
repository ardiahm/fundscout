import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";

// prompt, read only options  (always mulitple), value (one or mulitple), mulitple boolean, on change
type OnboardingCardProps = {
  prompt: string;

  options: readonly string[];

  value: string | string[] | undefined;

  multiple?: boolean;

  onChange: (value: string | string[]) => void;

  isFirstStep?: boolean;

  onBack?: () => void;

  isLastStep?: boolean;

  onNext?: () => void;
};

export default function OnboardingCard({
  prompt,
  options,
  value,
  multiple = false,
  onChange,
  isFirstStep,
  onBack,
  isLastStep,
  onNext,
}: OnboardingCardProps) {
  // replace "-" with " ", title case for all strings
  function formatString(value: string) {
    return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function handleMultipleClick(option: string) {
    if (!Array.isArray(value)) {
      const next = [option];
      console.log("Selected:", next);
      onChange(next);
      return;
    }

    const selected = value.includes(option);

    const next = selected
      ? value.filter((v) => v !== option)
      : [...value, option];

    console.log("Selected:", next);
    onChange(next);
  }

  const isValid = multiple
    ? Array.isArray(value) && value.length > 0
    : typeof value === "string" && value.length > 0;

  return (
    // card needs to display prompt, supplmentary descirption stating "choose all that apply" or "select one"
    // if multiple answers permitted, render checkbox and store selected values in array
    // if mulitple not permitted, render radiogroup and selected value updates value
    <Card className="w-full min-h-[420px] flex flex-col">
      <CardHeader >
        {onBack && (
                <button onClick={onBack} hidden={isFirstStep}>
                    <ArrowLeft />
                </button>
            )}
        <CardTitle className="font-semibold items-center text-4xl p-12 text-center items-center">
          {prompt}
        </CardTitle>
      </CardHeader>
      <CardContent>
        
        {multiple ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {options.map((option) => {
              const selected = Array.isArray(value)
                ? value.includes(option)
                : false;
              return (
                <div key={option}>
                  <Button
                    onClick={() => handleMultipleClick(option)}
                    className={
                      selected
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-muted hover:bg-muted/80"
                    }
                    variant={selected ? "default" : "outline"}
                  >
                    {formatString(option)}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
            
          <RadioGroup
            value={value as string}
            onValueChange={(v) => onChange(v)}
          >
            <div className="">
                <CardDescription className="text-md">
          {multiple ? "Choose all that apply" : "Select one"}
        </CardDescription>
              {options.map((option) => (
                <div key={option} className="flex text-3xl font-semibold items-center gap-2 py-1">
                  <RadioGroupItem value={option} id={option} />
                  <label htmlFor={option}>{formatString(option)}</label>
                </div>
              ))}
            </div>
          </RadioGroup>
          
        )}
        
      </CardContent>
      <CardFooter className="grid pt-15">
        
        <div className="items-center">
            <Button
              variant="outline"
              disabled={!isValid}
              className="w-[100%] bg-blue-600/80 hover:bg-blue-700 hover:text-white text-white border-gray"
              onClick={() => onNext?.()}
            >
              {isLastStep ? "Submit" : "Continue"}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
