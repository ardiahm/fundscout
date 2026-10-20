"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "@/app/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Switch } from "../../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useState } from "react";
import { Control, Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/app/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/app/components/ui/input-group";
import calculateValuation from "@/backend/api/valuation/calculateValuation";
import { useRouter } from "next/navigation";
import { ValuationStage } from "@/backend/lib/generated/prisma/enums";
import {
  ratingQuestions,
  valuationFormSchema,
  valuationStageLabels,
  type RatingName,
  type ValuationFormValues,
} from "@/backend/constants/valuation";

type ValuationFormProps = {
  sectors: string[];
};

export default function ValuationForm({ sectors }: ValuationFormProps) {
  const router = useRouter();

  const form = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationFormSchema),
    defaultValues: {
      companyName: "",
      stage: ValuationStage.SEED,
      sector: "",
      raiseAmount: undefined,

      hasRevenue: false,
      monthlyRevenue: undefined,
      monthlyGrowth: undefined,
      grossMargin: undefined,

      // 3 is average, so an untouched rating doesn't move the number
      teamRating: 3,
      marketRating: 3,
      productRating: 3,
      competitionRating: 3,
      tractionRating: 3,
    },
  });

  const hasRevenue = useWatch({ control: form.control, name: "hasRevenue" });

  async function onSubmit(data: ValuationFormValues) {
    const toastId = toast.loading("Calculating...");

    try {
      const result = await calculateValuation(data);

      if (!result.success) {
        toast.error(result.error, { id: toastId });
        return;
      }

      if (result.writeUpError) {
        toast.success("Valuation calculated!", {
          id: toastId,
          description: result.writeUpError,
        });
      } else {
        toast.success(
          `Valuation calculated! ${result.remaining} write-ups remaining today.`,
          { id: toastId },
        );
      }

      router.replace("/valuation", { scroll: true });
    } catch (error) {
      toast.error("Something went wrong while calculating your valuation.", {
        id: toastId,
      });

      console.error("Unexpected valuation error:", error);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-3xl overflow-hidden px-5">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-4xl">Valuation Calculator</CardTitle>
        <CardDescription>
          Tell us about your startup and we&apos;ll estimate a pre-money
          valuation range, backed by real rounds on FundScout.
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full min-w-0">
        <form
          id="valuation"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full min-w-0"
        >
          <FieldGroup className="w-full min-w-0">
            {/* ================= Startup ================= */}
            <FieldSet className="w-full min-w-0">
              <FieldLegend>Your startup</FieldLegend>

              <Controller
                name="companyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="companyName">
                      Company name <span className="font-normal text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="companyName"
                        placeholder="FundScout"
                        maxLength={100}
                        aria-invalid={fieldState.invalid}
                      />
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="stage"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>What round are you raising?</FieldLabel>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                    >
                      {Object.entries(valuationStageLabels).map(([value, label]) => (
                        <Field key={value} orientation="horizontal">
                          <RadioGroupItem value={value} id={`stage-${value}`} />
                          <FieldLabel htmlFor={`stage-${value}`} className="font-normal">
                            {label}
                          </FieldLabel>
                        </Field>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <Controller
                  name="sector"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="min-w-0">
                      <FieldLabel htmlFor="sector">Sector</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="sector"
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Pick the closest one" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <NumberField
                  control={form.control}
                  name="raiseAmount"
                  label="How much are you raising?"
                  placeholder="2,000,000"
                  prefix="$"
                />
              </div>
            </FieldSet>

            {/* ================= Revenue ================= */}
            <FieldSet className="w-full min-w-0">
              <FieldLegend>Revenue</FieldLegend>

              <Controller
                name="hasRevenue"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Switch
                      id="hasRevenue"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <FieldLabel htmlFor="hasRevenue" className="font-normal">
                      We have revenue
                    </FieldLabel>
                  </Field>
                )}
              />

              {hasRevenue && (
                <div className="grid gap-6 sm:grid-cols-3">
                  <NumberField
                    control={form.control}
                    name="monthlyRevenue"
                    label="Monthly revenue"
                    placeholder="40,000"
                    prefix="$"
                  />
                  <NumberField
                    control={form.control}
                    name="monthlyGrowth"
                    label="Monthly growth"
                    placeholder="10"
                    suffix="%"
                  />
                  <NumberField
                    control={form.control}
                    name="grossMargin"
                    label="Gross margin"
                    placeholder="75"
                    suffix="%"
                  />
                </div>
              )}
            </FieldSet>

            {/* ================= Ratings ================= */}
            <FieldSet className="w-full min-w-0">
              <FieldLegend>How do you stack up?</FieldLegend>
              <FieldDescription>
                Be honest: 3 is a typical startup at your stage.
              </FieldDescription>

              {(Object.keys(ratingQuestions) as RatingName[]).map((name) => (
                <RatingField key={name} control={form.control} name={name} />
              ))}
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          form="valuation"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="px-8 py-6 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
        >
          {form.formState.isSubmitting ? "Calculating..." : "Calculate"}
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ---------- Number field helper ---------- */

type NumberFieldName = "raiseAmount" | "monthlyRevenue" | "monthlyGrowth" | "grossMargin";

// shows numbers with commas, stores them as plain numbers
function NumberField({
  control,
  name,
  label,
  placeholder,
  prefix,
  suffix,
}: {
  control: Control<ValuationFormValues>;
  name: NumberFieldName;
  label: string;
  placeholder: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="min-w-0">
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <InputGroup>
            {prefix && (
              <InputGroupAddon>
                <InputGroupText>{prefix}</InputGroupText>
              </InputGroupAddon>
            )}
            <NumberInput
              id={name}
              placeholder={placeholder}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              invalid={fieldState.invalid}
            />
            {suffix && (
              <InputGroupAddon align="inline-end">
                <InputGroupText>{suffix}</InputGroupText>
              </InputGroupAddon>
            )}
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

const formatNumber = (value: number | undefined) =>
  value === undefined ? "" : value.toLocaleString("en-US", { maximumFractionDigits: 2 });

// keeps its own text so "7." can be typed, and adds commas when you leave the field
function NumberInput({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
}: {
  id: string;
  placeholder: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
  inputRef: React.Ref<HTMLInputElement>;
  invalid: boolean;
}) {
  const [text, setText] = useState(formatNumber(value));

  return (
    <InputGroupInput
      id={id}
      ref={inputRef}
      inputMode="decimal"
      placeholder={placeholder}
      value={text}
      onChange={(event) => {
        const typed = event.target.value.replace(/[^0-9.,-]/g, "");
        const cleaned = typed.replace(/,/g, "");
        const number = Number(cleaned);

        setText(typed);
        onChange(cleaned === "" || Number.isNaN(number) ? undefined : number);
      }}
      onBlur={() => {
        setText(formatNumber(value));
        onBlur();
      }}
      aria-invalid={invalid}
    />
  );
}

/* ---------- Rating field helper ---------- */

function RatingField({
  control,
  name,
}: {
  control: Control<ValuationFormValues>;
  name: RatingName;
}) {
  const question = ratingQuestions[name];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="min-w-0">
          <FieldLabel>{question.label}</FieldLabel>
          <RadioGroup
            value={String(field.value)}
            onValueChange={(value) => field.onChange(Number(value))}
            className="flex justify-between gap-2 sm:justify-start sm:gap-6"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <Field key={rating} orientation="horizontal" className="w-auto">
                <RadioGroupItem value={String(rating)} id={`${name}-${rating}`} />
                <FieldLabel htmlFor={`${name}-${rating}`} className="font-normal">
                  {rating}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
          <div className="flex justify-between text-xs text-muted-foreground sm:max-w-[19rem]">
            <span>1 · {question.low}</span>
            <span>5 · {question.high}</span>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
